import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  useTheme,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme as useCustomTheme } from '/src/theme/ThemeContext.jsx'; 
import { useTheme as useMuiTheme } from '@mui/material/styles'; 


const Appearance = () => {
  const theme = useMuiTheme();
  const { isLightTheme, toggleTheme } = useCustomTheme();


  const [appearanceSettings, setAppearanceSettings] = useState({
    compactMode: false,
    animations: true,
    fontSize: 'medium',
    cardStyle: 'modern'
  });

  const handleSettingChange = (setting, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const AppearanceSection = ({ title, children }) => (
    <Card 
      sx={{ 
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '12px',
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 1,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary 
              }}
            >
              {title}
            </Typography>
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 2,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        Appearance Settings
        <Divider sx={{ my: 1 }} />
      </Typography>

      <AppearanceSection title="Theme">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
               {isLightTheme ? <Brightness7Icon /> : <Brightness4Icon />}
             </IconButton>
        <Typography>{isLightTheme ? 'Light Mode' : 'Dark Mode'}</Typography>
          </Box>
      </AppearanceSection>

      <AppearanceSection title="Compact Mode">
        <FormControlLabel
          control={
            <Switch
              checked={appearanceSettings.compactMode}
              onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
            />
          }
          label="Enable Compact Mode"
        />
      </AppearanceSection>

      <AppearanceSection title="Animations">
        <FormControlLabel
          control={
            <Switch
              checked={appearanceSettings.animations}
              onChange={(e) => handleSettingChange('animations', e.target.checked)}
            />
          }
          label="Enable Animations"
        />
      </AppearanceSection>

      <AppearanceSection title="Font Size">
        <FormControl fullWidth>
          <Select
            value={appearanceSettings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
      </AppearanceSection>

      <AppearanceSection title="Card Style">
        <FormControl fullWidth>
          <Select
            value={appearanceSettings.cardStyle}
            onChange={(e) => handleSettingChange('cardStyle', e.target.value)}
          >
            <MenuItem value="modern">Modern</MenuItem>
            <MenuItem value="classic">Classic</MenuItem>
          </Select>
        </FormControl>
      </AppearanceSection>
    </Container>
  );
};

export default Appearance;