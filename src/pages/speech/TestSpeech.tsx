import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import QuestionSpeechCard from '@/components/speech/QuestionSpeechCard';

interface InterviewQuestion {
  interviewId: number;
  interviewContent: string;
  subjectId: number;
  nth: number;
}

const TestSpeech: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nth, setNth] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await api.get<{ data: InterviewQuestion[] }>('/api/interview/list', {
        params: { subjectIds: [1] },
      });
      setQuestions(res.data.data);

      if (res.data.data.length > 0) {
        setNth(res.data.data[0].nth);
      }
    }

    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10 font-sans text-gray-800">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">SUBJECT이름</h2>
        <span className="text-sm text-gray-500">
          {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : ''}
        </span>
      </div>

      {/* 질문 카드 */}
      {currentQuestion && (
        <QuestionSpeechCard question={currentQuestion} />
      )}

      {/* 페이지 네비게이션 */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2 rounded-md border font-semibold text-sm transition-colors 
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50"
        >
          ⬅ 이전
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="px-5 py-2 rounded-md border font-semibold text-sm transition-colors 
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50"
        >
          다음 ➡
        </button>
      </div>
    </div>
  );
};

export default TestSpeech;
