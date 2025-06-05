import { useQuery } from '@tanstack/react-query';
import { fetchDefaultRoadmap } from '@/api/roadmapService';

export const useDefaultRoadmapQuery = (type: 'FE' | 'BE') =>
  useQuery({
    queryKey: ['defaultRoadmap', type],
    queryFn : () => fetchDefaultRoadmap(type),
    staleTime: 1000 * 60 * 5,
  });
