import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "zustand";
import {
  DndProvider,
  useDrag,
  useDrop,
  type DragSourceMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Check } from "lucide-react";
import SubjectModal from "@/pages/roadmap/Subject";

/** 타입 정의 */
interface Subject {
  subjectId: number;
  subjectName: string;
}
interface RoadmapData {
  subjects: Subject[];
}
type NodeData = { id: number; label: string };
interface DragItem { index: number; }

/** 좌표 설정 */
const SLOT_GAP = 200;
const SLOT_START_X = 120;
const SLOT_Y = 120;

/** zustand 상태 관리 */
const useRoadmapStore = create<{
  nodes: NodeData[];
  editing: boolean;
  selected: NodeData | null;
  modalOpen: boolean;
  toggleEditing: () => void;
  addNode: (label: string) => void;
  deleteNode: (index: number) => void;
  reorderNode: (from: number, to: number) => void;
  setInitial: (subjects: Subject[]) => void;
  openModal: (index: number) => void;
  closeModal: () => void;
}>((set) => ({
  nodes: [],
  editing: false,
  selected: null,
  modalOpen: false,
  toggleEditing: () => set((s) => ({ editing: !s.editing })),
  addNode: (label) =>
    set((s) => ({ nodes: [...s.nodes, { id: Date.now(), label }] })),
  deleteNode: (index) =>
    set((s) => {
      const next = [...s.nodes];
      next.splice(index, 1);
      return { nodes: next };
    }),
  reorderNode: (from, to) =>
    set((s) => {
      if (from === to) return s;
      const next = [...s.nodes];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { nodes: next };
    }),
  setInitial: (subjects) =>
    set(() => ({
      nodes: subjects.map((s) => ({ id: s.subjectId, label: s.subjectName })),
    })),
  openModal: (index) =>
    set((s) => ({ modalOpen: true, selected: s.nodes[index] })),
  closeModal: () => set(() => ({ modalOpen: false, selected: null })),
}));

/** NodeItem */
const NodeItem: React.FC<{
  node: NodeData;
  index: number;
  slots: { x: number; y: number }[];
}> = ({ node, index, slots }) => {
  const ref = useRef<HTMLDivElement>(null);
  const editing = useRoadmapStore((s) => s.editing);
  const reorder = useRoadmapStore((s) => s.reorderNode);
  const del = useRoadmapStore((s) => s.deleteNode);
  const openModal = useRoadmapStore((s) => s.openModal);

  const [, drop] = useDrop<DragItem>({
    accept: "NODE",
    drop: (item) => item.index !== index && reorder(item.index, index),
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: "NODE",
    item: { index },
    canDrag: editing,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  const slot = slots[index] ?? { x: 0, y: 0 };

  return (
    <div
      ref={ref}
      className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: slot.x, top: slot.y, opacity: isDragging ? 0.5 : 1 }}
    >
      <motion.div
        className={`relative rounded-xl bg-white shadow-lg px-4 py-2 whitespace-nowrap ${
          editing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        whileHover={editing ? { scale: 1.05 } : undefined}
        onClick={() => !editing && openModal(index)}
      >
        {editing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              del(index);
            }}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-[2px]"
          >
            <X size={12} />
          </button>
        )}
        {node.label}
      </motion.div>
    </div>
  );
};

/** Slot (드롭 대상) */
const SlotPlaceholder: React.FC<{ index: number; slots: { x: number; y: number }[] }> = ({ index, slots }) => {
  const editing = useRoadmapStore((s) => s.editing);
  const reorder = useRoadmapStore((s) => s.reorderNode);
  const [, drop] = useDrop<DragItem>({
    accept: "NODE",
    drop: (item) => reorder(item.index, index),
  });

  if (!editing || !slots[index]) return null;
  const ref = useRef<HTMLDivElement>(null);
  drop(ref);
  const { x, y } = slots[index];

  return (
    <div
      ref={ref}
      style={{ left: x, top: y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-10 border-2 border-dashed border-gray-300 rounded-lg opacity-30"
    />
  );
};

/** 메인 컴포넌트 */
export default function Roadmap() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const setInitial = useRoadmapStore((s) => s.setInitial);
  const nodes = useRoadmapStore((s) => s.nodes);
  const editing = useRoadmapStore((s) => s.editing);
  const toggle = useRoadmapStore((s) => s.toggleEditing);
  const addNode = useRoadmapStore((s) => s.addNode);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const selected = useRoadmapStore((s) => s.selected);
  const closeModal = useRoadmapStore((s) => s.closeModal);

  const [modalInput, setModalInput] = useState("");

  useEffect(() => {
    const roadmap = (state as RoadmapData) ?? null;
    if (!roadmap) {
      alert("로드맵 정보가 없습니다. 진단을 먼저 진행해 주세요.");
      navigate("/diagnosis", { replace: true });
      return;
    }
    setInitial(roadmap.subjects);
  }, [state, navigate, setInitial]);

  const slotCount = nodes.length + 1;
  const slots = useMemo(
    () =>
      Array.from({ length: slotCount }, (_, i) => ({
        x: SLOT_START_X + i * SLOT_GAP,
        y: SLOT_Y,
      })),
    [slotCount]
  );

  const canvasWidth = SLOT_START_X + SLOT_GAP * (slotCount - 1) + 200;

  return (
    <section className="relative">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">맞춤 로드맵</h1>
        <div className="space-x-2">
          {editing ? (
            <Button onClick={toggle} variant="default" size="sm" className="gap-1">
              <Check size={16} /> 완료
            </Button>
          ) : (
            <Button onClick={toggle} variant="outline" size="sm">
              수정
            </Button>
          )}
          <Button onClick={() => setModalInput("새 과목")} size="sm" variant="secondary">
            <Plus size={16} />
          </Button>
        </div>
      </header>

      {/* 로드맵 영역 */}
      <div className="fixed inset-x-0 top-24 overflow-x-auto pb-16">
        <div className="relative h-64" style={{ width: canvasWidth }}>
          <svg className="absolute inset-0 h-full w-full z-0" fill="none" strokeWidth={6} stroke="#d1d5db">
            <path
              d={slots.map((s, i) => `${i === 0 ? "M" : "L"}${s.x} ${s.y}`).join(" ")}
              strokeLinecap="round"
            />
          </svg>
          <DndProvider backend={HTML5Backend}>
            {slots.map((_, i) => (
              <SlotPlaceholder key={i} index={i} slots={slots} />
            ))}
            {nodes.map((n, i) => (
              <NodeItem key={n.id} node={n} index={i} slots={slots} />
            ))}
          </DndProvider>
        </div>
      </div>

      {/* 새 과목 추가 다이얼로그 */}
      <Dialog open={!!modalInput} onOpenChange={() => setModalInput("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-lg font-semibold">새 과목 추가</DialogHeader>
          <Input value={modalInput} onChange={(e) => setModalInput(e.target.value)} />
          <DialogFooter className="justify-end">
            <Button variant="ghost" onClick={() => setModalInput("")}>
              취소
            </Button>
            <Button
              onClick={() => {
                addNode(modalInput);
                setModalInput("");
              }}
              disabled={!modalInput.trim()}
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 모달: 과목 상세 */}
      {modalOpen && selected && (
        <SubjectModal
          subject={{ subjectId: selected.id, subjectName: selected.label }}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
