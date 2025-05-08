import { Link, useLocation, useNavigate } from "react-router-dom";
import '@/styled/components/nav.css'
import rabbitImage from '@/asset/img/common/main.png'
import { useAuthStore } from "@/store/authGlobal";
import useLogout from "@/hooks/useLogout";


function Nav() {

  // js는 전역객체 ts useLocation으로 불러와야 함
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;
  const logout = useLogout();

  return (
    <header className="nav_header">
      <div className="logo">
        <img src={rabbitImage} alt="takeit" />
      </div>

      <div className="header-center">
        <Link to="/">
          <button className={location.pathname === "/" ? "active" : ""}>HOME</button>
        </Link>
        <Link to="/About">
          <button className={location.pathname === "/About" ? "active" : ""}>ABOUT</button>
        </Link>
        <a href="mailto:example@example.com">
          <button>CONTACT</button>
        </a>
      </div>
      <div className="login">
        {!isLogin ? (
          <>
            <Link to='/login'>
              <button className={location.pathname === "/login" ? "active" : ""}>Login</button>
            </Link>
            <Link to='/signup'>
              <button className={location.pathname === "/signup" ? "active" : ""}>Signup</button>
            </Link>
          </>
        ) :
          <>
            <Link to='/mypage'>
              <button className={location.pathname === "/mypage" ? "active" : ""}>MyPage</button>
            </Link>
            <button onClick={logout}>Logout</button>
          </>
        }

      </div>
    </header>
  );
}

export default Nav