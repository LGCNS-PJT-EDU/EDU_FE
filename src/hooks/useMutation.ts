import { useMutation } from "@tanstack/react-query";
import axios from "@/api/axios";
import { useAuthStore } from "@/store/authGlobal";

interface LoginParams {
    email : string;
    password: string;
}

interface LoginResponse {
  accessToken   : string;
  privacyStatus : boolean;
}

export const useLoginMutation = () =>
  useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: async ({ email, password }): Promise<LoginResponse> => {
      const res = await axios.post('/api/user/signin', { email, password });

      // (1) 헤더 백업용 토큰, (2) 본문 data 안 토큰 ― 둘 다 고려
      const accessToken   = res.data?.data?.accessToken
                         ?? res.headers['authorization']?.split(' ')[1];
      const privacyStatus = res.data?.data?.privacyStatus;

      if (!accessToken) throw new Error('토큰이 없습니다');
      return { accessToken, privacyStatus };
    },
    /** 성공 시 자동으로 zustand store 업데이트 */
    onSuccess: ({ accessToken, privacyStatus }) => {
      useAuthStore.getState().setLogin(accessToken, privacyStatus);
    },
  });

interface SignupParams {
    email: string;
    nickname: string;
    password: string;
}

export const useSignupMutation = () => 
    useMutation<void, Error, SignupParams> ({
        mutationFn: async ({email, nickname, password}) => {
            const res = await axios.post("/api/user/signup",{
                email,
                nickname,
                password,
            });
            if (![200,201].includes(res.status)){
                throw new Error("회원가입 실패");
            }
        }
    })

export const useCheckEmailMutation = () =>
  useMutation<boolean, Error, string>({
    mutationFn: async (email) => {
      const res = await axios.get('/api/user/check-email', {
        params: { email },
      });
      console.log("중복 여부 응답값:", res.data);
      return !res.data.data; 
    },
  });
  