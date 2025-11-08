import React from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';

const SunlightDistribution = ({ distribution, totalPlants }) => {
  // Calculate percentages for progress bars
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1.5 }}>
        Sunlight Requirements
      </Typography>
      
      <Stack spacing={1.5}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Full Sun</Typography>
            <Typography variant="body2" color="text.secondary">
              {distribution.full_sun} plants
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculatePercentage(distribution.full_sun, totalPlants)} 
            sx={{ height: 8, borderRadius: 1, bgcolor: 'rgba(255, 193, 7, 0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#ffc107' } 
            }} 
          />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Part Sun</Typography>
            <Typography variant="body2" color="text.secondary">
              {distribution.part_sun} plants
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculatePercentage(distribution.part_sun, totalPlants)} 
            sx={{ height: 8, borderRadius: 1, bgcolor: 'rgba(255, 152, 0, 0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' } 
            }} 
          />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Part Shade</Typography>
            <Typography variant="body2" color="text.secondary">
              {distribution.part_shade} plants
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculatePercentage(distribution.part_shade, totalPlants)} 
            sx={{ height: 8, borderRadius: 1, bgcolor: 'rgba(3, 169, 244, 0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#03a9f4' } 
            }} 
          />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Full Shade</Typography>
            <Typography variant="body2" color="text.secondary">
              {distribution.full_shade} plants
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculatePercentage(distribution.full_shade, totalPlants)} 
            sx={{ height: 8, borderRadius: 1, bgcolor: 'rgba(76, 175, 80, 0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } 
            }} 
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SunlightDistribution;
