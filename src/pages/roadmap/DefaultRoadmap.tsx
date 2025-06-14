import { useParams, Navigate } from 'react-router-dom';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useDefaultRoadmapQuery } from '@/hooks/useDefaultRoadmapQuery';
import RoadmapTemplate from './RoadmapTemplate';

export default function DefaultRoadmap() {
  const { type } = useParams(); // ':type' → 'FE' | 'BE'
  const roadmapType = type === 'FE' ? 'FE' : type === 'BE' ? 'BE' : null;
  if (!roadmapType) return <Navigate to="/" replace />;

  const { data, isLoading, isError } = useDefaultRoadmapQuery(roadmapType);
  const setInitial = useRoadmapStore((s) => s.setInitial);

  if (data?.subjects) setInitial(data.subjects);

  if (isLoading) return <p className="text-center mt-10">불러오는 중…</p>;
  if (isError || !data) return <p className="text-center mt-10">로드맵 로딩 실패</p>;

  return (
    <section className="relative py-10">
      <h1 className="text-2xl font-bold text-center mb-8">
        {type === 'FE' ? '프론트엔드' : '백엔드'} 기본 로드맵
      </h1>
      <RoadmapTemplate />
    </section>
  );
}
