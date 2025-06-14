import { Outlet } from 'react-router-dom';
import Nav from '../common/Nav';

function Layouts() {
  return (
    <>
      <Nav />
      <main className="w-full max-w-screen-lg sm:px-6 mx-auto">
        <Outlet />
      </main>
    </>
  );
}

export default Layouts;
