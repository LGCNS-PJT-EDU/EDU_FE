import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";

/* loginType에 provider를 대문자로 넣기 */
const toLoginType = provider =>
  provider.toLowerCase() === "local" ? "LOCAL" : provider.toUpperCase();

/* 네이버만 POST body에 state 포함하기 */
const buildBody = ({ code, state, provider }) => ({
  code,
  loginType: toLoginType(provider),
  ...(provider.toLowerCase() === "naver" && { state }),
});

/* 존왓탱 JWT 추출 (문자 | { token }) */
const extractToken = data =>
  typeof data === "string" ? data : data?.token ?? null;

function OAuthCallback() {
  const { provider = "" } = useParams();         // naver | kakao | google | local
  const { search } = useLocation();              // ?code=...&state=...
  const navigate  = useNavigate();
  const ranOnce   = useRef(false);               // Strict-mode 방지

  /* 실제 요청 */
  const requestLogin = useCallback(async () => {
    const qs    = new URLSearchParams(search);
    const code  = qs.get("code");
    const state = qs.get("state");

    if (!code || !provider) return navigate("/login");

    const body = buildBody({ code, state, provider });

    const { data: res } = await api.post(`/api/auth/${provider}/login`, body);

    const { stateCode, data } = res;
    if (stateCode !== 200) throw new Error(`stateCode ${stateCode}`);

    const token = extractToken(data);
    if (!token) throw new Error("token missing");

    localStorage.setItem("accesstoken", token);
    alert("로그인 성공!");
    console.log("존왓탱(JWT) 저장:", token);
    navigate("/", { replace: true });
  }, [provider, search, navigate]);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    requestLogin().catch(err => {
      console.error("OAuth 처리 실패:", err);
      alert("로그인 실패");
      navigate("/login");
    });
  }, [requestLogin, navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "20%" }}>
      로그인&nbsp;처리&nbsp;중…
    </p>
  );
}

export default OAuthCallback;