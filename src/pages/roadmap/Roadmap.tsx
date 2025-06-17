import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '@/store/roadmapStore';
import RoadmapTemplate from './RoadmapTemplate';
import SubjectModal from '@/components/modal/Subject';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { Button } from '@/components/ui/button';
import { useIsLoggedIn } from '@/store/authGlobal';
import { Check } from 'lucide-react';
import { RoadmapPayload } from '@/api/diagnosisService';
import { useGuestUuidStore } from '@/store/useGuestUuidStore';
import { useLoadingStore } from '@/store/useLoadingStore';
import useRoadmapEdit from '@/hooks/useRoadmapEdit';
import { useRoadmapQuery } from '@/hooks/useRoadmapQuery';
import axios from 'axios';
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';
// --- 수정: fetchRoadmap import (취소시 사용) ---
import { fetchRoadmap } from '@/api/roadmapService';

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
  const {
    data: userRoadmap,
    isLoading: loadingUser,
    isError,
    error,
  } = useRoadmapQuery({
    enabled: !Boolean(roadmapFromState),
    refetchOnMount: 'always',
    skipCache: true,
  });

  /* Zustand 상태 */
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const { save, saving } = useRoadmapEdit();
  const setInitial = useRoadmapStore((s) => s.setInitial); // --- 수정: setInitial 사용 (취소용) ---
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);
  const nodes = useRoadmapStore((s) => s.nodes);

  /* 로컬 모달 상태 */
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // --- 수정: 취소 로딩 상태 ---
  const [rollbackLoading, setRollbackLoading] = useState(false);

  /* 진입 시 로드맵 주입 */
  console.log('[Roadmap.tsx] ▶️ fromState:', roadmapFromState, '  /  userRoadmap:', userRoadmap);
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
    const cur = roadmap.subjects.find((s) => s.subjectId === roadmap.userLocationSubjectId);
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
    startLoading('로드맵 불러오는 중…');
    return () => stopLoading();
  }, [loadingUser, startLoading, stopLoading]);

  /* 라우트 이동 시(언마운트 포함) 수정모드 자동 해제 */
  useEffect(() => {
    return () => {
      if (useRoadmapStore.getState().editing) {
        useRoadmapStore.getState().toggleEditing();
      }
    };
  }, []);

  /* 수정: 취소 버튼 핸들러 */
  const handleCancel = async () => {
    setRollbackLoading(true);
    try {
      const latest = await fetchRoadmap(uuid ?? 'takeit');
      setInitial(latest.subjects);
      if (editing) toggleEditing();
    } finally {
      setRollbackLoading(false);
    }
  };

  if (loadingUser && !roadmap) {
    return <div style={{ height: '100vh' }} />;
  }

  const is404Error = isError && axios.isAxiosError(error) && error.response?.status === 404;

  if (is404Error) {
    return (
      <ConfirmModal
        title="로드맵이 없습니다"
        message="진단을 먼저 해주세요!"
        confirmText="진단하러 가기"
        onClose={() => navigate('/', { replace: true })}
        onConfirm={() => navigate('/diagnosis', { replace: true })}
      />
    );
  }

  if (!roadmap) return null;

  return (
    <section
      className="font-[pretendard] mx-auto"
      style={{
        minHeight: 'calc(100vh - 72px)',
        height: 'calc(100vh - 72px)',
        overflow: 'hidden',
      }}
    >
      <div className="flex flex-col h-full">
        {/* 진척도 바 + 수정 토글 */}
        <div
          className="
            w-full
            max-w-[718px]
            mx-auto
            flex flex-row justify-between items-center gap-4
            pt-[32px] pb-[16px] md:pt-[40px] md:pb-[24px]
          "
        >
          {/* 진척도 바 (PC: auto, 모바일: 60%) */}
          <div className="w-[60%] ml-4 mb-2 md:mb-5 flex flex-col justify-center">
            <div className="flex items-center mb-2 md:mb-3">
              <img src={rabbit} alt="rabbit" className="w-7 h-7 md:w-[30px] md:h-[30px] mr-2" />
              <p className="text-[18px] md:text-[20px] font-bold break-keep">
                {roadmap.roadmapName ?? '로드맵'}
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
          {/* 수정/저장/취소 버튼 (PC: auto, 모바일: 10%) */}
          <div className="w-auto mt-auto md:self-end mb-8 md:mb-3 mr-3 flex-shrink-0 flex gap-2">
            {editing ? (
              <>
                <button
                  className="w-full md:w-[90px] h-[38px] md:h-[40px] px-4 text-sm text-white bg-gray-400 rounded-md font-medium select-none font-[NeoDunggeunmo]"
                  onClick={handleCancel}
                  disabled={rollbackLoading}
                >
                  취소
                </button>
                <button
                  className="w-full md:w-[90px] h-[38px] md:h-[40px] px-4 text-sm text-white bg-[#6378EB] rounded-md font-medium select-none font-[NeoDunggeunmo]"
                  onClick={() => save()}
                  disabled={saving}
                >
                  {saving ? '저장 중…' : '완료'}
                </button>
                {/* 수정: 취소 버튼 추가 */}
              </>
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
        {/* 로드맵 그래프 (스크롤 영역) */}
        <div className="flex-1 min-h-0 md:ml-5 mb-10">
          <div
            className="h-full custom-scroll"
            style={{
              height: '100%',
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <RoadmapTemplate />
          </div>
        </div>
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
            onConfirm={() => navigate('/login')}
          />
        )}
      </div>
    </section>
  );
}
