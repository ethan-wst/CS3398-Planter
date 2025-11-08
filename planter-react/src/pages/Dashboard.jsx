import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import CareTaskCarousel from '/src/components/dashboard/CareTaskCarousel';
import PlantMetrics from '/src/components/dashboard/PlantMetrics';
import { useTheme } from '@mui/material/styles';


const Dashboard = () => {
  const theme = useTheme();
  // Add a ref to force PlantMetrics refresh
  const [metricsKey, setMetricsKey] = useState(0);
  
  // Listen for metrics refresh events
  useEffect(() => {
    const handleMetricsRefresh = () => {
      // Force the PlantMetrics component to re-render by changing its key
      setMetricsKey(prevKey => prevKey + 1);
    };
    
    window.addEventListener('metricsRefreshNeeded', handleMetricsRefresh);
    window.addEventListener('plantWateringUpdated', handleMetricsRefresh);
    
    return () => {
      window.removeEventListener('metricsRefreshNeeded', handleMetricsRefresh);
      window.removeEventListener('plantWateringUpdated', handleMetricsRefresh);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
          Dashboard
        </Typography>
        
        <Stack spacing={3}>
          {/* Care Tasks Card - Top */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '200px',  // Ensure adequate height for the carousel
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            <CareTaskCarousel />
          </Paper>
          
          {/* Plant Metrics Card - Bottom with key to force refresh */}
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            <PlantMetrics key={metricsKey} />
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
};

export default Dashboard;
