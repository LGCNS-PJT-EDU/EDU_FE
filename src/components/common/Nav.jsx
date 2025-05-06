import { Link } from "react-router-dom";
import '../../styled/components/nav.css'
import rabbitImage from "../../asset/img/common/main.png"

function Nav(){
    return (
        <header className="nav_header">
          <div className="logo">
            <img src={rabbitImage} alt="takeit" />
          </div>
    
          <div className="header-center">
              <Link to="/">
                <button className={location.pathname === "/" ? "active" : ""}>HOME</button>
              </Link>
              <Link to="/About">
                <button className={location.pathname === "/About" ? "active" : ""}>ABOUT</button>
              </Link>
              <a href="mailto:example@example.scom">
                <button>CONTACT</button>
              </a>
          </div>
          <div className="login">
            <Link to='/login'>
              <button className={location.pathname === "/login" ? "active" : ""}>Login</button>
            </Link>
            <Link to='/signup'>
              <button className={location.pathname === "/signup" ? "active" : ""}>Signup</button>
            </Link>
            <Link to='/mypage'>
              <button className={location.pathname === "/mypage" ? "active" : ""}>MyPage</button>
            </Link>
          </div>
        </header>
      );
    }
    
export default Nav