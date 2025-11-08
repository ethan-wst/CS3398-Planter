import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidebarComponent from './components/layout/Sidebar';
import AppBarComponent from './components/layout/AppBar';
import MainContent from './components/layout/MainContent';
import AppRoutes from './components/AppRoutes';
import { ThemeContextProvider } from '/src/theme/ThemeContext.jsx';

function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isSmallScreen);

  useEffect(() => {
    if (!isSmallScreen) {
      setSidebarOpen(true);
    }
  }, [isSmallScreen]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeContextProvider>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBarComponent
            sidebarOpen={sidebarOpen}
            handleSidebarToggle={handleSidebarToggle}
          />
          <SidebarComponent
            open={sidebarOpen}
            onClose={handleSidebarToggle}
            variant={!isSmallScreen ? 'persistent' : 'temporary'}
          />
          <MainContent open={sidebarOpen}>
            <AppRoutes />
          </MainContent>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;