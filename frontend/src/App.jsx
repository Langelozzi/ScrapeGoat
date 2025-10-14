import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Login from "./Login"
import Configs from "./Configs"
import Home from "./Home"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/configs" element={<Configs />} />
      </Routes>
    </Router>
  )
}

export default App;