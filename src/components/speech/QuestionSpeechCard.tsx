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
  const { transcript, listening, startListening, resetTranscript, speak } = useSpeech();
  const [feedback, setFeedback] = useState('');
  const [localTranscript, setLocalTranscript] = useState('');
  const [seconds,setSeconds]=useState(0);

  useEffect(() => {
    if (!listening && transcript) {
      setLocalTranscript(transcript);
      onTranscriptComplete(question.interviewId, transcript); 
    }
  }, [listening, transcript]);

  useEffect(() => {
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


  const handleStart = () => {
    resetTranscript();
    setLocalTranscript('');
    setFeedback('');
    setSeconds(0);
    startListening();
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

      {/* 녹음 시작 버튼 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleStart}
          disabled={listening}
          className={`px-5 py-2 rounded-md border font-semibold text-sm transition-colors 
          ${listening ? 'bg-cyan-200 text-white cursor-not-allowed' : 'bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50'}`}
        >
          🎤 {listening ? '듣는 중...' : '녹음 시작'}
        </button>
      </div>

      {/* 타이머 */}
      <div className="text-center text-lg font-mono mb-1">{formatTime(seconds)}</div>
      <p className="text-center text-sm text-gray-500 mb-4">대기 중..</p>

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
