import { Button } from "@/components/ui/button";
import { FrownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[10px]">
      <p className="text-lg flex items-center gap-2"><FrownIcon/>페이지를 찾을 수 없습니다</p>
      <Button onClick={() => navigate('/admin/dashboard')}>대시보드로 돌아가기</Button>
    </div>
  );
}