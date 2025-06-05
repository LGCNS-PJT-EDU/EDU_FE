import { useMutation } from "@tanstack/react-query";
import axios from "@/api/axios";

interface LoginParams {
    email : string;
    password: string;
}

export const useLoginMutation = () => 
    useMutation<string, Error, LoginParams>({
        mutationFn: async ({email, password}: LoginParams):Promise<string> =>{
        const res = await axios.post('api/user/signin', {email,password});
        const token = res.headers['authorization']?.split(' ')[1];
        if (!token) throw new Error('토큰이 없습니다');
        return token;
        }
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
  