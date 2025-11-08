import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
  TextField,
  Box,
  useTheme
} from '@mui/material';

const Notifications = () => {
  const theme = useTheme();

  // Define available notifications by method
  const notificationTypes = {
    email: [
      { key: 'careTasks', label: 'Upcoming Care Tasks' },
      { key: 'missedTasks', label: 'Missed Task Alerts' },
      { key: 'monthlyReview', label: 'Monthly Reviews' },
      { key: 'achievements', label: 'Plant Achievements' }
    ],
    push: [
      { key: 'careTasks', label: 'Upcoming Care Tasks' },
      { key: 'missedTasks', label: 'Missed Task Alerts' }
    ],
    sms: [
      { key: 'careTasks', label: 'Upcoming Care Tasks' },
      { key: 'missedTasks', label: 'Missed Task Alerts' }
    ]
  };

  // Update initial state to include new notification types
  const [notificationMethods, setNotificationMethods] = useState({
    email: {
      enabled: true,
      address: '',
      preferences: {
        careTasks: false,
        missedTasks: false,
        monthlyReview: true,
        achievements: true
      }
    },
    push: {
      enabled: true,
      preferences: {
        careTasks: true,
        missedTasks: true,
        tips: true
      }
    },
    sms: {
      enabled: true,
      phoneNumber: '',
      preferences: {
        careTasks: true,
        missedTasks: true
      }
    }
  });

  // Handle method toggle
  const handleMethodToggle = (method) => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        enabled: !prev[method].enabled
      }
    }));
  };

  // Handle preference toggle
  const handlePreferenceToggle = (method, preference) => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        preferences: {
          ...prev[method].preferences,
          [preference]: !prev[method].preferences[preference]
        }
      }
    }));
  };

  // Handle contact info change
  const handleContactChange = (method, value) => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [method === 'email' ? 'address' : 'phoneNumber']: value
      }
    }));
  };

  // Notification section component
  const NotificationSection = ({ title, method, contactField }) => (
    <Card 
      sx={{ 
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '12px',
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3}}
      >
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
            <FormControlLabel
              control={
                <Switch
                  checked={notificationMethods[method].enabled}
                  onChange={() => handleMethodToggle(method)}
                  color="primary"
                />
              }
              label={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: notificationMethods[method].enabled 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}
                >
                  {notificationMethods[method].enabled ? 'Enabled' : 'Disabled'}
                </Typography>
              }
            />
          </Box>
          
          {notificationMethods[method].enabled && (
            <Stack spacing={3}>
              {contactField && (
                <TextField
                  label={method === 'email' ? 'Email Address' : 'Phone Number'}
                  type={method === 'email' ? 'email' : 'tel'}
                  value={notificationMethods[method][method === 'email' ? 'address' : 'phoneNumber']}
                  onChange={(e) => handleContactChange(method, e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
              
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 500,
                    color: theme.palette.text.primary 
                  }}
                >
                </Typography>
                
                <Stack spacing={1.5}>
                  {notificationTypes[method].map(({ key, label }) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={notificationMethods[method].preferences[key]}
                          onChange={() => handlePreferenceToggle(method, key)}
                          disabled={!notificationMethods[method].enabled}
                          color="primary"
                        />
                      }
                      label={
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: notificationMethods[method].enabled 
                              ? theme.palette.text.primary 
                              : theme.palette.text.disabled
                          }}
                        >
                          {label}
                        </Typography>
                      }
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
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
        Notification Settings
        <Divider sx={{ my: 1 }} />
      </Typography>

      <NotificationSection title="Email Notifications" method="email" contactField={true} />
      <NotificationSection title="Push Notifications" method="push" contactField={false} />
      <NotificationSection title="Text Message Notifications" method="sms" contactField={true} />
    </Container>
  );
};

export default Notifications;