import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BaseAdminPage({
  children,
  title,
  showBackButton = false,
}: PropsWithChildren<{ title: string; showBackButton?: boolean }>) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="flex flex-row items-center gap-[10px]">
        {showBackButton && <ArrowLeftIcon className="w-4 h-4" onClick={() => navigate(-1)} />}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
