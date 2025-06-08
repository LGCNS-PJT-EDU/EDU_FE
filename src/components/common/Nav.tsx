import { Link, useLocation, useNavigate } from 'react-router-dom';
import rabbitImage from '@/asset/img/common/main.png';
import { useAuthStore } from '@/store/authGlobal';
import useLogout from '@/hooks/useLogout';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = !!accessToken;
  const logout = useLogout();


  const baseBtnClass =
    'bg-transparent border-none font-[pretendard] text-[#373F41] text-base hover:text-[#6378EB] transition-all';

  const navItem = (to: string, label: string) => (
    <Link to={to} onClick={() => setOpen(false)}>
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
    <>
      <div className="w-full border-b-2 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between h-[70px] w-full max-w-[430px] md:max-w-[1000px] px-4 mx-auto">
          <Link to="/">
            <div className="w-[120px]">
              <img src={rabbitImage} alt="takeit" className="w-full" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-[15px]">
            {navItem('/roadmap', 'ROADMAP')}
            {navItem('/testspeech', 'INTERVIEW')}
            <a href="mailto:example@example.com">
              <button className={`w-auto h-[70px] px-2 ${baseBtnClass}`}>CONTACT</button>
            </a>
          </div>

          { /* 햄부기온앤온 */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>

          {/* 로그인 / 회원가입 / 마이페이지 토글 UI */}
          <div className="hidden md:flex relative items-center w-[200px] h-[40px] rounded-full overflow-hidden bg-white">
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

      <AnimatePresence>
        {open && (
          <>
            {/* 사이드바 외부 클릭으로 닫기용 반투명 오버레이 */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-[#E4EBFF] z-50 shadow-lg
                         flex flex-col pt-4 px-6"
            >
              <button
                onClick={() => setOpen(false)}
                className="self-end p-2 text-black"
              >
                <X size={24} />
              </button>

              <div className="relative flex items-center w-full h-[40px] rounded-full overflow-hidden bg-white mt-6 mb-14">
                <motion.div
                  layout
                  className="absolute w-1/2 h-full bg-[#6C80EC] rounded-full z-0"
                  animate={{ left: getPosition() === 'left' ? '0%' : '50%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {!isLogin ? (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setOpen(false); }}
                      className={`w-1/2 h-full z-10 ${
                        getPosition() === 'left' ? 'text-white' : 'text-[#505050]'
                      }`}
                    >
                      LogIn
                    </button>
                    <button
                      onClick={() => { navigate('/signup'); setOpen(false); }}
                      className={`w-1/2 h-full z-10 ${
                        getPosition() === 'right' ? 'text-white' : 'text-[#505050]'
                      }`}
                    >
                      SignUp
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/mypage'); setOpen(false); }}
                      className={`w-1/2 h-full z-10 ${
                        getPosition() === 'left' ? 'text-white' : 'text-[#505050]'
                      }`}
                    >
                      MyPage
                    </button>
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className={`w-1/2 h-full z-10 ${
                        getPosition() === 'right' ? 'text-white' : 'text-[#505050]'
                      }`}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-10 px-2">
                <Link
                  to="/roadmap"
                  onClick={() => setOpen(false)}
                  className="block font-[pretendard] text-lg text-[#373F41]"
                >
                  ROADMAP
                </Link>

                <Link
                  to="/testspeech"
                  onClick={() => setOpen(false)}
                  className="block font-[pretendard] text-lg text-[#373F41]"
                >
                  INTERVIEW
                </Link>

                <a
                  href="mailto:example@example.com"
                  onClick={() => setOpen(false)}
                  className="block font-[pretendard] text-lg text-[#373F41]"
                >
                  CONTACT
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Nav;
