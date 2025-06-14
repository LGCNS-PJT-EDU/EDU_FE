import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authGlobal';
import { useSnackbarStore } from '@/store/useSnackbarStore';

export default function useLogout() {
  const navigate = useNavigate();
  const setLogout = useAuthStore((s) => s.setLogout);
  const { showSnackbar } = useSnackbarStore();

  return useCallback(async () => {
    try {
      await api.delete<void>('/api/user/signout');
    } catch (e) {
      console.warn('서버 로그아웃 요청 실패(무시)', e);
    }
    setLogout();
    showSnackbar('로그아웃 되었습니다') 
    navigate('/', { replace: true });
  }, [navigate, setLogout]);
}
 