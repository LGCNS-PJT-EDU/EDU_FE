import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

export interface Chapter {
  chapterName: string;
  chapterOrder: number;
}

interface ApiRecommendContent {
  contentId: number;
  subjectId: number;
  title: string;
  url: string;
  type: string;
  platform: string;
  duaration: string;
  price: string;
  isAiRecommendation: true;
  comment: string;
}

export interface Video {
  title: string;
  url: string;
}

export interface SubjectDetail {
  subjectId: number;
  overview: string;
  chapters: Chapter[];
  preSubmitCount: number;
  postSubmitCount: number;
  recommendContents?: ApiRecommendContent[];
}

interface ApiSubjectResponse {
  subject_name: string;
  subject_overview: string;
  chapters: Chapter[];
  preSubmitCount: number;
  postSubmitCount: number;
  recommendContents: ApiRecommendContent[];
}

async function fetchSubjectDetail(subjectId: number): Promise<SubjectDetail> {
  const response = await api.get<{ stateCode: number; message: string; data: ApiSubjectResponse }>(
    '/api/roadmap/subject',
    {
      params: { subjectId },
    }
  );

  const data = response.data.data; 

  return {
    subjectId,
    overview: data.subject_overview,
    chapters: data.chapters,
    preSubmitCount: data.preSubmitCount,
    postSubmitCount: data.postSubmitCount,
    recommendContents: data.recommendContents ?? [],
  }

}

export function useSubjectDetail(subjectId: number) {
  return useQuery({
    queryKey: ['subjectDetail', subjectId],
    queryFn: () => fetchSubjectDetail(subjectId),
    enabled: !!subjectId,
  })
}
