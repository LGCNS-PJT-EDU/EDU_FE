import { FeedbackItem } from '@/hooks/useReport';

/** 사전(가장 오래된) / 사후(가장 최신) 분리 */
export const splitPrePost = (list: FeedbackItem[]) => {
  if (!list.length) return { pre: null, post: null };
  const sorted = [...list].sort(
    (a, b) => +new Date(a.info.date) - +new Date(b.info.date)
  );
  return { pre: sorted[0], post: sorted[sorted.length - 1] };
};
