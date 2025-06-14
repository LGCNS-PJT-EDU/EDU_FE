import weakness from '@/asset/img/report/weakness.png';
import good from '@/asset/img/report/good.png';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import RadarChart from '@/components/chart/chart';
import BarChart from '@/components/chart/Barchart';

import { useState, useRef } from 'react';
import { useFeedback } from '@/hooks/useReport';
import { useSearchParams } from 'react-router-dom';

/* 100점으로 환산하는 함수 */
function normalizeScoresTo100(scores: Record<string, number>) {
  const { total, ...chapters } = scores;
  const actualTotal = Object.values(chapters).reduce((sum, val) => sum + val, 0);

  const totalPercentage = Math.round((actualTotal / total) * 100);
  const chapterPercentages = Object.values(chapters).map((score) =>
    Math.round((score / total) * 100)
  );

  return {
    total: totalPercentage,
    chapters: chapterPercentages,
  };
}

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

  const sorted = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  //사전평가와 사후평가 데이터 구분
  const pre = sorted[0]; //가장 첫번째 평가
  const post = sorted[sorted.length - 1]; //가장 마지막 평가

  const labels = Object.keys(pre.scores).filter((key) => key !== 'total');

  const preNormalized = normalizeScoresTo100(pre.scores);
  const postNormalized = normalizeScoresTo100(post.scores);

  const preTotal = preNormalized.total;
  const preScores = preNormalized.chapters;

  const postTotal = postNormalized.total;
  const postScores = postNormalized.chapters;

  return (
    <div className="w-[1000px] relative flex flex-col items-center px-4 py-10 font-[pretendard]">
      <h2 className="mb-2 text-2xl font-bold text-[#5B7CFF]">Education Evaluation</h2>
      <p className="text-center text-gray-600">
        {idx === 0 && '사전 평가 결과'}
        {idx === 1 && '사후 평가 결과'}
        {idx === 2 && '사전·사후 학습 결과 비교'}
      </p>

      {/* 총점 */}
      <p className="mt-4 text-sm text-gray-700">
        {idx === 0 && `사전평가 총점: ${preTotal}점`}
        {idx === 1 && `사후평가 총점: ${postTotal}점`}
        {idx === 2 && `사전평가 ${preTotal}점 / 사후평가 ${postTotal}점`}
      </p>

      {/* 슬라이드 & 버튼 묶음 */}
      <div className="relative w-full max-w-[700px] h-[600px] mx-auto mt-2">
        {/* 버튼 */}
        {idx > 0 && (
          <button
            className="absolute left-[-5rem] top-1/2 -translate-y-1/2 z-10"
            onClick={() => setIdx(idx - 1)}
          >
            <MdChevronLeft size={40} className="text-blue-500" />
          </button>
        )}

        {/* → 버튼 */}
        {idx < 2 && (
          <button
            className="absolute right-[-5rem] top-1/2 -translate-y-1/2 z-10"
            onClick={() => setIdx(idx + 1)}
          >
            <MdChevronRight size={40} className="text-blue-500" />
          </button>
        )}

        {/* 슬라이드 */}
        <div
          className="relative w-full h-[500px] overflow-hidden"
          onTouchStart={swipeStart}
          onTouchEnd={swipeEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            <div className="w-full flex-shrink-0">
              <RadarChart
                labels={labels}
                values={preScores}
                label="Pre"
                color="rgba(91, 124, 255, 1)"
              />
            </div>
            <div className="w-full flex-shrink-0">
              <RadarChart
                labels={labels}
                values={postScores}
                label="Post"
                color="rgba(255, 106, 176, 1)"
              />
            </div>
            <div className="w-full flex-shrink-0">
              <BarChart pre={preTotal} post={postTotal} final={post.feedback.final} />
            </div>
          </div>
        </div>
      </div>

      {/* 피드백 테이블 */}
      {(idx === 0 || idx === 1) && (
        <table className="mt-10 w-full table-fixed border-collapse rounded-xl overflow-hidden text-sm text-gray-800">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="w-[60px] py-3 text-center"></th>
              {labels.map((k) => (
                <th key={k} className="px-2 py-3 text-center font-bold">
                  {k.length > 11 ? (
                    <>
                      {k.slice(0, 17)}
                      <br />
                      {k.slice(17)}
                    </>
                  ) : (
                    k
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50 align-top leading-relaxed">
              <td className="text-center align-middle py-4">
                <img src={good} alt="긍정피드백" className="w-8 h-8 mx-auto" />
              </td>
              {labels.map((label, i) => (
                <td key={i} className="px-3 py-4 text-left">
                  {(idx === 0 ? pre.feedback.strength[label] : post.feedback.strength[label])
                    ?.split('.')
                    .filter(Boolean)
                    .map((s, j) => (
                      <div key={j} className="pb-[2px]">
                        {s.trim() + '.'}
                      </div>
                    )) || '—'}
                </td>
              ))}
            </tr>
            <tr className="bg-red-100 align-top leading-relaxed">
              <td className="text-center align-middle py-4">
                <img src={weakness} alt="부정피드백" className="w-8 h-8 mx-auto" />
              </td>
              {labels.map((label, i) => (
                <td key={i} className="px-3 py-4 text-left">
                  {(idx === 0 ? pre.feedback.weakness[label] : post.feedback.weakness[label])
                    ?.split('.')
                    .filter(Boolean)
                    .map((s, j) => (
                      <div key={j} className="pb-[2px]">
                        {s.trim() + '.'}
                      </div>
                    )) || '—'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
