import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/Main';
import About from '@/pages/About';
import Login from '@/pages/login/Login';
import MyPage from '@/pages/MyPage';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Layout from '@/components/layout/Layouts';
import Roadmap from '@/pages/roadmap/Roadmap';
import SignupRefactored from '@/pages/sign/SignupRefactored';
import Diagnosis from '@/pages/diagnosis/Diagnosis';
import FullLayouts from '@/components/layout/FullLayouts';
import Report from '@/pages/Report';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FullLayouts />,
    children: [
      { path: '', element: <Main /> },
      { path: 'login', element: <Login /> },
      { path: 'signup-refactored', element: <SignupRefactored /> },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'about', element: <About /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'report', element: <Report /> },
      { path: 'login/oauth2/code/:provider', element: <OAuthCallback /> },
      { path: 'roadmap', element: <Roadmap /> },
      { path: 'diagnosis', element: <Diagnosis /> },
    ],
  },
]);

export default router;
