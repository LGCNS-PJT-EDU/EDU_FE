import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, Users } from 'lucide-react';

const NavItem = ({ path, label, icon }: { path: string; label: string; icon: React.ReactNode }) => {
  const pathname = useLocation().pathname;

  return (
    <Button
      asChild
      variant={pathname === path ? 'default' : 'ghost'}
      className="flex justify-start items-center"
    >
      <Link to={path}>
        {icon} {label}
      </Link>
    </Button>
  );
};

export default function AdminNav() {
  return (
    <div className="min-w-[200px] h-screen bg-gray-100 px-[20px] py-[40px]">
      <h1 className="text-2xl font-bold mb-[20px]">TakeIt Admin</h1>
      <div className="flex flex-col gap-[4px]">
        <NavItem path="/admin/dashboard" label="대시보드" icon={<Home />} />
        <NavItem path="/admin/users" label="사용자 관리" icon={<Users />} />
      </div>
    </div>
  );
}
