import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Aurora2 from '@/components/Aurora/Particles';
import simbol from '@/asset/img/common/takeitlogo.png';
import chevron from '@/asset/img/main/chevron-down.png';
import FlipCard from '@/components/ui/FlipCard';
import roadmapimg from '@/asset/img/roadmap/roadmapImg.png'

export default function Main() {
  const bottomRef = useRef<HTMLElement | null>(null);
  const heroRef   = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  return (
    <div className="relative w-full font-[NeoDunggeunmo]">
      {/* 배경 Aurora 파티클 */}
      <div className="fixed inset-0 -z-10">
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

      {/* 상단 Hero 섹션 */}
      <section ref={heroRef} className="relative h-[calc(100vh-72px)] overflow-hidden snap-start w-full flex flex-col items-center justify-center text-center max-w-[900px] px-4 mx-auto scroll-mt-[72px]">
        <img src={simbol} alt="take it" className="mb-7 w-56" />
        <h1 className="mb-1 font-[NeoDunggeunmo] leading-relaxed text-[#373f41] text-[23px]">
          AI가 안내하는 당신만의 학습 여정
        </h1>
        <p className="mb-6 font-[NeoDunggeunmo] leading-relaxed text-[#373f41]">
          <br />지금 바로 진단 받고<br />나에게 딱 맞는 로드맵을 받아보세요!
        </p>
          <button className="px-4 py-3 text-white bg-[#6378EB] rounded-lg mb-30" onClick={() => navigate("/diagnosis")}>
            진단평가 보러가기
          </button>
          <button className="animate-bounce absolute bottom-4 left-1/2 -translate-x-1/2" onClick={scrollToBottom}>
            <img src={chevron} alt="scroll down" className="w-14" />
          </button>
      </section>

        {/* 진단 → 로드맵 → 학습 → 평가 흐름 소개 섹션 */}
        <section ref={bottomRef} className="relative min-h-screen snap-start w-full flex flex-col items-center text-center max-w-[900px] px-4 mx-auto pt-20 scroll-mt-[75px]">
          <h2 className="mb-4 text-2xl md:text-3xl font-bold text-center text-[#3d3d3d]">
            AI가 함께하는 학습 여정, 이렇게 진행돼요!
          </h2>
          <p className="mb-10 text-center text-sm text-[#555]">
            진단을 시작으로 나에게 맞는 로드맵을 만들고 끝까지 완주해 보세요.
          </p>

          {/* 소개 카드 4개: 모바일 2열, 데스크탑 4열 */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: '1단계',
                subtitle: '맞춤형 로드맵',
                desc: (
                  <>
                    나에게 꼭 맞는 학습 경로를<br/>추천 받아요.
                  </>
                ),
                back: (
                  <>
                    <h4 className="text-xs font-bold mt-4">맞춤형 로드맵</h4>
                    <img
                      src={roadmapimg}
                      alt="로드맵 미리보기"
                      className="w-64 mx-auto rounded-lg"
                    />
                    <p className="text-[0.5rem] text-gray-700">
                      간단한 진단을 통해 체계적인 <br/> 학습 과정을 설계해 드립니다.
                    </p>
                  </>
                ),
              },
              {
                title: '2단계',
                subtitle: '사전/사후 평가',
                desc: (
                  <>
                    전·후 평가로 나의 성장을<br/>눈으로 확인해요.
                  </>
                ),
                back: (
                  <>
                    <img
                      src="/img/chart.png"
                      alt="사전/사후 평가 차트"
                      className="w-64 mx-auto rounded-lg"
                    />
                    <h4 className="text-xl font-bold mt-4">사전/사후 평가</h4>
                    <p className="text-sm text-gray-700">
                      학습 전·후를 비교해 성장 폭을 확인할 수 있어요.
                    </p>
                  </>
                ),
              },
              {
                title: '3단계',
                subtitle: '추천 콘텐츠',
                desc: (
                  <>
                    부족한 부분을 채워줄<br/>맞춤 콘텐츠를 추천해줘요.
                  </>
                ),
                back    : (
                  <>
                    <img
                      src="/img/recommend_preview.png"
                      alt="추천 콘텐츠"
                      className="w-64 mx-auto rounded-lg"
                    />
                    <h4 className="text-xl font-bold mt-4">추천 콘텐츠</h4>
                    <p className="text-sm text-gray-700">
                      개인별 약점을 보완할 학습 자료를 제공합니다.
                    </p>
                  </>
                ),
              },
              {
                title: '4단계',
                subtitle: 'AI 피드백',
                desc: (
                  <>
                    결과를 바탕으로<br/>나의 강점과 약점을 짚어줘요.
                  </>
                ),
                back: (
                  <>
                    <img
                      src="/img/feedback_preview.png"
                      alt="AI 피드백"
                      className="w-64 mx-auto rounded-lg"
                    />
                    <h4 className="text-xl font-bold mt-4">AI 피드백</h4>
                    <p className="text-sm text-gray-700">
                      결과 분석을 통해 맞춤형 피드백을 제공합니다.
                    </p>
                  </>
                ),
              },
            ].map((card) => (
              <FlipCard key={card.title} {...card} />
            ))}
          </section>

          {/* 프론트엔드 기본 로드맵 & 백엔드 기본 로드맵 버튼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[700px] w-full mx-auto mt-16 mb-20 px-5 font-[Pretendard]">
            {[
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
            ].map(({ title, desc, type }) => (
              <div
                key={type}
                className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6 min-h-[90px]
                          text-center transition-all hover:bg-blue-100 hover:-translate-y-1 hover:border-transparent"
              >
                <h3 className="text-lg font-semibold text-[#6378EB] mb-2">
                  {title}
                </h3>
                <p
                  className="text-sm text-gray-600 underline underline-offset-4 cursor-pointer"
                  onClick={() => navigate(`/roadmap/default/${type}`)}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}