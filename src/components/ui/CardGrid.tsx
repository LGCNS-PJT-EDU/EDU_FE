import React from 'react';
import { MoreVertical } from 'lucide-react';

export interface CardItem {
  title: string;
  detailUrl: string;
  button1: string;
  isAiRecommendation?: boolean;
  platform?: string;
  type?: string;
  price?: string;
  subtitle?: string;
  scores?: Record<string, number>;
}

interface CardGridProps {
  cards: CardItem[];
  onButton1Click?: (card: CardItem) => void;
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size + 0, i * size + size)
  );
};

const CardGrid: React.FC<CardGridProps> = ({ cards, onButton1Click }) => {
  const groupedCards = chunk(cards, 4);

  return (
    <>
      {groupedCards.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-[pretendard]">
            {group.map((card, idx) => (
              <div key={idx}>
                {/* 데스크탑 카드 (기존 디자인 유지) */}
                <div className="hidden h-[250px] border px-3 py-4 sm:flex bg-white rounded-[7px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex-col">
                  {/* 이미지 영역 */}
                  <div className="h-[120px] bg-[#A8E1BC] flex items-center justify-center rounded-[7px]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      strokeWidth={1.5} fill="none" stroke="url(#grad1)" className="w-12 h-12">
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6DBE9C" />
                          <stop offset="100%" stopColor="#3F7E6B" />
                        </linearGradient>
                      </defs>

                      {/* 아이콘 path */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>

                  {/* 제목 및 설명 */}
                  <div className="px-2 py-3 flex-1">
                    <h2 className="text-[18px] font-bold text-gray-900 truncate overflow-hidden whitespace-nowrap">{card.title}</h2>
                    <p className="text-sm text-gray-600">{card.subtitle || `${card.platform ?? ''} · ${card.type ?? ''}`}</p>
                  </div>

                  {/* 점수 및 코멘트 */}
                  {card.scores && (
                    <ul className="px-4 text-sm text-gray-700 space-y-1">
                      {Object.entries(card.scores).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}점
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 버튼 */}
                  <div className="pb-2 mt-auto">
                    <button
                      onClick={() => onButton1Click?.(card)}
                      className="w-full bg-[#7f94f2] hover:bg-[#6378eb] text-white py-2 rounded-[7px] font-semibold hover:opacity-90"
                    >
                      {card.button1}
                    </button>
                  </div>
                </div>

                {/* 모바일 카드 (작게 축약된 형태) */}
                <div className="sm:hidden w-full bg-white rounded-2xl shadow-md px-4 py-3 flex items-center justify-between">
                  {/* 왼쪽: 아이콘 + 제목 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 19h18M5 5v14M19 5v14" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900">{card.title}</div>
                      <div className="text-sm text-gray-500">{card.subtitle || `${card.platform ?? ''} · ${card.type ?? ''}`}</div>
                    </div>
                  </div>

                  {/* 오른쪽: 메뉴 버튼 */}
                  <button className="text-gray-500 hover:text-gray-800">
                    {/* Lucide 아이콘 사용 시 */}
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 그룹 구분선 */}
          {groupIdx < groupedCards.length - 1 && (
            <div className="h-[1px] bg-[#D8D8DA] mt-6 w-full" />
          )}
        </div>
      ))}
    </>
  );
};

export default CardGrid;
