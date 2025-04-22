import { Link } from "react-router-dom";
import './Nav.css'

function Nav(){
    return (
        <header className="nav_header">
          <div className="logo">
            <img src="../asset/takeit.png" alt="takeit" />
          </div>
    
          <div className="header-center">
            <nav className="nav-toggle">
              <Link to="/">
                <button className={location.pathname === "/" ? "active" : ""}>HOME</button>
              </Link>
              <Link to="/About">
                <button className={location.pathname === "/About" ? "active" : ""}>About</button>
              </Link>
              <Link to="/Contact">
                <button className={location.pathname === "/Contact" ? "active" : ""}>Contact</button>
              </Link>
            </nav>
          </div>
          <div className="login">
            <button className="login-btn">Login</button>
            <button className="login-btn">SignIn</button>
          </div>
        </header>
      );
    }
    
export default Nav