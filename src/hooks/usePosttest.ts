import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  fetchPostTestQuestions,
  PostTestAnswer,
  PostTestQuestion,
  PostTestSubmitPayload,
  submitPostTest,
} from '@/api/postTestService';
import { getAccessToken } from "@/store/authGlobal";
import { useNavigate, useLocation } from "react-router-dom";

export default function usePosttest(subjectId: number) {

  const { state } = useLocation() as { state: { subjectId?: number } };
  const navigate = useNavigate();

  /* 토큰 없으면 로그인 페이지로 강제 이동 */
  useEffect(() => {
    if (!getAccessToken()) navigate("/login");
  }, [navigate])


  const {
    data: questions = [], isLoading
  } = useQuery<PostTestQuestion[]>({
    queryKey: ["postTestQuestions", subjectId],
    queryFn: () => fetchPostTestQuestions(subjectId),
    enabled: !!subjectId && !!getAccessToken(),
  });

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startDate] = useState(() => new Date().toISOString());

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

    if (Object.keys(answers).length !== questions.length) {
      alert("모든 문항에 응답 해주세요.");
      return;
    }
    const payload: PostTestSubmitPayload = {
      roadmapId: 1, // TODO: 동적 설정
      subjectId,
      startDate,
      duration: 300,
      submitCnt: 1,
      answers: Object.entries(answers).map(([id, val]) => ({
        id: Number(id),
        chapterNum: 0,
        chapterName: "",
        difficulty: "",
        answerTF: true,
        userAnswer: Number(val),
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
    isSubmitting,
    isLoading,
  };
}
