import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '/src/firebaseConfig';

/**
 * AppBarComponent for the application's AppBar.
 * @param {Object} props - Component props.
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open.
 * @param {function} props.handleSidebarToggle - Function to toggle the sidebar.
 * @param {string} props.title - The title to display in the AppBar.
 * @returns {JSX.Element} The AppBarComponent.
 */
const AppBarComponent = ({ sidebarOpen, handleSidebarToggle, title }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const [user] = useAuthState(auth);

  const handleLogoClick = () => {
    // If user is logged in, navigate to dashboard, otherwise to auth page
    navigate(user ? '/' : '/auth');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {!isLargeScreen && !isAuthPage && (
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, ml: 0, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }, borderRadius: '10%', p: 0.5 }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        )}
        <Button onClick={handleLogoClick} sx={{ p: 0 }}>
          <img src='/BannerTranspoLargeTxt.webp' alt="React logo" width="196" height="40" />
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
