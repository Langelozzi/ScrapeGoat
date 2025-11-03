import {
  Drawer,
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const isAuthenticated = Boolean(user);
  const userName = user?.name || user?.username || user?.email || 'Guest';

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
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            display: 'block',
            mx: -2,
            px: 2,
            letterSpacing: 0.5,
          }}
        >
          ScrapeGoat
        </Typography>

        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 36, height: 36 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {userName}
              </Typography>
            </Box>
            <Button
              size="small"
              variant={isAuthenticated ? 'outlined' : 'contained'}
              onClick={handleAuthClick}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </Stack>
        </Paper>

        <List dense sx={{ mt: 0.5 }}>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={go('/')}
          >
            <ListItemText primary="Home" />
          </ListItemButton>

          <ListItemButton
            selected={location.pathname.startsWith('/configs')}
            onClick={go('/configs')}
          >
            <ListItemText primary="My Configs" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
