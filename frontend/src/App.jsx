import { BrowserRouter as Router, Routes, Route, useMatch } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, GlobalStyles } from "@mui/material";
import { useUser } from "./context/UserContext.jsx"
import Navbar from "./components/Navbar.jsx";
import Login from "./Login";
import Configs from "./Configs";
import Home from "./Home";
import Results from "./Results";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E1116",
      paper: "#3c4d49",
    },
    primary: {
      main: "#4FC3F7",
      light: "#81D4FA",
      dark: "#0288D1",
      contrastText: "#0E1116",
    },
    secondary: {
      main: "#CE93D8",
      light: "#E1BEE7",
      dark: "#8E24AA",
      contrastText: "#fff",
    },
    success: {
      main: "#66BB6A",
    },
    error: {
      main: "#EF5350",
    },
    warning: {
      main: "#FFA726",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#d3d8de",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: { borderRadius: 14 },
});


function Layout({ children }) {
  const hideNavbar = useMatch("/login/*"); // Hide sidebar on login page

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {!hideNavbar && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  const { user, loading, logout } = useUser();

  if (loading) return <div>Loading...</div>

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
        <Layout>
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
