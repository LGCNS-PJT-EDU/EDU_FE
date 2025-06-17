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
  keyword: string;
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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mr-3">AI 면접 피드백 결과</h1>
        <span className="w-10 h-8 bg-indigo-100 text-[#6378eb] font-bold text-[10px] rounded-md flex items-center justify-center shadow-inner">
          {nth}회차
        </span>
      </div>
      {data.map((item, index) => (
        <section
          key={index}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6"
        >
          {/* 질문 */}
          <div>
            <p className="text-lg font-semibold text-gray-900">Q. {item.interviewContent}</p>
          </div>

          {/* 나의 답변 */}
          <div>
            <h3 className="text-sm text-gray-500 font-semibold mb-1">나의 답변</h3>
            <div className="bg-gray-50 border border-gray-200 text-sm text-gray-800 rounded-md px-4 py-3 whitespace-pre-line">
              {item.userReply || '없음'}
            </div>
          </div>

          {/* 피드백 */}
          <div>
            <h3 className="text-sm text-gray-500 font-semibold mb-1">피드백</h3>
            <div className="bg-blue-50 border border-blue-200 text-sm text-gray-800 rounded-md px-4 py-3 whitespace-pre-line">
              {item.aiFeedback || '피드백 없음'}
            </div>
          </div>

          {/* 모범 답안 */}
          <div>
            <h3 className="text-sm text-gray-500 font-semibold mb-1">모범 답안</h3>
            <div className="bg-yellow-50 border border-yellow-200 text-sm text-gray-800 rounded-md px-4 py-3 whitespace-pre-line">
              {item.interviewAnswer || '없음'}
            </div>
          </div>

          {/* 추천 키워드 */}
          <div>
            <h3 className="text-sm text-gray-500 font-semibold mb-1">추천 키워드</h3>
            <div className="bg-green-50 border border-green-200 text-sm text-gray-800 rounded-md px-4 py-3">
              {item.keyword?.length ? item.keyword : '추천 키워드 없음'}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default SpeechFeedbackPage;
