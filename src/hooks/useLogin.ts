import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authGlobal';

export default function useLogin() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.setLogin);

  /* async + Promise<void> */
  return useCallback<(token: string) => Promise<void>>(
    async (token) => {
      setLogin(token);
      alert('로그인 성공!');
      navigate('/roadmap', { replace: true });
    },
    [setLogin, navigate]
  );
}
