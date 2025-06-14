import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export interface InterviewItem {
  reply_id: number;
  interviewContent: string;
  subId: number;
  nth: number;
  userReply: string;
  aiFeedback: string;
  interviewAnswer: string;
}

export const useInterviewHistory = () => {
  return useQuery<InterviewItem[]>({
    queryKey: ['interviewHistory'],
    queryFn: async () => {
      const res = await api.get<{ data: InterviewItem[] }>('/api/interview/history');
      return res.data.data;
    },
  });
};
