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

export const useFeedback = () =>
  useQuery<FeedbackItem[]>({            
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data } = await axios.get<FeedbackItem[]>('/api/feedback/retrieve');
      return data;
    }
  });

