import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { auth } from '/src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * SidebarItemComponent for individual sidebar items.
 * @param {Object} props - Component props.
 * @param {Object} props.sidebarItem - The item object containing text, path, and icon.
 * @returns {JSX.Element} The SidebarItemComponent.
 */
const SidebarItemComponent = ({ sidebarItem }) => {
  const { text, path, icon: IconComponent, requiresAuth, isLogout } = sidebarItem;
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Don't render items that require auth when user is not logged in
  if (requiresAuth && !user) {
    return null;
  }

  // Handle logout action
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/auth"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Common styling for all sidebar items
  const itemStyle = {
    mx: 1,
    py: 0.8,
    width: "93%",

    '&:hover': {
      borderRadius: '8px',  // Remove border radius for full width effect
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      '& .MuiSvgIcon-root': {
        color: '#3ba9ff',
      },
    },
  };

  return (
    <ListItemButton
      component={isLogout ? 'button' : Link}
      to={!isLogout ? path : undefined}
      onClick={isLogout ? handleLogout : undefined}
      sx={itemStyle}
    >
      <ListItemIcon sx={{ color: 'white' }}>
        <IconComponent />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default SidebarItemComponent;
