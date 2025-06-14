import { FeedbackItem } from '@/hooks/useReport';

export const splitPrePost = (list: FeedbackItem[]) => {
  const valid = list.filter(item => item?.date); // date 존재 여부 체크
  if (!valid.length) return { pre: null, post: null };

  const sorted = [...valid].sort(
    (a, b) => +new Date(a.date) - +new Date(b.date)
  );

  return { pre: sorted[0], post: sorted[sorted.length - 1] };
};
