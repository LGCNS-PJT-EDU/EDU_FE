import { useEffect, useState } from 'react';
import { useLoginMutation } from '@/hooks/useMutation';
import axios from '@/api/axios';

import google from '@/asset/img/login/btn_google.svg';
import kakao from '@/asset/img/login/btn_kakao.svg';
import naver from '@/asset/img/login/btn_naver.svg';
import pixel_texture from '@/asset/img/common/pixel_texture.png';
import main from '@/asset/img/common/main.png';
import responsiveBG from '@/asset/img/common/resposive_pixel_texture.png';

import useLogin from '@/hooks/useLogin';
import { useLoadingStore } from '@/store/useLoadingStore';
import { useNavigate } from 'react-router-dom';

const REDIRECT_BASE = import.meta.env.VITE_REDIRECT_DOMAIN;
/* 1) 공급자별 고정 파라미터 */
const OAUTH = {
  naver: {
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: 'bG5y9c7SsXkdkxq2I14X',
    redirect: `${REDIRECT_BASE}/login/oauth2/code/naver`,
    scope: 'name email',
  },
  kakao: {
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: '0257e0d9342333ce55ef60c412d20c5f',
    redirect: `${REDIRECT_BASE}/login/oauth2/code/kakao`,
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: '478095454422-f3q1th169ltqv6i6bq5g92oaa7e2l6h8.apps.googleusercontent.com',
    redirect: `${REDIRECT_BASE}/login/oauth2/code/google`,
    scope: 'openid email profile',
  },
} as const;

// 공급자 타입 지정
type OAuthProvider = keyof typeof OAUTH;

/* 2) 버튼 클릭 → authorize URL 생성 & 이동 */
function goOAuthLogin(provider: OAuthProvider): void {
  const cfg = OAUTH[provider];
  if (!cfg) return alert('알 수 없는 provider');

  /* CSRF state */
  const state = crypto.randomUUID();
  sessionStorage.setItem(`oauth_state_${provider}`, state);

  /* 필요한 파라미터만 동적으로 추가 */
  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('client_id', cfg.clientId);
  params.append('redirect_uri', cfg.redirect);
  params.append('state', state);
  if ('scope' in cfg) params.append('scope', cfg.scope); // 있을 때만!

  window.location.href = `${cfg.authUrl}?${params.toString()}`;
}

function Login() {
  useEffect(() => window.scrollTo(0, 0), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { startLoading, stopLoading } = useLoadingStore();
  const LoginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email) setEmailError('아이디를 입력해 주세요.');
    if (!password) setPasswordError('비밀번호를 입력해주세요.');
    if (!email || !password) return;

    /* react-query 사용한 쪽 */
    try {
      await LoginMutation.mutateAsync({ email, password });
      navigate('/roadmap');
    } catch (e) {
      console.log(e);
      setErrorMessage(
        '이메일 또는 비밀번호가 잘못되었습니다.\n이메일과 비밀번호를 정확히 입력해 주세요.'
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="relative h-[calc(100vh-70px)] font-[pretendard] flex flex-col md:flex-row items-center md:items-start justify-center gap-[200px] overflow-hidden px-0 md:px-4">
      <img
        src={pixel_texture}
        alt=""
        className="hidden md:block absolute bottom-0 left-0 w-full h-[100%] object-cover z-0 opacity-70"
      />
      <img
        src={responsiveBG}
        alt=""
        className="block md:hidden absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 배너 */}
      <div className="hidden md:flex relative justify-center items-center self-center">
        <div className="z-20 text-[#373f41]">
          <img src={main} alt="main" className="w-[200px] mb-[10px]" />
          <p className="text-xl text-[#6378EB] font-[NeoDunggeunmo]">
            개발자의 꿈,
            <br />
            지금 TakeIT과 시작해보세요
          </p>
        </div>
      </div>

      {/* 로그인 박스 */}
      <div
        className="relative w-full max-w-[450px]
                      md:w-full md:max-w-[400px]
                      max-md:-mx-4
                      mb-25 mt-80 md:my-15
                      translate-y-8 md:translate-y-0
                      p-10 md:p-[60px_70px]
                      bg-white rounded-[40px] md:rounded-[30px]
                      flex flex-col gap-5 shadow-[ -4px_0_10px_rgba(0,0,0,0.05)] 
                      border border-[#E0E0E0] min-h-[calc(100vh-200px)]"
      >
        <p className="text-sm">안녕하세요! TakeIT에 오신 것을 환영합니다.</p>
        <h2 className="mt-1 mb-1 text-xl font-semibold">로그인</h2>

        <form
          className="flex flex-col"
          onKeyUp={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <div className="relative mb-6">
            <label
              htmlFor="email"
              className="absolute top-[-8px] left-[14px] bg-white px-[6px] text-xs text-gray-600 z-10"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className={`w-full px-3 pt-4 pb-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6378eb]/20 ${emailError ? 'border-red-500' : 'border-gray-400'}`}
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>

          <div className="relative mb-6">
            <label
              htmlFor="password"
              className="absolute top-[-8px] left-[14px] bg-white px-[6px] text-xs text-gray-600 z-10"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className={`w-full px-3 pt-4 pb-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6378eb]/20 ${passwordError ? 'border-red-500' : 'border-gray-400'}`}
            />
            {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500 whitespace-pre-line text-center">
              {errorMessage}
            </div>
          )}
        </form>

        <button
          onClick={handleLogin}
          className="py-3 bg-[#6378EB] text-white rounded-md font-bold hover:bg-[#455ce3] transition"
        >
          CONTINUE
        </button>

        <div className="flex items-center text-center my-1">
          <div className="flex-1 border-b border-gray-300" />
          <span className="px-3 text-sm text-gray-700 bg-white">Or</span>
          <div className="flex-1 border-b border-gray-300" />
        </div>

        <div className="flex justify-center gap-5">
          <button onClick={() => goOAuthLogin('kakao')}>
            <img src={kakao} alt="카카오 로그인" className="w-[42px] h-[42px] rounded-full" />
          </button>
          <button onClick={() => goOAuthLogin('naver')}>
            <img src={naver} alt="네이버 로그인" className="w-[42px] h-[42px] rounded-full" />
          </button>
          <button onClick={() => goOAuthLogin('google')}>
            <img src={google} alt="구글 로그인" className="w-[42px] h-[42px] rounded-full" />
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-3">
          <a href="/signup" className="text-gray-600 mx-1">
            회원가입
          </a>
          <span>|</span>
          <a href="#" className="text-gray-600 mx-1">
            아이디 찾기
          </a>
          <span>|</span>
          <a href="#" className="text-gray-600 mx-1">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
}
export default Login;
