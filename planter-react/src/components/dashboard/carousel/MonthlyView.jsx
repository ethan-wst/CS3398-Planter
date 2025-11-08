import React from 'react';
import { Box, Paper, Typography, Badge, Stack, Tooltip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { getTasksDueOnDate, getCompletedTasksInRange } from '/src/utils/careTaskUtils';
import { useTheme } from '@mui/material/styles';

const MonthlyView = ({ currentDate, savedPlants, today }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const theme = useTheme();

  // Create week rows
  const weeks = [];
  let currentWeek = [];

  // Add empty days for the first week
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  days.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  // Fill in the remaining days of the last week
  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }
  weeks.push(currentWeek);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <Box key={day} sx={{ flex: 1 }}>
            <Typography variant="subtitle2" align="center">
              {day}
            </Typography>
          </Box>
        ))}
      </Stack>
      
      {weeks.map((week, weekIndex) => (
        <Stack direction="row" spacing={1} key={weekIndex}>
          {week.map((day, dayIndex) => (
            <Box key={dayIndex} sx={{ flex: 1 }}>
              {day && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                    backgroundColor: format(day, 'dd') === format(today, 'dd') && format(day, 'MM') === format(today, 'MM')
                      ? theme.palette.background.highlight
                      : theme.palette.background.paper,
                  }}
                >
                  <Typography variant="body2">
                    {format(day, 'd')}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {(() => {
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
                        <>
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
                                <AssignmentIcon sx={{ color: 'info.main', fontSize: '1rem' }} />
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
                                <AssignmentIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                              </Badge>
                            </Tooltip>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                </Paper>
              )}
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

export default MonthlyView;