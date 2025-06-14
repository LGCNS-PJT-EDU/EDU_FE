import { Outlet } from 'react-router-dom';
import AdminNav from '../common/AdminNav';
import { ErrorBoundary } from 'react-error-boundary';

function AdminLayouts() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <AdminNav />
      <ErrorBoundary fallbackRender={() => <div>에러가 발생했어요</div>}>
        <div className="flex-1 px-[20px] py-[40px]">
          <Outlet />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default AdminLayouts;
