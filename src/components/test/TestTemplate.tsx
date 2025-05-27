import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import takeitR from "@/asset/img/diagnosis/takeit_pixel.png";
import blue_star from "@/asset/img/diagnosis/blue_star.png";
import gold_star from "@/asset/img/diagnosis/gold_star.png";
import smallRabbit from "@/asset/img/diagnosis/smallRabbit.png";
import Isolation from "@/asset/img/diagnosis/Isolation_Mode.png";
import pixel_texture from "@/asset/img/common/pixel_texture.png";
import startBtn from "@/asset/img/diagnosis/startBtn.png";
import { Options } from "../ui/option";

export type AssesmentKind = "diagnosis" | "pre" | "post";

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
}

const introCopy = {
  diagnosis: {
    time: "⏱ 진단 소요시간 5분, 약 10문제",
    headline: "문제를 시작해볼까요?",
    sub: "개발 로드맵 확인하러 가기",
    submitLabel: "로드맵 생성",
  },
  pre: {
    time: "⏱ 약 5분, 10문제",
    headline: "학습 전 실력을 측정해볼까요?",
    sub: "지금 내 수준을 확인해보세요",
    submitLabel: "제출",
  },
  post: {
    time: "⏱ 약 5분, 10문제",
    headline: "학습 후 실력이 얼마나 향상됐을까요?",
    sub: "변화를 숫자로 확인해보세요",
    submitLabel: "제출",
  },
} as const;

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
}: AssesmentProps) {
 const { time, headline, sub, submitLabel } = introCopy[kind];
  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentQ?.diagnosisId ?? -1] !== undefined;
  const totalCount = questions.length;

  if (!hasStarted) {
    return (
      <div className="flex h-[calc(100vh-70px)] flex-col items-center justify-center bg-gradient-to-b from-[#fff] to-[#C6EDF2] px-4 font-[pretendard]">
        <div
          className="relative h-[50%] w-full max-w-md rounded-2xl bg-[#E6EEFF] p-8 shadow-lg"
          style={{
            background: "linear-gradient(to bottom, #ffffff 0%, #94A5FF 100%)",
          }}
        >
          <img
            src={pixel_texture}
            alt="pixel texture background"
            className="pointer-events-none absolute bottom-0 left-0 h-[70%] w-full object-cover opacity-70"
          />
          <img src={blue_star} alt="star" className="absolute right-10 top-30 z-10 w-[50px]" />
          <img src={gold_star} alt="star" className="absolute right-40 top-50 z-10 w-[100px]" />
          <p className="z-10 text-sm text-gray-600">{time}</p>
          <h2 className="z-10 mt-4 text-xl font-bold">{headline}</h2>
          <p className="z-10 mt-2 flex gap-3 text-s text-[#4A4A4A]">
            <img src={Isolation} alt="isolation" className="z-10 w-[15px]" />
            <img src={smallRabbit} alt="smallRabbit" className="z-10 w-[30px]" />
            개발 로드맵 확인하러 가기
          </p>
          <div className="z-10 mt-6 flex justify-center">
            <img src={takeitR} alt="토끼 이미지" className="absolute bottom-0 right-0 w-[150px]" />
          </div>
          <button onClick={() => setHasStarted(true)} className="z-20 cursor-pointer font-semibold text-black">
            <img src={startBtn} alt="startBtn" className="w-[150px]" />
          </button>
        </div>
      </div>
    );
  }

 return (
    <div
      className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-4 py-8 font-[pretendard]"
      style={{ background: "linear-gradient(to bottom, #ffffff 30%, #C6EDF2 80%)" }}
    >
      <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">
        {/* 진행 통계 */}
        <div className="flex flex-row gap-6 lg:flex-col">
          <StatCard title="전체 질문 갯수" value={totalCount}            />
          <StatCard title="현재 응답 갯수" value={Object.keys(answers).length} bgColor="#C6EDF2" />
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
                className={`flex items-center gap-1 rounded-[8px] bg-[#6378EB] px-6 py-3 text-white ${
                  currentIdx === 0 && "cursor-not-allowed opacity-40"
                }`}
              >
                <SlArrowLeft className="h-4 w-4" /> 이전 문제로
              </button>

              {currentIdx < totalCount - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  disabled={!isAnswered}
                  className={`flex items-center gap-1 rounded-[8px] bg-[#D7DBFF] px-6 py-3 text-[#6378EB] ${
                    !isAnswered && "cursor-not-allowed opacity-40"
                  }`}
                >
                  다음 문제로 <SlArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!isAnswered || isSubmitting}
                  className={`rounded-[8px] bg-[#51BACB] px-6 py-3 text-white ${
                    (!isAnswered || isSubmitting) && "cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "제출 중…" : submitLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const StatCard = ({ title, value, bgColor = "#F2F2F2" }: StatCardProps) => (
  <div
    className="flex h-[70px] w-[200px] flex-col items-center justify-center rounded-[15px] px-10"
    style={{ backgroundColor: bgColor }}
  >
    <div className="flex w-full justify-between">
      <p className="font-semibold text-[#333333]">{title}</p>
      <p className="whitespace-nowrap text-[#898989]">{value}</p>
    </div>
  </div>
);
