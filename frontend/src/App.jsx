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
    background: { default: "#0D0709", paper: "#21332d", light: "#02632F" },
    primary: { main: "#91FFFB" },
    secondary: { main: "#448A9C" },
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
