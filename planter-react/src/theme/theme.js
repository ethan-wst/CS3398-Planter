import { createTheme } from '@mui/material/styles';

/**
 * Creates a theme instance based on the provided boolean flag.
 * @param {boolean} useLightTheme - True for light theme, false for dark theme.
 * @returns {import('@mui/material/styles').Theme} - The generated theme.
 */
const createCustomTheme = (useLightTheme) => {
  // Define color palette for light and dark themes
  const lightPalette = {
    primary: {
      main: '#50715c',
      light: '#6b9e83',
      dark: '#3d5c47',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#f5f5f5',
      dark: '#e0e0e0',
      contrastText: '#333333',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    sidebar: {
      main: '#8fae9a',
      hover: '#a8c2b4',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
      card: '#f8f8f8',
      highlight: '#e3f2fd',
    },
    text: {
      primary: '#333333',
      secondary: '#777777',
      disabled: '#9e9e9e',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  };

  const darkPalette = {
    primary: {
      main: '#2e8b57',
      light: '#4caf7d',
      dark: '#1b5e38',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e8e8e8',
      light: '#f5f5f5',
      dark: '#c1c1c1',
      contrastText: '#333333',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    sidebar: {
      main: '#27774a',
      hover: '#368a5e',
    },
    background: {
      default: '#282828',
      paper: '#3c3c3c',
      card: '#404040',
      highlight: '#1e3a55',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      disabled: '#7a7a7a',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: 'rgba(255, 255, 255, 0.7)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  };

  // Select the appropriate palette based on theme mode
  const palette = useLightTheme ? lightPalette : darkPalette;

  return createTheme({
    palette: palette,
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: useLightTheme 
              ? '0 2px 8px rgba(0, 0, 0, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: useLightTheme 
              ? '#c1c1c1 #f5f5f5'
              : '#555555 #2e2e2e',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
              backgroundColor: useLightTheme ? '#f5f5f5' : '#2e2e2e',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: useLightTheme ? '#c1c1c1' : '#555555',
              minHeight: 24,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: useLightTheme ? '#a8a8a8' : '#666666',
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: useLightTheme ? '#a8a8a8' : '#666666',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: useLightTheme ? '#a8a8a8' : '#666666',
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });
};

export default createCustomTheme;