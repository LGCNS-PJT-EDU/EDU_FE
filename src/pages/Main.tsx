import { useRef } from 'react';
import { Link } from 'react-router-dom';

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
      {/* ────────────── 공통 그라데이션만 남김 ────────────── */}
      {/* 스노우플레이크 장식 */}
      <img
        src={sparkle}
        alt="sparkle"
        className="absolute top-50 left-50 w-6 w-[10%] animate-fade-in"
      />

      {/* ① 상단 섹션 */}
      <section className="flex h-[calc(100vh-70px)] flex-col items-center justify-center">
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
      </section>

      {/* ② 하단 섹션 */}
      <section
        ref={bottomRef}
        className="relative flex h-[70vh] items-center justify-center"
      >
        {/* 그라데이션 & 도트 패턴 */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-[#eefbff] to-[#c6edf2]" />
        <img
          src={background}
          alt="dots"
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[70%] object-cover object-bottom -z-10"
        />

        {/* ▼▼ 150 px 위에 고정되는 콘텐츠 ▼▼ */}
        <div className="absolute bottom-[150px] left-0 right-0 flex flex-col items-center">
          <Link to="/diagnosis">
            <img
              src={startBtn}
              alt="start"
              className="w-full transition-transform hover:scale-105 active:scale-95"
            />
          </Link>

          <p className="mt-6 text-sm text-[#5e5e5e]">
            🕐 진단 소요시간&nbsp;5분, 약 18문제
          </p>
        </div>
      </section>
    </div>
  );
}
