// New file: /src/utils/careTaskUtils.js
import { parseISO, addDays, isSameDay, startOfDay } from 'date-fns';
import { loadPlantsFromStorage, savePlantsToStorage } from './plantUtils';

/**
 * Create a new care task for a plant
 * @param {string} plantId - The ID of the plant to add the task to
 * @param {Object} taskData - Data for the new task
 * @returns {Object} - Object containing the updated plant and success message
 */
export const createCareTask = (plantId, taskData) => {
  // Use the selected start date as the next due date if provided
  const startDate = taskData.startDateForDue ? new Date(taskData.startDateForDue) : null;
  
  // Create a new task object with required properties
  const newTask = {
    id: `${plantId}-${taskData.name}`,
    name: taskData.name,
    frequency: parseInt(taskData.frequency) || 7, // Default to weekly
    nextDueDate: startDate ? startDate.toISOString() : new Date().toISOString(),
    completionHistory: [],
    createdAt: new Date().toISOString()
  };
  
  // Get all plants
  const plants = loadPlantsFromStorage();
  
  // Find the specific plant and add the task
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantId) {
      // Initialize careTasks array if it doesn't exist
      const careTasks = Array.isArray(plant.careTasks) ? plant.careTasks : [];
      return {
        ...plant,
        careTasks: [...careTasks, newTask]
      };
    }
    return plant;
  });
  
  // Save updated plants
  savePlantsToStorage(updatedPlants);
  
  // Notify other components
  window.dispatchEvent(new CustomEvent('careTaskUpdated', {
    detail: { plantId, taskId: newTask.id, action: 'create' }
  }));
  
  // Return the updated plants and a success message
  return {
    updatedPlants,
    message: `New care task "${newTask.name}" created!`
  };
};

/**
 * Complete a care task for a plant
 * @param {string} plantId - The ID of the plant
 * @param {string} taskId - The ID of the task to complete
 * @returns {Object} - Object containing updated plants and success message
 */
export const completeTask = (plantId, taskId) => {
  const timestamp = new Date().toISOString();
  const plants = loadPlantsFromStorage();
  
  let taskName = "";
  
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantId) {
      const updatedTasks = plant.careTasks.map(task => {
        if (task.id === taskId) {
          taskName = task.name;
          return {
            ...task,
            completionHistory: [...(task.completionHistory || []), timestamp],
            nextDueDate: calculateNextDueDate(new Date(), task.frequency)
          };
        }
        return task;
      });
      
      return { ...plant, careTasks: updatedTasks };
    }
    return plant;
  });
  
  savePlantsToStorage(updatedPlants);
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('careTaskUpdated', {
    detail: { plantId, taskId, action: 'complete' }
  }));
  
  return {
    updatedPlants,
    message: `"${taskName}" task completed!`
  };
};

/**
 * Delete a care task from a plant
 * @param {string} plantId - The ID of the plant
 * @param {string} taskId - The ID of the task to delete
 * @returns {Object} - Object containing updated plants and success message
 */
export const deleteTask = (plantId, taskId) => {
  const plants = loadPlantsFromStorage();
  let taskName = "";
  
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantId) {
      // Find the task name before removing it
      const taskToDelete = plant.careTasks.find(task => task.id === taskId);
      if (taskToDelete) taskName = taskToDelete.name;
      
      // Filter out the task to delete
      return {
        ...plant,
        careTasks: plant.careTasks.filter(task => task.id !== taskId)
      };
    }
    return plant;
  });
  
  savePlantsToStorage(updatedPlants);
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('careTaskUpdated', {
    detail: { plantId, taskId, action: 'delete' }
  }));
  
  return {
    updatedPlants,
    message: `"${taskName}" task deleted`
  };
};

/**
 * Calculate the next due date for a task
 * @param {Date|null} completionDate - The date the task was completed (or null for new tasks)
 * @param {number} frequency - How often the task should repeat (in days)
 * @returns {string} - ISO string of the next due date
 */
export const calculateNextDueDate = (completionDate, frequency) => {
  if (completionDate == null) return new Date().toISOString();

  const startDate = completionDate || new Date();
  return addDays(startDate, frequency).toISOString();
};

/**
 * Get tasks due on a specific date for a plant
 * @param {Object} plant - The plant object
 * @param {Date} date - The date to check
 * @returns {Array} - Array of tasks due on the specified date
 */
export const getTasksDueOnDate = (plant, date) => {
  if (!plant.careTasks || !Array.isArray(plant.careTasks)) return [];
  
  const targetDate = startOfDay(date);
  const today = startOfDay(new Date());
  
  return plant.careTasks.filter(task => {
    if (!task.nextDueDate) return false;
    
    const dueDate = startOfDay(parseISO(task.nextDueDate));
    
    // If the task is overdue, it should only appear on today's view
    if (dueDate < today) {
      return isSameDay(targetDate, today);
    }
    
    // Otherwise, show the task on its actual due date
    return isSameDay(dueDate, targetDate);
  });
};

/**
 * Check if a plant has any care tasks due on a given date
 * @param {Object} plant - The plant object
 * @param {Date} date - The date to check
 * @returns {boolean} - Whether the plant has tasks due on the date
 */
export const hasTasksDueOnDate = (plant, date) => {
  return getTasksDueOnDate(plant, date).length > 0;
};

/**
 * Create a CareTask object with default values
 * @returns {Object} - A CareTask template object
 */
export const createTaskTemplate = () => {
  return {
    id: null,
    name: '',
    frequency: 7,
    nextDueDate: null,
    completionHistory: [],
    createdAt: null
  };
};

/**
 * Get completed tasks for a specific date range for a plant
 * @param {Object} plant - The plant object
 * @param {Date} startDate - The start date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {Array} - Array of completed tasks within the date range
 */
export const getCompletedTasksInRange = (plant, startDate, endDate) => {
  if (!plant.careTasks || !Array.isArray(plant.careTasks)) return [];

  const start = startOfDay(startDate);
  const end = startOfDay(endDate);

  return plant.careTasks.filter(task => {
    if (!task.completionHistory || !Array.isArray(task.completionHistory)) return false;

    return task.completionHistory.some(dateStr => {
      const completedDate = startOfDay(parseISO(dateStr));
      return completedDate >= start && completedDate <= end;
    });
  });
};

// Utility function to check if a task is completed today
export const isTaskCompletedToday = (plant, taskName) => {
  const today = new Date();
  const completedTasks = plant.completedTasks || [];

  return completedTasks.some(task => {
    const taskDate = new Date(task.date);
    return task.name === taskName &&
           taskDate.getDate() === today.getDate() &&
           taskDate.getMonth() === today.getMonth() &&
           taskDate.getFullYear() === today.getFullYear();
  });
};

/**
 * Push a task to the next day
 * @param {string} plantId - The ID of the plant
 * @param {string} taskId - The ID of the task to reschedule
 * @returns {Object} - Object containing updated plants and success message
 */
export const pushTaskToNextDay = (plantId, taskId) => {
  const plants = loadPlantsFromStorage();
  let taskName = "";
  const today = new Date();
  
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantId) {
      const updatedTasks = plant.careTasks.map(task => {
        if (task.id === taskId) {
          taskName = task.name;
          
          // Calculate tomorrow's date from today (not from the current due date)
          // This ensures tasks scheduled for today or overdue tasks are moved to tomorrow
          const tomorrow = addDays(today, 1);
          
          return {
            ...task,
            nextDueDate: startOfDay(tomorrow).toISOString()
          };
        }
        return task;
      });
      
      return { ...plant, careTasks: updatedTasks };
    }
    return plant;
  });
  
  savePlantsToStorage(updatedPlants);
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('careTaskUpdated', {
    detail: { plantId, taskId, action: 'postpone' }
  }));
  
  return {
    updatedPlants,
    message: `"${taskName}" pushed to tomorrow`
  };
};

// Function to check if a task was completed on a specific day
export const wasTaskCompletedOnDate = (task, date) => {
  if (!task.completionHistory || !Array.isArray(task.completionHistory)) return false;

  const targetDate = new Date(date);

  return task.completionHistory.some(completionDate => {
    const completedDate = new Date(completionDate);
    return (
      completedDate.getDate() === targetDate.getDate() &&
      completedDate.getMonth() === targetDate.getMonth() &&
      completedDate.getFullYear() === targetDate.getFullYear()
    );
  });
};