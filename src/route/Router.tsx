import { createBrowserRouter } from 'react-router-dom';
import Main from '@/pages/Main';
import About from '@/pages/about/About';
import Login from '@/pages/login/Login';
import MyPage from '@/pages/mypage/MyPage';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Layout from '@/components/layout/Layouts';
import Roadmap from '@/pages/roadmap/Roadmap';
import Signup from '@/pages/sign/Signup';
import Diagnosis from  '@/pages/test/DiagnosisPage';
import FullLayouts from '@/components/layout/FullLayouts';
import Report from '@/pages/report/Report';
import PretestPage from '@/pages/test/PretestPage';
import PosttestPage from '@/pages/test/PosttestPage';
import Solution from '@/pages/solution/Solution';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FullLayouts />,
    children: [
      { path: '', element: <Main /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'diagnosis', element: <Diagnosis /> },
      { path: 'pretest', element: <PretestPage /> },
      { path: 'posttest', element: <PretestPage /> }
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'about', element: <About /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'report', element: <Report /> },
      { path: 'roadmap', element: <Roadmap /> },
      { path: 'solution', element: <Solution /> },
      { path: 'login/oauth2/code/:provider', element: <OAuthCallback /> },
    ],
  },
]);

export default router;
