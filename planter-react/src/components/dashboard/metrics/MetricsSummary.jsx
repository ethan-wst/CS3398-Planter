import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { 
  LocalFlorist as PlantIcon,
  Opacity as WaterIcon,
  AccessTime as TimeIcon,
  TaskAlt as TaskIcon,
  EventNote as UpcomingIcon
} from '@mui/icons-material';

const MetricsSummary = ({ metrics }) => {
  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2} 
      useFlexGap
    >
      <Box sx={{ 
        textAlign: 'center', 
        p: 1, 
        borderRadius: 1, 
        bgcolor: 'rgba(80, 113, 92, 0.08)',
        flexGrow: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        <PlantIcon color="primary" />
        <Typography variant="h5" fontWeight="medium">{metrics.totalPlants}</Typography>
        <Typography variant="body2" color="text.secondary">Total Plants</Typography>
      </Box>
      
      <Box sx={{ 
        textAlign: 'center', 
        p: 1, 
        borderRadius: 1, 
        bgcolor: 'rgba(76, 175, 80, 0.08)',
        flexGrow: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        <TaskIcon sx={{ color: '#4caf50' }} />
        <Typography variant="h5" fontWeight="medium">{metrics.tasksCompletedToday}</Typography>
        <Typography variant="body2" color="text.secondary">Tasks Completed Today</Typography>
      </Box>
      
      <Box sx={{ 
        textAlign: 'center', 
        p: 1, 
        borderRadius: 1, 
        bgcolor: 'rgba(255, 152, 0, 0.08)',
        flexGrow: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        <TimeIcon sx={{ color: '#ff9800' }} />
        <Typography variant="h5" fontWeight="medium">{metrics.tasksDueToday}</Typography>
        <Typography variant="body2" color="text.secondary">Tasks Due Today</Typography>
      </Box>
      
      <Box sx={{ 
        textAlign: 'center', 
        p: 1, 
        borderRadius: 1, 
        bgcolor: 'rgba(33, 150, 243, 0.08)',
        flexGrow: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        <UpcomingIcon sx={{ color: '#2196f3' }} />
        <Typography variant="h5" fontWeight="medium">{metrics.tasksDueNextWeek}</Typography>
        <Typography variant="body2" color="text.secondary">Tasks Due Next 7 Days</Typography>
      </Box>
    </Stack>
  );
};

export default MetricsSummary;
