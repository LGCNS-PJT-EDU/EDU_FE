import { PropsWithChildren } from 'react';

export default function BaseAdminPage({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
