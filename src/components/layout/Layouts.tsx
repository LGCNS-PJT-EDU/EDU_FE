import { Outlet } from 'react-router-dom';
import Nav from '../common/Nav';

function Layouts() {
  return (
    <>
      <Nav />
      <main className='w-[800px] mx-auto'>
        <Outlet />
      </main>
    </>
  );
}

export default Layouts;
