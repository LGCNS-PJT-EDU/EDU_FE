import { useQuery } from "@tanstack/react-query";
import axios from '@/api/axios';

export interface FeedbackItem {
  info: {
    userId: string;
    date: string;
    subject: string;
  };
  scores: Record<string, number>;     
  feedback: {
    strength: Record<string, string>;
    weakness: Record<string, string>;
    final: string;
  }
}
interface ApiResponse<T> {
  stateCode: number;
  message: string;
  data: T;
}
export const useFeedback = () =>
  useQuery<FeedbackItem[]>({            
    queryKey: ['feedback'],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<FeedbackItem[]>>('/api/feedback/retrieve');
      return res.data.data;
    }
  });

