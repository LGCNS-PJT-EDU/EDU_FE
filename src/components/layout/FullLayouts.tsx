import { Outlet } from 'react-router-dom';
import Nav from '../common/Nav';

function FullLayouts() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default FullLayouts;