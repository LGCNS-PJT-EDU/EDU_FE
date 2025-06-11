import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRoadmapStore } from '@/store/roadmapStore';
import SkeletonCanvas from './SkeletonCanvas';
import RoadmapNode     from './RoadmapNode';

/* ───────── 레이아웃 상수 ───────── */
const NODE_SIZE        = 36;          // 아이콘 지름(px)
const GAP_X            = 160;         // 5칸 뼈대 기준 간격
const GAP_Y            = 160;
const MAX_COLS         = 5;           // 뼈대는 5칸 고정
const MIN_COLS         = 3;

const ROW_WIDTH        = (MAX_COLS - 1) * GAP_X; // 한 줄 전체 길이 = 640px

const SKELETON_Y       = 50;         // 뼈대 내려주는 오프셋
const NODE_Y           = 50;         // 노드 내려주는 오프셋(같이 둠)

const LABEL_OFF        = 8;           // 아이콘 ↔ 라벨 간격
const LABEL_W          = 112;         // w-28 = 7rem
const LABEL_H          = 40;          // 2줄 × 20px
const STROKE           = 4;           // 선 두께

/* 과목 수를 3~5개/줄로 분배 */
function splitIntoRows(total: number): number[] {
  let rows = Math.ceil(total / MAX_COLS);
  const arr = Array(rows).fill(MAX_COLS);       // [5,5,5 …] 채우기
  let excess = rows * MAX_COLS - total;         // 빼야 하는 개수

  // 아랫줄부터 1개씩 빼되, 최소 3개 유지
  for (let i = rows - 1; excess > 0; i--) {
    if (arr[i] > MIN_COLS) { arr[i]--; excess--; }
    if (i === 0) i = rows;                      // 다시 아래부터
  }
  return arr;
}

export default function RoadmapTemplate() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const currentOrder = useRoadmapStore((s) => s.currentOrder);

  /* 줄별 노드 수 계산 */
  const rowCounts = useMemo(() => splitIntoRows(nodes.length), [nodes.length]);
  const rows      = rowCounts.length;

  /* 간격 같도록 좌표 계산 */
  const positions = useMemo(() => {
    const pts: { x:number; y:number }[] = [];
    rowCounts.forEach((cnt, r) => {
      const step = ROW_WIDTH / (cnt - 1);           // 3→320 , 4→213.3 , 5→160
      for (let i = 0; i < cnt; i++) {
        const offset = i * step;
        const x = r % 2 === 0
          ? NODE_SIZE/2 + offset                    // → 방향
          : NODE_SIZE/2 + ROW_WIDTH - offset;       // ← 방향
        const y = NODE_SIZE/2 + r * GAP_Y + NODE_Y;
        pts.push({ x, y });
      }
    });
    return pts;
  }, [rowCounts]);

  /* 컨테이너 크기 (실제 좌표 기반) */
  const maxX = Math.max(...positions.map(p => p.x));
  const maxY = Math.max(...positions.map(p => p.y));

  const width  = maxX + Math.max(NODE_SIZE, LABEL_W)/2 + STROKE;
  const height = Math.max(
    maxY + NODE_SIZE/2,                                 // 아이콘 끝
    maxY + NODE_SIZE/2 + LABEL_OFF + LABEL_H,           // 라벨 끝
    SKELETON_Y + (rows-1)*GAP_Y + NODE_SIZE/2           // 뼈대 끝
  ) + STROKE;

  const MOBILE_MAX_WIDTH = 375;
  const scale = width > MOBILE_MAX_WIDTH
    ? MOBILE_MAX_WIDTH / width
    : 1;


  return (
    <div className="relative mx-auto" style={{ width, height }}>

      {/* 뼈대 SVG */}
      <SkeletonCanvas
        cols={MAX_COLS}
        rows={rows}
        nodeSize={NODE_SIZE}
        colGap={GAP_X}
        rowGap={GAP_Y}
        yOffset={SKELETON_Y}
        stroke={STROKE}
      />

      {/* 노드 + 라벨 */}
      <DndProvider backend={HTML5Backend}>
        {positions.map((p, i) => {
          const node = nodes[i];

          /* nodeStatus 결정 로직 currentId 없으면 'done' */
          const status =
            currentOrder === null || !node
              ? 'todo'
              : node.subjectOrder < currentOrder
              ? 'done'
              : node.subjectOrder === currentOrder
              ? 'current'
              : node.subjectOrder > currentOrder
              ? 'todo'
              : 'done';

          return (
            <RoadmapNode
              key={i}
              index={i}
              x={p.x}
              y={p.y}
              showLabel={!!node}
              nodeStatus={status}
            />
          );
        })}
      </DndProvider>
    </div>
  );
}
