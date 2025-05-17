import { Link, useLocation } from 'react-router-dom';
import rabbitImage from '@/asset/img/common/main.png';
import { useAuthStore } from '@/store/authGlobal';
import useLogout from '@/hooks/useLogout';

function Nav() {
  // js는 전역객체 ts useLocation으로 불러와야 함
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;
  const logout = useLogout();

  const baseBtnClass =
    'bg-transparent border-none font-[Figtree] text-[#373F41] text-base hover:text-[#6378EB] hover:text-[17px] transition-all';

  return (
    <header className="flex items-center justify-between h-[70px] w-[800px] mx-auto">
      <div className="w-[100px]">
        <img src={rabbitImage} alt="takeit" className="w-full" />
      </div>

      <div className="flex items-center gap-[30px]">
        <Link to="/">
          <button className={`${baseBtnClass} ${location.pathname === '/' ? 'font-semibold' : ''}`}>
            HOME
          </button>
        </Link>
        <Link to="/About">
          <button
            className={`${baseBtnClass} ${location.pathname === '/About' ? 'font-semibold' : ''}`}
          >
            ABOUT
          </button>
        </Link>
        <a href="mailto:example@example.com">
          <button className={baseBtnClass}>CONTACT</button>
        </a>
      </div>

      <div className="flex items-center gap-3">
        {!isLogin ? (
          <>
            <Link to="/login">
              <button
                className={`${baseBtnClass} ${location.pathname === '/login' ? 'font-semibold' : ''}`}
              >
                Login
              </button>
            </Link>
            <Link to="/signup-refactored">
              <button
                className={`${baseBtnClass} ${location.pathname === '/signup' ? 'font-semibold' : ''}`}
              >
                Signup
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/mypage">
              <button
                className={`${baseBtnClass} ${location.pathname === '/mypage' ? 'font-semibold' : ''}`}
              >
                MyPage
              </button>
            </Link>
            <button onClick={logout} className="baseBtnClass">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Nav;
