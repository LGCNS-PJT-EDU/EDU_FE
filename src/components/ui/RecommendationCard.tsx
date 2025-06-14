import React, { useState } from 'react';

interface RecommendationContent {
  title: string;
  url: string;
  type: string;
  platform: string;
  isAiRecommendation: boolean;
  comment?: string;

}

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const RecommendationCard: React.FC<RecommendationContent> = ({
  title,
  url,
  type,
  platform,
  isAiRecommendation,
  comment,
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const thumbnail = getYoutubeThumbnail(url);

  // 공통 카드 스타일
  const cardClass = "w-full bg-white rounded-xl border p-4 shadow transition-all duration-300";

  return (
    <div className={`${cardClass} mb-3`}>
      {!isDetailOpen ? (
        // 기본 카드 화면
        <div className="flex gap-3">
          <div className="w-20 h-20 rounded overflow-hidden bg-gray-200 shrink-0">
            {thumbnail ? (
              <img src={thumbnail} alt="썸네일" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                썸네일 없음
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-[#6378EB] break-words"
              >
                {title}
              </a>
              {isAiRecommendation && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                  AI 추천
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">{platform} · {type}</p>

            {comment && (
              <button
                onClick={() => setIsDetailOpen(true)}
                className="mt-2 text-xs text-gray-500 underline"
              >
                AI 추천 요약 더보기
              </button>
            )}
          </div>
        </div>
      ) : (
        // comment 상세 카드 화면
        <div className="text-sm text-gray-800 p-1 max-w-[540px] mx-auto">
          <div className="flex justify-between items-start mb-2">
            <div className="text-base font-semibold">추천 설명</div>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">
            {comment}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
