import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  CircularProgress,
  Stack
} from '@mui/material';
import { auth } from '/src/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { loadPlantsFromStorage } from '/src/utils/plantUtils';
import { 
  startOfDay, 
  addDays, 
  isSameDay,  
} from 'date-fns';
import { 
  getTasksDueOnDate, 
  wasTaskCompletedOnDate,
} from '/src/utils/careTaskUtils';
import { useTheme } from '@mui/material/styles';

import MetricsSummary from './metrics/MetricsSummary';
import SunlightDistribution from './metrics/SunlightDistribution';
import PlantEnvironment from './metrics/PlantEnvironment';
import EmptyMetrics from './metrics/EmptyMetrics';

// Utility function to check if a plant needs a specific care task on a given date
const needsCareTaskOnDate = (plant, taskName, date) => {
  if (!plant.careTasks || !Array.isArray(plant.careTasks)) return false;
  
  // Find the specific task by name
  const task = plant.careTasks.find(t => t.name.toLowerCase() === taskName.toLowerCase());
  if (!task || !task.nextDueDate) return false;
  
  // Check if the task is due on the specified date
  const dueDate = startOfDay(parseISO(task.nextDueDate));
  return isSameDay(dueDate, startOfDay(date));
};

// Specific function for watering tasks (for backward compatibility)
const needsWateringOnDate = (plant, date) => {
  return needsCareTaskOnDate(plant, 'water', date);
};

const PlantMetrics = () => {
  const theme = useTheme();
  const [user, authLoading] = useAuthState(auth);
  const [metrics, setMetrics] = useState({
    totalPlants: 0,
    wateredToday: 0,
    tasksCompletedToday: 0,
    tasksDueToday: 0,
    tasksDueNextWeek: 0,
    indoorPlants: 0,
    outdoorPlants: 0,
    sunlightDistribution: {
      full_sun: 0,
      part_sun: 0,
      part_shade: 0,
      full_shade: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Memoize calculate metrics to avoid unnecessary recalculations
  const calculateMetrics = useCallback(() => {
    try {
      const plants = loadPlantsFromStorage();
      const today = startOfDay(new Date());
      
      // Basic counts
      const totalPlants = plants.length;
      
      // Count all tasks completed today
      let tasksCompletedToday = 0;
      let tasksDueToday = 0;
      let tasksDueNextWeek = 0;
      let wateredToday = 0;
      
      // Process each plant for task metrics
      plants.forEach(plant => {
        // Handle completed tasks
        if (plant.careTasks && Array.isArray(plant.careTasks)) {
          // Count tasks completed today
          plant.careTasks.forEach(task => {
            if (wasTaskCompletedOnDate(task, today)) {
              tasksCompletedToday++;
              // Also count watering tasks specifically for backward compatibility
              if (task.name.toLowerCase() === 'water') {
                wateredToday++;
              }
            }
          });
          
          // Count tasks due today
          const dueTasks = getTasksDueOnDate(plant, today);
          tasksDueToday += dueTasks.length;
          
          // Count tasks due in the next week
          for (let i = 1; i <= 7; i++) {
            const futureDate = addDays(today, i);
            tasksDueNextWeek += getTasksDueOnDate(plant, futureDate).length;
          }
        }
        
        // Handle legacy watering records (for backward compatibility)
        if (plant.lastWatered) {
          const lastWateredDate = startOfDay(new Date(plant.lastWatered));
          if (isSameDay(lastWateredDate, today) && !plant.careTasks?.some(task => 
              task.name.toLowerCase() === 'water' && wasTaskCompletedOnDate(task, today)
            )) {
            wateredToday++;
          }
        }
      });
      
      // Indoor vs outdoor plants
      const indoorPlants = plants.filter(plant => 
        plant.indoor === true || plant.plantDetails?.indoor === true
      ).length;
      
      const outdoorPlants = plants.filter(plant => 
        plant.indoor === false || plant.plantDetails?.indoor === false
      ).length;
      
      // Count sunlight preferences
      const sunlightDistribution = {
        full_sun: 0,
        part_sun: 0, 
        part_shade: 0,
        full_shade: 0
      };
      
      plants.forEach(plant => {
        if (plant.sunAmount && sunlightDistribution[plant.sunAmount] !== undefined) {
          sunlightDistribution[plant.sunAmount]++;
        }
      });
      
      setMetrics({
        totalPlants,
        wateredToday,
        tasksCompletedToday,
        tasksDueToday,
        tasksDueNextWeek,
        indoorPlants,
        outdoorPlants,
        sunlightDistribution
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error calculating plant metrics:", error);
      setLoading(false);
    }
  }, []);

  // Initial metrics calculation when component loads
  useEffect(() => {
    if (!authLoading && user) {
      calculateMetrics();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, calculateMetrics]);

  // Listen for storage events (when plants are updated elsewhere)
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the updated storage key is related to plants
      if (user && event.key && (
        event.key.includes('savedPlants') || 
        event.key.includes('wateredPlants')
      )) {
        calculateMetrics();
      }
    };

    const handlePlantUpdate = () => {
      if (user) {
        calculateMetrics();
      }
    };

    const handleWateringUpdate = (event) => {
      if (user) {
        console.log('Watering update detected in metrics:', event.detail);
        calculateMetrics();
      }
    };

    // Listen for localStorage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom update events from within the same tab
    window.addEventListener('plantDataUpdated', handlePlantUpdate);
    
    // Listen specifically for watering updates
    window.addEventListener('plantWateringUpdated', handleWateringUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('plantDataUpdated', handlePlantUpdate);
      window.removeEventListener('plantWateringUpdated', handleWateringUpdate);
    };
  }, [user, calculateMetrics]);

  // Display loading state while data is being fetched
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.background.paper,
         color: theme.palette.text.primary   }}>
        <CircularProgress size={40} />
      </Card>
    );
  }

  // Display message if no user is logged in
  if (!user) {
    return <EmptyMetrics reason="no-user" />;
  }

  // Display message if user has no plants
  if (metrics.totalPlants === 0) {
    return <EmptyMetrics reason="no-plants" />;
  }

  return (
    <Card sx={{ height: '100%', 
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary 
              }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Plant Metrics
        </Typography>

        <Stack spacing={2}>
          {/* First row - Key numbers */}
          <MetricsSummary metrics={metrics} />
          
          <Divider sx={{ my: 1 }} />
          
          {/* Second row - Sunlight and Environment distributions */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} useFlexGap>
            {/* Sunlight distribution */}
            <Stack spacing={3} sx={{ width: { xs: '100%', md: '50%' } }}>
              <SunlightDistribution 
                distribution={metrics.sunlightDistribution} 
                totalPlants={metrics.totalPlants} 
              />
            </Stack>
            
            {/* Plant Environment - now the only component in the right column */}
            <Stack spacing={3} sx={{ width: { xs: '100%', md: '50%' } }}>
              <PlantEnvironment metrics={metrics} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PlantMetrics;
