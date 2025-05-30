import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X } from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import nodeImg from '@/asset/img/roadmap/subject/SubjectNode.png';

const NODE_SIZE = 36;        // 템플릿과 동일하게
const LABEL_OFFSET = 8;      // 아이콘 바로 아래 라벨과의 간격(px)

interface Props {
  index: number;
  x: number;
  y: number;
  showLabel: boolean;
}

export default function RoadmapNode({ index, x, y, showLabel }: Props) {
  const node        = useRoadmapStore((s) => s.nodes[index]);
  const editing     = useRoadmapStore((s) => s.editing);
  const reorderNode = useRoadmapStore((s) => s.reorderNode);
  const deleteNode  = useRoadmapStore((s) => s.deleteNode);
  const openModal   = useRoadmapStore((s) => s.openModal);

  const [, drop] = useDrop({
    accept: 'NODE',
    drop: (item: any) =>
      item.index !== index && reorderNode(item.index, index),
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
      <div
        ref={iconRef}
        style={{ left: x, top: y }}
        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => !editing && openModal(index)}
      >
        <img
          src={nodeImg}
          alt={node?.label ?? ''}
          className="w-9 h-9"
          style={{ opacity: isDragging ? 0.5 : 1 }}
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

      {showLabel && node && (
        <p
          style={{
            left: x,
            top: y + NODE_SIZE / 2 + LABEL_OFFSET,
          }}
          className="absolute -translate-x-1/2 w-28 text-center text-sm font-bold break-words"
        >
          {node.label}
        </p>
      )}
    </>
  );
}
