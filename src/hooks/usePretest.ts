import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  fetchPreTestQuestions,
  fetchSubjectDetail,
  submitPreTest,
  PreTestQuestion,
  PreTestSubmitPayload,
} from "@/api/preTestService";
import { getAccessToken } from "@/store/authGlobal";
import { useNavigate } from "react-router-dom";
import { SubjectDetail } from "./useSubjectDetail";

export default function usePretest(subjectId: number) {
  const navigate = useNavigate();

  /* 토큰 없으면 로그인 페이지로 강제 이동 */
  useEffect(() => {
    if (!getAccessToken()) navigate("/login");
  }, [navigate]);

  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
  } = useQuery<PreTestQuestion[]>({
    queryKey: ["preTestQuestions", subjectId],
    queryFn: () => fetchPreTestQuestions(subjectId),
    enabled: !!subjectId,
  });

  const {
    data: subjectDetail,
    isLoading: isSubjectLoading,
  } = useQuery<SubjectDetail>({
    queryKey: ["subjectDetail", subjectId],
    queryFn: () => fetchSubjectDetail(subjectId),
    enabled: !!subjectId,
  });


  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startDate] = useState(() => new Date().toISOString());
  const [startTime] = useState(() => Date.now());
  const duration = Math.floor((Date.now() - startTime) / 1000);

  const { mutate: submit, isPending: isSubmitting, isSuccess, isError } = useMutation({
    mutationFn: submitPreTest,
  });

  const choose = (value: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const submitAnswers = () => {
    if (!subjectDetail?.roadmapId) {
      alert("로드맵 정보를 불러오지 못했습니다.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      alert("모든 문항에 응답해주세요.");
      return;
    }

    const submitCnt = subjectDetail.preSubmitCount ?? 0;

    const payload: PreTestSubmitPayload = {
      roadmapId: subjectDetail.roadmapId,
      subjectId,
      startDate,
      duration,
      submitCnt,
      answers: questions.map((q) => ({
        examId: q.id,
        examContent: q.question,
        chapterNum: q.chapterNum,
        chapterName: q.chapterName,
        difficulty: q.difficulty,
        answerTF: Number(answers[q.id]) === q.answerNum,
        userAnswer: Number(answers[q.id]),
      })),
    };
    submit(payload);
  };

  return {
    questions,
    currentIdx,
    setCurrentIdx,
    answers,
    choose,
    submitAnswers,
    submit,
    isSubmitting: isSubmitting || isQuestionsLoading || isSubjectLoading,
    isSuccess,
    isError,
  };
}
