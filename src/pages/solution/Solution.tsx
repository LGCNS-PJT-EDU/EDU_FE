import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Options, Choice } from '@/components/ui/option';
import { fetchSolutions, SolutionResDto } from '@/api/solutionService';
import { useSolutionStore, EvalType } from '@/store/useSolutionStore';
import takeRabbit from '@/asset/img/common/takeRabbit.png';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Solution: React.FC = () => {
  const [sp] = useSearchParams();
  const subjectId = Number(sp.get('subjectId')) || 0;
  const qsEval = sp.get('eval');
  const qsNthRaw = Number(sp.get('nth'));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    data: rawList,
    isLoading,
    isError,
  } = useQuery<SolutionResDto[], Error>({
    queryKey: ['solutions', subjectId],
    queryFn: () => fetchSolutions(subjectId),
    enabled: subjectId > 0,
  });

  const postRounds = useMemo(() => {
    if (!Array.isArray(rawList)) return [];
    return Array.from(new Set(rawList.filter((q) => !q.isPre).map((q) => q.nth))).sort((a, b) => a - b);
  }, [rawList]);

  const hasPost = postRounds.length > 0;

  const { evalType, setEvalType } = useSolutionStore();
  useEffect(() => {
    if (!Array.isArray(rawList)) return;

    let initEval: EvalType = 'pre';
    if (qsEval === 'post') initEval = 'post';
    else if (!qsEval && rawList.some((q) => !q.isPre)) initEval = 'post';

    setEvalType(initEval);
  }, [qsEval, rawList, setEvalType]);

  const [postRound, setPostRound] = useState<number | null>(null);

  useEffect(() => {
    if (evalType === 'post' && hasPost) {
      const nth = Number.isFinite(qsNthRaw) ? qsNthRaw : postRounds[postRounds.length - 1];
      setPostRound(nth);
    } else {
      setPostRound(null);
    }
  }, [evalType, hasPost, qsNthRaw, postRounds]);

  useEffect(() => {
    if (evalType === 'post' && hasPost && !postRounds.includes(postRound as number)) {
      setPostRound(postRounds[postRounds.length - 1]);
    }
  }, [evalType, hasPost, postRounds, postRound]);

  const list = useMemo(() => {
    if (!Array.isArray(rawList)) return [];
    if (evalType === 'pre') return rawList.filter((q) => q.isPre);
    return rawList.filter((q) => !q.isPre && q.nth === postRound);
  }, [rawList, evalType, postRound]);

  const [showExp, setShowExp] = useState<boolean[]>([]);
  useEffect(() => {
    setShowExp(Array(list.length).fill(false));
  }, [list]);

  const toggleExp = (i: number) =>
    setShowExp((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  const navigate = useNavigate();
  const needNotice = isLoading || isError || !list.length;
  const noticeMsg = isLoading
    ? '문제를 불러오는 중입니다...'
    : isError
    ? '문제를 불러오지 못했습니다.'
    : '표시할 문항이 없습니다.';

  const subjectName = Array.isArray(rawList) && rawList.length > 0 ? rawList[0].subNm : '과목';

  const levelMap: Record<
    string,
    { label: '하' | '중' | '상'; badge: string; text: string }
  > = {
    low: { label: '하', badge: 'bg-[#D6F0FF]', text: 'text-[#2563EB]' },
    medium: { label: '중', badge: 'bg-[#FFF4CC]', text: 'text-[#92400E]' },
    high: { label: '상', badge: 'bg-[#FFE5E5]', text: 'text-[#B91C1C]' },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 animate-fade-slide-in">
        <div className="flex items-center gap-3 py-4">
          <div className="w-10 h-8 bg-indigo-100 text-[#6378eb] font-semibold text-[10px] rounded-md flex items-center justify-center shadow-inner">
            과목명
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{subjectName}</h1>
        </div>

        {evalType === 'post' && (
          <div className="relative w-48">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-left shadow-sm hover:border-indigo-400 hover:shadow-md transition flex justify-between items-center"
            >
              {postRound ? `사후평가 ${postRound}차` : '사후평가 선택'}
              <span className="text-xs text-gray-400 ml-2">▼</span>
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-300 animate-dropdown origin-top">
                {postRounds.map((r) => (
                  <li
                    key={r}
                    onClick={() => {
                      setPostRound(r);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer flex justify-between items-center"
                  >
                    사후평가 {r}차
                    {postRound === r && (
                      <span className="text-indigo-500 text-xs">✔</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setEvalType('pre')}
          className={`mr-4 pb-2 border-b-2 ${
            evalType === 'pre'
              ? 'border-[#6378EB] text-[#6378EB] font-bold'
              : 'border-transparent text-gray-500'
          }`}
        >
          사전평가
        </button>
        <button
          onClick={() => hasPost && setEvalType('post')}
          disabled={!hasPost}
          className={`pb-2 border-b-2 ${
            evalType === 'post'
              ? 'border-[#6378EB] text-[#6378EB] font-bold'
              : 'border-transparent text-gray-500'
          } ${!hasPost ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          사후평가
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">총 {list.length}문항</h2>

      {needNotice ? (
        <div className="flex flex-col items-center mb-10">
          <img src={takeRabbit} alt="empty" className="h-40 w-40 object-contain mb-6" />
          <p className="mb-6 whitespace-pre-wrap text-gray-600 text-center">{noticeMsg}</p>
          <button
            onClick={() => navigate('/roadmap')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            로드맵으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {list.map((q, idx) => {
            const choices: Choice[] = [
              { choiceId: idx * 4 + 1, choiceNum: 1, choice: q.option1, value: '1' },
              { choiceId: idx * 4 + 2, choiceNum: 2, choice: q.option2, value: '2' },
              { choiceId: idx * 4 + 3, choiceNum: 3, choice: q.option3, value: '3' },
              { choiceId: idx * 4 + 4, choiceNum: 4, choice: q.option4, value: '4' },
            ];

            const { label, badge, text } = levelMap[q.examLevel] ?? {
              label: '?',
              badge: 'bg-gray-400',
              text: 'text-gray-700',
            };

            return (
              <div key={idx} className="rounded-lg border border-gray-200 shadow-sm p-4 bg-white transition-transform duration-200">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    {idx + 1}. {q.examContent}
                  </h3>
                  <span className={`ml-2 inline-flex h-7 px-3 items-center justify-center rounded-full text-sm font-semibold ${badge} ${text}`}>
                    {label}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleExp(idx)}
                    className="flex items-center text-sm font-semibold text-gray-700 transition mb-2"
                  >
                    {showExp[idx] ? (
                      <>
                        해설 접기
                        <ChevronUp className="ml-1 w-5 h-5 text-gray-600" />
                      </>
                    ) : (
                      <>
                        해설 보기
                        <ChevronDown className="ml-1 w-5 h-5 text-gray-600" />
                      </>
                    )}
                  </button>
                </div>

                {showExp[idx] && (
                  <div className="mb-3 rounded-md bg-indigo-50 p-3 text-sm text-gray-700 animate-fade-in">
                    {q.solution}
                  </div>
                )}

                <Options
                  choices={choices}
                  selectedValue={q.userAnswer.toString()}
                  showResult
                  correctValue={q.examAnswer.toString()}
                  indicatorType="number"
                  stateColors={{
                    normalBg: '#F9FAFB',
                    selectedBg: '#C9EBEF',
                    correctBg: '#D1F2EB',
                    incorrectBg: '#FADBD8',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Solution;
