import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styled/pages/login.css";
import axios from "@/api/axios";

import google from "@/asset/img/login/btn_google.svg";
import kakao from "@/asset/img/login/btn_kakao.svg";
import naver from "@/asset/img/login/btn_naver.svg";
import useLogin from "@/hooks/useLogin";

/* 1) 공급자별 고정 파라미터 */
const OAUTH = {
  naver: {
    authUrl: "https://nid.naver.com/oauth2.0/authorize",
    clientId: "bG5y9c7SsXkdkxq2I14X",
    redirect: "http://localhost:5173/login/oauth2/code/naver",
    scope: "name email",
  },
  kakao: {
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    clientId: "0257e0d9342333ce55ef60c412d20c5f",
    redirect: "http://localhost:5173/login/oauth2/code/kakao",
  },
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: "478095454422-f3q1th169ltqv6i6bq5g92oaa7e2l6h8.apps.googleusercontent.com",
    redirect: "http://localhost:5173/login/oauth2/code/google",
    scope: "openid email profile",
  },
} as const

// 공급자 타입 지정
type OAuthProvider = keyof typeof OAUTH;

/* 2) 버튼 클릭 → authorize URL 생성 & 이동 */
function goOAuthLogin(provider: OAuthProvider): void {
  const cfg = OAUTH[provider];
  if (!cfg)
    return alert("알 수 없는 provider");

  /* CSRF state */
  const state = crypto.randomUUID();
  sessionStorage.setItem(`oauth_state_${provider}`, state);

  /* 필요한 파라미터만 동적으로 추가 */
  const params = new URLSearchParams();
  params.append("response_type", "code");
  params.append("client_id", cfg.clientId);
  params.append("redirect_uri", cfg.redirect);
  params.append("state", state);
  if ("scope" in cfg) params.append("scope", cfg.scope);    // 있을 때만!

  window.location.href = `${cfg.authUrl}?${params.toString()}`;
}

function Login() {
  useEffect(() => window.scrollTo(0, 0), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const saveAccessToken = useLogin();

  const handleLogin = async (): Promise<void> => {
    try {
      const res = await axios.post('/api/user/signin', {
        email,
        password,
      });

      const token = res.headers["authorization"]?.split(" ")[1]
      if (!token) throw new Error("token missing");

      saveAccessToken(token);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    catch (err: unknown) {
      console.error(err);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="loginWrapper">
      <div className="loginBanner">
        <div className="bannerContent">
          <h1>TakeIT</h1>
          <p>개발자의 꿈, 지금 TakeIT과 시작해보세요</p>
        </div>
      </div>
      {/* ✅ 오른쪽 로그인 컨테이너 */}
      <div className="loginMain">
        <div className="intro">
        <p className="welcome">안녕하세요! TakeIT에 오신 것을 환영합니다.</p>
        <h2 className="loginh2">Login</h2>
        </div>
        <form
          className="loginformGroup"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        >
          <div className="floatingInput">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" " // <-- 중요! placeholder가 공백이어야 라벨이 겹치지 않음
            />
          </div>
          <div className="floatingInput">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" " // 여기도 공백
            />
          </div>
        </form>
        <button type="submit" className="loginSubmit" onClick={handleLogin}>
          CONTINUE
        </button>
        <div className="divider">
          <span>Or</span>
        </div>
        <div className="sociallogin">
          <button className="kakao" onClick={() => goOAuthLogin("kakao")}>
            <img src={kakao} alt="카카오 로그인" />
          </button>
          <button className="naver" onClick={() => goOAuthLogin("naver")}>
            <img src={naver} alt="네이버 로그인" />
          </button>
          <button className="google" onClick={() => goOAuthLogin("google")}>
            <img src={google} alt="구글 로그인" />
          </button>
        </div>
        <div className="links">
          <a href="/signup">회원가입</a>
          <span>|</span>
          <a href="#">아이디 찾기</a>
          <span>|</span>
          <a href="#">비밀번호 찾기</a>
        </div>
      </div>
      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>
      <div className="bubble bubble4"></div>
      <div className="bubble bubble5"></div>
    </div>
  );
}
export default Login;