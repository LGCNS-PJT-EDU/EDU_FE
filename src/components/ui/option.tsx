// src/component/ui/Options.tsx
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

export interface Choice {
  choiceId: number;
  choiceNum: number; // 1,2,3,4 같은 번호
  choice: string;
  value: string;
}

export interface StateColors {
  normalBg?: string; // 기본 배경
  selectedBg?: string; // 체크(quiz) 모드에서 선택됐을 때
  correctBg?: string; // 정답인 경우
  incorrectBg?: string; // 오답인 경우
}

export interface OptionsProps {
  choices: Choice[];
  selectedValue?: string;
  onChoose?: (value: string) => void;

  /** 오답노트 모드로 전환할지 여부 */
  showResult?: boolean;
  /** 진짜 정답의 value */
  correctValue?: string;
  /** prefix 표시 타입: 체크말고 번호를 쓰려면 'number' */
  indicatorType?: 'check' | 'number';
  /** 각 상태별 배경색 설정 */
  stateColors?: StateColors;
}

export const Options: React.FC<OptionsProps> = ({
  choices,
  selectedValue,
  onChoose,
  showResult = false,
  correctValue,
  indicatorType = 'check',
  stateColors = {},
}) => {
  // 디폴트 색상
  const {
    normalBg = '#F6F5F8',
    selectedBg = '#C9EBEF',
    correctBg = '#A3E55C',
    incorrectBg = '#F87171',
  } = stateColors;

  return (
    <div className="flex flex-col gap-4">
      {choices.map((c) => {
        const isSelected = selectedValue === c.value;
        const isCorrect = showResult && c.value === correctValue;
        const isWrong = showResult && isSelected && selectedValue !== correctValue;

        // 배경색 결정
        let bgColor = normalBg;
        if (isCorrect) bgColor = correctBg;
        else if (isWrong) bgColor = incorrectBg;
        else if (!showResult && isSelected) bgColor = selectedBg;

        // prefix 표시(✔, ✖, 또는 번호)
        const indicator = (() => {
          if (!showResult) {
            // quiz 모드

            return indicatorType === 'number'
              ? c.choiceNum
              : (isSelected ? <FaCheck size={14} /> : null);
          } else {
            // 오답노트 모드
            if (isCorrect) return <FaCheck size={14} />;
            if (isWrong) return <FaTimes size={14} />;
            return indicatorType === 'number'
              ? c.choiceNum
              : null;
          }
        })();

        // 선택지 테두리 색: 정답(녹색), 오답(빨강), 기본(투명)
        const borderColor = isCorrect
          ? '#1ABC9C'    
          : isWrong
            ? '#E74C3C'    
            : 'transparent';

        // prefix 배경색
        let prefixBgColor = '#DBDFE3';
        if (isCorrect) prefixBgColor = '#7FCBA0';
        else if (isWrong) prefixBgColor = '#DD4B4B';

        else if (!showResult && isSelected) prefixBgColor = '#51BACB';

        return (
          <button
            key={c.choiceId}
            onClick={() => onChoose?.(c.value)}
            disabled={showResult}
            className="flex w-full items-center gap-3 rounded-[10px] border border-transparent px-4 py-3"
            style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: prefixBgColor }}
            >
              {indicator}
            </span>
            <span className="flex-1 text-left">{c.choice}</span>
          </button>
        );
      })}
    </div>
  );
};
