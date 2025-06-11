import { useState, useRef } from 'react';

interface WindowWithRecognition extends Window {
  webkitSpeechRecognition: any;
}
declare const window: WindowWithRecognition;

export const useSpeech = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // 저장할 Blob 파일 관리

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // 녹음된 오디오 조각 담을 배열
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resetAudioBlob = () => setAudioBlob(null);


  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('브라우저가 음성 인식을 지원하지 않습니다.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MediaRecorder 설정
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data); // 오디오 조각 배열에 누적하기 
    };

    mediaRecorder.onstop = () => { // 오디오 조각 하나의 파일로 만들기 
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
    };

    mediaRecorder.start(); // 녹음 시작 

    // SpeechRecognition 설정
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript; //정확도가 가장 높은 문장 가져오기기
      setTranscript((prev) => prev + ' ' + result); // 음성 인식한 텍스트 누적해서 저장하기기
    };

    recognition.onend = () => { // 음성 인식 자동으로 끝났을 때 계속 재시작하기 
  if (listening) {  // 듣고 있는데 내용이 아무것도 없으면 
    if (transcript.trim() === '') {
      console.log('인식된 음성이 없습니다.');
    }
    recognitionRef.current?.start(); // 끊기면 다시 시작 
  }
};


   recognition.onerror = (event: any) => {
  console.error('STT 수동 종료함:');

  if (event.error !== 'aborted' && listening) {
    recognitionRef.current?.start();
  }
};

    setListening(true); // 수동 종료한거 아니면 무조건 true로 설정 
    recognition.start(); // STT 시작
  };

  const stopRecording = () => {
    recognitionRef.current?.abort(); // STT 완전 중단 (강제 종료)
    mediaRecorderRef.current?.stop(); // 녹음 종료
    setListening(false);  // listening을 false로 바꾸면 재시작 안 함
  };

  //TTS
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const resetTranscript = () => setTranscript(''); // 음성 인식 결과 초기화

  return {
    transcript, // 음성 인식 전체 문장장
    listening, // 지금 음성 인식 중인지 여부 
    startListening,  // STT + 녹음 시작
    stopRecording,   // STT + 녹음 중단
    speak, // TTS
    resetTranscript,  // 텍스트 초기화
    audioBlob,
    resetAudioBlob,
  };
};
