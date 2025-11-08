import React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { LogoutButton } from '../pages/Buttons';

/**
 * SidebarItemComponent for individual sidebar items.
 * @param {Object} props - Component props.
 * @param {Object} props.sidebarItem - The item object containing text, path, and icon.
 * @returns {JSX.Element} The SidebarItemComponent.
 */
const SidebarItemComponent = ({ sidebarItem }) => {
  const { text, path, icon: IconComponent, requiresAuth } = sidebarItem;
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    console.log("SidebarItemComponent received:", sidebarItem);
    if (!sidebarItem) console.error("sidebarItem is undefined!");
    if (!text) console.error("sidebarItem.text is undefined!");
    if (!IconComponent) console.error("sidebarItem.icon is undefined for:", sidebarItem);
  }, [sidebarItem]);

  if (requiresAuth && !user) {
    return null;
  }

  return sidebarItem.isLogout ? (
    <LogoutButton />
    ) : (
    <ListItemButton
      component={Link}
      to={path}
      sx={{
        mx: 1,
        py: 0.8,
        '&:hover': {
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          '& .MuiSvgIcon-root': {
            color: '#3ba9ff',
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: 'white' }}>
        <IconComponent />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default SidebarItemComponent;
