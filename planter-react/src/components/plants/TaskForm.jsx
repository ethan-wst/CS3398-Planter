import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { createCareTask } from '/src/utils/careTaskUtils';

const TaskForm = ({ plantId, open, onClose }) => {
  const [taskData, setTaskData] = React.useState({
    name: '',
    frequency: '7',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [customFrequency, setCustomFrequency] = React.useState(false);
  const [dateError, setDateError] = React.useState('');

  // Get today's date formatted as YYYY-MM-DD for date validation
  const today = new Date().toISOString().split('T')[0];

  // Handle form input changes
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate date if the changed field is startDate
    if (name === 'startDate') {
      // Check if date is in the past
      if (value < today) {
        setDateError('Start date cannot be in the past');
        return; // Don't update state with invalid date
      } else {
        setDateError(''); // Clear error if date is valid
      }
    }
    
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));

    // If selecting frequency and it's "custom", enable custom frequency input
    if (name === "frequency" && value === "custom") {
      setCustomFrequency(true);
    } else if (name === "frequency") {
      setCustomFrequency(false);
    }
  };

  // Handle task creation
  const handleCreateTask = () => {
    // Add startDate to task data to use as the first due date
    const taskWithStartDate = {
      ...taskData,
      // Ensure we're using the user's selected start date as the first due date
      startDateForDue: taskData.startDate
    };
    
    // Create the task using the utility function
    const result = createCareTask(plantId, taskWithStartDate);
    
    // Reset form and close dialog
    setTaskData({
      name: '',
      frequency: '7',
      startDate: new Date().toISOString().split('T')[0]
    });
    
    // Close dialog and show success message
    onClose(result.message);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create New Care Task</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Task Name"
            name="name"
            value={taskData.name}
            onChange={handleTaskInputChange}
            margin="normal"
            required
            placeholder="e.g., Water, Fertilize, Prune"
          />
          
          <TextField
            fullWidth
            label="Frequency (days between tasks)"
            name="frequency"
            type="number"
            value={taskData.frequency}
            onChange={handleTaskInputChange}
            margin="normal"
            inputProps={{ min: 1 }}
            required
            placeholder="Enter number of days"
          />
          
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={taskData.startDate}
            onChange={handleTaskInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!dateError}
            helperText={dateError || "First day this task will appear on your dashboard"}
            inputProps={{ min: today }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button 
          onClick={handleCreateTask}
          variant="contained"
          disabled={!taskData.name || !!dateError}
          sx={{ 
            backgroundColor: "#50715c",
            "&:hover": { backgroundColor: "#6b9e83" }
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;