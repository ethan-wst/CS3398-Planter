import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import createCustomTheme from '/src/theme/theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  // Check local storage for the last selected theme
  const storedTheme = localStorage.getItem('isLightTheme');
  const initialTheme = storedTheme ? JSON.parse(storedTheme) : false; // Default to light

  const [isLightTheme, setIsLightTheme] = useState(initialTheme);
  const theme = createCustomTheme(isLightTheme);

  // Update local storage whenever the theme changes
  useEffect(() => {
    localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};