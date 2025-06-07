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

    console.log('보낼 payload:', {
      interviewId: question.interviewId,
      userReply: localTranscript,
    });

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

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-500 mb-2">{question.interviewContent}</h3>

      <button
        onClick={handleStart}
        className={`px-4 py-2 rounded-md font-semibold text-white ${
          listening ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={listening}
      >
        {listening ? '듣는 중...' : '답변 시작'}
      </button>

      {localTranscript && (
        <p className="mt-4 italic text-gray-700"> 인식된 내용: {localTranscript}</p>
      )}

      {localTranscript && !feedback && (
        <button
          onClick={handleSend}
          className="mt-2 px-4 py-2 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
          전송하기
        </button>
      )}

      {feedback && (
        <div className="mt-4 bg-green-50 p-4 rounded-md">
          <h4 className="font-semibold text-green-600 mb-2">AI 피드백</h4>
          <p className="mb-2">{feedback}</p>
          <button
            onClick={() => speak(feedback)}
            className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600"
          >
            피드백 읽기
          </button>
        </div>
      )}
    </section>
  );
};

export default QuestionSpeechCard;
