import React, { useState, useEffect } from 'react';
import { useSpeech } from '@/hooks/useSpeech';


interface Props {
  question: {
    interviewId: number;
    interviewContent: string;
    subjectId: number;
    nth: number;
  };
  onTranscriptComplete: (interviewId: number, text: string) => void;
}

const QuestionSpeechCard: React.FC<Props> = ({ question, onTranscriptComplete }) => {
  const { transcript,
  listening,
  startListening,
  stopRecording,
  speak,
  resetTranscript,
  resetAudioBlob,
  audioBlob, } = useSpeech();

  const [feedback, setFeedback] = useState('');
  const [localTranscript, setLocalTranscript] = useState('');
  const [seconds,setSeconds]=useState(0);
  const [countdown, setCountdown] =useState(2); // 카운트 다운
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {

  setCountdown(2);
  setShowCountdown(true);

  const countdownTimer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(countdownTimer);
        setShowCountdown(false);
        handleStart(); 
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(countdownTimer);
    if (listening) {
    stopRecording(); 
  }
}, [question.interviewId]); 



  useEffect(() => {
  if (transcript) {
    setLocalTranscript(transcript);
    onTranscriptComplete(question.interviewId, transcript); //상위 컴포넌트에 최신 답변을 전달하기 
  }
}, [transcript]);


  useEffect(() => {
  console.log('listening 상태:', listening);
  if (!listening) return;

  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [listening]);

// 타이머 형식
const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


// 녹음 시작 
  const handleStart = () => {
    resetTranscript();
    resetAudioBlob();
    setLocalTranscript('');
    setFeedback('');
    setSeconds(0);
    startListening();
  };

  //녹음 종료 
  const handleStop = () => {
  stopRecording();
  setLocalTranscript(transcript);  
  onTranscriptComplete(question.interviewId, transcript); // 상위 컴포넌트에도 전달
};


  // 다운로드용 링크 생성
const handleDownload = () => {
  if (!audioBlob) return;
  const url = URL.createObjectURL(audioBlob); // Blob을 브라우저에서 접근 가능한 임시 URL로 변환
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview_${question.interviewId}.webm`;
  a.click();
};

  const handlePlayQuestion = () => {
    speak(question.interviewContent);
  };

  return (
    <section className="border border-cyan-300 rounded-xl p-6 bg-white shadow-sm">
      {/* 질문 텍스트 */}
      <h3 className="text-base font-medium text-gray-800 mb-4">
        {question.interviewContent}
      </h3>

      {/* 질문 다시 듣기 버튼 */}
      <div className="mb-4">
        <button
          onClick={handlePlayQuestion}
          className="flex items-center gap-1 px-4 py-2 border border-cyan-400 text-cyan-600 rounded-md text-sm font-medium hover:bg-cyan-50"
        >
          🔊 질문 다시 듣기
        </button>
      </div>

      {/* 타이머 */}
      <div className="text-center text-lg font-mono mb-1">
        {showCountdown ? `녹음까지 ${countdown}초` : formatTime(seconds)}
      </div>
      <p className="text-center text-sm text-gray-500 mb-4">
        {showCountdown ? '잠시 후 녹음이 시작됩니다.' : ''}
      </p>


      {/* 녹음 종료 버튼 */}
{listening && (
  <div className="flex justify-center mb-4">
    <button
      onClick={handleStop}
      className="px-5 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
    >
      🛑 녹음 종료
    </button>
  </div>
)}

{/* 다운로드 버튼 */}
{audioBlob && (
  <div className="flex justify-center mb-4">
    <button
      onClick={handleDownload}
      className="px-4 py-2 rounded-md bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
    >
      ⬇ 녹음 파일 다운로드
    </button>
  </div>
)}

      {/* 음성 인식 결과 */} 
{localTranscript && (
  <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md mb-4 min-h-[60px]">
    {localTranscript}
  </div>
)}


    </section>
  );
};

export default QuestionSpeechCard;
