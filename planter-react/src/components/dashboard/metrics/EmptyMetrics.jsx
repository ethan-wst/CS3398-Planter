import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { LocalFlorist as PlantIcon } from '@mui/icons-material';

const EmptyMetrics = ({ reason }) => {
  let content;
  
  if (reason === 'no-user') {
    content = (
      <Typography textAlign="center">
        Please log in to view your plant metrics.
      </Typography>
    );
  } else if (reason === 'no-plants') {
    content = (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <PlantIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6">No Plants Yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add some plants to see your collection metrics!
        </Typography>
      </Box>
    );
  } else {
    content = (
      <Typography textAlign="center">
        Unable to display metrics at this time.
      </Typography>
    );
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default EmptyMetrics;
