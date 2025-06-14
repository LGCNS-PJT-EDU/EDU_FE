import { Button } from "@/components/ui/button";
import { FrownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNotAuthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[10px]">
      <p className="text-lg flex items-center gap-2"><FrownIcon/>관리자 메뉴 접근 권한이 없습니다</p>
      <Button onClick={() => navigate('/')}>메인 페이지로 돌아가기</Button>
    </div>
  );
}