import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  fetchPreTestQuestions,
  PreTestQuestion,
  PreTestSubmitPayload,
  submitPreTest,
} from '@/api/preTestService';
import { getAccessToken } from "@/store/authGlobal";
import { useNavigate, useLocation } from "react-router-dom";

export default function usePretest(subjectId: number) {
  const navigate = useNavigate();

  /* 토큰 없으면 로그인 페이지로 강제 이동 */
  useEffect(() => {
    if (!getAccessToken()) navigate("/login");
  }, [navigate])


  const {
    data: questions = [], isLoading
  } = useQuery<PreTestQuestion[]>({
    queryKey: ["preTestQuestions", subjectId],
    queryFn: () => fetchPreTestQuestions(subjectId),
    enabled: !!subjectId && !!getAccessToken(),
  });

  const [answers, setAnswers] = useState<Record<number, string>>({}); // 사용자 선택
  const [currentIdx, setCurrentIdx] = useState(0); //현재 보고 있는 문제의 인덱스
  const [startDate] = useState(() => new Date().toISOString()); //사전평가 시작 시간
  const [startTime] = useState(() => Date.now());

  const duration = Math.floor((Date.now() - startTime) / 1000);
  //제출함수
  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: submitPreTest,
    onSuccess: () => {
      alert("사전평가 제출이 완료되었습니다.");
      /* 모달창 추가해줘야함 */
      navigate("/roadmap")
    },
    onError: () => alert("사전평가 제출 실패"),
  });

  //선택지 저장 
  const choose = (value: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  /* 제출 함수*/
  const submitAnswers = () => {

    if (Object.keys(answers).length !== questions.length) {
      alert("모든 문항에 응답 해주세요.");
      return;
    }
    const payload: PreTestSubmitPayload = {
      subjectId,
      startDate,
      duration,
      submitCnt: 1,
      answers: questions.map((q) => {
        const isCorrect = Number(answers[q.id]) === q.answerNum;
        return {
          examId: q.id,
          chapterNum: q.chapterNum,
          chapterName: q.chapterName,
          difficulty: q.difficulty,
          userAnswer: Number(answers[q.id]),
          answerTF: isCorrect,
        };
      }),
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
