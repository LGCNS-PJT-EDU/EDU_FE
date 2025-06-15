import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import blue_star from '@/asset/img/diagnosis/blue_star.png';
import gold_star from '@/asset/img/diagnosis/gold_star.png';
import smallRabbit from '@/asset/img/diagnosis/smallRabbit.png';
import Isolation from '@/asset/img/diagnosis/Isolation_Mode.png';
import startBtn from '@/asset/img/diagnosis/startBtn.png';
import pixelTexture from '@/asset/img/common/pixel_texture.png';
import responsiveBG from '@/asset/img/common/resposive_pixel_texture.png';
import { Options } from '../ui/option';
import { useState } from 'react';
import ConfirmModal from '../modal/ConfirmModal';

/* ===== 타입 ===== */
export type AssesmentKind = 'diagnosis' | 'pre' | 'post';

interface Choice {
  choiceId: number;
  choiceNum: number;
  choice: string;
  value: string;
}
interface Question {
  diagnosisId: number;
  question: string;
  questionType: string;
  choices: Choice[];
}
interface StatCardProps {
  title: string;
  value: number | string;
  bgColor?: string;
}
export interface AssesmentProps {
  kind: AssesmentKind;
  questions: Question[];
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  answers: Record<number, string>;
  choose: (value: string) => void;
  submit: () => void;
  isSubmitting: boolean;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;
  isLoadingQuestions?: boolean;
}

/* ===== 진단용 카피 ===== */
export const introCopy = {
  diagnosis_fe: {
    time: '⏱ 진단 소요시간 5분, 10문제',
    headline: '문제를 시작해볼까요?',
    sub: '개발 로드맵 확인하러 가기',
    submitLabel: '로드맵 생성',
  },
  diagnosis_be: {
    time: '⏱ 진단 소요시간 5분, 13문제',
    headline: '문제를 시작해볼까요?',
    sub: '개발 로드맵 확인하러 가기',
    submitLabel: '로드맵 생성',
  },
  pre: {
    time: '⏱ 약 5분, 10문제',
    headline: '학습 전 실력을 측정해볼까요?',
    sub: '지금 내 수준을 확인해보세요',
    submitLabel: '제출',
  },
  post: {
    time: '⏱ 약 5분, 15문제',
    headline: '학습 후 실력이 얼마나 향상됐을까요?',
    sub: '변화를 숫자로 확인해보세요',
    submitLabel: '제출',
  },
} as const;

/* ===== subjectId 분기 (필요 값으로 수정) ===== */
const FRONTEND_ID = 1;
const BACKEND_ID = 2;

export default function TestTemplate({
  kind,
  questions,
  currentIdx,
  setCurrentIdx,
  answers,
  choose,
  submit,
  isSubmitting,
  hasStarted,
  setHasStarted,
  isLoadingQuestions = false,
  subjectId,
  showConfirm,
  onConfirmNote,
  onCloseConfirm,
}: AssesmentProps & {
  subjectId?: number;
  showConfirm?: boolean;
  onConfirmNote?: () => void;
  onCloseConfirm?: () => void;
}) {
  /* 어떤 카피를 쓸지 결정 */
  const copyKey =
    kind === 'diagnosis'
      ? subjectId === FRONTEND_ID
        ? 'diagnosis_fe'
        : 'diagnosis_be'
      : kind;

  const { time, headline, sub, submitLabel } =
    introCopy[copyKey as keyof typeof introCopy];

  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentQ?.diagnosisId ?? -1] !== undefined;
  const totalCount = questions.length;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async () => {
    await submit();
    setShowConfirmModal(true);
  };

  /* ---------- 1. 제출 완료 모달 ---------- */
  if (showConfirm && onConfirmNote && onCloseConfirm) {
    return (
      <ConfirmModal
        title="제출이 완료되었습니다"
        message="오답노트를 확인하시겠습니까?"
        confirmText="오답노트 보러 가기"
        onClose={onCloseConfirm}
        onConfirm={onConfirmNote}
      />
    );
  }

  /* ---------- 2. 메인 컨텐츠 (시작 or 문제 풀이) ---------- */
  const pageContent = !hasStarted ? (
    /* ===== 시작 화면 ===== */
    <div className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-8 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">
        {/* 진행 통계 */}
        <div className="flex flex-row gap-6 lg:flex-col">
          <StatCard title="전체 질문 개수" value={totalCount} />
          <StatCard
            title="현재 응답 개수"
            value={Object.keys(answers).length}
            bgColor="#C6EDF2"
          />
        </div>

        {/* 시작 카드 */}
        <div className="relative flex-1 rounded-2xl bg-[#E6EEFF] p-8 border-4 border-blue-200 min-h-[300px] flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-600">{time}</p>
            <h2 className="mt-4 text-xl font-bold">{headline}</h2>
            <p className="mt-2 flex gap-2 text-sm text-[#4A4A4A]">
              <img src={Isolation} alt="isolation" className="w-[15px]" />
              <img src={smallRabbit} alt="smallRabbit" className="w-[30px]" />
              {sub}
            </p>
          </div>

          <div className="z-10 mt-6 flex justify-start">
            <button
              onClick={() => setHasStarted(true)}
              disabled={isLoadingQuestions}
              className="z-20 cursor-pointer font-semibold text-black"
            >
              <img src={startBtn} alt="startBtn" className="w-[320px] h-[50px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    /* ===== 문제 풀이 화면 ===== */
    <div className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-8 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">
        {/* 진행 통계 */}
        <div className="flex flex-row gap-6 lg:flex-col">
          <StatCard title="전체 질문 갯수" value={totalCount} />
          <StatCard
            title="현재 응답 갯수"
            value={Object.keys(answers).length}
            bgColor="#d8f4f9"
          />
        </div>

        {/* 현재 문항 */}
        {currentQ && (
          <div className="flex flex-1 flex-col justify-between rounded-[15px] bg-white p-8 shadow">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">
                {currentIdx + 1}. {currentQ.question}
                <span className="text-red-500"> *</span>
              </p>

              <Options
                choices={currentQ.choices as Choice[]}
                selectedValue={answers[currentQ.diagnosisId]}
                onChoose={choose}
              />
            </div>

            {/* 내비게이션 / 제출 */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentIdx(currentIdx - 1)}
                disabled={currentIdx === 0}
                className={`flex items-center gap-1 rounded-[8px] bg-[#D7DBFF] px-6 py-3 text-[#6378EB] ${currentIdx === 0 && 'cursor-not-allowed opacity-40'
                  }`}
              >
                <SlArrowLeft className="h-4 w-4" /> 이전 문제로
              </button>

              {currentIdx < totalCount - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  disabled={!isAnswered}
                  className={`flex items-center gap-1 rounded-[8px] bg-[#6378EB] px-6 py-3 text-white ${!isAnswered && 'cursor-not-allowed opacity-40'
                    }`}
                >
                  다음 문제로 <SlArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isAnswered || isSubmitting}
                  className={`rounded-[8px] bg-[#51BACB] px-6 py-3 text-white ${(!isAnswered || isSubmitting) && 'cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? '제출 중…' : submitLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ---------- 3. 픽셀 배경을 가진 최종 출력 ---------- */
  return (
    <div className="relative h-[calc(100vh-70px)] font-[pretendard] flex flex-col md:flex-row items-center md:items-start justify-center gap-[200px] overflow-hidden px-0 md:px-4">

      {/* 배경: 데스크탑 */}
      <img
        src={pixelTexture}
        alt=""
        className="hidden md:block absolute bottom-0 left-0 w-full h-full object-cover z-0 opacity-70"
      />

      {/* 배경: 모바일 */}
      <div className="absolute inset-0 z-0 block md:hidden">
        <img
          src={responsiveBG}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 실제 콘텐츠 */}
      <div className="relative z-10 w-full">
        {pageContent}
      </div>
    </div>
  );
}


/* ===== 진행 통계 카드 ===== */
const StatCard = ({ title, value, bgColor = '#ffffff' }: StatCardProps) => (
  <div
    className="w-[220px] rounded-xl px-5 py-4 border-2 border-[#e7eff5] bg-white/70"
    style={{ backgroundColor: bgColor }}
  >
    <div className="flex flex-col gap-[4px] text-center md:text-left">
      <p className="text-[15px] text-[#77818f]">{title}</p>
      <p className="text-[20px] font-semibold text-[#1a1a1a]">{value}</p>
    </div>
  </div>
);

