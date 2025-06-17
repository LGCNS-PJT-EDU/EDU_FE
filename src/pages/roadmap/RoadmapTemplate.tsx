/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useRoadmapStore } from '@/store/roadmapStore';
import SkeletonCanvas from './SkeletonCanvas';
import RoadmapNode from './RoadmapNode';

/* ───────── 레이아웃 상수 ───────── */
const DESK_NODE_SIZE = 36;
const DESK_GAP_X = 160;
const DESK_GAP_Y = 160;
const DESK_MAX_COLS = 5;
const DESK_MIN_COLS = 3;

const MOB_NODE_SIZE = 44;
const MOB_GAP_X = 140;
const MOB_GAP_Y = 160;
const MOB_MAX_COLS = 4;
const MOB_MIN_COLS = 2;

/* 패딩 / 여백 값 분리 */
const LEFT_MARGIN_MOB = 16;
const RIGHT_MARGIN_MOB = 12;

const LABEL_OFF = 8;
const LABEL_W = 112;
const LABEL_H = 40;
const STROKE = 4;

/* 과목 수를 rows에 분배 */
function splitIntoRows(total: number, maxCols: number, minCols: number) {
  let rows = Math.ceil(total / maxCols);
  const arr = Array(rows).fill(maxCols);
  let excess = rows * maxCols - total;
  for (let i = rows - 1; excess > 0; i--) {
    if (arr[i] > minCols) {
      arr[i]--;
      excess--;
    }
    if (i === 0) i = rows;
  }
  return arr;
}

/* 100vw 안에 ‘여백 포함’으로 맞추는 scale */
function useFitScale(designWidth: number, left: number, right: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handler = () => {
      const vw = window.innerWidth;
      if (vw < 768) {
        const available = vw - left - right;
        setScale(Math.min(1, available / designWidth));
      } else {
        setScale(1);
      }
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [designWidth, left, right]);
  return scale;
}

export default function RoadmapTemplate() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const currentOrder = useRoadmapStore((s) => s.currentOrder);
  const editing = useRoadmapStore((s) => s.editing);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const NODE_SIZE = isMobile ? MOB_NODE_SIZE : DESK_NODE_SIZE;
  const GAP_X = isMobile ? MOB_GAP_X : DESK_GAP_X;
  const GAP_Y = isMobile ? MOB_GAP_Y : DESK_GAP_Y;
  const MAX_COLS = isMobile ? MOB_MAX_COLS : DESK_MAX_COLS;
  const MIN_COLS = isMobile ? MOB_MIN_COLS : DESK_MIN_COLS;

  /* 모바일 여백 값 적용 */
  const LEFT_MARGIN = isMobile ? LEFT_MARGIN_MOB : 0;
  const RIGHT_MARGIN = isMobile ? RIGHT_MARGIN_MOB : 0;

  const ROW_WIDTH = (MAX_COLS - 1) * GAP_X;
  const NODE_Y = 50;
  const SKELETON_Y = 50;

  const rowCounts = useMemo(() => splitIntoRows(nodes.length, MAX_COLS, MIN_COLS), [
    nodes.length,
    MAX_COLS,
    MIN_COLS,
  ]);
  const rows = rowCounts.length;

  const positions = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    rowCounts.forEach((cnt, r) => {
      const step = ROW_WIDTH / (cnt - 1);
      for (let i = 0; i < cnt; i++) {
        const offset = i * step;
        const x =
          r % 2 === 0 ? NODE_SIZE / 2 + offset : NODE_SIZE / 2 + ROW_WIDTH - offset;
        const y = NODE_SIZE / 2 + r * GAP_Y + NODE_Y;
        pts.push({ x, y });
      }
    });
    return pts;
  }, [rowCounts, NODE_SIZE, ROW_WIDTH, GAP_Y, NODE_Y]);

  const maxX = Math.max(...positions.map((p) => p.x));
  const maxY = Math.max(...positions.map((p) => p.y));
  const contentWidth = maxX + Math.max(NODE_SIZE, LABEL_W) / 2 + STROKE;
  const contentHeight =
    Math.max(
      maxY + NODE_SIZE / 2,
      maxY + NODE_SIZE / 2 + LABEL_OFF + LABEL_H,
      SKELETON_Y + (rows - 1) * GAP_Y + NODE_SIZE / 2,
    ) + STROKE;

  /* scale 계산 */
  const scale = useFitScale(contentWidth, LEFT_MARGIN, RIGHT_MARGIN);
  const scaledWidth = contentWidth * scale;
  const wrapperWidth = scaledWidth + RIGHT_MARGIN;

  return (
    <div
      className="relative"
      style={{
        width: isMobile ? wrapperWidth : contentWidth,
        marginLeft: isMobile ? LEFT_MARGIN : 'auto',
        marginRight: isMobile ? 0 : 'auto',
        height: contentHeight * scale,
      }}
    >
      <div
        className="mx-auto"
        style={{
          width: contentWidth,
          height: contentHeight,
          marginLeft: 13,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: contentWidth,
            height: contentHeight,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
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
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            {positions.map((p, i) => {
              const node = nodes[i];
              const status =
                currentOrder === null || !node
                  ? 'todo'
                  : node.subjectOrder < currentOrder
                  ? 'done'
                  : node.subjectOrder === currentOrder
                  ? 'current'
                  : 'todo';

              return (
                <RoadmapNode
                  key={i}
                  index={i}
                  x={p.x}
                  y={p.y}
                  showLabel={!!node}
                  nodeStatus={status}
                  wiggle={editing}
                  size={NODE_SIZE}
                />
              );
            })}
          </DndProvider>
        </div>
      </div>
    </div>
  );
}
