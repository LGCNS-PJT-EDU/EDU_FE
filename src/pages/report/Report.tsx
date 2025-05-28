import weakness from '@/asset/img/report/weakness.png';
import good     from '@/asset/img/report/good.png';
import leftArrow  from '@/asset/img/report/left.png';
import rightArrow from '@/asset/img/report/right.png';

import RadarChart from '@/components/chart/chart';   
import BarChart   from '@/components/chart/Barchart';

import { useState, useRef } from 'react';
import { useFeedback } from '@/hooks/useReport';        

export default function Report() {
  const { data, isLoading, isError } = useFeedback();

  /* ---------- 슬라이드 상태 ---------- */
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const swipeStart = (e: React.TouchEvent<HTMLDivElement>) =>
    (startX.current = e.touches[0].clientX);
  const swipeEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const delta = startX.current - e.changedTouches[0].clientX;
    if (delta > 50 && idx < 2) setIdx(idx + 1);
    else if (delta < -50 && idx > 0) setIdx(idx - 1);
  };

  /* ---------- 로딩 / 에러 ---------- */
  if (isLoading) return <p className="py-20 text-center">불러오는 중…</p>;
  if (isError || !data?.length) return <p className="py-20 text-center">데이터 없음</p>;

  /* ---------- 사전·사후 분리 ---------- */
  const sorted = [...data].sort(
    (a, b) => +new Date(a.info.date) - +new Date(b.info.date)
  );
  const pre  = sorted[0];                      // 가장 오래된
  const post = sorted[sorted.length - 1];      // 가장 최신

  /* ---------- 공통 데이터 ---------- */
  const labels      = Object.keys(pre.scores);
  const preScores   = Object.values(pre.scores);
  const postScores  = Object.values(post.scores);
  const strengthArr = Object.values((idx === 0 ? pre : post).feedback.strength);
  const weaknessArr = Object.values((idx === 0 ? pre : post).feedback.weakness);

  return (
    <div className="relative flex flex-col items-center px-4 py-10 font-[pretendard]">
      {/* 제목 */}
      <h2 className="mb-2 text-2xl font-bold text-[#5B7CFF]">Education Evaluation</h2>
      <p className="text-center text-gray-600">사전·사후 학습 결과 비교</p>

      {/* 화살표 */}
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

      {/* ---------- 차트 슬라이드 ---------- */}
      <div
        className="relative mt-10 w-full max-w-[500px] overflow-hidden"
        onTouchStart={swipeStart}
        onTouchEnd={swipeEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {/* 0 : 사전 */}
          <div className="w-full flex-shrink-0">
            <RadarChart labels={labels} values={preScores} label="Pre" color="#5b7cff" />
          </div>

          {/* 1 : 사후 */}
          <div className="w-full flex-shrink-0">
            <RadarChart labels={labels} values={postScores} label="Post" color="#ff6ab0" />
          </div>

          {/* 2 : 막대 + 종합평 */}
          <div className="w-full flex-shrink-0">
            <BarChart
              labels={labels}
              pre={preScores}
              post={postScores}
              final={post.feedback.final}
            />
          </div>
        </div>
      </div>

      {/* ---------- 범례 (슬라이드 0·1 기준) ---------- */}
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

      {/* ---------- 표 : 슬라이드 0,1 만 표시 ---------- */}
      {idx < 2 && (
        <table className="mt-10 w-full table-fixed border-separate border-spacing-0 text-sm text-gray-800">
          <thead>
            <tr>
              <th className="w-[60px]" />
              {labels.map((k) => (
                <th key={k} className="border-l border-b border-blue-200">
                  <div className="font-bold">{k}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 장점 */}
            <tr className="align-top">
              <td className="border-t border-b border-blue-200">
                <img src={good} alt="good" className="mx-auto h-6 w-6" />
              </td>
              {labels.map((_, i) => (
                <td key={i} className="border-l border-b border-blue-200 px-2 py-3 text-left">
                  {strengthArr[i] ?? '—'}
                </td>
              ))}
            </tr>
            {/* 단점 */}
            <tr className="align-top">
              <td>
                <img src={weakness} alt="bad" className="mx-auto h-6 w-6" />
              </td>
              {labels.map((_, i) => (
                <td key={i} className="border-l border-blue-200 px-2 py-3 text-left">
                  {weaknessArr[i] ?? '—'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
