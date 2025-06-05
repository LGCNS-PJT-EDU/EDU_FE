import { Link, useLocation, useNavigate } from 'react-router-dom';
import rabbitImage from '@/asset/img/common/main.png';
import { useAuthStore } from '@/store/authGlobal';
import useLogout from '@/hooks/useLogout';
import { motion } from 'framer-motion';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;
  const logout = useLogout();


  const baseBtnClass =
    'bg-transparent border-none font-[pretendard] text-[#373F41] text-base hover:text-[#6378EB] transition-all';

  const navItem = (to: string, label: string) => (
    <Link to={to}>
      <button
        className={`w-auto h-[70px] px-2 ${baseBtnClass} ${location.pathname === to ? 'font-semibold' : ''}`}
      >
        {label}
      </button>
    </Link>
  );

  const currentPath = location.pathname;

  // 로그인/회원가입 또는 마이페이지 기준 위치 계산
  const getPosition = () => {
    if (!isLogin) {
      if (currentPath === '/signup') return 'right';
      return 'left';
    } else {
      if (currentPath === '/mypage') return 'left';
      return 'right';
    }
  };
  const isLeft = getPosition() === 'left';
  const isRight = getPosition() === 'right';

  return (
    <div className="w-full border-b-2">
      <div className="flex items-center justify-between h-[70px] w-[1000px] mx-auto">
        <Link to="/">
          <div className="w-[120px]">
            <img src={rabbitImage} alt="takeit" className="w-full" />
          </div>
        </Link>

        <div className="flex items-center gap-[15px]">
          {navItem('/roadmap', 'ROADMAP')}
          {navItem('/testspeech', 'INTERVIEW')}
          <a href="mailto:example@example.com">
            <button className={`w-auto h-[70px] px-2 ${baseBtnClass}`}>CONTACT</button>
          </a>
        </div>

        {/* 로그인 / 회원가입 / 마이페이지 토글 UI */}
        <div className="relative flex items-center w-[200px] h-[40px] rounded-full overflow-hidden bg-white">
          {/* 슬라이딩 배경 */}
          <motion.div
            layout
            className="absolute w-1/2 h-full bg-[#6C80EC] rounded-full z-0"
            initial={false}
            animate={{
              left: getPosition() === 'left' ? '0%' : '50%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {!isLogin ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className={`w-1/2 h-full z-10 ${isLeft ? 'text-white' : 'text-[#505050]'}`}
              >
                LogIn
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`w-1/2 h-full z-10 ${isRight ? 'text-white' : 'text-[#505050]'}`}
              >
                SignUp
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/mypage')}
                className={`w-1/2 h-full z-10 ${isLeft ? 'text-white' : 'text-[#505050]'}`}
              >
                MyPage
              </button>
              <button
                onClick={logout}
                className={`w-1/2 h-full z-10 ${isRight ? 'text-white' : 'text-[#505050]'}`}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
