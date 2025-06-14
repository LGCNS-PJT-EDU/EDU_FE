import { createBrowserRouter, Navigate } from 'react-router-dom';
import Main from '@/pages/Main';
import Login from '@/pages/login/Login';
import MyPage from '@/pages/mypage/MyPage';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Layout from '@/components/layout/Layouts';
import Roadmap from '@/pages/roadmap/Roadmap';
import Signup from '@/pages/sign/Signup';
import Diagnosis from '@/pages/test/DiagnosisPage';
import FullLayouts from '@/components/layout/FullLayouts';
import Report from '@/pages/report/Report';
import PretestPage from '@/pages/test/PretestPage';
import PosttestPage from '@/pages/test/PosttestPage';
import Solution from '@/pages/solution/Solution';
import TestSpeech from '@/pages/speech/TestSpeech';
import Selectspeech from '@/pages/speech/selectSpeech';
import SpeechFeedback from '@/pages/speech/speechFeedback';
import DefaultRoadmap from '@/pages/roadmap/DefaultRoadmap';
import AdminLayouts from '@/components/layout/AdminLayouts';
import Dashboard from '@/pages/admin/Dashboard';
import UserListPage from '@/pages/admin/UserListPage';
import QuestionListPage from '@/pages/admin/QuestionListPage';
import SubjectListPage from '@/pages/admin/SubjectListPage';
import ContentListPage from '@/pages/admin/ContentsListPage';
import AdminNotAuthorizedPage from '@/pages/admin/AdminNotAuthorizedPage';
import AdminNotFoundPage from '@/pages/admin/AdminNotFoundPage';

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
      { path: 'posttest', element: <PosttestPage /> },
      { path: 'roadmap', element: <Roadmap /> },
      { path: '/roadmap/default/:type', element: <DefaultRoadmap /> },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'mypage', element: <MyPage /> },
      { path: 'report', element: <Report /> },
      { path: 'solution', element: <Solution /> },
      { path: 'login/oauth2/code/:provider', element: <OAuthCallback /> },
      { path: 'selectspeech', element: <Selectspeech /> },
      { path: 'testspeech', element: <TestSpeech /> },
      { path: 'speechfeedback', element: <SpeechFeedback /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayouts />,
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <UserListPage /> },
      { path: 'subjects', element: <SubjectListPage /> },
      { path: 'questions', element: <QuestionListPage /> },
      { path: 'contents', element: <ContentListPage /> },
      { path: 'not-found', element: <AdminNotFoundPage /> },
      { path: '*', element: <Navigate to="/admin/not-found" /> },
    ],
  },
  { path: '/admin/not-authorized', element: <AdminNotAuthorizedPage /> },
]);

export default router;
