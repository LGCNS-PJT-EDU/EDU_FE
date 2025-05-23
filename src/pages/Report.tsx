import weakness from '@/asset/img/report/weakness.png';
import good from '@/asset/img/report/good.png';
import RadarChart from '@/components/chart/chart';
import leftArrow from '@/asset/img/report/left.png';
import rightArrow from '@/asset/img/report/right.png';

import { useState, useRef } from 'react';

function Report() {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const startX = useRef<number>(0);
  const endX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    endX.current = e.changedTouches[0].clientX;
    const delta = startX.current - endX.current;
    if (delta > 50 && slideIndex < 1) setSlideIndex(1);
    else if (delta < -50 && slideIndex > 0) setSlideIndex(0);
  };
  const goPrev = (): void => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const goNext = (): void => {
    if (slideIndex < 1) setSlideIndex(slideIndex + 1);
  };

  return (
    <div className="flex font-[pretendard] flex-col items-center justify-center px-4 py-10 text-center">
      {/* 제목 */}
      <h2 className="text-2xl font-bold text-[#5B7CFF] mb-2">Education Evaluation</h2>
      <p className="text-lg font-semibold text-black">
        TakeIT과 함께한 학습 여정,
        <br />
        이제 더 나은 방향을 향해 나아갑니다.
      </p>
      <p className="text-sm text-gray-500 mt-1">
        We’ve wrapped up the evaluation phase to prepare for what’s next.
      </p>

      {/* 버튼 */}
      <button onClick={goPrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
        <img src={leftArrow} alt="Previous" className="w-8 h-8" />
      </button>
      <button onClick={goNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
        <img src={rightArrow} alt="Next" className="w-8 h-8" />
      </button>

      {/* 슬라이드 영역 */}
      <div
        className="relative w-full max-w-[500px] overflow-hidden mt-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          <div className="w-full flex-shrink-0">
            <RadarChart />
          </div>
          <div className="w-full flex-shrink-0">
            <RadarChart />
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> 2020
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span> 2021
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 2022
        </div>
      </div>

      {/* 표 영역 */}

      <table className=" mt-10 w-full table-fixed border-separate border-spacing-0 text-center text-sm text-gray-800">
        <thead>
          <tr>
            <th className="w-[60px]"></th>
            <th className="border-l border-b border-blue-200">
              <div className="font-bold">학습용이성</div>
              <div className="text-xs text-gray-400">Learnability</div>
            </th>
            <th className="border-l border-b border-blue-200">
              <div className="font-bold">효율성</div>
              <div className="text-xs text-gray-400">Usefulness</div>
            </th>
            <th className="border-l border-b border-blue-200">
              <div className="font-bold">유용성</div>
              <div className="text-xs text-gray-400">Efficiency</div>
            </th>
            <th className="border-l border-b border-blue-200">
              <div className="font-bold">호감도/재미</div>
              <div className="text-xs text-gray-400">Likability/fun</div>
            </th>
            <th className="border-l border-b border-blue-200">
              <div className="font-bold">심미성</div>
              <div className="text-xs text-gray-400">Aesthetics</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="border-t border-b border-blue-200">
              <img src={good} alt="good" className="w-6 h-6 mx-auto" />
            </td>
            <td className="border-l border-b border-blue-200 px-2 py-3 text-left">
              팀원 간의 대화가 잘 이루어졌으며
              <br />
              전달력도 좋았습니다.
            </td>
            <td className="border-l border-b border-blue-200 px-2 py-3 text-left">
              효율성과 몰입도가 높았습니다.
            </td>
            <td className="border-l border-b border-blue-200 px-2 py-3 text-left">
              다양한 정보를 빠르게 이해하고
              <br />
              흥미 있게 접근할 수 있었습니다.
            </td>
            <td className="border-l border-b border-blue-200 px-2 py-3 text-left">
              사용자 중심적인 UI/UX가
              <br />
              긍정적인 인상을 남겼습니다.
            </td>
            <td className="border-l border-b border-blue-200 px-2 py-3 text-left">
              깔끔한 스타일이
              <br />
              전체적인 분위기와 잘 어울렸습니다.
            </td>
          </tr>
          <tr className="align-top">
            <td>
              <img src={weakness} alt="good" className="w-6 h-6 mx-auto" />
            </td>
            <td className="border-l px-2 py-3 text-left border-blue-200">
              일부 UI 요소의 의미 전달이
              <br />
              모호한 부분이 있었습니다.
            </td>
            <td className="border-l px-2 py-3 text-left border-blue-200">
              조작 동선이 다소 복잡하게
              <br />
              느껴졌습니다.
            </td>
            <td className="border-l px-2 py-3 text-left border-blue-200">
              핵심 기능 접근성이
              <br />
              조금 더 직관적이면 좋겠습니다.
            </td>
            <td className="border-l px-2 py-3 text-left border-blue-200">
              개성이 부족해 보일 수 있습니다.
            </td>
            <td className="border-l px-2 py-3 text-left border-blue-200">
              비슷한 톤의 색이 반복되어
              <br />
              구분이 어려웠습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Report;
