import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Stack, Avatar } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const isAuthenticated = Boolean(user);
  const userName = user?.first_name || user?.email || 'Guest';

  const [activeTab, setActiveTab] = useState(
    location.pathname.startsWith("/configs") ? "configs" : "home"
  );

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await Promise.resolve(logout?.());
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const go = (path, tab) => () => {
    if (tab) setActiveTab(tab);
    navigate(path);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* LEFT: Logo + Nav Buttons */}
        <Stack direction="row" spacing={2} alignItems="center">
          <img
            src="/goat-logo-white.png"
            alt="Scrapegoat Logo"
            style={{ width: 36, height: "auto", opacity: 0.9 }}
          />

          {/* Buttons closer together */}
          <Stack direction="row" spacing={1}>
            <Button
              color={activeTab === "home" ? "primary" : "inherit"}
              onClick={go("/", "home")}
              sx={{
                textDecoration: activeTab === "home" ? "underline" : "none",
                textUnderlineOffset: "4px",
                textDecorationThickness: "1px",
                transition: "none",
                "&:hover": {
                  textDecoration: activeTab === "home" ? "underline" : "none",
                  backgroundColor: "transparent",
                },
              }}
            >
              Home
            </Button>

            <Button
              color={activeTab === "configs" ? "primary" : "inherit"}
              onClick={go("/configs", "configs")}
              sx={{
                textDecoration: activeTab === "configs" ? "underline" : "none",
                textUnderlineOffset: "4px",
                textDecorationThickness: "1px",
                transition: "none",
                "&:hover": {
                  textDecoration: activeTab === "configs" ? "underline" : "none",
                  backgroundColor: "transparent",
                },
              }}
            >
              My Configs
            </Button>
          </Stack>
        </Stack>

        {/* RIGHT: User panel */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 36, height: 36 }} />
          <Typography variant="body2" sx={{ pr: 2 }} noWrap>
            {userName}
          </Typography>
          <Button
            size="small"
            variant={isAuthenticated ? "outlined" : "contained"}
            onClick={handleAuthClick}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </Stack>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
