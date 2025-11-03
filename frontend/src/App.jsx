import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, GlobalStyles } from "@mui/material";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./Login";
import Configs from "./Configs";
import Home from "./Home";
import Results from "./Results";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0b0f19", paper: "#111827" },
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
  },
  shape: { borderRadius: 14 },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const handleAuthClick = () => setIsAuthenticated(p => !p);

  return (
    <ThemeProvider theme={theme}>

      {/* Makes scrollbar dark mode */}
      <GlobalStyles styles={{
        '::-webkit-scrollbar': { width: 8 },
        '::-webkit-scrollbar-track': { background: '#0b0f19' },
        '::-webkit-scrollbar-thumb': { background: '#333', borderRadius: 8 },
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#333 #0b0f19' },
      }} />

      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
          <Sidebar
            userName={userName}
            isAuthenticated={isAuthenticated}
            onAuthClick={handleAuthClick}
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/configs" element={<Configs />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
