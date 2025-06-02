import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import QuestionSpeechCard from '../../components/speech/QuestionSpeechCard';

interface InterviewQuestion {
  interviewId: number;
  interviewContent: string;
}

const TestSpeech: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await api.get<{ data: InterviewQuestion[] }>('/api/interview/list?subjectId=1');
      setQuestions(res.data.data);
    }

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-10 font-sans text-gray-800">
      <h2 className="text-3xl font-bold text-blue-600 mb-10">STT 면접 피드백</h2>
      {questions.map((q) => (
        <QuestionSpeechCard key={q.interviewId} question={q} />
      ))}
    </div>
  );
};

export default TestSpeech;
