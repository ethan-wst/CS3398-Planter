import React from 'react';
import { Box, Paper, Typography, Badge, Stack, Tooltip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { getTasksDueOnDate, getCompletedTasksInRange } from '/src/utils/careTaskUtils';
import { useTheme } from '@mui/material/styles';

const WeeklyView = ({ currentDate, savedPlants, today }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      {days.map((day) => {
        // Get all tasks due on this day
        const tasksForDay = savedPlants.flatMap(plant => 
          getTasksDueOnDate(plant, day)
        );
        
        // Total count of tasks
        const taskCount = tasksForDay.length;

        const completedTasks = savedPlants.flatMap(plant => 
          getCompletedTasksInRange(plant, day, day)
        );
        const completedTaskCount = completedTasks.length;
        
        return (
          <Box key={day.toString()} sx={{ flex: 1 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1, 
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor:  format(day, 'dd') === format(today, 'dd') && format(day, 'MM') === format(today, 'MM') 
                  ? theme.palette.background.highlight 
                  : theme.palette.background.paper,
                //borderLeft: isToday ? `3px solid ${theme.palette.primary.main}` : 'none'
              }}
            >
              <Typography variant="subtitle2">
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="body2">
                {format(day, 'd')}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {taskCount > 0 && (
                  <Tooltip title={`${taskCount} task${taskCount !== 1 ? 's' : ''} due`}>
                    <Badge 
                      badgeContent={taskCount} 
                      color="info"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          height: '16px',
                          minWidth: '16px'
                        }
                      }}
                    >
                      <AssignmentIcon sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                    </Badge>
                  </Tooltip>
                )}
                {completedTaskCount > 0 && (
                  <Tooltip title={`${completedTaskCount} task${completedTaskCount !== 1 ? 's' : ''} completed`}>
                    <Badge 
                      badgeContent={completedTaskCount} 
                      color="success"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          height: '16px',
                          minWidth: '16px'
                        }
                      }}
                    >
                      <AssignmentIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                    </Badge>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          </Box>
        );
      })}
    </Stack>
  );
};

export default WeeklyView;