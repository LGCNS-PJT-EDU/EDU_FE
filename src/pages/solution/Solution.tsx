// src/pages/solution/Solution.tsx
import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Options, Choice } from '@/components/ui/option'
import { fetchSolutions, SolutionResDto } from '@/api/solutionService'
import { useSolutionStore, EvalType } from '@/store/useSolutionStore'
import takeRabbit from '@/asset/img/common/takeRabbit.png'

const Solution: React.FC = () => {
  /* subjectId 읽기 (쿼리스트링) */
  const [sp] = useSearchParams()
  const subjectId = Number(sp.get('subjectId')) || 0

  const { evalType, setEvalType } = useSolutionStore()

  /* 모든 문제를 한 번에 가져옴 */
  const { data: rawList = [], isLoading, isError } = useQuery<
    SolutionResDto[],
    Error
  >({
    queryKey: ['solutions', subjectId],
    queryFn: () => fetchSolutions(subjectId),
    enabled: subjectId > 0,
  })

  /* ---------- 사후평가 라운드(drop-down) ---------- */
  const postRounds = React.useMemo(
    () =>
      Array.from(
        new Set(rawList.filter(q => !q.isPre).map(q => q.nth))
      ).sort((a, b) => a - b),
    [rawList],
  )

  const [postRound, setPostRound] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (postRounds.length) setPostRound(postRounds[postRounds.length - 1])
  }, [postRounds])

  /* isPre / nth 값으로 필터 */
  const list = React.useMemo(() => {
    if (evalType === 'pre') return rawList.filter(q => q.isPre)
    return rawList.filter(q => !q.isPre && q.nth === postRound)
  }, [rawList, evalType, postRound])
  /* ---------- 사후평가 라운드(drop-down) 끝 ---------- */

  /* 해설 토글 배열은 필터된 리스트 길이에 맞춰 초기화 */
  const [showExp, setShowExp] = React.useState<boolean[]>([])
  React.useEffect(() => {
    setShowExp(Array(list.length).fill(false))
  }, [list])

  const toggleExp = (i: number) =>
    setShowExp(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })

  /* ---------- 안내 카드용 상태 ---------- */
  const navigate = useNavigate()
  const needNotice = isLoading || isError || !list.length
  const noticeMsg = isLoading
    ? '문제를 불러오는 중입니다...'
    : isError
    ? '문제를 불러오지 못했습니다.'
    : '표시할 문항이 없습니다.'
  /* ---------- 안내 카드용 상태 끝 ---------- */

  const subjectName = rawList[0]?.subNm || '과목'

  return (
    <div className="p-6">
      {/* 과목명, 드롭다운 */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">{subjectName}</h1>

        {/* 드롭다운: 사전·사후 공통으로 표시 */}
        <select
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          value={evalType === 'pre' ? 'pre' : postRound ?? undefined}
          onChange={e => {
            if (evalType === 'pre') return
            setPostRound(Number(e.target.value))
          }}
        >
          {evalType === 'pre' ? (
            <option value="pre">사전평가 1차</option>
          ) : (
            postRounds.map(r => (
              <option key={r} value={r}>
                사후평가 {r}차
              </option>
            ))
          )}
        </select>
      </div>

      {/* 사전/사후 토글 */}
      <div className="inline-flex rounded-lg bg-[#f3f6fb] p-1 mb-5">
        <button
          onClick={() => setEvalType('pre')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            evalType === 'pre'
              ? 'bg-white text-gray-900 font-semibold shadow-sm'
              : 'text-gray-500'
          }`}
        >
          사전평가
        </button>
        <button
          onClick={() => setEvalType('post')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            evalType === 'post'
              ? 'bg-white text-gray-900 font-semibold shadow-sm'
              : 'text-gray-500'
          }`}
        >
          사후평가
        </button>
      </div>

      {/* 총 문항 수 (빈 목록이면 0) */}
      <h2 className="text-xl font-semibold mb-4">총 {list.length}문항</h2>

      {/* 에러 상황에 보여주는 화면 */}
      {needNotice && (
        <div className="flex flex-col items-center mb-10">
          <img
            src={takeRabbit}
            alt="empty"
            className="h-40 w-40 object-contain mb-6"
          />
          <p className="mb-6 whitespace-pre-wrap text-gray-600 text-center">
            {noticeMsg}
          </p>
          <button
            onClick={() => navigate('/roadmap')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            로드맵으로 돌아가기
          </button>
        </div>
      )}

      {/* 문항 카드 리스트 */}
      {!needNotice && (
        <div className="space-y-8">
          {list.map((q, idx) => {
            const choices: Choice[] = [
              { choiceId: idx * 4 + 1, choiceNum: 1, choice: q.option1, value: '1' },
              { choiceId: idx * 4 + 2, choiceNum: 2, choice: q.option2, value: '2' },
              { choiceId: idx * 4 + 3, choiceNum: 3, choice: q.option3, value: '3' },
              { choiceId: idx * 4 + 4, choiceNum: 4, choice: q.option4, value: '4' },
            ]

            return (
              <div key={idx} className="border border-black rounded-lg p-5">
                {/* 문제 헤더 */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {idx + 1}. {q.examContent}
                    <span className="ml-3 text-sm text-gray-500">
                      Lv. {q.examLevel}
                    </span>
                  </h3>
                  <button
                    onClick={() => toggleExp(idx)}
                    className="text-sm text-black"
                  >
                    {showExp[idx] ? '해설 접기 ▲' : '해설 보기 ▼'}
                  </button>
                </div>

                {/* 해설 */}
                {showExp[idx] && (
                  <div className="bg-gray-100 rounded-md p-3 mb-4 text-sm">
                    {q.solution}
                  </div>
                )}

                {/* 보기 리스트 */}
                <Options
                  choices={choices}
                  selectedValue={q.userAnswer.toString()}
                  showResult
                  correctValue={q.examAnswer.toString()}
                  indicatorType="number"
                  stateColors={{
                    normalBg: '#F6F5F8',
                    selectedBg: '#C9EBEF',
                    correctBg: '#F0FFF2',
                    incorrectBg: '#FFD2D2',
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default Solution
