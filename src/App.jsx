import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Report from "./pages/Report";
import Personal from "./pages/Personal";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/report" element={<Report />}/>
        <Route path="/rewards" element={<Personal />}/>
        <Route path="/personal" element={<Rewards />}/>
        <Route path="/settinds" element={<Settings />}/>
      </Routes>
    </Router>
    </>
  )
}
export default App
