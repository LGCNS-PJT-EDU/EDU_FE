/* src/pages/auth/OAuthCallback.jsx
 * 모든 공급자(Naver / Kakao / Google)  ➜  POST /api/auth/{provider}/login
 * 요청 Body  { code, loginType:"LOCAL", state }
 */
import { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const { provider } = useParams();          // naver | kakao | google
  const { search }   = useLocation();        // ?code=...&state=...
  const nav          = useNavigate();
  const once         = useRef(false);        // Strict-mode 중복 방지

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    /* 0) code / state 추출 */
    const qs    = new URLSearchParams(search);
    const code  = qs.get("code");
    const state = qs.get("state");           // (Naver만 필수긴한데 다 전송)
    if (!code || !provider) return nav("/login");

    (async () => {
      try {
        /* 1) 백엔드로 code 전달 */
        const res  = await fetch(
          `http://localhost:8080/api/auth/${provider}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code, loginType: "LOCAL", state }),
          }
        );
        if (!res.ok) throw new Error(`status ${res.status}`);

        const { stateCode, data } = await res.json();   // ← 통일된 포맷

        /* 2) JWT 추출 & 저장 */
        const token =
          typeof data === "string"
            ? data
            : typeof data?.token === "string"
              ? data.token
              : null;

        if (!token) throw new Error("token missing");
        localStorage.setItem("accesstoken", token);
        console.log("존왓탱(JWT) 저장:", token);

        alert("로그인 성공!");
        nav("/", { replace: true });
      } catch (err) {
        console.error("OAuth 처리 실패:", err);
        alert("로그인 실패");
        nav("/login");
      }
    })();
  }, [provider, search, nav]);

  return (
    <p style={{ textAlign: "center", marginTop: "20%" }}>
      로그인&nbsp;처리&nbsp;중…
    </p>
  );
}
