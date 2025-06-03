import React from 'react';

export interface CardItem {
  title: string;
  detailUrl: string;
  button1: string;
  button2: string;
}

interface CardGridProps {
  cards: CardItem[];
  onButton1Click?: (card: CardItem) => void;
  onButton2Click?: (card: CardItem) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onButton1Click, onButton2Click }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-blue-300 rounded-xl shadow-md p-4 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold">{card.title}</h2>
            <a
              href={card.detailUrl}
              className="text-sm text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              자세히 보기 &gt;
            </a>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="bg-white border border-blue-500 text-blue-500 py-1 rounded"
              onClick={() => onButton1Click?.(card)}
            >
              {card.button1}
            </button>
            <button
              className="bg-blue-500 text-white py-1 rounded"
              onClick={() => onButton2Click?.(card)}
            >
              {card.button2}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
