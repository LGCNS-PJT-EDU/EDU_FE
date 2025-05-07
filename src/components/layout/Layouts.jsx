import { Outlet } from "react-router-dom";
import Nav from "../common/Nav";

function Layouts() {
  return (
    <>
      <Nav />
      <main>
        <Outlet /> 
      </main>
    </>
  );
}


export default Layouts;