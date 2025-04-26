import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        /* 1) (선택) 서버 세션 / 리프레시 토큰 무효화 */
        await axios.post(
          "https://api.example.com/auth/logout",   // ← 엔드포인트 이름 맞춰서 수정
          {},
          { withCredentials: true }
        );
      } catch (e) {
        console.warn("서버 로그아웃 요청 실패(무시)", e);
      }

      /* 2) 로컬 저장소 토큰 제거 */
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");     // 있다면 같이 제거

      /* 3) 홈으로 리다이렉트 (기존 기록 덮어쓰기) */
      nav("/", { replace: true });
    })();
  }, [nav]);

  /* 로딩 메시지용 간단 UI */
  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>로그아웃 중입니다...</h2>
    </div>
  );
}
