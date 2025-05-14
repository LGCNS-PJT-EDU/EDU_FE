import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useRoadmapStore } from "@/store/roadmapStore";
import { SLOTS } from "@/pages/roadmap/slots";

export default function SlotPlaceholder({ index }: { index: number }) {
  const editing = useRoadmapStore((s) => s.editing);
  const reorder = useRoadmapStore((s) => s.reorderNode);

  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "NODE",
    drop: (item: any) => reorder(item.index, index),
  });

  drop(ref);
  
  const slot = SLOTS[index];
  if (!editing || !slot) return null;

  return (
    <div
      ref={ref}
      style={{ left: slot.x, top: slot.y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-10 border-2 border-dashed
                 border-gray-300 rounded-lg opacity-30"
    />
  );
}
