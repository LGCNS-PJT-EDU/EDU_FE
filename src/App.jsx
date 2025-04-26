import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import OAuthCallback  from "./pages/OAuthCallback";
import Signup from "./pages/Signup";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/about" element={<Contact />}/>
        <Route path="/contact" element={<About />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/login/oauth2/code/:provider" element={<OAuthCallback />} />
        <Route path="/signup" element={<Signup />}/>
      </Routes>
      <Footer />
    </Router>
  )
}
export default App
