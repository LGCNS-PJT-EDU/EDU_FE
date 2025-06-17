import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Aurora2 from '@/components/Aurora/Particles';
import simbol from '@/asset/img/common/takeitlogo.png';
import chevron from '@/asset/img/main/chevron-down.png';
import FlipCard from '@/components/ui/FlipCard';

import roadmap from '@/asset/img/main/roadmap.png';
import chart from '@/asset/img/main/chart.png';
import interview from '@/asset/img/main/interview.png';
import recommend from '@/asset/img/main/recommend.png';

export default function Main() {
  const bottomRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stepCards = [
    {
      title: '1단계',
      subtitle: '맞춤형 로드맵',
      desc: (
        <>
          나에게 꼭 맞는 학습 경로를 추천 받아요.
        </>
      ),
      imageUrl: {roadmap},
      back: (
        <div className="flex flex-col items-center p-4 text-center max-h-[80vh] overflow-auto">
          <h4 className="text-lg font-bold text-gray-800 mb-4">맞춤형 로드맵</h4>
          <img src={roadmap} alt="로드맵 미리보기" className="w-full max-w-xs rounded-xl mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            간단한 진단을 통해 체계적인 학습 과정을<br /> 설계해 드립니다.
          </p>
        </div>
      ),
    },
    {
      title: '2단계',
      subtitle: '사전/사후 평가',
      desc: (
        <>
          전·후 평가로 나의 성장을 눈으로 확인해요.
        </>
      ),
      imageUrl: {chart},
      back: (
        <div className="flex flex-col items-center p-4 text-center max-h-[80vh] overflow-auto">
          <h4 className="text-lg font-bold text-gray-800 mb-4">사전/사후 평가</h4>
          <img src={chart} alt="사전/사후 평가 차트" className="w-full max-w-xs rounded-xl mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            학습 전·후를 비교해 성장 폭을 확인할 수 있어요.
          </p>
        </div>
      ),
    },
    {
      title: '3단계',
      subtitle: '추천 콘텐츠',
      desc: (
        <>
          부족한 부분을 채워줄<br />맞춤 콘텐츠를 추천해줘요.
        </>
      ),
      imageUrl: {recommend},
      back: (
        <div className="flex flex-col items-center p-4 text-center max-h-[80vh] overflow-auto">
          <h4 className="text-lg font-bold text-gray-800 mb-4">추천 콘텐츠</h4>
          <img src={recommend} alt="추천 콘텐츠" className="w-full max-w-xs rounded-xl mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            개인별 약점을 보완할 학습 자료를 제공합니다.
          </p>
        </div>
      ),
    },
    {
      title: '4단계',
      subtitle: '모의 인터뷰',
      desc: (
        <>
          AI와 인터뷰를 진행하고 응답을 분석해 피드백을 받아보세요.
        </>
      ),
      imageUrl: {interview},
      back: (
        <div className="flex flex-col items-center p-4 text-center max-h-[80vh] overflow-auto">
          <h4 className="text-lg font-bold text-gray-800 mb-4">모의 인터뷰</h4>
          <img src={interview} alt="AI 피드백" className="w-full max-w-xs rounded-xl mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            AI가 인터뷰 답변을 분석해<br />
            말하기 습관, 강점과 약점을 짚어드립니다.
          </p>
        </div>
      ),
    },
  ];

  const roadmapButtons = [
    {
      type: 'FE',
      title: '프론트엔드 기본 로드맵',
      desc: 'HTML부터 React까지, 기초부터 한 걸음씩! →',
    },
    {
      type: 'BE',
      title: '백엔드 기본 로드맵',
      desc: 'Java부터 Spring까지, 실무 흐름대로 쭉! →',
    },
  ];

  return (
    <div className="relative w-full font-[NeoDunggeunmo]">
      <div className="fixed inset-0 -z-10">
        <Aurora2
          particleColors={['#586bd1', '#73ccd7']}
          particleCount={250}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <section
        ref={heroRef}
        className="relative h-[calc(100vh-72px)] overflow-hidden snap-start w-full flex flex-col items-center justify-center text-center max-w-[900px] px-4 mx-auto scroll-mt-[72px]"
      >
        <img src={simbol} alt="take it" className="mb-7 w-56" />
        <h1 className="mb-1 leading-relaxed text-[#373f41] text-[23px]">AI가 안내하는 당신만의 학습 여정</h1>
        <p className="mb-6 leading-relaxed text-[#373f41]">
          <br />지금 바로 진단 받고<br />나에게 딱 맞는 로드맵을 받아보세요!
        </p>
        <button
          className="px-4 py-3 text-white bg-[#6378EB] rounded-lg mb-30"
          onClick={() => navigate('/diagnosis')}
        >
          진단평가 보러가기
        </button>
        <button
          className="animate-bounce absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={scrollToBottom}
        >
          <img src={chevron} alt="scroll down" className="w-14" />
        </button>
      </section>

      <section
        ref={bottomRef}
        className="relative min-h-screen snap-start w-full flex flex-col items-center text-center max-w-[900px] px-4 mx-auto pt-20 md:pt-30"
      >
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-[#3d3d3d]">
          AI가 함께하는 학습 여정, 이렇게 진행돼요!
        </h2>
        <p className="mb-10 text-sm text-[#555]">
          진단을 시작으로 나에게 맞는 로드맵을 만들고 끝까지 완주해 보세요.
        </p>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stepCards.map((card) => (
            <FlipCard key={card.title} {...card} />
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[700px] w-full mx-auto mt-16 mb-20 md:mb-0 px-5 font-[Pretendard]">
          {roadmapButtons.map(({ type, title, desc }) => (
            <div
              key={type}
              className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6 min-h-[90px] text-center transition-all hover:bg-blue-100 hover:-translate-y-1 hover:border-transparent"
              onClick={() => navigate(`/roadmap/default/${type}`)}
            >
              <h3 className="text-lg font-semibold text-[#6378EB] mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}