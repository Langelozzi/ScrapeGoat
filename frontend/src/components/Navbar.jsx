import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Stack, Avatar } from "@mui/material";
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
        borderBottom: "1px solid",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
          onClick={go("/", "home")}
        >
          ScrapeGoat
        </Typography>

        <Stack direction="row" spacing={3}>
          <Button
            color={activeTab === "home" ? "primary" : "inherit"}
            onClick={go("/", "home")}
          >
            Home
          </Button>

          <Button
            color={activeTab === "configs" ? "primary" : "inherit"}
            onClick={go("/configs", "configs")}
          >
            My Configs
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" noWrap>
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
