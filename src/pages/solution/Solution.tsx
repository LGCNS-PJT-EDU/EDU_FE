import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Options, Choice } from '@/components/ui/option'
import { fetchSolutions, SolutionResDto } from '@/api/solutionService'
import { EvalType, useSolutionStore } from '@/store/useSolutionStore'

const Solution: React.FC = () => {
  const { evalType, setEvalType } = useSolutionStore()

const {
    data: list = [],
    isLoading,
    isError,
  } = useQuery<SolutionResDto[], Error>({
    queryKey: ['solutions', evalType],
    queryFn: () => fetchSolutions(evalType),
  })

  // 해설 토글
  const [showExp, setShowExp] = React.useState<boolean[]>([])
  React.useEffect(() => {
    if (list.length) setShowExp(Array(list.length).fill(false))
  }, [list])

  const toggleExp = (i: number) =>
    setShowExp(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })

  if (isLoading) return <div>로딩 중…</div>
  if (isError)   return <div>문항을 불러오지 못했습니다.</div>
  if (!list.length) return <div>표시할 문항이 없습니다.</div>

  const subjectName = list[0].subNm

  return (
    <div className="p-6">
      {/* 과목명 */}
      <h1 className="text-2xl font-bold mb-1">{subjectName}</h1>

      {/* 헤더: 총 문항 + 평가 타입 셀렉트 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">총 {list.length}문항</h2>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={evalType}
          onChange={e => setEvalType(e.target.value as EvalType)}
        >
          <option value="pre">사전평가</option>
          <option value="post">사후평가</option>
        </select>
      </div>

      {/* 탭 */}
      <div className="flex space-x-2 mb-6">
        {(['pre', 'post'] as EvalType[]).map(t => (
          <button
            key={t}
            onClick={() => setEvalType(t)}
            className={`px-4 py-2 rounded ${
              evalType === t ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            {t === 'pre' ? '사전평가' : '사후평가'}
          </button>
        ))}
      </div>

      {/* 문항 리스트 */}
      <div className="space-y-8">
        {list.map((q, idx) => {
        const choices: Choice[] = [
          {
            choiceId: idx * 4 + 1,
            choiceNum: 1,
            choice: q.option1,
            value: '1',
          },
          {
            choiceId: idx * 4 + 2,
            choiceNum: 2,
            choice: q.option2,
            value: '2',
          },
          {
            choiceId: idx * 4 + 3,
            choiceNum: 3,
            choice: q.option3,
            value: '3',
          },
          {
            choiceId: idx * 4 + 4,
            choiceNum: 4,
            choice: q.option4,
            value: '4',
          },
        ]

          return (
            <div key={idx} className="border border-black rounded-lg p-5">
              {/* 문항 헤더 + 레벨 */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  {idx + 1}. {q.examContent}
                  <span className="ml-3 text-sm text-gray-500">
                    Lv. {q.examLevel}
                  </span>
                </h3>
                <button
                  onClick={() => toggleExp(idx)}
                  className="text-sm text-blue-600"
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

              {/* Options: 오답노트 모드 */}
              <Options
                choices={choices}
                selectedValue={q.userAnswer.toString()}
                showResult={true}
                correctValue={q.examAnswer.toString()}
                indicatorType="number"
                stateColors={{
                  normalBg:    '#F6F5F8',
                  selectedBg:  '#C9EBEF',
                  correctBg:   '#A3E55C',
                  incorrectBg: '#F87171',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Solution