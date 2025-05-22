import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import takeitR from '@/asset/img/diagnosis/takeit_pixel.png';
import blue_star from '@/asset/img/diagnosis/blue_star.png';
import gold_star from '@/asset/img/diagnosis/gold_star.png';
import smallRabbit from '@/asset/img/diagnosis/smallRabbit.png';
import Isolation from '@/asset/img/diagnosis/Isolation_Mode.png';
import pixel_texture from '@/asset/img/common/pixel_texture.png';

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

interface DiagnosisTemplateProps {
  questions: Question[];
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onSubmit: () => void;
  submitting: boolean;
  hasStarted: boolean;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DiagnosisTemplate({
  questions,
  currentIdx,
  setCurrentIdx,
  answers,
  setAnswers,
  onSubmit,
  submitting,
  hasStarted,
  setHasStarted,
}: DiagnosisTemplateProps) {
  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentQ?.diagnosisId ?? -1] !== undefined;

  const choose = (value: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.diagnosisId]: value }));
  };

  const toPrev = () => currentIdx > 0 && setCurrentIdx(currentIdx - 1);
  const toNext = () => currentIdx < questions.length - 1 && setCurrentIdx(currentIdx + 1);

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)] px-4 font-[pretendard] bg-gradient-to-b from-[#fff] to-[#C6EDF2]">
        <div className="relative bg-[#E6EEFF] rounded-2xl p-8 w-full h-[50%] max-w-md shadow-lg">
          <img src={pixel_texture} alt="background" className="absolute bottom-0 left-0 w-full h-[70%] z-0 object-cover opacity-70 pointer-events-none" />
          <img src={blue_star} alt="star" className="absolute top-30 right-10 w-[50px] z-10" />
          <img src={gold_star} alt="star" className="absolute top-50 right-40 w-[100px] z-10" />
          <p className="text-sm text-gray-600 z-10">⏱ 소요시간 5분, 약 10문제</p>
          <h2 className="text-xl font-bold mt-4 z-10">문제를 시작해볼까요?</h2>
          <p className="flex mt-2 text-[#4A4A4A] text-s gap-3 z-10">
            <img src={Isolation} alt="isolation" className="w-[15px] z-10" />
            <img src={smallRabbit} alt="smallRabbit" className="w-[30px] z-10" />
            개발 로드맵 확인하러 가기
          </p>
          <div className="flex justify-center mt-6 z-10">
            <img src={takeitR} alt="토끼 이미지" className="w-[150px] absolute bottom-0 right-0" />
          </div>
          <button
            onClick={() => setHasStarted(true)}
            className="mt-6 font-[NeoDunggeunmo] bg-white border border-black text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#f0f0f0] z-20"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 py-8 px-4 font-[pretendard] h-[calc(100vh-70px)] justify-center bg-gradient-to-b from-[#fff] to-[#C6EDF2]">
      <div className="w-full max-w-[800px] flex flex-col lg:flex-row gap-6">
        <div className="flex flex-row lg:flex-col gap-6">
          <StatCard title="전체 질문 갯수" value={questions.length} bgColor="#F2F2F2" />
          <StatCard title="현재 응답 갯수" value={Object.keys(answers).length} bgColor="#C6EDF2" />
        </div>

        {currentQ && (
          <div className="flex-1 bg-white rounded-[15px] p-8 flex flex-col justify-between h-full shadow-md">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">
                {currentIdx + 1}. {currentQ.question}<span className="text-red-500"> *</span>
              </p>
              <div className="flex flex-col gap-4">
                {currentQ.choices.map((c) => {
                  const selected = answers[currentQ.diagnosisId] === c.value;
                  return (
                    <button
                      key={c.choiceId}
                      onClick={() => choose(c.value)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-[15px] border ${selected ? 'bg-[#C9EBEF] border-[#51BACB]' : 'bg-[#F6F5F8] border-transparent'}`}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${selected ? 'bg-[#51BACB]' : 'bg-[#DBDFE3]'}`}>
                        {selected && '✔'}
                      </span>
                      <span className="flex-1 text-left">{c.choice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={toPrev}
                disabled={currentIdx === 0}
                className={`flex items-center gap-1 px-6 py-3 rounded-[8px] bg-[#6378EB] text-white ${currentIdx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <SlArrowLeft className="w-4 h-4" /> 이전 문제로
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={toNext}
                  disabled={!isAnswered}
                  className={`flex items-center gap-1 px-6 py-3 rounded-[8px] bg-[#D7DBFF] text-[#6378EB] ${!isAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  다음 문제로 <SlArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={!isAnswered || submitting}
                  className={`px-6 py-3 rounded-[8px] bg-[#51BACB] text-white ${(!isAnswered || submitting) && 'opacity-40 cursor-not-allowed'}`}
                >
                  제출
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, bgColor }: { title: string; value: number | string; bgColor: string }) => (
  <div className="w-[200px] h-[70px] px-10 rounded-[15px] flex flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
    <div className="flex justify-between w-full">
      <p className="text-[#333333] font-semibold">{title}</p>
      <p className="text-[#898989] whitespace-nowrap">{value}</p>
    </div>
  </div>
);
