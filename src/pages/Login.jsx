import { useEffect } from "react";
import "./login.css";

const OAUTH = {
  naver: {
    authUrl: "https://nid.naver.com/oauth2.0/authorize",
    clientId: "YOUR_NAVER_CLIENT_ID",
    redirect: "https://api.example.com/login/oauth2/code/naver",
    extra: "&state=naver",                 // CSRF 대비용
  },
  kakao: {
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    clientId: "YOUR_KAKAO_REST_API_KEY",
    redirect: "https://api.example.com/login/oauth2/code/kakao",
  },
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: "YOUR_GOOGLE_CLIENT_ID",
    redirect: "https://api.example.com/login/oauth2/code/google",
    scope: "openid email profile",
  },
};

const goOAuthLogin = (provider) => {
  const cfg = OAUTH[provider];
  if (!cfg) return console.error("Unknown provider:", provider);

  const query = new URLSearchParams({
    response_type: "code",
    client_id: cfg.clientId,
    redirect_uri: cfg.redirect,
    scope: cfg.scope,          // 없으면 자동으로 undefined 제외
  }).toString();

  window.location.href = `${cfg.authUrl}?${query}${cfg.extra ?? ""}`;
};

export default function Login() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="loginMain">
      <img src="/asset/takeRabbit.png" alt="rabbit" />
      <p className="subtitle">개발자, 지금 TakeIT와 함께 시작해보세요</p>
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
        <a href="#">회원가입</a>
        <span>|</span>
        <a href="#">문항보기</a>
      </div>
    </div>
  );
}
