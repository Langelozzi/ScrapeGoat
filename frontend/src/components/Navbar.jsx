import { AppBar, Toolbar, Typography, Button, Box, Stack, Avatar, IconButton } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const isAuthenticated = Boolean(user);
  const userName = user?.first_name || user?.email || 'Guest';

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await Promise.resolve(logout?.());
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const go = (path) => () => navigate(path);

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
        {/* Left: Logo / Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
          onClick={go("/")}
        >
          ScrapeGoat
        </Typography>

        {/* Center: Navigation links */}
        <Stack direction="row" spacing={3}>
          <Button
            color={location.pathname === "/" ? "primary" : "inherit"}
            onClick={go("/")}
          >
            Home
          </Button>
          <Button
            color={location.pathname.startsWith("/configs") ? "primary" : "inherit"}
            onClick={go("/configs")}
          >
            My Configs
          </Button>
        </Stack>

        {/* Right: User info */}
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


    // <Drawer
    //   variant="permanent"
    //   sx={{
    //     width: 240,
    //     '& .MuiDrawer-paper': {
    //       width: 240,
    //       boxSizing: 'border-box',
    //       bgcolor: 'background.paper',
    //       borderRight: '1px solid rgba(255,255,255,0.06)',
    //     },
    //   }}
    // >
    //   <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    //     <Typography
    //       variant="h6"
    //       sx={{
    //         fontWeight: 700,
    //         textAlign: 'center',
    //         display: 'block',
    //         mx: -2,
    //         px: 2,
    //         letterSpacing: 0.5,
    //       }}
    //     >
    //       ScrapeGoat
    //     </Typography>

    //     <Paper variant="outlined" sx={{ p: 1.5 }}>
    //       <Stack direction="row" spacing={1.5} alignItems="center">
    //         <Avatar sx={{ width: 36, height: 36 }} />
    //         <Box sx={{ flexGrow: 1, minWidth: 0 }}>
    //           <Typography variant="body2" noWrap>
    //             {userName}
    //           </Typography>
    //         </Box>
    //         <Button
    //           size="small"
    //           variant={isAuthenticated ? 'outlined' : 'contained'}
    //           onClick={handleAuthClick}
    //         >
    //           {isAuthenticated ? 'Logout' : 'Login'}
    //         </Button>
    //       </Stack>
    //     </Paper>

    //     <List dense sx={{ mt: 0.5 }}>
    //       <ListItemButton
    //         selected={location.pathname === '/'}
    //         onClick={go('/')}
    //       >
    //         <ListItemText primary="Home" />
    //       </ListItemButton>

    //       <ListItemButton
    //         selected={location.pathname.startsWith('/configs')}
    //         onClick={go('/configs')}
    //       >
    //         <ListItemText primary="My Configs" />
    //       </ListItemButton>
    //     </List>
    //   </Box>
    // </Drawer>
  );
}

export default Navbar;
