import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useDefaultRoadmapQuery } from '@/hooks/useDefaultRoadmapQuery';
import RoadmapTemplate from './RoadmapTemplate';
import { useCallback, useEffect, useState } from 'react';
import { useLoadingStore } from '@/store/useLoadingStore';
import { useSnackbarStore } from '@/store/useSnackbarStore';
import { useIsLoggedIn } from '@/store/authGlobal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { assignDefaultRoadmap, ApiResp } from '@/api/roadmapService';

export default function DefaultRoadmap() {
  const { type } = useParams();           // ':type' → 'FE' | 'BE'
  const roadmapType = type === 'FE' ? 'FE' : type === 'BE' ? 'BE' : null;
  if (!roadmapType) return <Navigate to="/" replace />;

  const { data, isLoading, isError } = useDefaultRoadmapQuery(roadmapType);
  const setInitial = useRoadmapStore((s) => s.setInitial);

  useEffect(() => {
    if (data?.subjects) setInitial(data.subjects);
  }, [data, setInitial]);

  const isLoggedIn            = useIsLoggedIn();
  const navigate              = useNavigate();
  const { showSnackbar }      = useSnackbarStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const queryClient = useQueryClient();      

  const [loginModalOpen,  setLoginModalOpen]  = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false); 

  const { mutate: assign, isPending, isSuccess } = useMutation<
    ApiResp<null>,
    Error,
    'FE' | 'BE'
  >({
    mutationFn: assignDefaultRoadmap,
    onSuccess: () => {
      showSnackbar('기본 로드맵이 성공적으로 할당되었습니다!');
      navigate('/roadmap');
    },
    onError: (e) => {
      showSnackbar('기본 로드맵 할당 실패');
    }
  });

  const handleChooseClick = useCallback(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setSelectModalOpen(true);
    }
  }, [isLoggedIn]);

  if (isLoading)  return <p className="text-center mt-10">불러오는 중…</p>;
  if (isError || !data)
    return <p className="text-center mt-10">로드맵 로딩 실패</p>;

  return (
    <section className="relative py-10">
      <h1 className="text-2xl font-bold text-center mb-8">
        {type === 'FE' ? '프론트엔드' : '백엔드'} 기본 로드맵
      </h1>

      <RoadmapTemplate />

      {/* 선택 버튼 */}
      <button
        className="block mx-auto mt-12 bg-primary-500 hover:bg-primary-600
                   text-white bg-[#6378EB] font-semibold py-3 px-6 rounded-lg"
        onClick={handleChooseClick}
      >
        이 로드맵 선택하기
      </button>

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

      {/* 로드맵 선택 확인 모달 */}
      {selectModalOpen && (
        <ConfirmModal
          onClose={() => setSelectModalOpen(false)}
          title="나의 로드맵으로 선택하시겠어요?"
          message="기존 로드맵이 있다면 학습 이력이 모두 삭제됩니다."
          confirmText="확인"
          onConfirm={() => {
            setSelectModalOpen(false);
            assign(roadmapType as 'FE' | 'BE');
          }}
        />
      )}
    </section>
  );
}