import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchDiagnosisQuestions,
  submitDiagnosis,
  DiagnosisAnswerReq,
  Question,
  RawData,
  RoadmapPayload,
} from "@/api/diagnosisService";
import { isLoggedIn } from "@/store/authGlobal";

export function useDiagnosis() {
  /* 문제 로드 */
  const {
    data: raw,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useQuery<RawData>({
    queryKey: ["diagnosisQuestions"],
    queryFn: fetchDiagnosisQuestions,
  });

  /* 클라이언트 상태 */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  /* 문제 배열 계산 */
  const trackQuestionId = raw?.COMMON?.[0]?.diagnosisId;
  const track = answers[trackQuestionId ?? -1];
  const questions: Question[] = useMemo(() => {
    if (!raw) return [];
    const { COMMON = [], BE = [], FE = [] } = raw;
    if (track === "BE") return [...COMMON, ...BE];
    if (track === "FE") return [...COMMON, ...FE];
    return COMMON;
  }, [raw, track]);

  /* 응답 등록 */
  const choose = (value: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.diagnosisId]: value }));
  };

  /* 제출 mutation */
  const navigate = useNavigate();
  const { mutate: submit, isPending: isSubmitting } = useMutation<
    RoadmapPayload,
    Error,
    DiagnosisAnswerReq[]
  >({
    mutationFn: submitDiagnosis,
    onSuccess: (roadmap) => {
      if (!isLoggedIn() && roadmap.uuid) {
        localStorage.setItem("roadmapUuid", roadmap.uuid);
      }
      navigate("/roadmap", { state: roadmap });
    },
    onError: () => alert("로드맵 생성에 실패했습니다."),
  });

  return {
    /* 상태 */
    raw,
    isQuestionsLoading,
    isQuestionsError,
    questions,
    currentIdx,
    setCurrentIdx,
    answers,
    isSubmitting,
    /* 메서드 */
    choose,
    submit,
  };
}
