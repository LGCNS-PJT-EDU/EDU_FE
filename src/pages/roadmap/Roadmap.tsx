import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoadmapStore } from "@/store/roadmapStore";
import RoadmapCanvas from "./RoadmapCanvas";
import SubjectModal from "@/components/modal/Subject";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/store/authGlobal";
import { Check } from "lucide-react";
import { RoadmapPayload } from "@/api/diagnosisService";
import { usePromoteGuestRoadmap } from "@/hooks/usePromoteGuestRoadmap";
import { useUserRoadmapQuery } from "@/hooks/useUserRoadmapQuery";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function Roadmap() {
  /* 로딩 스토어 */
  const { startLoading, stopLoading } = useLoadingStore(); 
  /* 정식 로드맵 있으면 있는거 가져오기 */
  const { data: userRoadmap, isLoading } = useUserRoadmapQuery();
  /* 정식 로드맵 없고, Uuid 있고, 로그인한 상태면 guest 로드맵 정식으로 승격 */
  usePromoteGuestRoadmap();

  /* Zustand 상태 */
  const setInitial = useRoadmapStore((s) => s.setInitial);
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);

  /* 라우터 */
  const { state } = useLocation();
  const navigate = useNavigate();

  /* uuid 상태 */
  const uuid = useGuestUuidStore((s) => s.uuid); 

  /* 로컬 모달 상태 */
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  /* 진입 시 로드맵 주입 */
  const roadmapFromState = state as RoadmapPayload | undefined;
  const roadmap = userRoadmap ?? roadmapFromState;

  /* 로드맵 보여주기 */
  useEffect(() => {
    if (roadmap?.subjects) {
      setInitial(roadmap.subjects);
    }
  }, [roadmap, setInitial]);

  /* 로그인 안 한 상태에서 모달 열면 로그인 유도 */
  useEffect(() => {
    if (modalOpen && !isLoggedIn()) {
      closeModal();
      setLoginModalOpen(true);
    }
  }, [modalOpen, closeModal]);

  /* 로딩 */
  useEffect(() => {
    if (isLoading) startLoading("로드맵 불러오는 중…");
    else           stopLoading();
  }, [isLoading, startLoading, stopLoading]);

  /* 로드맵도 uuid도 없으면 → 진단 */
  if (!roadmap && !uuid && !isLoading) {
    navigate("/diagnosis", { replace: true });
    return null;
  }

  return (
    <section className="relative">
      {/* 헤더 */}
      <header className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <h1 className="drop-shadow text-2xl font-bold">맞춤 로드맵</h1>

        {editing ? (
          <Button
            onClick={toggleEditing}
            variant="default"
            size="sm"
            className="absolute left-96 top-4 gap-1"
          >
            <Check size={16} /> 완료
          </Button>
        ) : (
          <Button
            onClick={toggleEditing}
            variant="outline"
            size="sm"
            className="absolute left-96 top-4"
          >
            수정
          </Button>
        )}
      </header>

      {/* 로드맵 그래프 */}
      <RoadmapCanvas />

      {/* 과목 상세 모달 */}
      {modalOpen && selected && (
        <SubjectModal
          subject={{
            subjectId: selected.id,
            subjectName: selected.label
          }}
          onClose={closeModal}
        />
      )}

      {/* 로그인 유도 모달 */}
      {loginModalOpen && (
        <ConfirmModal
          onClose={() => setLoginModalOpen(false)}
          title="로그인이 필요합니다!"
          message={`개인화 로드맵 저장 및 과목 상세 조회는\n로그인 후 이용하실 수 있어요.`}
          confirmText="로그인 하러가기"
          onConfirm={() => navigate("/login")}
        />
      )}
    </section>
  );
}
