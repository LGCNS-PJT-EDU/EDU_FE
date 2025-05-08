import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authGlobal";

export default function useLogin() {
  const navigate  = useNavigate();
  const setLogin  = useAuthStore((s) => s.setLogin);

  return useCallback<(token: string) => void>(
    (token) => {
      setLogin(token);
      alert("로그인 성공!");
      navigate("/", { replace: true });
    },
    [setLogin, navigate],
  );
}
