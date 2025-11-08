import React, { useEffect, useState } from 'react';
import { Box, Stack, Snackbar, Alert, Typography, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { addDays, isSameDay, startOfDay, isBefore, addWeeks, addMonths} from 'date-fns';
import { loadPlantsFromStorage, formatDateDisplay } from '/src/utils/plantUtils';
import { 
  hasTasksDueOnDate, 
  getTasksDueOnDate,
  completeTask,
  getCompletedTasksInRange,
  wasTaskCompletedOnDate,
  pushTaskToNextDay
} from '/src/utils/careTaskUtils';
import { auth } from '/src/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import useTheme from '@mui/material/styles/useTheme';
import OpacityIcon from '@mui/icons-material/Opacity';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Import components
import CarouselCard from './carousel/CarouselCard';
import CarouselControls from './carousel/CarouselControls';
import EmptyCard from './carousel/EmptyCard';
import WeeklyView from './carousel/WeeklyView';
import MonthlyView from './carousel/MonthlyView';

const CareTaskCarousel = () => {
  const [user, authLoading, authError] = useAuthState(auth);
  const [savedPlants, setSavedPlants] = useState([]);
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [plantsWithTasks, setPlantsWithTasks] = useState([]);
  const [expandedPlants, setExpandedPlants] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [viewMode, setViewMode] = useState('daily');
  
  const today = startOfDay(new Date());
  const theme = useTheme();

  const commonStyles = {
    card: {
      width: '97%', 
      borderRadius: 2,
      border: '1px solid rgba(0, 0, 0, 0.12)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary
    },
    arrowButton: {
      m: 0.2, 
      p: 0.5, 
      width: "40px", 
      height: "40px", 
      display: 'flex',
      borderRadius: '10%'
    }
  };

  const toggleExpanded = (plantId) => {
    setExpandedPlants(prev => ({ ...prev, [plantId]: !prev[plantId] }));
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
      setCurrentDate(today);
    }
  };

  const handleDateNavigation = (direction) => {
    let newDate;
    switch (viewMode) {
      case 'daily':
        newDate = direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1);
        break;
      case 'weekly':
        newDate = direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1);
        break;
      case 'monthly':
        newDate = direction === 'prev' ? addMonths(currentDate, -1) : addMonths(currentDate, 1);
        break;
    }
    
    const futureLimit = addMonths(today, 3);
    if (!isBefore(futureLimit, newDate)) {
      setCurrentDate(newDate);
    }
  };

  const toggleTaskCompletion = (plantId, taskId) => {
    const result = completeTask(plantId, taskId);

    setSavedPlants(result.updatedPlants);
    updatePlantsWithTasks(result.updatedPlants, currentDate);

    setSuccessMessage(result.message);
  };

  const postponeTask = (plantId, taskId) => {
    const result = pushTaskToNextDay(plantId, taskId);
    
    setSavedPlants(result.updatedPlants);
    updatePlantsWithTasks(result.updatedPlants, currentDate);
    
    setSuccessMessage(result.message);
  };

  const updatePlantsWithTasks = (plants, date) => {
    const plantsWithTasksForDate = plants
      .map(plant => {
        // Get tasks due on this date
        const tasksDue = getTasksDueOnDate(plant, date);
        
        // Get tasks that were completed on this date (even if they're not technically "due" today)
        const completedTasks = plant.careTasks 
          ? plant.careTasks.filter(task => wasTaskCompletedOnDate(task, date))
          : [];
          
        // Combine tasks, removing duplicates
        const tasksForDate = [...tasksDue, ...completedTasks]
          .filter((task, index, self) => 
            index === self.findIndex(t => t.id === task.id)
          );
          
        // Only include plants that have tasks
        if (tasksForDate.length === 0) return null;
          
        return {
          ...plant,
          tasksForDate
        };
      })
      .filter(plant => plant !== null);

    setPlantsWithTasks(plantsWithTasksForDate);
  };

  useEffect(() => {
    if (!authLoading && user) {
      try {
        const plants = loadPlantsFromStorage();
        
        if (!plants || plants.length === 0) {
          setIsLoading(false);
          return;
        }
        
        const savedExpandedState = localStorage.getItem(`expandedPlants_${user.uid}`);
        const expandedState = savedExpandedState ? JSON.parse(savedExpandedState) : {};
        
        const plantsWithTasksDue = plants.filter(plant => 
          hasTasksDueOnDate(plant, today)
        );
        
        setSavedPlants(plants);
        setExpandedPlants(expandedState);
        setCurrentDate(today);
        setPlantsWithTasks(plantsWithTasksDue);
        
      } catch (error) {
        console.error('Error loading plant data:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (savedPlants.length > 0) {
      updatePlantsWithTasks(savedPlants, currentDate);
    }
  }, [currentDate, savedPlants]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`expandedPlants_${user.uid}`, JSON.stringify(expandedPlants));
    }
  }, [expandedPlants, user]);

  useEffect(() => {
    const handleTaskUpdated = () => {
      const updatedPlants = loadPlantsFromStorage();
      setSavedPlants(updatedPlants);
      updatePlantsWithTasks(updatedPlants, currentDate);
    };
    
    window.addEventListener('careTaskUpdated', handleTaskUpdated);
    window.addEventListener('storage', handleTaskUpdated);
    
    return () => {
      window.removeEventListener('careTaskUpdated', handleTaskUpdated);
      window.removeEventListener('storage', handleTaskUpdated);
    };
  }, [currentDate]);

  if (authLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress size={40} sx={{ mr: 2 }} />
        <Typography>Loading plant data...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Please log in to view your care tasks.</Typography>
      </Box>
    );
  }

  if (authError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="error">Error checking authentication status. Please refresh the page.</Typography>
      </Box>
    );
  }

  // Determine if all tasks are completed using careTaskUtils functions
  const allTasksCompleted = Array.isArray(plantsWithTasks) && plantsWithTasks.length > 0 && plantsWithTasks.every(plant => {
    // If there are no tasks for this date, consider it "completed"
    if (!Array.isArray(plant.tasksForDate) || plant.tasksForDate.length === 0) return true;
    
    // Check if every task is completed for the current date
    return plant.tasksForDate.every(task => wasTaskCompletedOnDate(task, currentDate));
  });

  return (
    <Box className="flex-container" sx={{ display: 'flex', flexDirection: 'column', height: '100%', mr: 2 }} data-testid="care-task-carousel">
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="daily">
            <CalendarViewDayIcon sx={{ mr: 1 }} />
            Daily
          </ToggleButton>
          <ToggleButton value="weekly">
            <CalendarViewWeekIcon sx={{ mr: 1 }} />
            Weekly
          </ToggleButton>
          <ToggleButton value="monthly">
            <CalendarMonthIcon sx={{ mr: 1 }} />
            Monthly
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <CarouselControls
        currentDate={currentDate}
        today={today}
        handlePrevClick={() => handleDateNavigation('prev')}
        handleNextClick={() => handleDateNavigation('next')}
        formatDateDisplay={formatDateDisplay}
        arrowButtonStyles={commonStyles.arrowButton}
        viewMode={viewMode}
      />
      
      <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'auto', pb: 1 }}>
        {viewMode === 'daily' ? (
          plantsWithTasks.length === 0 ? (
            <EmptyCard cardStyles={commonStyles.card} />
          ) : (
            <Stack spacing={2}>
              {plantsWithTasks.map(plant => (
                <CarouselCard
                  key={plant.id}
                  plant={plant}
                  expanded={expandedPlants[plant.id]}
                  toggleExpanded={toggleExpanded}
                  toggleTaskCompletion={toggleTaskCompletion}
                  postponeTask={postponeTask}
                  currentDate={currentDate}
                  today={today}
                  cardStyles={commonStyles.card}
                  completedTasks={plant.completedTasks}
                />
              ))}
            </Stack>
          )
        ) : viewMode === 'weekly' ? (
          <WeeklyView
            currentDate={currentDate}
            savedPlants={savedPlants}
            today={today}
          />
        ) : (
          <MonthlyView
            currentDate={currentDate}
            savedPlants={savedPlants}
            today={today}
          />
        )}
      </Box>
    </Box>
  );
};

export default CareTaskCarousel;
