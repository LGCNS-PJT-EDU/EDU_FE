// src/pages/roadmap/RoadmapTemplate.tsx
import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRoadmapStore } from '@/store/roadmapStore';
import SkeletonCanvas from '@/pages/roadmap/SkeletonCanvas';
import RoadmapNode from '@/pages/roadmap/RoadmapNode';

const NODE_SIZE        = 36;   // 아이콘 실제 표시 크기(px)
const GAP_X            = 160;  // 가로 간격(px)
const GAP_Y            = 160;  // 세로 간격(px)
const MAX_COLS         = 5;    // 지그재그 열 수
const SKELETON_Y       = 150;  // 뼈대 Y-offset(px)
const NODE_Y           = 150;  // 노드(Y-offset) – 뼈대와 같게 두는 경우
const LABEL_OFFSET     = 8;    // 아이콘 바로 아래 라벨 간격(px)
const MAX_LABEL_LINES  = 2;    // 라벨 최대 줄 수
const LINE_HEIGHT      = 20;   // 라벨 1줄 높이(px)
const LABEL_HEIGHT     = MAX_LABEL_LINES * LINE_HEIGHT; // 예상 최대 라벨 높이
const LABEL_WIDTH      = 112;  // 라벨 w-28 → 7rem → 112px
const STROKE_WIDTH     = 4;    // 뼈대 선 굵기(px)

export default function RoadmapTemplate() {
  // 스토어에서 과목 배열
  const nodes = useRoadmapStore((s) => s.nodes);

  // 총 슬롯 수·행(row) 계산
  const cols       = MAX_COLS;
  const totalSlots = Math.max(nodes.length, cols); 
  const rows       = Math.ceil(totalSlots / cols);

  // 슬롯 중심 좌표 계산 (NODE_Y 오프셋 포함)
  const positions = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < totalSlots; i++) {
      const r = Math.floor(i / cols);
      const c = r % 2 === 0 ? i % cols : cols - 1 - (i % cols);
      pts.push({
        x: NODE_SIZE / 2 + c * GAP_X,
        y: NODE_SIZE / 2 + r * GAP_Y + NODE_Y,
      });
    }
    return pts;
  }, [nodes.length]);

  // 컨테이너 크기 계산
  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);

  const maxXCenter     = Math.max(...xs);
  const maxYCenter     = Math.max(...ys);

  // 오른쪽 끝 = maxXCenter + max(아이콘 반지름, 라벨 반 너비)
  const rightEdgeNode  = maxXCenter + NODE_SIZE / 2;
  const rightEdgeLabel = maxXCenter + LABEL_WIDTH / 2;
  const containerWidth = Math.max(rightEdgeNode, rightEdgeLabel) + STROKE_WIDTH;

  // 아래 끝 candidates
  const bottomNode     = maxYCenter + NODE_SIZE / 2;
  const bottomLabel    = maxYCenter + NODE_SIZE / 2 + LABEL_OFFSET + LABEL_HEIGHT;
  const bottomSkeleton = SKELETON_Y + (rows - 1) * GAP_Y + NODE_SIZE / 2;
  const containerHeight = Math.max(bottomNode, bottomLabel, bottomSkeleton) + STROKE_WIDTH;

  return (
    <div
      className="relative mx-auto"
      style={{
        width:  containerWidth,
        height: containerHeight,
      }}
    >
      {/* SkeletonCanvas: stroke, yOffset 모두 전달 */}
      <SkeletonCanvas
        cols={cols}
        rows={rows}
        nodeSize={NODE_SIZE}
        colGap={GAP_X}
        rowGap={GAP_Y}
        yOffset={SKELETON_Y}
        stroke={STROKE_WIDTH}
      />

      {/* Nodes */}
      <DndProvider backend={HTML5Backend}>
        {positions.map((p, i) => (
          <RoadmapNode
            key={i}
            index={i}
            x={p.x}
            y={p.y}
            showLabel={!!nodes[i]}
          />
        ))}
      </DndProvider>
    </div>
  );
}
