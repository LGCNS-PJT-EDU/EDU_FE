import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

interface ProgressResponse {
  nickname: string;
  percent: number;
}

const fetchProgress = async (): Promise<ProgressResponse> => {
    const {data} = await axios.get('/api/roadmap/progress');
    return data
};

export const useProgress = () => {
    return useQuery<ProgressResponse>({
        queryKey: ['roadmapProgress'],
        queryFn: fetchProgress,
    });
}