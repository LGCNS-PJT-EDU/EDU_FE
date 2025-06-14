import { useQuery } from "@tanstack/react-query";
import axios from '@/api/axios';

export interface FeedbackItem {
  userId: number;
  date: string;
  subject: string;
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

export const fetchUserFeedback = async (subjectId: number) => {
  const res = await axios.get<ApiResponse<FeedbackItem[]>>('/api/feedback/retrieve', {
    params: { subjectId },
  });
  console.log("subjectId 확인:", subjectId);
  console.log("응답 확인", res.data); // 확인용
  return res.data?.data ?? [];
};

export const useFeedback = (subjectId?: number) =>
  useQuery<FeedbackItem[]>({
    queryKey: ['feedback', subjectId],
    queryFn: () => fetchUserFeedback(subjectId!),
    enabled: subjectId !== undefined,
  });