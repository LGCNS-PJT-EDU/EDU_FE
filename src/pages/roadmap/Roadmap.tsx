import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '@/store/roadmapStore';
import RoadmapCanvas from './RoadmapCanvas';
import SubjectModal from '@/components/modal/Subject';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { isLoggedIn } from '@/store/authGlobal';
import { Check } from 'lucide-react';

export default function Roadmap() {
  const setInitial = useRoadmapStore((s) => s.setInitial);
  const toggleEditing = useRoadmapStore((s) => s.toggleEditing);
  const editing = useRoadmapStore((s) => s.editing);
  const selected = useRoadmapStore((s) => s.selected);
  const modalOpen = useRoadmapStore((s) => s.modalOpen);
  const closeModal = useRoadmapStore((s) => s.closeModal);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const roadmap = state ?? null;

    if (!roadmap || !roadmap.subjects) {
      alert('로드맵 정보가 없습니다. 진단을 먼저 진행해 주세요.');
      navigate('/diagnosis', { replace: true });
    } else {
      setInitial(roadmap.subjects);
    }
  }, [state, navigate, setInitial]);

  useEffect(() => {
    if (modalOpen && !isLoggedIn()) {
      closeModal();
      setLoginModalOpen(true);
    }
  }, [modalOpen, closeModal]);

  return (
    <section className="relative">
      {/* 헤더 */}
      <header className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <h1 className="text-2xl font-bold drop-shadow">맞춤 로드맵</h1>

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

      {/* 과목 상세 모달 (로그인 상태일 때만 열림) */}
      {modalOpen && selected && (
        <SubjectModal
          subject={{ subjectId: selected.id, subjectName: selected.label }}
          onClose={closeModal}
        />
      )}

      {/* 로그인 하러가기 모달 */}
      {loginModalOpen && (
        <ConfirmModal
          onClose={() => setLoginModalOpen(false)}
          title="로그인이 필요합니다!"
          message={`개인화 로드맵 저장 및 과목 상세 조회는\n로그인 후 이용하실 수 있어요.`}
          confirmText="로그인 하러가기"
          onConfirm={() => navigate('/login')}
        />
      )}
    </section>
  );
}
