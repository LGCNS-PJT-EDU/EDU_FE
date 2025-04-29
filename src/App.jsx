import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import About from "./pages/About";
import Login from "./pages/login/Login";
import Signup from "./pages/sign/Signup";
import MyPage from "./pages/MyPage";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import OAuthCallback  from "./pages/login/OAuthCallback";
import LogoutHandler from "./pages/login/LogoutHandler";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/mypage" element={<MyPage />}/>
        <Route path="/login/oauth2/code/:provider" element={<OAuthCallback />} />
        <Route path="/logout" element={<LogoutHandler />} />
      </Routes>
      <Footer />
    </Router>
  )
}
export default App
