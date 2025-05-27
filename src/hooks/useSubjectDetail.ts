import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

export interface Chapter {
  chapterName: string;
  chapterOrder: number;
}

interface ApiRecommendContent {
  contentName: string;
  url: string;
  contentType: string;
}

export interface Video {
  title: string;
  url: string;
}

export interface SubjectDetail {
  subjectId: number;
  overview: string;
  videos: Video[];
  chapters: Chapter[];
  preSubmitCount: number;
  postSubmitCount: number;
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
    videos: (data.recommendContents as ApiRecommendContent[]).map((item) => ({
      title: item.contentName,
      url: item.url,
    })),
    preSubmitCount: data.preSubmitCount,
    postSubmitCount: data.postSubmitCount,
  }

}

export function useSubjectDetail(subjectId: number) {
  return useQuery({
    queryKey: ['subjectDetail', subjectId],
    queryFn: () => fetchSubjectDetail(subjectId),
    enabled: !!subjectId,
  })
}
