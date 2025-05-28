import { useDiagnosis } from "@/hooks/useDiagnosis";
import TestTemplate from "@/components/test/TestTemplate";
import { useState } from "react";

export default function DiagnosisPage(){
  const [hasStarted, setHasStarted] = useState(false);
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    answers,
    choose,
    submitAnswers,
    isSubmitting,
  } = useDiagnosis();

  return (
    <TestTemplate
      kind="diagnosis"       
      questions={questions}
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