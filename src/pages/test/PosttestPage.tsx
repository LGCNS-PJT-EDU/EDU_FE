import TestTemplate from "@/components/test/TestTemplate";
import usePosttest from "@/hooks/usePosttest";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PosttestPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [params] = useSearchParams();
  const subjectId = Number(params.get("subjectId") || 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subjectId) navigate("/roadmap");
  }, [subjectId, navigate]);

  const {
    questions = [],
    currentIdx,
    setCurrentIdx,
    answers,
    choose,
    submitAnswers,
    isSubmitting,
  } = usePosttest(subjectId);

  const mappedQuestions = questions.map((q) => {
    const choiceArr = q.choices.map((c, idx) => ({
      choiceId: c.id,
      choiceNum: idx + 1,
      choice: c.text,
      value: c.value,
    }));

    return {
      diagnosisId: q.id,
      question: q.question,
      questionType: "객관식",
      choices: choiceArr,
    };
  });
  return (
    <TestTemplate
      kind="post"
      questions={mappedQuestions}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      answers={answers}
      choose={choose}
      submit={submitAnswers}
      isSubmitting={isSubmitting}
      hasStarted={hasStarted}
      setHasStarted={setHasStarted}
    />
  )
}