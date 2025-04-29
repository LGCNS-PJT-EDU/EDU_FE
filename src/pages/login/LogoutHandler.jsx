// src/pages/auth/LogoutHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";          // 공통 인스턴스

export default function LogoutHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    /* 로컬 스토리지에서 토큰 가져오기 */
    const accessToken = localStorage.getItem("accesstoken");
    (async () => {
      try {
        /* api 호출 */
        await delete("http://localhost:8080/api/user/signout", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (e) {
        console.warn("서버 로그아웃 요청 실패(무시)", e);
      }

      /* 토큰 삭제 */
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");   // 있으면 삭제

      /* 3) 홈으로 이동 */
      navigate("/", { replace: true });
    })();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>로그아웃 중</h2>
    </div>
  );
}