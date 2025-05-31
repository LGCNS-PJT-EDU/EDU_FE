import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  fetchPostTestQuestions,
  fetchSubjectDetail,
  submitPostTest,
  PostTestQuestion,
  PostTestSubmitPayload,
} from '@/api/postTestService';
import { getAccessToken } from "@/store/authGlobal";
import { useNavigate, useLocation } from "react-router-dom";

export default function usePosttest(subjectId: number) {
  const navigate = useNavigate();

  /* 토큰 없으면 로그인 페이지로 강제 이동 */
  useEffect(() => {
    if (!getAccessToken()) navigate("/login");
  }, [navigate])

  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
  } = useQuery<PostTestQuestion[]>({
    queryKey: ["postTestQuestions", subjectId],
    queryFn: () => fetchPostTestQuestions(subjectId),
    enabled: !!subjectId,
  });

  const {
    data: subjectDetail,
    isLoading: isSubjectLoading,
  } = useQuery({
    queryKey: ["subjectDetail", subjectId],
    queryFn: () => fetchSubjectDetail(subjectId),
    enabled: !!subjectId,
  });

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startDate] = useState(() => new Date().toISOString());
  const [startTime] = useState(() => Date.now());
  const duration = Math.floor((Date.now() - startTime) / 1000);

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: submitPostTest,
    onSuccess: () => {
      alert("사전평가 제출이 완료되었습니다.");
      /* 모달창 추가해줘야함 */
      navigate("/roadmap")
    },
    onError: () => alert("사전평가 제출 실패"),
  });

  const choose = (value: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  /* 제출 */
  const submitAnswers = () => {
    if (!subjectDetail?.roadmapId) {
      alert("로드맵 정보를 불러오지 못했습니다.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      alert("모든 문항에 응답 해주세요.");
      return;
    }

    const payload: PostTestSubmitPayload = {
      roadmapId: subjectDetail.roadmapId,
      subjectId,
      startDate,
      duration,
      submitCnt: 1,
      answers: questions.map((q) => ({
        examId: q.id,
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
    isSubmitting: isSubmitting || isQuestionsLoading || isSubjectLoading,
  };
}
