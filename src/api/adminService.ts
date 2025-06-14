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

export const fetchUserList = async (request: PageableReq): Promise<PageableData<User>> => {
    const params = new URLSearchParams();
    params.append('page', request.page.toString());
    params.append('size', request.size.toString());
    const res = await api.get<ApiResp<PageableData<User>>>('/api/admin/users?' + params.toString());
    return res.data.data;
};

export interface Subject {
  id: string;
  subId: number;
  subNm: string;
  subType: string;
  subEssential: string;
  baseSubOrder: number;
  subOverview: string;
  trackId: number;
}

export const fetchSubjectList = async (request: PageableReq): Promise<PageableData<Subject>> => {
  //   const res = await api.post<ApiResp<PageableData<Subject>>>('/api/subjects', request);
  //   return res.data.data;
  return {
    content: Array.from({ length: 10 }, (_, index) => ({
      id: `${index + 1}`,
      subId: index + 1,
      subNm: `과목${index + 1}`,
      subType: index % 2 === 0 ? '필수' : '선택',
      subEssential: index % 2 === 0 ? 'Y' : 'N',
      baseSubOrder: index + 1,
      subOverview: `과목${index + 1}에 대한 개요 설명입니다.`,
      trackId: Math.floor(index / 3) + 1, // 3개 과목마다 다른 트랙 ID 할당
    })),
    pageable: {
      pageNumber: 0,
      pageSize: 10,
    },
    totalPages: 3,
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

export const fetchContentList = async (request: PageableReq): Promise<PageableData<Content>> => {
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
  };
};

export interface Question {
  questionId: number;
  question: string;
  questionType: string;
}

export const fetchQuestionList = async (request: PageableReq): Promise<PageableData<Question>> => {
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
  };
};
