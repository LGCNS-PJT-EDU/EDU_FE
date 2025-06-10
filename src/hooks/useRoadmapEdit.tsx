import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoadmap } from '@/api/roadmapService';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useSnackbarStore } from '@/store/useSnackbarStore';
import { useGuestUuidStore } from '@/store/useGuestUuidStore';

/** 로드맵 저장 훅 */
export default function useRoadmapEdit() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const setEditing = useRoadmapStore((s) => s.setEditing);
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);
  const uuid = useGuestUuidStore((s) => s.uuid);
  const queryClient = useQueryClient();

  // React-Query 객체형 옵션 사용
  const { mutate: save, status } = useMutation({
    mutationFn: () =>
      updateRoadmap(
        nodes.map((n, idx) => ({
          subjectId: n.id,
          subjectName: n.label,
          subjectOrder: idx + 1,
        })),
      ),
    onSuccess: () => {
      showSnackbar('로드맵이 저장되었습니다!', 'success');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["roadmap", uuid] });
    },
    onError: () => {
      showSnackbar('저장 실패 · 다시 시도해 주세요', 'error');
    },
  });

  // 상태 값을 기반으로 저장 중 여부 계산
  const saving = status === 'pending';

  return { save, saving };
}