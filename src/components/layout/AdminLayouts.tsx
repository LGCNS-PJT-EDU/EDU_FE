import { Outlet } from 'react-router-dom';
import AdminNav from '../common/AdminNav';

function AdminLayouts() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <AdminNav />
      <div className="flex-1 px-[20px] py-[40px]">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayouts;
