import { createBrowserRouter } from "react-router-dom";
import Main from "@/pages/Main";
import About from "@/pages/About";
import Login from "@/pages/login/Login";
import Signup from "@/pages/sign/Signup";
import MyPage from "@/pages/MyPage";
import OAuthCallback from "@/pages/login/OAuthCallback";
import Layout from "@/components/layout/Layouts";
import Roadmap from "@/pages/roadmap/Roadmap";
import SignupRefactored from "@/pages/sign/SignupRefactored";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Main /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-refactored", element: <SignupRefactored /> },
      { path: "mypage", element: <MyPage /> },
      { path: "login/oauth2/code/:provider", element: <OAuthCallback /> },
      { path: "roadmap", element: <Roadmap /> },
    ],
  },
]);

export default router;