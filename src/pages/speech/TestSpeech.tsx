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
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ [interviewId: number]: string }>({});


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

  const handleSubmit = async () => {
  const payload = Object.entries(answers).map(([interviewId, userReply]) => ({
    interviewId: Number(interviewId),
    userReply,
    nth: nth!,
  }));

  try {
    await api.post('/api/interview/answers', { answers: payload });
    alert('면접 제출 완료!');
  } catch (e) {
    console.error('제출 실패:', e);
    alert('제출 실패');
  }
};




  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-2">
  <div className="w-full max-w-4xl mx-auto px-1">
    {/* 헤더 */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">과목 이름</h2>
      <span className="text-sm text-gray-500">
        {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : ''}
      </span>
    </div>

    {/* 질문 카드 */}
    {currentQuestion && (
      <QuestionSpeechCard
        question={currentQuestion}
        onTranscriptComplete={(interviewId, text) =>
          setAnswers((prev) => ({ ...prev, [interviewId]: text }))
        }
      />
    )}

    {/* 이전/다음 버튼 */}
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

    {/* 제출 버튼 */}
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
      >
        면접 제출하기
      </button>
    </div>
  </div>
</div>

  );
};

export default TestSpeech;
