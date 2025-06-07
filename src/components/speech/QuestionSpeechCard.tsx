import React, { useState, useEffect } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { sendInterviewFeedback } from '@/api/interviewService';

interface Props {
  question: {
    interviewId: number;
    interviewContent: string;
    subjectId: number;
    nth: number;
  };
}

const QuestionSpeechCard: React.FC<Props> = ({ question }) => {
  const { transcript, listening, startListening, resetTranscript, speak } = useSpeech();
  const [feedback, setFeedback] = useState('');
  const [localTranscript, setLocalTranscript] = useState('');

  useEffect(() => {
    if (!listening && transcript) {
      setLocalTranscript(transcript);
    }
  }, [listening, transcript]);

  const handleStart = () => {
    resetTranscript();
    setLocalTranscript('');
    setFeedback('');
    startListening();
  };

  const handleSend = async () => {
    if (!localTranscript) return alert('음성 인식 결과가 없습니다.');

    try {
      const result = await sendInterviewFeedback(
        question.interviewId,
        localTranscript,
        question.nth
      );
      setFeedback(result);
    } catch (e) {
      console.error('피드백 요청 중 오류:', e);
    }
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
      <div className="text-center text-lg font-mono mb-1">00:00</div>
      <p className="text-center text-sm text-gray-500 mb-4">대기 중..</p>

      {/* 음성 인식 결과 */}
      {localTranscript && (
        <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md mb-4 min-h-[60px]">
          {localTranscript}
        </div>
      )}

      {/* 전송 버튼 */}
      {localTranscript && !feedback && (
        <button
          onClick={handleSend}
          className="px-5 py-2 rounded-md font-semibold bg-cyan-500 text-white hover:bg-cyan-600"
        >
          전송하기
        </button>
      )}

      {/*피드백 영역 */}
      {feedback && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-md">
          <h4 className="font-semibold text-green-600 mb-2">AI 피드백</h4>
          <p className="text-sm text-gray-800">{feedback}</p>
        </div>
      )}
    </section>
  );
};

export default QuestionSpeechCard;
