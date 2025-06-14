import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/api/axios';

interface FeedbackData {
  interviewContent: string;
  subId: number;
  nth: number;
  userReply: string;
  aiFeedback: string;
  interviewAnswer: string;
  recommend_keywords: string[];
}

const SpeechFeedbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nth = Number(searchParams.get('nth'));
  const [data, setData] = useState<FeedbackData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!nth) return;

    async function fetchFeedback() {
      try {
        const res = await api.get<{ data: FeedbackData[] }>('/api/interview/history');
        const filtered = res.data.data.filter((item) => item.nth === nth);
        setData(filtered);
      } catch (err) {
        console.error('피드백 불러오기 실패', err);
      }
    }

    fetchFeedback();
  }, [nth]);

  if (!data.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 text-gray-600">
        피드백 데이터를 찾을 수 없습니다. <br />
        <button onClick={() => navigate('/')} className="mt-4 underline text-blue-500">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        🧠 AI 면접 피드백 결과 ({nth}회차)
      </h1>

      {data.map((item, index) => (
        <section
          key={index}
          className="bg-white rounded-xl border border-gray-200 shadow p-6 space-y-4"
        >
          <h2 className="font-bold text-gray-700">Q. {item.interviewContent}</h2>

          <div className="text-sm text-gray-800">
            <strong>🗣 나의 답변:</strong>
            <p className="mt-1 bg-gray-50 p-2 rounded text-gray-600">{item.userReply || '없음'}</p>
          </div>

          <div className="text-sm text-gray-800">
            <strong>📋 피드백:</strong>
            <p className="mt-1 bg-blue-50 p-2 rounded text-gray-700">
              {item.aiFeedback || '피드백 없음'}
            </p>
          </div>

          <div className="text-sm text-gray-800">
            <strong>💡 모범 답안:</strong>
            <p className="mt-1 bg-yellow-50 p-2 rounded text-gray-700">
              {item.interviewAnswer || '없음'}
            </p>
          </div>

          <div className="text-sm text-gray-800">
            <strong>🧩 추천 키워드:</strong>
            <p className="mt-1 bg-green-50 p-2 rounded text-gray-700">
              {item.recommend_keywords?.length
                ? item.recommend_keywords.join(', ')
                : '추천 키워드 없음'}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default SpeechFeedbackPage;
