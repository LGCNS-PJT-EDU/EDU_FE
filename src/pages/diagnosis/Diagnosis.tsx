import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { isLoggedIn } from "@/store/authGlobal";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

import takeitR from "@/asset/img/diagnosis/takeit_pixel.png";
import blue_star from "@/asset/img/diagnosis/blue_star.png";
import gold_star from "@/asset/img/diagnosis/gold_star.png";
import smallRabbit from "@/asset/img/diagnosis/smallRabbit.png";
import Isolation from "@/asset/img/diagnosis/Isolation_Mode.png";
import pixel_texture from '@/asset/img/common/pixel_texture.png';

/* ---------- 타입 ---------- */
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
interface RawData {
  COMMON: Question[];
  BE: Question[];
  FE: Question[];
}

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface RoadmapData {
  subjects: Subject[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  bgColor?: string;
}

/* ---------- 컴포넌트 ---------- */
const Diagnosis = () => {
  const [raw, setRaw] = useState<RawData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const navigate = useNavigate();

  /* 1. 문제 받아오기 */
  useEffect(() => {
    api
      .get('/api/diagnosis')
      .then((res) => setRaw(res.data as RawData))
      .catch((e) => {
        console.error('문제 로드 실패:', e);
        alert('문제를 불러오지 못했습니다.');
      });
  }, []);

  /* 2. BE / FE 선택에 따라 전체 문제 시퀀스 구성 */
  const track = answers[1]; // 첫 번째 공통문항(진로 선택)의 값
  const questions: Question[] = useMemo(() => {
    if (!raw) return [];
    const common = raw.COMMON ?? [];
    const be = raw.BE ?? [];
    const fe = raw.FE ?? [];

    if (track === 'BE') return [...common, ...be];
    if (track === 'FE') return [...common, ...fe];
    return common;
  }, [raw, track]);

  const totalCount = track ? questions.length : undefined;
  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentQ?.diagnosisId ?? -1] !== undefined;

  /* 3. 선택지 클릭 */
  const choose = (value: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.diagnosisId]: value }));
  };

  /* 4. 페이지 이동 */
  const toPrev = () => currentIdx > 0 && setCurrentIdx((i) => i - 1);
  const toNext = () => currentIdx < questions.length - 1 && setCurrentIdx((i) => i + 1);


  /* 5. 제출 */
  const submit = async () => {
    if (!isAnswered || submitting) return;
    setSubmitting(true);

    const payload = Object.entries(answers).map(([id, val]) => ({
      questionId: Number(id),
      answer: val,
    }));

    try {
      const { data } = await api.post<RoadmapData & { uuid?: string }>(
        "/api/diagnosis",
        payload,
      );
      if (!isLoggedIn() && data.uuid) {
        localStorage.setItem("roadmapUuid", data.uuid);
      }
      navigate("/roadmap", { state: data });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)] px-4 font-[pretendard] bg-gradient-to-b from-[#fff] to-[#C6EDF2]">
        <div className="relative bg-[#E6EEFF] rounded-2xl p-8 w-full h-[50%] max-w-md shadow-lg" 
        style={{
          background: 'linear-gradient(to bottom, #ffffff %, #94A5FF 100%)',
        }}>
          <img
            src={pixel_texture}
            alt="pixel texture background"
            className="absolute bottom-0 left-0 w-full h-[70%] z-0 object-cover opacity-70 pointer-events-none"
          />
          <img
            src={blue_star}
            alt="star"
            className="absolute top-30 right-10 w-[50px] z-10"
          />
          <img
            src={gold_star}
            alt="star"
            className="absolute top-50 right-40 w-[100px] z-10"
          />
          <p className="text-sm text-gray-600 z-10">⏱ 진단 소요시간 5분, 약 10문제</p>
          <h2 className="text-xl font-bold mt-4 z-10">문제를 시작해볼까요?</h2>
          <p className="flex mt-2 text-[#4A4A4A] text-s gap-3 z-10">
            <img src={Isolation} alt="isolation" className="w-[15px] z-10" />
            <img src={smallRabbit} alt="smallRabbit" className="w-[30px] z-10" />
            개발 로드맵 확인하러 가기</p>

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
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 py-8 px-4 font-[pretendard] h-[calc(100vh-70px)] justify-center"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 30%, #C6EDF2 80%)',
      }}>
      {/* 상단 배너 */}
      <div className="w-full max-w-[800px] flex flex-col lg:flex-row gap-6">
        {/* 왼쪽 통계 박스 */}
        <div className="flex flex-row lg:flex-col gap-6 " >
          <StatCard title="전체 질문 갯수" value={totalCount ?? "-"} bgColor="#F2F2F2" />
          <StatCard title="현재 응답 갯수" value={Object.keys(answers).length} bgColor="#C6EDF2" />
        </div>

        {/* 오른쪽 질문 카드 */}
        {currentQ && (
          <div
            className="flex-1 bg-white rounded-[15px] p-8 flex flex-col justify-between h-full"
            style={{
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 6px rgba(0, 0, 0, 0.05)', // 아래 + 위 그림자
            }}
          >
            {/* 질문 + 선택지 묶음 */}
            <div className="flex flex-col gap-4">
              {/* 질문 */}
              <p className="text-lg font-semibold">
                {currentIdx + 1}. {currentQ.question}
                <span className="text-red-500"> *</span>
              </p>

              {/* 선택지 */}
              <div className="flex flex-col gap-4">
                {currentQ.choices.map((c) => {
                  const selected = answers[currentQ.diagnosisId] === c.value;
                  return (
                    <button
                      key={c.choiceId}
                      onClick={() => choose(c.value)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-[15px] border ${selected
                        ? "bg-[#C9EBEF] border-[#51BACB]"
                        : "bg-[#F6F5F8] border-transparent"
                        }`}
                    >
                      {/* 체크 아이콘 */}
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-white ${selected ? "bg-[#51BACB]" : "bg-[#DBDFE3]"
                          }`}
                      >
                        {selected && "✔"}
                      </span>
                      <span className="flex-1 text-left">{c.choice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between mt-8">
              {/* 이전 */}
              <button
                onClick={toPrev}
                disabled={currentIdx === 0}
                className={`flex items-center gap-1 px-6 py-3 rounded-[8px] bg-[#6378EB] text-white ${currentIdx === 0 && "opacity-40 cursor-not-allowed"
                  }`}
              >
                <SlArrowLeft className="w-4 h-4" /> 이전 문제로
              </button>

              {currentIdx < questions.length - 1 ? (
                /* 다음 */
                <button
                  onClick={toNext}
                  disabled={!isAnswered}
                  className={`items-center gap-1 px-6 py-3 rounded-[8px] bg-[#D7DBFF] flex text-[#6378EB] ${!isAnswered && "opacity-40 cursor-not-allowed"
                    }`}
                >
                  다음 문제로 <SlArrowRight className="w-4 h-4" />
                </button>
              ) : (
                /* 제출 */
                <button
                  onClick={submit}
                  disabled={!isAnswered || submitting}
                  className={`px-6 py-3 rounded-[8px] bg-[#51BACB] text-white ${(!isAnswered || submitting) && "opacity-40 cursor-not-allowed"
                    }`}
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

export default Diagnosis;

/* ---------- 보조 컴포넌트 ---------- */
const StatCard = ({ title, value, bgColor = "#F2F2F2" }: StatCardProps) => (
  <div
    className="w-[200px] h-[70px] px-10 rounded-[15px] flex flex-col items-center justify-center"
    style={{ backgroundColor: bgColor }}
  >
    <div className="flex justify-between w-full">
      <p className="text-[#333333] font-semibold">
        {title}
      </p>
      <p className="text-[#898989] whitespace-nowrap">
        {value}
      </p>
    </div>
  </div>
);
