import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

interface ProgressResponse {
  nickname: string;
  roadmapName: string;
  percent: number;
  subCnt: number;
  completeCnt: number;
}

interface ProgressResponse {
  stateCode: number;
  message: string;
  data: ProgressResponse;
}

const fetchProgress = async (): Promise<ProgressResponse> => {
  const res = await api.get<ProgressResponse>('/api/roadmap/progress');

  if (res.data.stateCode !== 1073741824) {
    throw new Error(`Error: ${res.data.message}`);
  }

  return res.data.data;
};

export const useProgress = () => {
  return useQuery<ProgressResponse>({
    queryKey: ['roadmapProgress'],
    queryFn: fetchProgress,
  });
};
