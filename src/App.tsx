// src/App.tsx
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import router from './route/Router';
import LoadingOverlay from './components/common/LoadingOverlay';
import Snackbar from './components/common/Snackbar';
import ConfirmModal from './components/modal/ConfirmModal';

export const queryClient = new QueryClient();

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const openModal = () => setSessionExpired(true);
    window.addEventListener('sessionExpired', openModal);
    return () => window.removeEventListener('sessionExpired', openModal);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <LoadingOverlay />
      <Snackbar />

      {/* 전역 세션 만료 모달 */}
      {sessionExpired && (
        <ConfirmModal
          title="로그인 시간이 만료되었습니다"
          message="보안을 위해 다시 로그인해 주세요."
          confirmText="로그인 하러가기"
          onClose={() => setSessionExpired(false)}
          onConfirm={() => {
            setSessionExpired(false);
            router.navigate('/login', { replace: true });
          }}
        />
      )}
    </QueryClientProvider>
  );
}
