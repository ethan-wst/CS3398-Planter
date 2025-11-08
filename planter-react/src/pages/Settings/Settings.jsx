import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Divider,
  useTheme as useMuiTheme,
  FormControlLabel,
  Switch,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTheme } from '/src/theme/ThemeContext.jsx';
import { savePlantsToStorage, loadPlantsFromStorage } from '/src/utils/plantUtils.js';
import { getUserPreference, setUserPreference } from '/src/utils/preferencesUtils.js';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';

const SettingsSection = ({ title, children }) => {
  const theme = useMuiTheme();
  return (
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
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
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
};

const Settings = () => {
  const { isLightTheme, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const [storeAdvancedData, setStoreAdvancedData] = useState(false);
  const [userState, setUserState] = useState('');

  // Load user preferences when component mounts
  useEffect(() => {
    const advancedDataPref = getUserPreference('storeAdvancedData', false);
    setStoreAdvancedData(advancedDataPref);
    
    // Load the user's location preference
    const locationPref = getUserPreference('userState', '');
    setUserState(locationPref);
  }, []);

  const handleAdvancedDataToggle = (event) => {
    const newValue = event.target.checked;
    setStoreAdvancedData(newValue);
    setUserPreference('storeAdvancedData', newValue);
  };

  const handleStateChange = (event) => {
    const newState = event.target.value;
    setUserState(newState);
    setUserPreference('userState', newState);
  };

  const handleExportData = () => {
    const plants = loadPlantsFromStorage();
    const dataStr = JSON.stringify(plants);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'plant_data.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const plants = JSON.parse(e.target.result);
          if (Array.isArray(plants)) {
            savePlantsToStorage(plants);
            alert('Plants imported successfully!');
          } else {
            alert('Invalid file format. Please upload a valid JSON file.');
          }
        } catch (error) {
          alert('Error parsing file. Please ensure it is a valid JSON file.');
          console.error('Error importing plants:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        General Settings
        <Divider sx={{ my: 1 }} />
      </Typography>
      
      <SettingsSection title="Data Management">
        <FormControlLabel
          control={<Switch checked={storeAdvancedData} onChange={handleAdvancedDataToggle} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Store advanced plant data</Typography>
              <Tooltip title="When enabled, additional technical plant data from API will be stored. Useful for plant enthusiasts and advanced users.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleExportData} startIcon={<FileDownloadIcon />}>
            Export Plant Data
          </Button>
          <input
            type="file"
            id="import-file"
            style={{ display: 'none' }}
            onChange={handleImportData}
          />
          <label htmlFor="import-file">
            <Button variant="outlined" color="primary" component="span" startIcon={<FileUploadIcon />}>
              Import Plant Data
            </Button>
          </label>
        </Stack>
      </SettingsSection>

      <SettingsSection title="Language & Region">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select value={'english'} onChange={() => {}} label="Language">
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="spanish">Spanish</MenuItem>
            <MenuItem value="french">French</MenuItem>
            <MenuItem value="german">German</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Location (US State)</InputLabel>
          <Select
            value={userState}
            onChange={handleStateChange}
            label="Location (US State)"
          >
            <MenuItem value="">Select your state</MenuItem>
            <MenuItem value="AL">Alabama</MenuItem>
            <MenuItem value="AK">Alaska</MenuItem>
            <MenuItem value="AZ">Arizona</MenuItem>
            <MenuItem value="AR">Arkansas</MenuItem>
            <MenuItem value="CA">California</MenuItem>
            <MenuItem value="CO">Colorado</MenuItem>
            <MenuItem value="CT">Connecticut</MenuItem>
            <MenuItem value="DE">Delaware</MenuItem>
            <MenuItem value="FL">Florida</MenuItem>
            <MenuItem value="GA">Georgia</MenuItem>
            <MenuItem value="HI">Hawaii</MenuItem>
            <MenuItem value="ID">Idaho</MenuItem>
            <MenuItem value="IL">Illinois</MenuItem>
            <MenuItem value="IN">Indiana</MenuItem>
            <MenuItem value="IA">Iowa</MenuItem>
            <MenuItem value="KS">Kansas</MenuItem>
            <MenuItem value="KY">Kentucky</MenuItem>
            <MenuItem value="LA">Louisiana</MenuItem>
            <MenuItem value="ME">Maine</MenuItem>
            <MenuItem value="MD">Maryland</MenuItem>
            <MenuItem value="MA">Massachusetts</MenuItem>
            <MenuItem value="MI">Michigan</MenuItem>
            <MenuItem value="MN">Minnesota</MenuItem>
            <MenuItem value="MS">Mississippi</MenuItem>
            <MenuItem value="MO">Missouri</MenuItem>
            <MenuItem value="MT">Montana</MenuItem>
            <MenuItem value="NE">Nebraska</MenuItem>
            <MenuItem value="NV">Nevada</MenuItem>
            <MenuItem value="NH">New Hampshire</MenuItem>
            <MenuItem value="NJ">New Jersey</MenuItem>
            <MenuItem value="NM">New Mexico</MenuItem>
            <MenuItem value="NY">New York</MenuItem>
            <MenuItem value="NC">North Carolina</MenuItem>
            <MenuItem value="ND">North Dakota</MenuItem>
            <MenuItem value="OH">Ohio</MenuItem>
            <MenuItem value="OK">Oklahoma</MenuItem>
            <MenuItem value="OR">Oregon</MenuItem>
            <MenuItem value="PA">Pennsylvania</MenuItem>
            <MenuItem value="RI">Rhode Island</MenuItem>
            <MenuItem value="SC">South Carolina</MenuItem>
            <MenuItem value="SD">South Dakota</MenuItem>
            <MenuItem value="TN">Tennessee</MenuItem>
            <MenuItem value="TX">Texas</MenuItem>
            <MenuItem value="UT">Utah</MenuItem>
            <MenuItem value="VT">Vermont</MenuItem>
            <MenuItem value="VA">Virginia</MenuItem>
            <MenuItem value="WA">Washington</MenuItem>
            <MenuItem value="WV">West Virginia</MenuItem>
            <MenuItem value="WI">Wisconsin</MenuItem>
            <MenuItem value="WY">Wyoming</MenuItem>
            <MenuItem value="DC">District of Columbia</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Used to display the correct USDA hardiness zone map for your location
          </Typography>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Time Zone</InputLabel>
          <Select value={'UTC-5'} onChange={() => {}} label="Time Zone">
            <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
            <MenuItem value="UTC-6">Central Time (UTC-6)</MenuItem>
            <MenuItem value="UTC-7">Mountain Time (UTC-7)</MenuItem>
            <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
          </Select>
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Privacy Settings">
        <FormControlLabel
          control={<Switch checked={false} onChange={() => {}} />}
          label="Enhanced data privacy (limits data collection)"
        />

        <FormControlLabel
          control={<Switch checked={false} onChange={() => {}} />}
          label="Allow anonymous usage analytics"
        />
      </SettingsSection>

      <SettingsSection title="Plant Display">
        <FormControl fullWidth>
          <Select value={'grid'} onChange={() => {}}>
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