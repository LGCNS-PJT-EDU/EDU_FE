import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setLogin: (token: string) => void;
  setLogout: () => void;
}
/* zustand 상태 훅 생성
AuthState 타입을 제네릭으로 넣어서 상태 구조를 안전하게 정의 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setLogin: (token) => {
        set({ accessToken: token });
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      },
      setLogout: () => {
        set({ accessToken: null });
        delete axios.defaults.headers.common.Authorization;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/* 전역 util – 컴포넌트 밖에서 토큰을 읽을 때 사용 */
export const getAccessToken = () => useAuthStore.getState().accessToken;

/* 로그인 여부 one-liner */
export function useIsLoggedIn() {
  return useAuthStore(state => Boolean(state.accessToken));
}
