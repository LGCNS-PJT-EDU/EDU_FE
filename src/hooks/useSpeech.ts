import { useState, useRef } from 'react';

interface WindowWithRecognition extends Window {
  webkitSpeechRecognition: any;
}
declare const window: WindowWithRecognition;

export const useSpeech = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
    };

    mediaRecorder.start();

    // SpeechRecognition 설정
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript((prev) => prev + ' ' + result); // 누적 저장
    };

    recognition.onend = () => {
  if (listening) {
    if (transcript.trim() === '') {
      console.log('인식된 음성이 없습니다.');
    }
    recognitionRef.current?.start(); // 계속 재시작
  }
};


   recognition.onerror = (event: any) => {
  console.error('STT error:', event.error);
  if (event.error !== 'aborted') {
  console.error('STT 수동 종료함:', event.error);
}
  if (event.error !== 'aborted' && listening) {
    recognitionRef.current?.start();
  }
};



    setListening(true);
    recognition.start(); // STT 시작
  };

  const stopRecording = () => {
    setListening(false); // 수동 종료만 false 처리
    recognitionRef.current?.abort(); // STT 완전 중단
    mediaRecorderRef.current?.stop(); // 녹음 종료
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const resetTranscript = () => setTranscript('');

  return {
    transcript,
    listening,
    startListening,
    stopRecording,
    speak,
    resetTranscript,
    audioBlob,
  };
};
