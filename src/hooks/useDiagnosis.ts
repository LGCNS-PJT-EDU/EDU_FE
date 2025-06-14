import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchDiagnosisQuestions,
  submitDiagnosis,
  DiagnosisAnswerReq,
  Question,
  RawData,
  RoadmapPayload,
} from '@/api/diagnosisService';
import { useIsLoggedIn } from '@/store/authGlobal';
import { useGuestUuidStore } from '@/store/useGuestUuidStore';
import { useLoadingStore } from '@/store/useLoadingStore';

export function useDiagnosis() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoadingStore();

  /* 1) 질문 불러오기 */
  const {
    data: raw,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useQuery<RawData>({
    queryKey: ['diagnosisQuestions'],
    queryFn: fetchDiagnosisQuestions,
  });

  /* 2) 클라이언트 상태 (답안, 인덱스) */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  /* 3) 질문 목록 계산 */
  const trackQuestionId = raw?.COMMON?.[0]?.diagnosisId;
  const track = answers[trackQuestionId ?? -1];
  const questions: Question[] = useMemo(() => {
    if (!raw) return [];
    const { COMMON = [], BE = [], FE = [] } = raw;
    if (track === 'BE') return [...COMMON, ...BE];
    if (track === 'FE') return [...COMMON, ...FE];
    return COMMON;
  }, [raw, track]);

  /* 4) 답안 선택 */
  const choose = (value: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.diagnosisId]: value }));
  };

  /* 5) 제출 뮤테이션 */
  const { mutate: submit, isPending: isSubmitting } = useMutation<
    RoadmapPayload,
    Error,
    DiagnosisAnswerReq[]
  >({
    mutationFn: submitDiagnosis,
    onMutate: () => startLoading('진단 제출하는 중…'),
    onSuccess: (roadmap) => {
      console.log('[useDiagnosis에서 로드맵 불러오기]:', roadmap);
      if (!isLoggedIn && roadmap.uuid) {
        useGuestUuidStore.getState().setUuid(roadmap.uuid);
      }
      navigate('/roadmap', { state: roadmap });
    },
    onError: () => alert('로드맵 생성에 실패했습니다.'),
    onSettled: () => stopLoading(),
  });

  /* 제출 함수 래핑 */
  const submitAnswers = () => {
    const payload: DiagnosisAnswerReq[] = Object.entries(answers).map(([id, val]) => ({
      questionId: Number(id),
      answer: val,
    }));
    submit(payload);
  };

  return {
    raw,
    isQuestionsLoading,
    isQuestionsError,
    questions,
    currentIdx,
    setCurrentIdx,
    answers,
    submitAnswers,
    isSubmitting,
    choose,
    submit,
  };
}
