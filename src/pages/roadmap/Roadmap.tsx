import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoadmapStore } from "@/store/roadmapStore";
import RoadmapCanvas from "./RoadmapCanvas";
import SubjectModal from "@/pages/roadmap/Subject";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";

export default function Roadmap() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const setInitial = useRoadmapStore((s) => s.setInitial);
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);
  const addNode = useRoadmapStore((s) => s.addNode);

  const handleAdd = () => {
    const newLabel = prompt("새 과목명을 입력하세요");
    if (newLabel?.trim()) {
      addNode(newLabel.trim());
    }
  };

  useEffect(() => {
    const roadmap = state ?? null;
    if (!roadmap || !roadmap.subjects) {
      alert("로드맵 정보가 없습니다. 진단을 먼저 진행해 주세요.");
      navigate("/diagnosis", { replace: true });
    } else {
      setInitial(roadmap.subjects);
    }
  }, [state, navigate, setInitial]);

  return (
    <section className="relative">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">맞춤 로드맵</h1>
        <div className="space-x-2">
          {editing ? (
            <Button onClick={toggleEditing} variant="default" size="sm" className="gap-1">
              <Check size={16} /> 완료
            </Button>
          ) : (
            <Button onClick={toggleEditing} variant="outline" size="sm">
              수정
            </Button>
          )}
          <Button onClick={handleAdd} size="sm" variant="secondary">
            <Plus size={16} />
          </Button>
        </div>
      </header>

      <RoadmapCanvas />

      {modalOpen && selected && (
        <SubjectModal
          subject={{ subjectId: selected.id, subjectName: selected.label }}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
