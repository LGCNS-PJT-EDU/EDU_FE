import { useRef } from 'react';
import { Link } from 'react-router-dom';

import Aurora from '@/components/Aurora/Aurora';
import chevron from '@/asset/img/main/chevron-down.png';
import simbol from '@/asset/img/common/takeitlogo.png';
import background from '@/asset/img/common/pixel_texture.png';
import sparkle from '@/asset/img/login/star.png';
import startBtn from '@/asset/img/main/BTN style 1.png';

export default function Main() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () =>
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="relative h-[calc(100vh-70px)] w-full overflow-y-auto scroll-smooth">

      {/* 스노우플레이크 장식 */}
      <Aurora
        colorStops={['#586bd1', '#73ccd7', '#dbeef1']}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <img
        src={sparkle}
        alt="sparkle"
        className="absolute top-50 left-50 w-6 animate-fade-in"
      />
      {/* ① 상단 섹션 */}
      <section className="absolute top-50 bottom-20 flex-col items-center justify-center">
        <img src={simbol} alt="take it" className="mb-7 w-56" />

        <p className="mb-14 text-center font-[NeoDunggeunmo] leading-relaxed text-[17px] text-[#373f41]">
          방향을 잃고 헤매고 있나요?
          <br />
          진단 한 번으로 당신의 성장 경로가 눈앞에 펼쳐집니다.
          <br />
          쉽고 빠르게, 당신만의 로드맵을 만나보세요!
        </p>

        <button onClick={handleScroll} className="animate-bounce">
          <img src={chevron} alt="scroll down" className="mx-auto w-8" />
        </button>

        <Link to="/diagnosis">
          <img
            src={startBtn}
            alt="start"
            className="w-53 transition-transform hover:scale-105 active:scale-95"
          />
        </Link>

        <p className="mt-6 text-sm text-[#5e5e5e]">
          🕐 진단 소요시간&nbsp;5분, 약 18문제
        </p>
      </section>
    </div>
  );
}
