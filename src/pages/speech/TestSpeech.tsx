import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import QuestionSpeechCard from '@/components/speech/QuestionSpeechCard';

interface InterviewQuestion {
  interviewId: number;
  interviewContent: string;
  subjectId: number;
  nth:number;

}

const TestSpeech: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nth, setNth] = useState<number|null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await api.get<{ data: InterviewQuestion[] }>('/api/interview/list', {
        params: { subjectIds: [1] },
      });
      setQuestions(res.data.data);

      // 첫번째 질문에서 회차 저장하기 
      if(res.data.data.length>0){
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
    <div className="min-h-screen bg-blue-50 p-10 font-sans text-gray-800">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">SUBJECT이름</h2>

      {currentQuestion && (
        <div>
          <p className="mb-2 font-medium">
            {currentIndex + 1} / {questions.length}
          </p>
          <QuestionSpeechCard question={currentQuestion} />
        </div>
      )}

      {/* 페이지 전환 버튼 */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded bg-cyan-200 text-white disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 rounded bg-cyan-200 text-white disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TestSpeech;
