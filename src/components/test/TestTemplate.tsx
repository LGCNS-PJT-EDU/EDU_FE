/* eslint-disable react-hooks/exhaustive-deps */
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import smallRabbit    from '@/asset/img/diagnosis/smallRabbit.png';
import Isolation      from '@/asset/img/diagnosis/Isolation_Mode.png';
import startBtn       from '@/asset/img/diagnosis/startBtn.png';
import pixelTexture   from '@/asset/img/common/pixel_texture.png';
import responsiveBG   from '@/asset/img/diagnosis/mobile.png';
import { Options }    from '../ui/option';
import { useEffect, useState }   from 'react';
import ConfirmModal   from '../modal/ConfirmModal';

/* ===== 타입 정의 ===== */
export type AssesmentKind = 'diagnosis' | 'pre' | 'post';

interface Choice {
  choiceId:   number;
  choiceNum:  number;
  choice:     string;
  value:      string;
}
interface Question {
  diagnosisId:  number;
  question:     string;
  questionType: string;
  choices:      Choice[];
}
interface StatCardProps {
  title:    string;
  value:    number | string;
  bgColor?: string;
}
export interface AssesmentProps {
  kind:              AssesmentKind;
  questions:         Question[];
  currentIdx:        number;
  setCurrentIdx:     (idx: number) => void;
  answers:           Record<number, string>;
  choose:            (value: string) => void;
  submit:            () => void;
  isSubmitting:      boolean;
  hasStarted:        boolean;
  setHasStarted:     (started: boolean) => void;
  isLoadingQuestions?: boolean;
}

/* ===== intro 카피 ===== */
export const introCopy = {
  diagnosis_fe: {
    time:        '⏱ 진단 소요시간 3분, 9문제',
    headline:    '먼저 관심 분야를 선택해 주세요!',
    submitLabel: '시작하기',
  },
  diagnosis_be: {
    time:        '⏱ 진단 소요시간 3분, 8문제',
    headline:    '먼저 관심 분야를 선택해 주세요!',
    submitLabel: '시작하기',
  },
  pre: {
    time:        '⏱ 평가 소요시간 5분, 10문제',
    headline:    '학습 전 실력을 측정해볼까요?',
    submitLabel: '제출',
  },
  post: {
    time:        '⏱ 평가 소요시간 5분, 15문제',
    headline:    '학습 후 실력이 얼마나 향상됐을까요?',
    submitLabel: '제출',
  },
} as const;

/* ===== subjectId 하드코딩 분기 ===== */
const FRONTEND_ID = 1;
const BACKEND_ID  = 2;

/* ===== diagnosis 모드 질문 수 상수 ===== */
const FE_TOTAL   = 9;
const BE_TOTAL   = 8;

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
  subjectId?:     number;
  showConfirm?:   boolean;
  onConfirmNote?: () => void;
  onCloseConfirm?:() => void;
}) {
  /* FE / BE 선택 상태 */
  const [selectedTrack, setSelectedTrack] = useState<'FE' | 'BE' | null>(null);
  
  /* wave 번갈아서 하기 */
  const [activeWave, setActiveWave] = useState<'FE' | 'BE'>('FE');
    useEffect(() => {
      if (selectedTrack === null) {
        const timer = setInterval(() => {
          setActiveWave((prev) => (prev === 'FE' ? 'BE' : 'FE'));
        }, 1200);
        return () => clearInterval(timer);
      }
    }, [selectedTrack]);

  /* 카피 결정 */
  const derivedSubjectId =
    subjectId ??
    (selectedTrack === 'FE'
      ? FRONTEND_ID
      : selectedTrack === 'BE'
      ? BACKEND_ID
      : undefined);

  const copyKey =
    kind === 'diagnosis'
      ? derivedSubjectId === FRONTEND_ID
        ? 'diagnosis_fe'
        : 'diagnosis_be'
      : kind;

  const { time, headline, submitLabel } =
    introCopy[copyKey as keyof typeof introCopy];

  const totalCount = questions.length;
  const totalCountDisplayed =
    kind === 'diagnosis' ? totalCount - 1 : totalCount;

  /* 답변 카운트 계산 */
  const rawAnsweredCount      = Object.keys(answers).length;
  const displayedAnsweredCount =
    kind === 'diagnosis'
      ? Math.max(0, rawAnsweredCount - 1)  // FE/BE 선택(1번) 제외
      : rawAnsweredCount;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* intro → 문제 시작 */
  const handleIntroStart = () => {
    if (!selectedTrack) return;
    choose(selectedTrack);                 // FE/BE 선택 저장 (1번 문항)
    setCurrentIdx(1);                      // 2번 문제부터
    setHasStarted(true);
  };

  /* 제출 완료 모달 */
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

  /* 메인 컨텐츠 */
  const pageContent = !hasStarted ? (
    /* 시작 화면 */
    <div className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-8 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">

        {/* 진행 통계 */}
        <div className="flex flex-row gap-6 lg:flex-col">
          {(() => {
            let introTotal: number | string;

            /* pre / post → 실제 총 문항 수로 표시 */
            if (kind !== 'diagnosis') {
              introTotal = totalCountDisplayed;
            } else {
              /* diagnosis → FE/BE 선택 여부에 따라 표시 */
              if (selectedTrack === 'FE') introTotal = FE_TOTAL;
              else if (selectedTrack === 'BE') introTotal = BE_TOTAL;
              else introTotal = '-';
            }

            return (
              <>
                <StatCard title="전체 질문 개수" value={introTotal} />
                <StatCard
                  title="현재 응답 개수"
                  value={displayedAnsweredCount}
                  bgColor="#C6EDF2"
                />
              </>
            );
          })()}
        </div>

        {/* 시작 카드 */}
        <div className="relative flex-1 min-h-[300px] rounded-2xl border-4 border-blue-200 bg-[#E6EEFF] p-8">
          <div>
            <p className="text-sm text-gray-600">{time}</p>
            <h2 className="mt-4 text-xl font-bold">{headline}</h2>

            {/* diagnosis FE / BE 선택 텍스트 */}
            {kind === 'diagnosis' ? (
              <div className="mt-6 flex flex-col gap-3 text-m">
                {(['FE', 'BE'] as const).map((track) => {
                  const isSel    = selectedTrack === track;
                  const noSelYet = selectedTrack === null;
                  const waveClass = noSelYet && activeWave === track ? 'wave-y' : '';
                  return (
                    <p
                      key={track}
                      onClick={() => setSelectedTrack(track)}
                      className={`
                        flex items-center gap-2 cursor-pointer
                        ${isSel ? 'font-semibold text-[#6378EB]' : 'text-[#4A4A4A]'}
                        ${waveClass}
                      `}
                    >
                      {isSel && (
                        <>
                          <img src={Isolation} alt="arrow" className="w-[15px]" />
                          <img src={smallRabbit} alt="rabbit" className="w-[25px]" />
                        </>
                      )}
                      {!isSel && '▶ '}
                      {track === 'FE' ? '프론트엔드' : '백엔드'}
                    </p>
                  );
                })}
              </div>
            ) : (
              /* pre / post 안내 */
              <p className="mt-4 flex gap-2 text-sm text-[#4A4A4A]">
                <img src={Isolation} alt="isolation" className="w-[15px]" />
                <img src={smallRabbit} alt="rabbit" className="w-[25px]" />
                {kind === 'pre'
                  ? '지금 내 수준을 확인해보세요'
                  : '변화를 숫자로 확인해보세요'}
              </p>
            )}
          </div>

          {/* 시작 버튼 */}
          <div className="z-10 mt-8 flex justify-start">
            <button
              onClick={
                kind === 'diagnosis'
                  ? handleIntroStart
                  : () => setHasStarted(true)
              }
              disabled={
                isLoadingQuestions ||
                (kind === 'diagnosis' && !selectedTrack)
              }
              className="z-20 cursor-pointer font-semibold text-black disabled:opacity-40"
            >
              <img
                src={startBtn}
                alt="startBtn"
                className="h-[40px] w-full md:h-[50px] md:w-[320px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    /* 문제 풀이 화면 */
    <div className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-8 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">

        {/* 진행 통계 */}
        <div className="flex flex-row gap-6 lg:flex-col">
          <StatCard title="전체 질문 개수" value={totalCountDisplayed} />
          <StatCard
            title="현재 응답 개수"
            value={displayedAnsweredCount}
            bgColor="#d8f4f9"
          />
        </div>

        {/* 현재 문항 */}
        {questions[currentIdx] && (
          <div className="flex flex-1 flex-col justify-between rounded-[15px] bg-white p-8 shadow">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">
                {kind === 'diagnosis' ? currentIdx : currentIdx + 1}.{' '}
                {questions[currentIdx].question}
                <span className="text-red-500"> *</span>
              </p>

              <Options
                choices={questions[currentIdx].choices as Choice[]}
                selectedValue={answers[questions[currentIdx].diagnosisId]}
                onChoose={choose}
              />
            </div>

            {/* 내비게이션 / 제출 */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentIdx(currentIdx - 1)}
                disabled={
                  kind === 'diagnosis' ? currentIdx === 1 : currentIdx === 0
                }
                className={`
                  flex items-center gap-1 rounded-[8px] bg-[#D7DBFF] px-6 py-3 text-[#6378EB]
                  ${
                    (kind === 'diagnosis'
                      ? currentIdx === 1
                      : currentIdx === 0) && 'cursor-not-allowed opacity-40'
                  }`}
              >
                <SlArrowLeft className="h-4 w-4" /> 이전
              </button>

              {currentIdx < totalCount - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  disabled={!answers[questions[currentIdx].diagnosisId]}
                  className={`
                    flex items-center gap-1 rounded-[8px] bg-[#6378EB] px-6 py-3 text-white
                    ${!answers[questions[currentIdx].diagnosisId] && 'cursor-not-allowed opacity-40'}
                  `}
                >
                  다음<SlArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await submit();
                    setShowConfirmModal(true);
                  }}
                  disabled={
                    !answers[questions[currentIdx].diagnosisId] || isSubmitting
                  }
                  className={`
                    rounded-[8px] bg-[#51BACB] px-6 py-3 text-white
                    ${(!answers[questions[currentIdx].diagnosisId] || isSubmitting) &&
                    'cursor-not-allowed opacity-40'}
                  `}
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

  /* 픽셀 배경 & 최종 렌더 */
  return (
    <div className="relative flex h-[calc(100vh-70px)] flex-col items-center justify-center overflow-hidden px-0 font-[pretendard] md:flex-row md:items-start md:gap-[200px] md:px-4">
      {/* 배경: 데스크탑 */}
      <img
        src={pixelTexture}
        alt=""
        className="absolute bottom-0 left-0 z-0 hidden h-full w-full opacity-70 md:block"
      />

      {/* 배경: 모바일 */}
      <div className="absolute inset-0 z-0 block md:hidden">
        <img src={responsiveBG} alt="" className="h-full w-full object-cover" />
      </div>

      {/* 실제 콘텐츠 */}
      <div className="relative z-10 w-full">{pageContent}</div>
    </div>
  );
}

/* 진행 통계 카드 */
const StatCard = ({ title, value, bgColor = '#ffffff' }: StatCardProps) => (
  <div
    className="w-[220px] rounded-xl border-2 border-[#e7eff5] bg-white/70 px-5 py-4"
    style={{ backgroundColor: bgColor }}
  >
    <div className="flex flex-col gap-[4px] text-center md:text-left">
      <p className="text-[15px] text-[#77818f]">{title}</p>
      <p className="text-[20px] font-semibold text-[#1a1a1a]">{value}</p>
    </div>
  </div>
);
