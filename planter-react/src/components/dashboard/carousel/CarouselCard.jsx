import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  IconButton, 
  Chip, 
  Button, 
  Collapse, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageviewIcon from '@mui/icons-material/Pageview';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { format, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '/src/utils/plantUtils';
import { getTasksDueOnDate, wasTaskCompletedOnDate } from '/src/utils/careTaskUtils';
import { useTheme } from '@mui/material/styles';


const CarouselCard = ({ 
  plant, 
  expanded, 
  toggleExpanded, 
  toggleTaskCompletion, 
  postponeTask, 
  currentDate, 
  today, 
  cardStyles 
}) => {

  const theme = useTheme();

  const navigate = useNavigate();
  const isToday = isSameDay(currentDate, today);
  
  // Get tasks due on this date and completed tasks
  const tasksDue = getTasksDueOnDate(plant, currentDate);
  
  // Get completed tasks for this date from the plant's careTasks
  const completedTasks = plant.careTasks 
    ? plant.careTasks.filter(task => wasTaskCompletedOnDate(task, currentDate))
    : [];
  
  // Combine both sets of tasks and mark completion status
  const tasks = [...tasksDue, ...completedTasks]
    .filter((task, index, self) => 
      // Remove duplicates (tasks that appear in both arrays)
      index === self.findIndex(t => t.id === task.id)
    )
    .map(task => ({
      ...task,
      isCompleted: wasTaskCompletedOnDate(task, currentDate)
    }));

  // Return null if no tasks
  if (tasks.length === 0) return null;

  return (
    <Card sx={{ ...cardStyles, overflow: 'hidden' }}>
      {/* Card Header */}
      <CardContent sx={{ '&:last-child': { paddingBottom: '16px' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{toTitleCase(plant.name)}</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Show remaining tasks chip if there are incomplete tasks */}
            {tasks.some(task => !task.isCompleted) && (
              <Chip
                icon={<AssignmentIcon />}
                label={`${tasks.filter(task => !task.isCompleted).length}`}
                color="info"
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            
            {/* Show completed tasks chip */}
            {tasks.some(task => task.isCompleted) && (
              <Chip
                icon={<CheckCircleIcon />}
                label={`${tasks.filter(task => task.isCompleted).length}`}
                color="success"
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            
            <IconButton
              onClick={() => toggleExpanded(plant.id)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                p: 0.5
              }}
              size="small"
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      
      {/* Expandable Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: '16px' }}>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Care Tasks Due {isToday ? "Today" : format(currentDate, "MMM d")}:
          </Typography>
          
          <List dense sx={{ pl: 1, mb: 2 }}>
            {tasks.map(task => (
              <ListItem key={task.id} disableGutters sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {task.name.toLowerCase() === 'water' 
                    ? <WaterDropIcon color={task.isCompleted ? "success" : "primary"} fontSize="small" />
                    : <TaskAltIcon color={task.isCompleted ? "success" : "info"} fontSize="small" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary={task.name} 
                  secondary={task.isCompleted ? "Completed" : `Every ${task.frequency} days`}
                  slotProps={{
                    primary: {
                      variant: 'body2',
                      fontWeight: 500,
                      sx: task.isCompleted ? { textDecoration: 'line-through', color: 'text.secondary' } : {}
                    },
                    secondary: { variant: 'caption' }
                  }}
                />
                {isToday && !task.isCompleted && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => toggleTaskCompletion(plant.id, task.id)}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Done
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => postponeTask(plant.id, task.id)}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Push 
                    </Button>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<PageviewIcon />}
            onClick={() => navigate(`/plant/${plant.id}`)}
            sx={{ textTransform: 'none' }}
          >
            View Full Profile
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CarouselCard;
