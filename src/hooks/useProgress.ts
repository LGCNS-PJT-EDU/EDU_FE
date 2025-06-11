import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

interface ProgressData {
  nickname: string;
  roadmapName: string;
  percent: number;
  subCnt: number;
  completeCnt: number;
}

interface ProgressResponse {
  stateCode: number;
  message: string;
  data: ProgressData;
}

const fetchProgress = async (): Promise<ProgressData> => {
  const res = await api.get<ProgressResponse>('/api/roadmap/progress');
  return res.data.data;
};

export const useProgress = () => {
  return useQuery<ProgressData>({
    queryKey: ['roadmapProgress'],
    queryFn: fetchProgress,
  });
};
