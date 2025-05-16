import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import { useRoadmapStore } from "@/store/roadmapStore";
import { SLOTS } from "@/pages/roadmap/slots";
import { X } from "lucide-react";
import { SUBJECT_IMAGES } from "@/pages/roadmap/subjectImages";

interface NodeItemProps {
  node: { id: number; label: string };
  index: number;
}

export default function NodeItem({ node, index }: NodeItemProps) {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const imgBoxRef    = useRef<HTMLDivElement>(null);

  const editing  = useRoadmapStore((s) => s.editing);
  const reorder  = useRoadmapStore((s) => s.reorderNode);
  const del      = useRoadmapStore((s) => s.deleteNode);
  const openModal = useRoadmapStore((s) => s.openModal);

  /* 드롭: 다른 노드가 이 자리로 오면 순서 스왑 */
  const [, drop] = useDrop({
    accept: "NODE",
    drop: (item: any) => item.index !== index && reorder(item.index, index),
  });

  /* 드래그: 편집 모드일 때만 가능 */
  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: { index },
    canDrag: editing,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  drag(drop(imgBoxRef));

  const { x, y } = SLOTS[index] ?? { x: 0, y: 0 };

  return (
    <div
      ref={wrapperRef}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
      style={{ left: x, top: y, opacity: isDragging ? 0.5 : 1 }}
    >
      <motion.div
        ref={imgBoxRef}
        className={`relative w-[80px] h-[80px] rounded-full bg-white shadow-lg flex items-center justify-center ${
          editing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        onClick={() => !editing && openModal(index)}
        whileHover={editing ? { scale: 1.05 } : undefined}
      >
        {editing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              del(index);
            }}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-[2px]"
          >
            <X size={14} />
          </button>
        )}
        {SUBJECT_IMAGES[node.label] ? (
          <img
            src={SUBJECT_IMAGES[node.label]}
            alt={node.label}
            className="w-[68px] h-[68px] object-contain rounded-full"
          />
        ) : (
          <span className="text-lg font-semibold">{node.label.charAt(0)}</span>
        )}
      </motion.div>
      <p className="mt-1 w-[76px] text-center text-[13px] leading-tight
                    break-words whitespace-normal
                    bg-white px-1 rounded-2xl">{node.label}</p>
    </div>
  );
}