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
import axios from "axios";
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';

export default function Roadmap() {
  /* 로딩 스토어 */
  const { startLoading, stopLoading } = useLoadingStore();
  /* 라우터 */
  const { state } = useLocation();
  const navigate = useNavigate();
  /* 정식 로드맵 있으면 있는거 가져오기 */
  const roadmapFromState = state as RoadmapPayload | undefined;

  /* uuid, 로그인 여부 */
  const uuid = useGuestUuidStore((s) => s.uuid);
  const isLoggedIn = useIsLoggedIn();

  /* React Query: state 가 없을 때만 fetch */
  const { data: userRoadmap, isLoading: loadingUser, isError, error } = useRoadmapQuery({
    enabled: !Boolean(roadmapFromState),
    refetchOnMount: 'always',
  });

  /* Zustand 상태 */
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const { save, saving } = useRoadmapEdit();
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);
  const nodes = useRoadmapStore((s) => s.nodes);

  /* 로컬 모달 상태 */
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  /* 진입 시 로드맵 주입 */
  console.log("[Roadmap.tsx] ▶️ fromState:", roadmapFromState, "  /  userRoadmap:", userRoadmap);
  const roadmap = roadmapFromState ?? userRoadmap;

  /* 로드맵 보여주기 */
  useEffect(() => {
    const source = roadmapFromState ?? userRoadmap;
    if (source?.subjects) {
      useRoadmapStore.getState().setInitial(source.subjects);
    }
  }, [userRoadmap, roadmapFromState]);

  /* 현재 과목 order 계산하기 */
  useEffect(() => {
    if (!roadmap) return;
    const cur = roadmap.subjects.find(
      (s) => s.subjectId === roadmap.userLocationSubjectId
    );
    useRoadmapStore.getState().setCurrentOrder(cur?.subjectOrder ?? 0);
  }, [roadmap]);

  /* 진척도 계산 */
  const total = nodes.length;
  const currentOrder = useRoadmapStore((s) => s.currentOrder) ?? 0;
  const percent = total ? Math.round(((currentOrder - 1) / total) * 100) : 0;
  const doneCount = Math.max(currentOrder - 1, 0);
  
  /* 로그인 안 한 상태에서 모달 열면 로그인 유도 */
  useEffect(() => {
    if (modalOpen && !isLoggedIn) {
      closeModal();
      setLoginModalOpen(true);
    }
  }, [modalOpen, closeModal]);

  /* 로딩 */
  useEffect(() => {
    if (!loadingUser) return;
    startLoading("로드맵 불러오는 중…");
    return () => stopLoading();
  }, [loadingUser, startLoading, stopLoading]);

  if (loadingUser && !roadmap) {
    return <div style={{ height: "100vh" }} />;
  }

  const is404Error =
    isError &&
    axios.isAxiosError(error) &&
    error.response?.status === 404;

  if (is404Error) {
    return (
      <ConfirmModal
        title="로드맵이 없습니다"
        message="진단을 먼저 해주세요!"
        confirmText="진단하러 가기"
        onClose={() => navigate("/", { replace: true })}
        onConfirm={() => navigate("/diagnosis", { replace: true })}
      />
    );
  }

  if (!roadmap) return null;

  return (
<section className="font-[pretendard] pt-[32px] pb-[32px] md:pt-[50px] md:pb-[50px] mx-auto">
  {/* 진척도 바 + 수정 토글 */}
  <div
    className="
      w-full
      max-w-[718px]
      mx-auto
      flex
      flex-row
      justify-between
      items-center
      gap-4
    "
  >
    {/* 진척도 바 (PC: auto, 모바일: 60%) */}
    <div className="w-[60%] ml-4 mb-8 md:mb-5 flex flex-col justify-center">
      <div className="flex items-center mb-2 md:mb-3">
        <img src={rabbit} alt="rabbit" className="w-7 h-7 md:w-[30px] md:h-[30px] mr-2" />
        <p className="text-[18px] md:text-[20px] font-bold break-keep">
          {roadmap.roadmapName ?? "로드맵"}
        </p>
      </div>
      <p className="mb-2 md:mb-3 text-[16px] md:text-[20px] font-medium break-keep">
        오늘도 학습을 시작해볼까요?
        <span className="ml-2 font-bold">{percent}%</span>
      </p>
      <div className="w-full flex items-center gap-2">
        <div className="w-full h-5 md:h-6 border-2 border-[#59C5CD] p-[2px] md:p-[3px] box-border">
          <div
            className="h-full bg-[#C6EDF2]"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>
        <span className="text-[#59C5CD] text-xs md:text-sm font-medium whitespace-nowrap font-[NeoDunggeunmo]">
          {doneCount}/{total} 완료
        </span>
      </div>
    </div>

    {/* 수정/저장 버튼 (PC: auto, 모바일: 10%) */}
    <div className="w-auto mt-auto md:self-end mb-8 md:mb-3 mr-3 flex-shrink-0">
      {editing ? (
        <button
          className="w-full md:w-[90px] h-[38px] md:h-[40px] px-4 text-sm text-white bg-[#6378EB] rounded-md font-medium select-none font-[NeoDunggeunmo]"
          onClick={() => save()}
        >
          {saving ? "저장 중…" : "저장하기"}
        </button>
      ) : (
        <button
          className="w-full md:w-[90px] h-[38px] md:h-[40px] px-4 text-sm text-white bg-[#6378EB] rounded-md font-medium select-none font-[NeoDunggeunmo]"
          onClick={toggleEditing}
        >
          수정하기
        </button>
      )}
    </div>
  </div>



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
