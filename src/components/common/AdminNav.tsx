import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Book, FileQuestion, Home, Lightbulb, Users } from 'lucide-react';

const NavItem = ({ path, label, icon }: { path: string; label: string; icon: React.ReactNode }) => {
  const pathname = useLocation().pathname;

  return (
    <Button
      asChild
      variant={pathname.startsWith(path) ? 'default' : 'ghost'}
      className="flex justify-start items-center gap-[10px]"
    >
      <Link to={path}>
        {icon} {label}
      </Link>
    </Button>
  );
};

export default function AdminNav() {
  return (
    <div className="min-w-[200px] h-screen bg-[#F2F9FB] px-[20px] py-[40px] border-r-[1px] border-[#D0E9EC]">
      <h1 className="text-2xl font-bold mb-[20px] text-[#6378EB]">TakeIt Admin</h1>
      <div className="flex flex-col gap-[4px]">
        <NavItem path="/admin/dashboard" label="대시보드" icon={<Home />} />
        <NavItem path="/admin/users" label="사용자 관리" icon={<Users />} />
        <NavItem path="/admin/subjects" label="과목 관리" icon={<Book />} />
        <NavItem path="/admin/questions" label="문제 관리 (에러)" icon={<FileQuestion />} />
        <NavItem path="/admin/contents" label="추천 컨텐츠 관리" icon={<Lightbulb />} />
      </div>
    </div>
  );
}
