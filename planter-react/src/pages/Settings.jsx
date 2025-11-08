import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Divider,
  useTheme,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const Settings = () => {
  const theme = useTheme();
  
  const [generalSettings, setGeneralSettings] = useState({
    language: 'english',
    timezone: 'UTC-5',
    dataPrivacy: true,
    analytics: true,
    autoBackup: false,
    backupFrequency: 'weekly',
    defaultPlantView: 'grid'
  });

  const handleSettingChange = (setting, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const SettingsSection = ({ title, children }) => (
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
        py: 4,
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
        General Settings
        <Divider sx={{ my: 1 }} />
      </Typography>

      <SettingsSection title="Language & Region">
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={generalSettings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            label="Language"
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="spanish">Spanish</MenuItem>
            <MenuItem value="french">French</MenuItem>
            <MenuItem value="german">German</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel sx={{ mb: 1 }}>Time Zone</InputLabel>
          <Select
            value={generalSettings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            label="Time Zone"
          >
            <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
            <MenuItem value="UTC-6">Central Time (UTC-6)</MenuItem>
            <MenuItem value="UTC-7">Mountain Time (UTC-7)</MenuItem>
            <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
          </Select>
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Privacy Settings">
        <FormControlLabel
          control={
            <Switch
              checked={generalSettings.dataPrivacy}
              onChange={(e) => handleSettingChange('dataPrivacy', e.target.checked)}
            />
          }
          label="Enhanced data privacy (limits data collection)"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={generalSettings.analytics}
              onChange={(e) => handleSettingChange('analytics', e.target.checked)}
            />
          }
          label="Allow anonymous usage analytics"
        />
      </SettingsSection>

      <SettingsSection title="Data Management">
        <FormControlLabel
          control={
            <Switch
              checked={generalSettings.autoBackup}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
            />
          }
          label="Enable automatic backups"
        />
        
        {generalSettings.autoBackup && (
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Backup Frequency</InputLabel>
            <Select
              value={generalSettings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        )}
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary">
            Export All Data
          </Button>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
        </Stack>
      </SettingsSection>
      
      <SettingsSection title="Plant Display">
        <FormControl fullWidth>
          <Select
            value={generalSettings.defaultPlantView}
            onChange={(e) => handleSettingChange('defaultPlantView', e.target.value)}
          >
            <MenuItem value="grid">Grid View</MenuItem>
            <MenuItem value="list">List View</MenuItem>
            <MenuItem value="calendar">Calendar View</MenuItem>
          </Select>
        </FormControl>
      </SettingsSection>
    </Container>
  );
};

export default Settings;