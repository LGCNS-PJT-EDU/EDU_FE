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
    const res = await api.get<ApiResp<PageableData<User>>>('/api/admin/users?' + params.toString());
    return res.data.data;
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
  subNm?: string;
}

export const fetchSubjectList = async (request: SubjectReq): Promise<PageableData<Subject>> => {
  //   const res = await api.post<ApiResp<PageableData<Subject>>>('/api/subjects', request);
  //   return res.data.data;
  return {
    content: Array.from({ length: 10 }, (_, index) => ({
      id: `${index + 1}`,
      subId: index + 1,
      subNm: `과목${index + 1}`,
      subType: index % 2 === 0 ? 'FE' : 'BE',
      subEssential: index % 2 === 0 ? 'Y' : 'N',
      baseSubOrder: index + 1,
      assignmentCount: index + 1,
    })),
    pageable: {
      pageNumber: 0,
      pageSize: 10,
    },
    totalPages: 3,
    totalElements: 10,
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
  contentTitle?: string;
  contentType?: string;
}

export const fetchContentList = async (request: ContentReq): Promise<PageableData<Content>> => {
  //   const res = await api.post<ApiResp<PageableData<Content>>>('/api/contents', request);
  //   return res.data.data;
  return {
    content: Array.from({ length: 10 }, (_, index) => ({
      totalContentId: index + 1,
      contentTitle: `컨텐츠 제목 ${index + 1}`,
      contentUrl: `https://example.com/content/${index + 1}`,
      contentType: index % 3 === 0 ? '동영상' : index % 3 === 1 ? '문서' : '퀴즈',
      contentPlatform: index % 2 === 0 ? '유튜브' : '인프런',
      contentDuration: `${Math.floor(Math.random() * 60) + 30}분`,
      contentLevel: index % 3 === 0 ? '초급' : index % 3 === 1 ? '중급' : '고급',
      contentPrice: `${(index + 1) * 10000}원`,
      subId: Math.floor(index / 3) + 1, // 3개 컨텐츠마다 다른 과목 ID 할당
    })),
    pageable: {
      pageNumber: 0,
      pageSize: 10,
    },
    totalPages: 3,
    totalElements: 10,
  };
};

export interface Question {
  questionId: number;
  question: string;
  questionType: string;
}

export interface QuestionReq extends PageableReq {
  question?: string;
  questionType?: string;
}

export const fetchQuestionList = async (request: QuestionReq): Promise<PageableData<Question>> => {
  window.location.replace('/admin/not-authorized');
  //   const res = await api.post<ApiResp<PageableData<Question>>>('/api/questions', request);
  //   return res.data.data;
  return {
    content: Array.from({ length: 10 }, (_, index) => ({
      questionId: index + 1,
      question: `질문 ${index + 1}`,
      questionType: index % 2 === 0 ? '객관식' : '주관식',
    })),
    pageable: {
      pageNumber: 0,
      pageSize: 10,
    },
    totalPages: 3,
    totalElements: 10,
  };
};
