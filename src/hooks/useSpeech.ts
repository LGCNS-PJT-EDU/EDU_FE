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
  const resetAudioBlob = () => setAudioBlob(null);

  const startListening = async () => {
    console.log('startListening 호출됨');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('브라우저가 음성 인식을 지원하지 않습니다.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('startListening 마이크 스트림');

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

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript((prev) => prev + ' ' + result);
    };

    recognition.onend = () => {
      console.log('자동 재시작 제거됨');
    };

    recognition.onerror = (event: any) => {
      console.error('recognition.onerror 무시됨', event.error);

    };

    setListening(true);
    recognition.start();
  };

  const stopRecording = () => {
    console.log('stopRecording 호출됨');
    setListening(false);

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.abort(); // STT 완전 종료
    }

    mediaRecorderRef.current?.stop();
  };

  // TTS
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const speakWithCallback = (text: string, onEnd: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.onend = onEnd;
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
    speakWithCallback,
    resetTranscript,
    audioBlob,
    resetAudioBlob,
  };
};
