import React from 'react';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 240;

/**
 * StyledMain is a styled component that represents the main content area.
 * It adjusts its margin and padding based on whether the sidebar is open or closed.
 *
 * @param {Object} theme - The theme object provided by MUI.
 * @param {boolean} open - Indicates whether the sidebar is open.
 * @returns {Object} The styles for the main content area.
 */
const StyledMain = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  backgroundColor: '#f0f0f0',
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    padding: theme.spacing(3),
  },
}));

/**
 * MainContent component provides the main content area of the application.
 * It adjusts its margin based on whether the sidebar is open or closed.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Indicates whether the sidebar is open.
 * @param {React.ReactNode} props.children - The content to be displayed inside the main content area.
 * @returns {JSX.Element} The rendered MainContent component.
 */
const MainContent = ({ open, children }) => {
  return (
    <StyledMain open={open}>
      <Toolbar />
      {children}
    </StyledMain>
  );
};

export default MainContent;
