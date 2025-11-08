import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

// Material UI Components
import { 
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box 
} from '@mui/material';

// Icons
import ArrowBack from '@mui/icons-material/ArrowBack';

// Custom Components
import SidebarItemComponent from './SidebarItem';
import { sidebarItems, bottomSidebarItems } from '../data/sidebarItems';

//authentication
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

const drawerWidth = 240;

const Sidebar = ({ open, onClose, variant }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsView, setIsSettingsView] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsSettingsView(location.pathname.startsWith('/settings'));
  }, [location]);

  const currentItems = user
    ? sidebarItems
    : sidebarItems.filter((item) => !item.requiresAuth);
  
  const drawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: "#8fae9a",
      color: theme.palette.secondary.main,
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'space-between',
    },
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={drawerStyles}
      data-testid="sidebar"
    >
      <Toolbar />

    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>  
    
    <Box sx={{ flexGrow: 1 }}> 
      <List>
        {isSettingsView && (
          <ListItemButton 
            onClick={() => navigate('/')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <ArrowBack />
            </ListItemIcon>
            <ListItemText primary="Back" />
          </ListItemButton>
        )}
        
        {currentItems.map((sidebarItem) => (
          <SidebarItemComponent 
            key={sidebarItem.text} 
            sidebarItem={sidebarItem} 
          />
        ))}
        </List>
        </Box>

        <Box>
        <List>
        {bottomSidebarItems.map((sidebarItem) => (
          <SidebarItemComponent key={sidebarItem.text} sidebarItem={sidebarItem} 
          />
       ))}

        {!user && (
          <ListItemButton onClick={() => navigate("/auth")}>
            <ListItemText primary="Login/Register" />
          </ListItemButton>
        )}

        </List>
        </Box>

      </Box>
    </Drawer>
  );
};

export default Sidebar;