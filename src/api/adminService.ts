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

export interface User{
    "userId": number;
    "email": string;
    "nickname": string;
    "loginType": string;
    "lectureAmount": string;
    "priceLevel": string;
    "isActive": boolean;
    "likeBooks": boolean;
    "PrivacyStatus": boolean;
}

export interface PageableReq{
    pageSize: number;
    pageIndex: number;
}

export const fetchUserList = async (request: PageableReq) : Promise<PageableData<User>> => {
//   const res = await api.post<ApiResp<PageableData<User>>>('/api/interview/answers', request);
//   return res.data.data;
    return {
        content: Array.from({length: 10}, (_, index) => ({
                userId: index + 1,
                email: `user${index + 1}@user.com`,
                nickname: `user${index + 1}`,
                loginType: 'LOCAL',
                lectureAmount: '10',
                priceLevel: '10',
                isActive: true,
                likeBooks: false,
                PrivacyStatus: false,
            })),
        pageable: {
            pageNumber: 0,
            pageSize: 10,
        },
        totalPages: 3,
    }
};