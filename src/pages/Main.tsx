import { useRef } from 'react';
import { Link } from 'react-router-dom';

import Aurora2 from '@/components/Aurora/Particles';
import simbol from '@/asset/img/common/takeitlogo.png';
import chevron from '@/asset/img/main/chevron-down.png';
import startBtn from '@/asset/img/main/BTN style 1.png';

export default function Main() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="relative min-h-[145vh] w-full font-[NeoDunggeunmo]">
      {/* 배경 Aurora 파티클 */}
      <div className="absolute inset-0">
        <Aurora2
          particleColors={['#586bd1', '#73ccd7']}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* ① 상단 Hero 섹션 */}
      <div className="relative pt-[10%] flex-col items-center justify-center text-center w-[900px] mx-auto">
        <img src={simbol} alt="take it" className="mb-7 w-56 mx-auto" />
        <h1 className="mb-1 font-[NeoDunggeunmo] leading-relaxed text-[#373f41] text-[23px]">
          당신만의 학습 여정을 시작하세요
        </h1>
        <p className='mb-14 font-[NeoDunggeunmo] leading-relaxed text-[#373f41]'>진단부터 로드맵, 사후평가까지 AI 기반 맞춤형 학습 플랜</p>
        <div className="flex justify-center items-center">
          <button className="px-4 py-3 text-white bg-[#6378EB] rounded-lg mb-30">
            진단평가 보러가기
          </button>
        </div>
        <button className="animate-bounce" onClick={scrollToBottom}>
          <img src={chevron} alt="scroll down" className="mx-auto w-20 mb-10" />
        </button>

        {/* ② 진단 → 로드맵 → 학습 → 평가 흐름 소개 섹션 */}
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-center text-[#3d3d3d]">
          당신의 학습 여정, 이렇게 진행돼요!
        </h2>
        <p className="mb-10 text-center text-sm text-[#555]">
          진단을 통해 나에게 맞는 로드맵을 만들고, 끝까지 완주해 보세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl bg-transparent font-[Pretendard]">
          {[
            {
              title: '1단계',
              subtitle: '맞춤형 로드맵',
              desc: '분석 결과로 나에게 꼭 맞는 학습 경로를 받아요.',
              to: '/roadmap',
            },
            {
              title: '2단계',
              subtitle: '사전/사후평가',
              desc: '학습 전후 실력을 비교하며 성장 과정을 확인해요.',
              to: '/', /* 수정필요 */
            },
            {
              title: '3단계',
              subtitle: '추천 콘텐츠',
              desc: '학습에 도움되는 맞춤형 자료를 제공받아요.',
              to: '/', /* 수정하기 */
            },
            {
              title: '4단계',
              subtitle: '피드백',
              desc: '나의 강점과 약점을 분석해봐요.',
              to: '/report',
            },
          ].map(({ title, subtitle, desc, to }) => (
            <div
              key={title}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <span className="text-sm text-[#6378EB] font-bold mb-2">
                {title}
              </span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {subtitle}
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">{desc}</p>
              <Link
                to={to}
                className="mt-auto px-4 py-2 bg-[#7F94F2] text-white text-sm rounded-lg hover:bg-[#6378EB] transition"
              >
                바로가기
              </Link>
            </div>
          ))}
          <div ref={bottomRef} className="h-10" />
        </div>
      </div>
    </div>
  );
}
