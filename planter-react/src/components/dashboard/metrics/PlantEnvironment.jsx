import React from 'react';
import { Box, Typography, Chip, Stack, Paper } from '@mui/material';
import { 
  WbSunny as SunIcon,
  Home as IndoorIcon,
  Yard as OutdoorIcon
} from '@mui/icons-material';

const PlantEnvironment = ({ metrics }) => {
  const unspecifiedCount = metrics.totalPlants - metrics.indoorPlants - metrics.outdoorPlants;
  
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1.5 }}>
        Plant Environment
      </Typography>
      
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<IndoorIcon />}
            label={`Indoor Plants: ${metrics.indoorPlants}`}
            sx={{ 
              bgcolor: 'rgba(138, 43, 226, 0.1)', 
              color: 'rgb(138, 43, 226)',
              '& .MuiChip-icon': { color: 'rgb(138, 43, 226)' }
            }}
          />
          
          <Chip
            icon={<OutdoorIcon />}
            label={`Outdoor Plants: ${metrics.outdoorPlants}`}
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              color: 'rgb(76, 175, 80)',
              '& .MuiChip-icon': { color: 'rgb(76, 175, 80)' }
            }}
          />
          
          {unspecifiedCount > 0 && (
            <Chip
              icon={<SunIcon />}
              label={`Unspecified: ${unspecifiedCount}`}
              sx={{ 
                bgcolor: 'rgba(158, 158, 158, 0.1)', 
                color: 'rgb(158, 158, 158)',
                '& .MuiChip-icon': { color: 'rgb(158, 158, 158)' } 
              }}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default PlantEnvironment;
