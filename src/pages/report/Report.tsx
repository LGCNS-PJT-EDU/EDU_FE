import weakness from '@/asset/img/report/weakness.png';
import good from '@/asset/img/report/good.png';
import leftArrow from '@/asset/img/report/left.png';
import rightArrow from '@/asset/img/report/right.png';

import RadarChart from '@/components/chart/chart';
import BarChart from '@/components/chart/Barchart';

import { useState, useRef } from 'react';
import { useFeedback } from '@/hooks/useReport';
import { useSearchParams } from 'react-router-dom';

export default function Report() {
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const numericId = Number(subjectId);

  const { data = [], isLoading, isError } = useFeedback(numericId);

  const [idx, setIdx] = useState(0);
  const startX = useRef(0);

  const swipeStart = (e: React.TouchEvent<HTMLDivElement>) =>
    (startX.current = e.touches[0].clientX);

  const swipeEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const delta = startX.current - e.changedTouches[0].clientX;
    if (delta > 50 && idx < 2) setIdx(idx + 1);
    else if (delta < -50 && idx > 0) setIdx(idx - 1);
  };

  if (isLoading) return <p className="py-20 text-center">불러오는 중…</p>;
  if (isError || !data.length) return <p className="py-20 text-center">데이터 없음</p>;

  const sorted = [...data].sort((a, b) => +new Date(a.info.date) - +new Date(b.info.date));

  // 사전 + 사후 평가 있을 때
  const pre = sorted[0];
  const post = sorted[sorted.length - 1];

  const labels = Object.keys(pre.scores).filter((key) => key !== 'total');
  const preScores = labels.map((label) => pre.scores[label]);
  const postScores = labels.map((label) => post.scores[label]);
  const preTotal = pre.scores['total'];
  const postTotal = post.scores['total'];
  const currentFeedback = idx === 0 ? pre.feedback : post.feedback;
  const strengthArr = labels.map((label) => currentFeedback.strength[label] ?? '—');
  const weaknessArr = labels.map((label) => currentFeedback.weakness[label] ?? '—');
  const hasPost = sorted.length > 1;
  
  return (
    <div className="relative flex flex-col items-center px-4 py-10 font-[pretendard]">
      <h2 className="mb-2 text-2xl font-bold text-[#5B7CFF]">Education Evaluation</h2>
      <p className="text-center text-gray-600">사전·사후 학습 결과 비교</p>

      <p className="mt-4 text-sm text-gray-700">
        사전 총점: {preTotal}점 / 사후 총점: {postTotal}점
      </p>

      {idx > 0 && (
        <button onClick={() => setIdx(idx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2">
          <img src={leftArrow} alt="prev" className="h-8 w-8" />
        </button>
      )}
      {idx < 2 && (
        <button onClick={() => setIdx(idx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2">
          <img src={rightArrow} alt="next" className="h-8 w-8" />
        </button>
      )}

      <div className="relative mt-10 w-full max-w-[700px] h-[500px] mx-auto overflow-hidden"
        onTouchStart={swipeStart}
        onTouchEnd={swipeEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          <div className="w-full flex-shrink-0">
            <RadarChart labels={labels} values={preScores} label="Pre" color="#5b7cff" />
          </div>

          {hasPost && (
            <>
              <div className="w-full flex-shrink-0">
                <RadarChart labels={labels} values={postScores} label="Post" color="#ff6ab0" />
              </div>
              <div className="w-full flex-shrink-0">
                <BarChart pre={preScores} post={postScores} final={post.feedback.final} />
              </div>
            </>
          )}
        </div>
      </div>

      {idx < 2 && (
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#5b7cff]"></span> Pre
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ff6ab0]"></span> Post
          </div>
        </div>
      )}

      {idx < 2 && (
        <table className="mt-10 w-full table-fixed border-collapse rounded-xl overflow-hidden shadow-md text-sm text-gray-800">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="w-[60px] py-3 text-center"></th>
              {labels.map((k) => (
                <th key={k} className="px-2 py-3 text-center font-bold">
                  {k.length > 11 ? (
                    <>
                      {k.slice(0, 11)}<br />{k.slice(11)}
                    </>
                  ) : k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 긍정 피드백 */}
            <tr className="bg-blue-50 align-top leading-relaxed">
              <td className="text-center align-middle py-4">
                <div className=" rounded-full w-8 h-8 flex items-center justify-center mx-auto text-lg">
                  <img src={good} alt="긍정피드백" />
                </div>
              </td>
              {labels.map((_, i) => (
                <td key={i} className="px-3 py-4 text-left">
                  {(strengthArr[i] ?? '—')
                    .split('.')
                    .filter(Boolean)
                    .map((sentence, idx) => (
                      <div key={idx} className="pb-[2px]">
                        {sentence.trim() + '.'}
                      </div>
                    ))}
                </td>
              ))}
            </tr>

            {/* 부정 피드백 */}
            <tr className="bg-red-100 align-top leading-relaxed">
              <td className="text-center align-middle py-4">
                <div className="rounded-full w-8 h-8 flex items-center justify-center mx-auto text-lg">
                  <img src={weakness} alt="긍정피드백" />
                </div>
              </td>
              {labels.map((_, i) => (
                <td key={i} className="px-2 py-4 text-left">
                  {(weaknessArr[i] ?? '—')
                    .split('.')
                    .filter(Boolean)
                    .map((sentence, idx) => (
                      <div key={idx} className="pb-[2px]">
                        {sentence.trim() + '.'}
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

      )}
    </div>
  );
}
