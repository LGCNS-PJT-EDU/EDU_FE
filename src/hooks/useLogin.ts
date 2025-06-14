import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authGlobal';
import { useSnackbarStore } from '@/store/useSnackbarStore';

export default function useLogin() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.setLogin);
  const { showSnackbar } = useSnackbarStore();

  /* async + Promise<void> */
  return useCallback<(token: string) => Promise<void>>(
    async (token) => {
      setLogin(token);
      showSnackbar('로그인 성공!');
      navigate('/roadmap', { replace: true });
    },
    [setLogin, navigate]
  );
}
