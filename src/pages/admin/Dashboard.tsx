import BaseAdminPage from './BaseAdminPage';

export default function Dashboard() {
  return (
    <BaseAdminPage title="대시보드">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-lg font-bold">사용자 통계</h2>
        </div>
      </div>
    </BaseAdminPage>
  );
}
