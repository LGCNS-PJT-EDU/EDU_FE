import api from "./axios";

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

export interface PageableData<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

export type LoginType = 'LOCAL' | 'KAKAO' | 'NAVER' | 'GOOGLE';
export type PriceLevel =
  | 'FREE'
  | 'UNDER_50K'
  | 'BETWEEN_50K_100K'
  | 'BETWEEN_100K_200K'
  | 'BETWEEN_200K_500K'
  | 'OVER_500K';
export type StudyTime = 'HOUR_1' | 'HOUR_3' | 'HOUR_5' | 'HOUR_10' | 'OVER_10';
export interface User {
  id: string;
  userId: number;
  email: string;
  nickname: string;
  loginType: LoginType;
  lectureAmount: StudyTime;
  priceLevel: PriceLevel;
  isActive: boolean;
  likeBooks: boolean;
  PrivacyStatus: boolean;
}

export interface PageableReq {
  page: number;
  size: number;
}

export interface UserReq extends PageableReq {
  nickname?: string;
  email?: string;
}

export const fetchUserList = async (request: UserReq): Promise<PageableData<User>> => {
  const params = new URLSearchParams();
  params.append('page', request.page.toString());
  params.append('size', request.size.toString());
  if (request.nickname) {
    params.append('nickname', request.nickname.trim());
  }
  if (request.email) {
    params.append('email', request.email.trim());
  }
  const res = await api.get<ApiResp<{ content: User[]; page: { size: number; number: number; totalElements: number; totalPages: number } }>>(
    '/api/admin/users?' + params.toString(),
  );
  const { content, page } = res.data.data;
  return {
    content,
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
};

export type SubType = 'FE' | 'BE';
export type SubEssential = 'Y' | 'N';
export interface Subject {
  id: string;
  subId: number;
  subNm: string;
  subType: SubType;
  subEssential: SubEssential;
  baseSubOrder: number;
  assignmentCount: number;
}

export interface SubjectReq extends PageableReq {
  keyword?: string;
}

export const fetchSubjectList = async (
  request: SubjectReq,
): Promise<PageableData<Subject>> => {
  const params = new URLSearchParams();
  params.append('page', request.page.toString());
  params.append('size', request.size.toString());
  params.append('sortBy', 'id');
  params.append('keyword', request.keyword?.trim() ?? '');
  const res = await api.get<ApiResp<{ content: Subject[]; page: { size: number; number: number; totalElements: number; totalPages: number } }>>(
    '/api/admin/subjects?' + params.toString(),
  );
  const { content, page } = res.data.data;
  return {
        content,
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
};

export interface Content {
  totalContentId: number;
  contentTitle: string;
  contentUrl: string;
  contentType: string;
  contentPlatform: string;
  contentDuration: string;
  contentLevel: string;
  contentPrice: string;
  subId: number;
}

export interface ContentReq extends PageableReq {
  title?: string;
  subName?: string;
}

export const fetchContentList = async (
  request: ContentReq,
): Promise<PageableData<Content>> => {
  const params = new URLSearchParams();
  params.append('page', request.page.toString());
  params.append('size', request.size.toString());
  params.append('sortBy', 'id');
  if (request.title) params.append('title', request.title.trim());
  if (request.subName) params.append('subName', request.subName.trim());
  const res = await api.get<ApiResp<{ content: Content[]; page: { size: number; number: number; totalElements: number; totalPages: number } }>>(
    '/api/admin/contents?' + params.toString(),
  );
  const { content, page } = res.data.data;
  return {
    content,
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
};

export interface Exam {
  id: number;
  examContent: string;
  subName: string;
}

export interface ExamReq extends PageableReq {
  examContent?: string;
  subName?: string;
}

export const fetchExamList = async (
  request: ExamReq,
): Promise<PageableData<Exam>> => {
  const params = new URLSearchParams();
  params.append("page", request.page.toString());
  params.append("size", request.size.toString());
  params.append("sortBy", "id");
  if (request.examContent) params.append("examContent", request.examContent.trim());
  if (request.subName) params.append("subName", request.subName.trim());

  const res = await api.get<
    ApiResp<{
      content: any[];
      page: { size: number; number: number; totalElements: number; totalPages: number };
    }>
  >("/api/admin/exams?" + params.toString());

  const { content, page } = res.data.data;

  return {
    content: content.map((item: any) => ({
      ...item,
      id: item.examId,
    })),
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements
  };
};

export interface FailLogReq extends PageableReq {
  nickname?: string;
  email?: string;
  errorCode?: string;
  sort?: string;
}

export interface FeedbackFailLog {
  id: number;
  email: string;
  nickname: string;
  subjectId: number;
  type: string;
  nth: number;
  errorCode: string;
  errorMessage: string;
  retry: boolean;
  createdDt: string;
}

export interface RecommendFailLog {
  id: number;
  email: string;
  nickname: string;
  subjectId: number;
  errorCode: string;
  errorMessage: string;
  retry: boolean;
  createdDt: string;
}

export const fetchFeedbackFailLogs = async (
  request: FailLogReq
): Promise<PageableData<FeedbackFailLog>> => {
  const res = await api.get<ApiResp<{
    content: FeedbackFailLog[];
    page: { size: number; number: number; totalElements: number; totalPages: number };
  }>>('/api/admin/fail-logs/feedback', { params: request });

  const { content, page } = res.data.data;
  return {
    content,
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
};

export const fetchRecommendFailLogs = async (
  request: FailLogReq
): Promise<PageableData<RecommendFailLog>> => {
  const res = await api.get<ApiResp<{
    content: RecommendFailLog[];
    page: { size: number; number: number; totalElements: number; totalPages: number };
  }>>('/api/admin/fail-logs/recommend', { params: request });

  const { content, page } = res.data.data;
  return {
    content,
    pageable: { pageNumber: page.number, pageSize: page.size },
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
};

export const retryFeedbackFailLog = async (id: number): Promise<void> => {
  await api.post<ApiResp<null>>(`/api/admin/fail-logs/feedback/${id}/retry`);
};

export const retryRecommendFailLog = async (id: number): Promise<void> => {
  await api.post<ApiResp<null>>(`/api/admin/fail-logs/recommend/${id}/retry`);
};

export interface DailyCount {
  date: string;
  count: number;
}

export const fetchFeedbackDailyCounts = async (): Promise<DailyCount[]> => {
  const res = await api.get<ApiResp<DailyCount[]>>(
    '/api/admin/fail-logs/feedback/daily-counts',
  );
  return res.data.data ?? [];
};

export const fetchRecommendDailyCounts = async (): Promise<DailyCount[]> => {
  const res = await api.get<ApiResp<DailyCount[]>>(
    '/api/admin/fail-logs/recommend/daily-counts',
  );
  return res.data.data ?? [];
};