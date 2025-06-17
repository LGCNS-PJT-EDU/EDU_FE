import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X } from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useSnackbarStore } from '@/store/useSnackbarStore';
import nodeDoneImg from '@/asset/img/roadmap/subject/doneNode.png';
import nodeCurrentImg from '@/asset/img/roadmap/subject/currentNode.png';
import nodeTodoImg from '@/asset/img/roadmap/subject/todoNode.png';
import arrow from '@/asset/img/common/pixel_arrow.png';

interface Props {
  index: number;
  x: number;
  y: number;
  showLabel: boolean;
  nodeStatus: 'done' | 'current' | 'todo';
  wiggle?: boolean;     /* --- 흔들림 애니메이션 --- */
  size: number;
}

export default function RoadmapNode({
  index,
  x,
  y,
  showLabel,
  nodeStatus,
  wiggle = false,
  size,
}: Props) {
  const node = useRoadmapStore((s) => s.nodes[index]);
  const rawOrder = useRoadmapStore((s) => s.currentOrder);
  const currentOrder = rawOrder ?? 0;
  const reorderNode = useRoadmapStore((s) => s.reorderNode);
  const deleteNode = useRoadmapStore((s) => s.deleteNode);
  const editing = useRoadmapStore((s) => s.editing);
  const openModal = useRoadmapStore((s) => s.openModal);

  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);

  const iconSrc =
    nodeStatus === 'done' ? nodeDoneImg : nodeStatus === 'current' ? nodeCurrentImg : nodeTodoImg;
  const isCurrent = nodeStatus === 'current';

  const [, drop] = useDrop({
    accept: 'NODE',
    drop: (item: any) => {
      const { nodes } = useRoadmapStore.getState();
      const dragNode = nodes[item.index];
      if (!dragNode || !node) return;

      const sameGroup =
        (dragNode.subjectOrder < currentOrder && node.subjectOrder < currentOrder) ||
        (dragNode.subjectOrder >= currentOrder && node.subjectOrder >= currentOrder);

      if (!sameGroup) {
        showSnackbar('완료 과목과 미완료 과목은 서로 순서를 바꿀 수 없습니다', 'error');
        return;
      }
      reorderNode(item.index, index);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { index },
    canDrag: editing,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  const iconRef = useRef<HTMLDivElement>(null);
  drag(drop(iconRef));

  return (
    <>
      {/* 아이콘 */}
      <div
        ref={iconRef}
        style={{ left: x, top: y }}
        /* --- 흔들림 index.css 적용: animate-wiggle 대신 wiggle 클래스 --- */
        className={`
          absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer
          ${wiggle ? 'wiggle' : ''}
        `}
        onClick={() => !editing && openModal(index)}
      >
        <img
          src={iconSrc}
          alt=""
          style={{ width: size, height: size, opacity: isDragging ? 0.5 : 1 }}
        />

        {editing && (
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-[1px]"
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(index);
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {isCurrent && (
        <img
          style={{ left: x, top: y - 55 }}
          src={arrow}
          alt="현재 위치"
          className="absolute -top- left-1/2 -translate-x-1/2 w-9 h-7"
        />
      )}

      {/* 라벨 */}
      {showLabel && node && (
        <p
          style={{ left: x, top: y + size / 2 + 8 }}
          className="absolute -translate-x-1/2 w-25 text-center text-l font-bold break-words bg-white px-1"
        >
          {node.label}
        </p>
      )}
    </>
  );
}
