import React, { JSX, memo } from 'react';

interface Props {
  cols: number;
  rows: number;
  nodeSize: number;
  colGap: number;
  rowGap: number;
  yOffset?: number;
  stroke?: number;
}
export default memo(function SkeletonCanvas({
  cols,
  rows,
  nodeSize,
  colGap,
  rowGap,
  yOffset = 0,
  stroke = 4,
}: Props) {
  const half = nodeSize / 2;
  const lines: JSX.Element[] = [];

  for (let r = 0; r < rows; r++) {
    const y = half + r * rowGap + (yOffset ?? 0);
    lines.push(
      <line
        key={`h-${r}`}
        x1={half}
        y1={y}
        x2={half + (cols - 1) * colGap}
        y2={y}
        stroke="#7fa2ff"
        strokeWidth={stroke}
      />
    );
    if (r < rows - 1) {
      const fromX = r % 2 === 0 ? half + (cols - 1) * colGap : half;
      lines.push(
        <line
          key={`v-${r}`}
          x1={fromX}
          y1={y}
          x2={fromX}
          y2={y + rowGap}
          stroke="#7fa2ff"
          strokeWidth={stroke}
        />
      );
    }
  }
  const w = half + (cols - 1) * colGap + half + stroke;
  const h = yOffset + (rows - 1) * rowGap + nodeSize + stroke;

  return (
    <svg width={w} height={h} className="absolute left-0 top-0 pointer-events-none">
      {lines}
    </svg>
  );
});
