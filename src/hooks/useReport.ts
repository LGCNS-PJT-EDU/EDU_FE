// useReport.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/* 타입 */
export interface FeedbackItem {
  userId: number;
  date: string;
  subject: string;
  scores: Record<string, number>;
  feedback: {
    strength: Record<string, string>;
    weakness: Record<string, string>;
    final: string;
  };
}
interface ApiResponse<T> {
  stateCode: number;
  message: string;
  data: T;
}

/* API 호출 */
export const fetchUserFeedback = async (subjectId: number) => {
  const res = await api.get<ApiResponse<FeedbackItem[]>>('/api/feedback/retrieve', {
    params: { subjectId },
  });

  const data = res.data?.data ?? [];

  /* 데이터가 비어 있으면 의도적으로 에러 throw → react-query 의 retry 대상이 됨 */
  if (data.length === 0) {
    const err = new Error('EMPTY_DATA');          // 에러 식별용
    // @ts-ignore
    err.code = 'EMPTY_DATA';
    throw err;
  }

  return data;
};

/* react-query 훅 */
export const useFeedback = (subjectId?: number) =>
  useQuery<FeedbackItem[]>({
    queryKey : ['feedback', subjectId],
    queryFn  : () => fetchUserFeedback(subjectId!),   // subjectId 는 Report 컴포넌트에서 항상 number
    enabled  : subjectId !== undefined,

    /* EMPTY_DATA 5초 간격으로 4회 재시도(총 20초) */
    retry     : (failureCount, error: any) =>
      error.code === 'EMPTY_DATA' && failureCount < 4,
    retryDelay: 5000,
    /* 사용자가 다른 탭 눌렀다가 돌아와도 다시 20초 돌지 않게 */
    refetchOnWindowFocus: false,
  });
