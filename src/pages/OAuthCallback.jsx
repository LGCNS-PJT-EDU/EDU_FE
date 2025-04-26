/* src/pages/auth/OAuthCallback.jsx
 * naver  : GET  /api/user/oauth/naver?code=...
 * kakao  : POST /api/oauth/kakao/login   { code, loginType:"LOCAL" }
 * google : POST /api/oauth/google/login  { code, loginType:"LOCAL" }
 */
import { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const { provider } = useParams();        // naver | kakao | google
  const { search }   = useLocation();      // ?code=...
  const nav          = useNavigate();
  const handledRef   = useRef(false);      // Strict-mode 중복 실행 방지

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    /* 0) 쿼리에서 code 추출 */
    const code = new URLSearchParams(search).get("code");
    if (!code || !provider) return nav("/login");

    (async () => {
      try {
        let res, json;

        /* 1) 공급자별 요청 형식 분기 */
        if (provider === "naver") {
          /* ── NAVER ---------------------------------------------------------------- */
          const url = new URL(
            `http://localhost:8080/api/user/oauth/naver`
          );
          url.searchParams.set("code", code);

          res  = await fetch(url, { credentials: "include" });
          json = await res.json();                       // { stateCode, data: token }

        } else {
          /* ── KAKAO / GOOGLE ------------------------------------------------------- */
          const url = `http://localhost:8080/api/auth/${provider}/login`;

          res  = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code, loginType: "LOCAL" }),
          });
          json = await res.json();                       // { stateCode: 1073741824, data: {...} }
        }

        /* 2) 공통 성공 판정 */
        if (!res.ok) throw new Error(`status ${res.status}`);

        const okCodes = [200, 1073741824];               // 백엔드 정의된 성공 코드
        if (!okCodes.includes(json.stateCode))
          throw new Error(`stateCode ${json.stateCode}`);

        /* 3) 토큰이 있으면 저장 (네이버 방식) */
        if (json.data && typeof json.data === "string" && json.data.length > 20) {
          localStorage.setItem("accesstoken", json.data);
          console.log("존왓탱(JWT) 저장:", json.data);
        } else {
          console.log("JWT는 쿠키로 전달되었거나 필요 없는 로그인 방식입니다.");
        }

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
