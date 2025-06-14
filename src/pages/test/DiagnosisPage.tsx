import { useDiagnosis } from "@/hooks/useDiagnosis";
import TestTemplate from "@/components/test/TestTemplate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/modal/ConfirmModal";

export default function DiagnosisPage(){
  const [hasStarted, setHasStarted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate();
  
  const {
    raw,
    questions,
    currentIdx,
    setCurrentIdx,
    answers,
    choose,
    submitAnswers,
    isSubmitting,
    isQuestionsLoading,
  } = useDiagnosis();

  const handleStart = () => {
    if (raw?.roadmap_exist) setConfirmOpen(true);
    else setHasStarted(true);
  };
  const onConfirmReDiagnose = () => {
    setConfirmOpen(false);
    setHasStarted(true);
  };
  const onCancleReDiagnose = () => {
    navigate("/", { replace: true});
  };

  return (
    <>
      {confirmOpen && (
        <ConfirmModal
          title="기존 로드맵이 있습니다"
          message={"진단을 다시 진행하면 기존 로드맵과 \n학습 이력이 삭제됩니다.😢\n계속 진행하시겠습니까?"}
          confirmText="네 진행할게요"
          onConfirm={onConfirmReDiagnose}
          onClose={onCancleReDiagnose}
        />
      )}
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
        setHasStarted={handleStart}
        isLoadingQuestions={isQuestionsLoading}
      />
    </>
  )
}