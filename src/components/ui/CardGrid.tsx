import React from 'react';
import { MoreVertical } from 'lucide-react';

export interface CardItem {
  title: string;
  detailUrl?: string;
  button1?: string;
  isAiRecommendation?: boolean;
  platform?: string;
  type?: string;
  price?: string;
  subtitle?: string;
  scores?: Record<string, number>;
  subjectId?: number;
}

interface CardGridProps {
  cards: CardItem[];
  onButton1Click?: (card: CardItem) => void;
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

const truncateText = (text: string, maxLength = 20) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
};

const getYoutubeThumbnail = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const CardGrid: React.FC<CardGridProps> = ({ cards, onButton1Click }) => {
  const groupedCards = chunk(cards, 4);

  return (
    <>
      {groupedCards.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-[pretendard]">
            {group.map((card, idx) => {
              const youtubeThumbnail =
                card.detailUrl && getYoutubeThumbnail(card.detailUrl);

              return (
                <div key={idx}>
                  {/* 데스크탑 카드 */}
                  <div className="hidden h-[250px] border px-3 py-4 sm:flex bg-white rounded-[7px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex-col">
                    <div className="h-[120px] rounded-[7px] overflow-hidden bg-gray-200">
                      {youtubeThumbnail ? (
                        <img
                          src={youtubeThumbnail}
                          alt="Youtube Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          썸네일 없음
                        </div>
                      )}
                    </div>

                    <div className="px-2 py-3 flex-1">
                      <h2 className="text-[18px] font-bold text-gray-900 truncate overflow-hidden whitespace-nowrap">
                        {card.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {card.subtitle || `${card.platform ?? ''} · ${card.type ?? ''}`}
                      </p>
                    </div>

                    {card.scores && (
                      <ul className="px-4 text-sm text-gray-700 space-y-1">
                        {Object.entries(card.scores).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value}점
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="pb-2 mt-auto">
                      <button
                        onClick={() => onButton1Click?.(card)}
                        className="w-full bg-[#7f94f2] hover:bg-[#6378eb] text-white py-2 rounded-[7px] font-semibold hover:opacity-90"
                      >
                        {card.button1}
                      </button>
                    </div>
                  </div>

                  {/* 모바일 카드 */}
                  <div className="sm:hidden w-full bg-white rounded-2xl shadow-md px-4 py-3 flex gap-3 items-center">
                    {/* 썸네일 또는 아이콘 */}
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 shrink-0">
                      {youtubeThumbnail ? (
                        <img
                          src={youtubeThumbnail}
                          alt="Youtube Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          썸네일 없음
                        </div>
                      )}
                    </div>

                    {/* 텍스트 영역 */}
                    <div className="flex-1">
                      <div className="text-base font-bold text-gray-900">
                        {truncateText(card.title, 20)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {card.subtitle || `${card.platform ?? ''} · ${card.type ?? ''}`}
                      </div>
                    </div>

                    <button className="text-gray-500 hover:text-gray-800">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {groupIdx < groupedCards.length - 1 && (
            <div className="h-[1px] bg-[#D8D8DA] mt-6 w-full" />
          )}
        </div>
      ))}
    </>
  );
};

export default CardGrid;
