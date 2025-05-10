import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authGlobal';

export default function useLogout() {
  const navigate = useNavigate();
  const setLogout = useAuthStore((s) => s.setLogout);

  return useCallback(async () => {
    try {
      await api.delete<void>('/api/user/signout');
    } catch (e) {
      console.warn('서버 로그아웃 요청 실패(무시)', e);
    }
    setLogout();
    navigate('/', { replace: true });
  }, [navigate, setLogout]);
}
