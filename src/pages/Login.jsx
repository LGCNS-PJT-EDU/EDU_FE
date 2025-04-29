import { useEffect, useState } from "react";
import "./login.css";
import axios from '../api/axios';

/* 1) 공급자별 고정 파라미터 */
const OAUTH = {
  naver: {
    authUrl   : "https://nid.naver.com/oauth2.0/authorize",
    clientId  : "bG5y9c7SsXkdkxq2I14X",
    redirect  : "http://localhost:5173/login/oauth2/code/naver",
    scope     : "name email",
  },
  kakao: {
    authUrl   : "https://kauth.kakao.com/oauth/authorize",
    clientId  : "0257e0d9342333ce55ef60c412d20c5f",
    redirect  : "http://localhost:5173/login/oauth2/code/kakao",
  },
  google: {
    authUrl   : "https://accounts.google.com/o/oauth2/v2/auth",
    clientId  : "478095454422-f3q1th169ltqv6i6bq5g92oaa7e2l6h8.apps.googleusercontent.com",
    redirect  : "http://localhost:5173/login/oauth2/code/google",
    scope     : "openid email profile",
  },
};

/* 2) 버튼 클릭 → authorize URL 생성 & 이동 */
function goOAuthLogin(provider) {
  const cfg = OAUTH[provider];
  if (!cfg) return alert("알 수 없는 provider");

  /* CSRF state */
  const state = crypto.randomUUID();
  sessionStorage.setItem(`oauth_state_${provider}`, state);

  /* 필요한 파라미터만 동적으로 추가 */
  const params = new URLSearchParams();
  params.append("response_type", "code");
  params.append("client_id", cfg.clientId);
  params.append("redirect_uri", cfg.redirect);
  params.append("state", state);
  if (cfg.scope) params.append("scope", cfg.scope);    // 있을 때만!

  window.location.href = `${cfg.authUrl}?${params.toString()}`;
}

function Login() {
  useEffect(() => window.scrollTo(0, 0), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/user/signin', {
        email,
        password,
      });
      console.log('서버 응답:', res.data);      
      alert('로그인이 완료되었습니다.');
      }
      catch (err) {
      console.error(err);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="loginMain">
      <img src="/asset/takeRabbit.png" alt="rabbit" />
      <p className="subtitle">개발자, 지금 TakeIT와 함께 시작해보세요</p>
      <div className="loginformGroup">
        <label>이메일</label>
        <input
          type="text"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="loginSubmit" onClick={handleLogin}>Login</button>
      <div className="start">
        <p>3초만에 시작하기🎉</p>
      </div>
      <div className="sociallogin">
        <button className="kakao" onClick={() => goOAuthLogin("kakao")}>
          <img src="/asset/btn_kakao.svg"  alt="카카오 로그인" />
        </button>
        <button className="naver"  onClick={() => goOAuthLogin("naver")}>
          <img src="/asset/btn_naver.svg"  alt="네이버 로그인" />
        </button>
        <button className="google" onClick={() => goOAuthLogin("google")}>
          <img src="/asset/btn_google.svg" alt="구글 로그인"  />
        </button>
      </div>
      <div className="links">
        <a href="/signup">회원가입</a>
        <span>|</span>
        <a href="#">문항보기</a>
      </div>
    </div>
  );
}
export default Login;