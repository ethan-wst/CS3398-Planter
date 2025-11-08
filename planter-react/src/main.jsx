import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from '/src/theme/ThemeContext.jsx';
import createCustomTheme from './theme/theme';
import App from './App.jsx';

const theme = createCustomTheme(true); // Use light theme by default

/**
 * Main entry point of the application.
 * @type {HTMLElement}
 */
const rootElement = document.getElementById('root'); // Getting the root element from the DOM
const root = createRoot(rootElement); // Creating a root for React rendering

root.render(
  <React.StrictMode> {/* Enabling strict mode for highlighting potential problems */}
    <ThemeContextProvider> {/* Providing the theme to the application */}
      <CssBaseline /> {/* Applying baseline CSS styles */}
      <App /> {/* Rendering the App component */}
      </ThemeContextProvider>
  </React.StrictMode>,
);
