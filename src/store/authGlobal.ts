import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  privacyStatus: boolean;
  setLogin: (token: string, privacyStatus?: boolean) => void;
  setLogout: () => void;
  setPrivacyStatus: (status: boolean) => void;
}
/* zustand 상태 훅 생성
AuthState 타입을 제네릭으로 넣어서 상태 구조를 안전하게 정의 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      privacyStatus: false, // 기본값
      /* 토큰 + 동의 여부를 한 번에 저장 */
      setLogin: (token: string, privacyStatus: boolean = false) => {
        set({ accessToken: token, privacyStatus: privacyStatus });
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      },
      setLogout: () => {
        set({ accessToken: null, privacyStatus: false });
        delete axios.defaults.headers.common.Authorization;
      },
      setPrivacyStatus: (status) => set({ privacyStatus: status }),
    }),
    {
      name: 'auth-storage', // 기존 키 그대로
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/* 전역 util – 컴포넌트 밖에서 토큰을 읽을 때 사용 */
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getPrivacyStatus = () => useAuthStore.getState().privacyStatus;

/* 로그인 여부 one-liner */
export function useIsLoggedIn() {
  return useAuthStore((state) => Boolean(state.accessToken));
}
