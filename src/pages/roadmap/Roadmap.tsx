import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoadmapStore } from "@/store/roadmapStore";
import RoadmapTemplate from "./RoadmapTemplate";
import SubjectModal from "@/components/modal/Subject";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useIsLoggedIn } from "@/store/authGlobal";
import { Check } from "lucide-react";
import { RoadmapPayload } from "@/api/diagnosisService";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import useRoadmapEdit from "@/hooks/useRoadmapEdit";
import { useRoadmapQuery } from "@/hooks/useRoadmapQuery";

export default function Roadmap() {
  /* 로딩 스토어 */
  const { startLoading, stopLoading } = useLoadingStore(); 
  /* 라우터 */
  const { state } = useLocation();
  const navigate = useNavigate();
  /* 정식 로드맵 있으면 있는거 가져오기 */
  const roadmapFromState = state as RoadmapPayload | undefined;
  const { data: userRoadmap, isLoading: loadingUser, isError, error } = useRoadmapQuery();

  /* uuid, 로그인 여부 */
  const uuid = useGuestUuidStore((s) => s.uuid);
  const isLoggedIn = useIsLoggedIn();

  /* Zustand 상태 */
  const setInitial = useRoadmapStore((s) => s.setInitial);
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const { save, saving } = useRoadmapEdit();
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);

  /* 로컬 모달 상태 */
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  /* 진입 시 로드맵 주입 */
  console.log("[Roadmap.tsx] ▶️ fromState:", roadmapFromState, "  /  userRoadmap:", userRoadmap);
  const roadmap = userRoadmap ?? roadmapFromState;

  /* 로드맵 보여주기 */
  useEffect(() => {
    const source = userRoadmap ?? roadmapFromState;
    console.log("[Roadmap.tsx] initializing subjects from →", source);
    if (source?.subjects) {
      setInitial(source.subjects);
    }
  }, [userRoadmap, roadmapFromState, setInitial]);

  /* 로그인 안 한 상태에서 모달 열면 로그인 유도 */
  useEffect(() => {
    if (modalOpen && !isLoggedIn) {
      closeModal();
      setLoginModalOpen(true);
    }
  }, [modalOpen, closeModal]);

  /* 로딩 */
  useEffect(() => {
    if (loadingUser) startLoading("로드맵 불러오는 중…");
    else           stopLoading();
  }, [loadingUser, startLoading, stopLoading]);

  if (isError) {
    return (
    <ConfirmModal
      title="로드맵이 없습니다"
      message="진단을 먼저 해주세요!"
      confirmText="진단하러 가기"
      onClose={() => {}}
      onConfirm={() => navigate("/diagnosis", { replace: true })}
      />
    );
  }
  if (!roadmap) return null;

  return (
    <section className="relative">  
      {/* 헤더 */}
      <header className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <h1 className="drop-shadow text-2xl font-bold">맞춤 로드맵</h1>

        {editing ? (
          <Button
            onClick={ () => save() }
            disabled={saving}
            variant="default"
            size="sm"
            className="absolute left-96 top-4 gap-1"
          >
            <Check size={16} /> {saving ? '저장 중' : '완료'}
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
      <RoadmapTemplate />

      {/* 과목 상세 모달 */}
      {modalOpen && selected && (
        <SubjectModal
          subject={{
            subjectId: selected.id,
            subjectName: selected.label,
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
