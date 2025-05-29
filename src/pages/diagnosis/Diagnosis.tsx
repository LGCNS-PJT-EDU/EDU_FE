// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
// import { useLoadingStore } from "@/store/useLoadingStore";
// import { useDiagnosis } from "@/hooks/useDiagnosis";

// import takeitR from "@/asset/img/diagnosis/takeit_pixel.png";
// import blue_star from "@/asset/img/diagnosis/blue_star.png";
// import gold_star from "@/asset/img/diagnosis/gold_star.png";
// import smallRabbit from "@/asset/img/diagnosis/smallRabbit.png";
// import Isolation from "@/asset/img/diagnosis/Isolation_Mode.png";
// import pixel_texture from "@/asset/img/common/pixel_texture.png";
// import startBtn from "@/asset/img/diagnosis/startBtn.png";
// import { DiagnosisAnswerReq } from "@/api/diagnosisService";

// interface StatCardProps {
//   title: string;
//   value: number | string;
//   bgColor?: string;
// }

// const StatCard = ({ title, value, bgColor = "#F2F2F2" }: StatCardProps) => (
//   <div
//     className="flex h-[70px] w-[200px] flex-col items-center justify-center rounded-[15px] px-10"
//     style={{ backgroundColor: bgColor }}
//   >
//     <div className="flex w-full justify-between">
//       <p className="font-semibold text-[#333333]">{title}</p>
//       <p className="whitespace-nowrap text-[#898989]">{value}</p>
//     </div>
//   </div>
// );

// export default function Diagnosis() {
//   const { startLoading, stopLoading } = useLoadingStore();
//   const {
//     raw,
//     isQuestionsLoading,
//     isQuestionsError,
//     questions,
//     currentIdx,
//     setCurrentIdx,
//     answers,
//     isSubmitting,
//     choose,
//     submit,
//   } = useDiagnosis();

//   const [hasStarted, setHasStarted] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isQuestionsLoading) startLoading("문제 불러오는 중…");
//     else stopLoading();
//   }, [isQuestionsLoading, startLoading, stopLoading]);

//   /* Start 화면 */
//   if (!hasStarted) {
//     return (
//       <div className="flex h-[calc(100vh-70px)] flex-col items-center justify-center bg-gradient-to-b from-[#fff] to-[#C6EDF2] px-4 font-[pretendard]">
//         <div
//           className="relative h-[50%] w-full max-w-md rounded-2xl bg-[#E6EEFF] p-8 shadow-lg"
//           style={{
//             background: "linear-gradient(to bottom, #ffffff 0%, #94A5FF 100%)",
//           }}
//         >
//           <img
//             src={pixel_texture}
//             alt="pixel texture background"
//             className="pointer-events-none absolute bottom-0 left-0 h-[70%] w-full object-cover opacity-70"
//           />
//           <img
//             src={blue_star}
//             alt="star"
//             className="absolute right-10 top-30 z-10 w-[50px]"
//           />
//           <img
//             src={gold_star}
//             alt="star"
//             className="absolute right-40 top-50 z-10 w-[100px]"
//           />
//           <p className="z-10 text-sm text-gray-600">
//             ⏱ 진단 소요시간 5분, 약 10문제
//           </p>
//           <h2 className="z-10 mt-4 text-xl font-bold">문제를 시작해볼까요?</h2>
//           <p className="z-10 mt-2 flex gap-3 text-s text-[#4A4A4A]">
//             <img src={Isolation} alt="isolation" className="z-10 w-[15px]" />
//             <img
//               src={smallRabbit}
//               alt="smallRabbit"
//               className="z-10 w-[30px]"
//             />
//             개발 로드맵 확인하러 가기
//           </p>

//           <div className="z-10 mt-6 flex justify-center">
//             <img
//               src={takeitR}
//               alt="토끼 이미지"
//               className="absolute bottom-0 right-0 w-[150px]"
//             />
//           </div>

//           <button
//             onClick={() => setHasStarted(true)}
//             className="z-20 cursor-pointer font-semibold text-black"
//           >
//             <img src={startBtn} alt="startBtn" className="w-[150px]" />
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* 본문 모습 */
//   const totalCount   = questions.length;
//   const currentQ     = questions[currentIdx];
//   const isAnswered   = currentQ && answers[currentQ.diagnosisId] !== undefined;
//   const payloadReady = Object.keys(answers).length > 0;

//   const toPrev = () => currentIdx > 0 && setCurrentIdx(idx => idx - 1);
//   const toNext = () => currentIdx < totalCount - 1 && setCurrentIdx(idx => idx + 1);

//   const handleSubmit = () => {
//     const payload: DiagnosisAnswerReq[] = Object.entries(answers).map(
//       ([id, val]) => ({ questionId: Number(id), answer: val })
//     );
//     submit(payload);
//   };

//   return (
//     <div className="flex h-[calc(100vh-70px)] w-full flex-col items-center justify-center gap-8 px-4 py-8 font-[pretendard]" style={{
//       background: "linear-gradient(to bottom, #ffffff 30%, #C6EDF2 80%)",
//     }}>
//       <div className="flex w-full max-w-[800px] flex-col gap-6 lg:flex-row">
//         <div className="flex flex-row gap-6 lg:flex-col">
//           <StatCard title="전체 질문 갯수" value={totalCount} />
//           <StatCard title="현재 응답 갯수" value={Object.keys(answers).length} bgColor="#C6EDF2" />
//         </div>

//         {currentQ && (
//           <div className="flex h-full flex-1 flex-col justify-between rounded-[15px] bg-white p-8" style={{
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 6px rgba(0, 0, 0, 0.05)",
//           }}>
//             <div className="flex flex-col gap-4">
//               <p className="text-lg font-semibold">
//                 {currentIdx + 1}. {currentQ.question}
//                 <span className="text-red-500"> *</span>
//               </p>

//               {currentQ.choices.map(c => {
//                 const selected = answers[currentQ.diagnosisId] === c.value;
//                 return (
//                   <button
//                     key={c.choiceId}
//                     onClick={() => choose(c.value)}
//                     className={`flex w-full items-center gap-3 rounded-[15px] border px-4 py-3 ${selected
//                       ? "bg-[#C9EBEF] border-[#51BACB]"
//                       : "bg-[#F6F5F8] border-transparent"}
//                     `}
//                   >
//                     <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${selected ? "bg-[#51BACB]" : "bg-[#DBDFE3]"}`}>              {selected && "✔"}
//                     </span>
//                     <span className="flex-1 text-left">{c.choice}</span>
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="mt-8 flex justify-between">
//               <button
//                 onClick={toPrev}
//                 disabled={currentIdx === 0}
//                 className={`flex items-center gap-1 rounded-[8px] bg-[#6378EB] px-6 py-3 text-white ${currentIdx === 0 && "cursor-not-allowed opacity-40"}`}
//               >
//                 <SlArrowLeft className="h-4 w-4" /> 이전 문제로
//               </button>

//               {currentIdx < totalCount - 1 ? (
//                 <button
//                   onClick={toNext}
//                   disabled={!isAnswered}
//                   className={`flex items-center gap-1 rounded-[8px] bg-[#D7DBFF] px-6 py-3 text-[#6378EB] ${!isAnswered && "cursor-not-allowed opacity-40"}`}
//                 >
//                   다음 문제로 <SlArrowRight className="h-4 w-4" />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   disabled={!isAnswered || !payloadReady || isSubmitting}
//                   className={`rounded-[8px] bg-[#51BACB] px-6 py-3 text-white ${(!isAnswered || isSubmitting) && "cursor-not-allowed"}`}
//                 >
//                   {isSubmitting ? "제출 중…" : "제출"}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }