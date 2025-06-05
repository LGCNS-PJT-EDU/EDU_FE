import React from 'react';

export interface CardItem {
  title: string;
  detailUrl: string;
  button1: string;
}

interface CardGridProps {
  cards: CardItem[];
  onButton1Click?: (card: CardItem) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onButton1Click }) => {
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-[NeoDunggeunmo]">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border-2 border-[#6C80EC] rounded-[7px] p-3 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-[18px] text-[#1B1A1B]">{card.title}</h2>
          </div>
          <div className="mt-4">
            <button
              className="bg-white border border-[#6C80EC] text-[#1B1A1B] py-1 rounded w-full"
              onClick={() => onButton1Click?.(card)}
            >
              {card.button1}
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="h-[1px] bg-[#D8D8DA] mt-6 w-full" />
    </>
  );
};

export default CardGrid;