import weakness from '@/asset/img/report/weakness.png';
import good from '@/asset/img/report/good.png';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RadarChart from '@/components/chart/chart';
import BarChart from '@/components/chart/Barchart';
import { useFeedback } from '@/hooks/useReport';

/* 백점으로 변환 */
function normalizeScoresTo100(scores: Record<string, number>) {
  const { total, ...chapters } = scores;
  const actualTotal = Object.values(chapters).reduce((sum, val) => sum + val, 0);
  const totalPercentage = Math.round((actualTotal / total) * 100);
  const chapterPercentages = Object.values(chapters).map((score) =>
    Math.round((score / total) * 100)
  );
  return { total: totalPercentage, chapters: chapterPercentages };
}

export default function Report() {
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const numericId = Number(subjectId);
  const { data = [], isLoading, isError } = useFeedback(numericId);
  const [tab, setTab] = useState(0);

  if (isLoading) return <p className="py-20 text-center">불러오는 중…</p>;
  if (isError || !data.length) return <p className="py-20 text-center">데이터 없음</p>;

  const sorted = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const pre = sorted[0];
  const post = sorted.length > 1 ? sorted[sorted.length - 1] : null;
  const postExists = !!post && pre !== post;

  const labels = Object.keys(pre.scores).filter((key) => key !== 'total');
  const preNormalized = normalizeScoresTo100(pre.scores);
  const preTotal = preNormalized.total;
  const preScores = preNormalized.chapters;
  const postNormalized = postExists ? normalizeScoresTo100(post.scores) : null;
  const postTotal = postNormalized?.total || 0;
  const postScores = postNormalized?.chapters || [];

  const tabList = [
    { title: '사전 평가', disabled: false },
    { title: '사후 평가', disabled: !postExists },
    { title: '사전/사후평가 비교', disabled: !postExists },
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-10 font-[pretendard] text-center">
      <h2 className="text-3xl font-bold text-[#6C80EC] mb-2">학습 진단 결과</h2>
      <p className="text-gray-600 text-sm mb-6">
        학습자별 사전/사후 평가 결과를 시각적으로 확인할 수 있어요.
      </p>

      {/* 탭 버튼 */}
      <div className="flex justify-center gap-4 mb-6">
        {tabList.map((tabInfo, i) => (
          <button
            key={i}
            onClick={() => !tabInfo.disabled && setTab(i)}
            disabled={tabInfo.disabled}
            className={`px-4 py-2 rounded-full text-[13px] md:text-sm font-semibold transition-all
        ${tab === i ? 'bg-[#6C80EC] text-white' : 'bg-[#E8ECFF] text-gray-600'}
        ${tabInfo.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tabInfo.title}
          </button>
        ))}
      </div>


      {/* 총점 정보 */}
      <div className="inline-block bg-white border-2 rounded-xl px-6 py-4 mb-6">
        <h3 className="text-[#6C80EC] font-semibold text-lg">
          {tab === 0 && `사전평가 총점: ${preTotal}점`}
          {tab === 1 && postExists && `사후평가 총점: ${postTotal}점`}
          {tab === 2 && postExists && `사전평가 ${preTotal}점 / 사후평가 ${postTotal}점`}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {tab === 0 && '사전 평가 결과'}
          {tab === 1 && '사후 평가 결과'}
          {tab === 2 && '사전·사후 학습 결과 비교'}
        </p>
      </div>

      {/* 차트 */}
      <div className="rounded-xl p-0 md:p-6 max-w-[900px] w-full h-[320px] md:h-[480px] mx-auto flex items-center justify-center ">
        {tab === 0 && (
          <RadarChart labels={labels} values={preScores} label="Pre" color="rgba(91, 124, 255, 1)" />
        )}
        {tab === 1 && postExists && (
          <RadarChart labels={labels} values={postScores} label="Post" color="rgba(255, 106, 176, 1)" />
        )}
        {tab === 2 && postExists && (
          <BarChart pre={preTotal} post={postTotal} final={String(post.feedback.final ?? '')} />
        )}
      </div>

      {/* 피드백 테이블 */}
      {/* 모바일에서만 문구 표시 */}
      {tab !== 2 && (
        <>
          {/* 모바일에서만 문구 표시 */}
          <p className="text-sm text-gray-500 mt-2 mb-1 sm:hidden text-left">
            👉 슬라이드로 넘겨서 확인해보세요
          </p>

          {/* 피드백 테이블 */}
          <div className="w-full overflow-x-auto sm:overflow-x-visible mt-10">
            <table className="mt-4 min-w-[940px] border-collapse rounded-xl overflow-hidden text-sm text-gray-800">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="sticky left-0 bg-blue-100 z-20 min-w-[70px] py-3 text-center border-r border-gray-200"></th>
                  {labels.map((k) => (
                    <th
                      key={k}
                      className="px-4 py-3 text-center font-bold whitespace-pre-wrap min-w-[180px] sm:min-w-0"
                    >
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
                  <td className="sticky left-0 bg-blue-50 z-20 min-w-[70px] py-4 text-center align-middle">
                    <img src={good} alt="긍정피드백" className="w-10 h-10 object-contain mx-auto" />
                  </td>
                  {labels.map((label, i) => (
                    <td
                      key={i}
                      className="px-3 py-4 text-left whitespace-pre-wrap min-w-[160px] sm:min-w-0"
                    >
                      {(tab === 0 ? pre.feedback.strength[label] : post?.feedback.strength[label])
                        ?.split('.')
                        .filter(Boolean)
                        .map((s, j) => (
                          <div key={j} className="pb-[2px]">{s.trim() + '.'}</div>
                        )) || '—'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-red-100 align-top leading-relaxed">
                  <td className="sticky left-0 bg-red-100 z-20 min-w-[70px] py-4 text-center align-middle">
                    <img src={weakness} alt="부정피드백" className="w-10 h-10 object-contain mx-auto" />
                  </td>
                  {labels.map((label, i) => (
                    <td
                      key={i}
                      className="px-3 py-4 text-left whitespace-pre-wrap min-w-[160px] sm:min-w-0"
                    >
                      {(tab === 0 ? pre.feedback.weakness[label] : post?.feedback.weakness[label])
                        ?.split('.')
                        .filter(Boolean)
                        .map((s, j) => (
                          <div key={j} className="pb-[2px]">{s.trim() + '.'}</div>
                        )) || '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}


      {tab !== 2 && (
        <p className="text-xs text-gray-400 mt-8">
          ※ 본 결과는 AI 기반 진단 분석에 따라 제공됩니다.
        </p>
      )}
    </div>
  );
}