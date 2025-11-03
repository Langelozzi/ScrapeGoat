import { BrowserRouter as Router, Routes, Route, useLocation, useMatch } from "react-router-dom";
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
    background: { default: "#0D0709", paper: "#21332d" },
    primary: { main: "#91FFFB" },
    secondary: { main: "#448A9C" },
  },
  shape: { borderRadius: 14 },
});


function Layout({ children, userName, isAuthenticated, onAuthClick }) {
  const hideSidebar = useMatch("/login/*"); // Hide sidebar on login page

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {!hideSidebar && (
        <Sidebar
          userName={userName}
          isAuthenticated={isAuthenticated}
          onAuthClick={onAuthClick}
        />
      )}
      <Box component="main" sx={{ flexGrow: 1, p: hideSidebar ? 0 : 3, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
}

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
        <Layout userName={userName} isAuthenticated={isAuthenticated} onAuthClick={handleAuthClick}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/configs" element={<Configs />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
