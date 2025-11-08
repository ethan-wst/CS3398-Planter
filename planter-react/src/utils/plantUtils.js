import { auth } from '../firebaseConfig';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { getUserPreference } from './preferencesUtils';

/**
 * Converts sun_amount values to readable text
 * @param {string} sunAmount - The sun amount value
 * @returns {string} - Human readable sun amount text
 */
export const formatSunAmount = (sunAmount) => {
  const sunOptions = {
    full_sun: "Full Sun (6+ hrs)",
    part_sun: "Part Sun (4-6 hrs)",
    part_shade: "Part Shade (2-4 hrs)",
    full_shade: "Full Shade (0-2 hrs)"
  };
  return sunOptions[sunAmount] || "Full Sun (6+ hrs)";
};

/**
 * Loads plants from local storage based on the current user
 * @returns {Array} Array of saved plants
 */
export const loadPlantsFromStorage = () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No current user found when loading plants');
      return [];
    }
    
    const savedPlantsKey = `savedPlants_${user.uid}`;
    const storedData = localStorage.getItem(savedPlantsKey);
    
    if (!storedData) {
      // No data found, return empty array
      return [];
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Validate that the parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error('Stored plant data is not an array:', parsedData);
      return [];
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading plants from storage:', error);
    return []; // Return empty array on error
  }
};

/**
 * Saves plants to local storage for the current user
 * @param {Array} plants - Array of plant objects to save
 */
export const savePlantsToStorage = (plants) => {
  const user = auth.currentUser;
  if (!user) return;
  
  const savedPlantsKey = `savedPlants_${user.uid}`;
  localStorage.setItem(savedPlantsKey, JSON.stringify(plants));
  
  // Dispatch events to notify other components about the update
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  // Custom event for components within the same tab
  window.dispatchEvent(new Event('plantDataUpdated'));
};

/**
 * Checks if a plant is already saved
 * @param {number|string} plantId - The ID of the plant to check
 * @returns {boolean} Whether the plant is already saved
 */
export const isPlantSaved = (plantId) => {
  const savedPlants = loadPlantsFromStorage();
  return savedPlants.some(plant => String(plant.id) === String(plantId));
};

/**
 * Converts text to title case (capitalize first letter of each word)
 * @param {string} text - Text to convert
 * @returns {string} - Title-cased text
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats a date for display in a user-friendly way
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string (Today, Tomorrow, or day of week)
 */
export const formatDateDisplay = (date) => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  
  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, tomorrow)) return 'Tomorrow';
  return format(date, 'EEEE');
};

/**
 * Determines if a plant needs watering on a given date
 * @param {Object} plant - The plant object
 * @param {Date} date - The date to check
 * @returns {boolean} - Whether the plant needs watering on that date
 */
export const needsWateringOnDate = (plant, date) => {
  const creationDate = plant.createdAt ? new Date(plant.createdAt) : new Date();
  const wateringFrequency = parseInt(plant.wateringFrequency) || 7;
  const lastWateredDate = plant.lastWatered ? new Date(plant.lastWatered) : null;
  const targetDate = startOfDay(date);
  
  // If the plant has never been watered (no lastWatered date)
  // and we're checking for today, it always needs watering
  if (!lastWateredDate && isSameDay(targetDate, startOfDay(new Date()))) {
    return true;
  }
  
  // Use creation date as fallback if no lastWatered date
  const startDate = startOfDay(lastWateredDate || creationDate);
  
  // Check if this is the creation date (plant was just added today)
  const isCreationDay = isSameDay(creationDate, targetDate);
  
  // Calculate days since last watered
  const daysSinceStart = Math.floor((targetDate - startDate) / (1000 * 3600 * 24));
  
  // Plant needs watering if:
  // 1. It's the day the plant was added (creation day) OR
  // 2. It's been some multiple of wateringFrequency days since last watering
  return isCreationDay || (daysSinceStart > 0 && daysSinceStart % wateringFrequency === 0);
};

/**
 * Checks if a plant was watered on the current day
 * @param {Object} plant - The plant object
 * @returns {boolean} - Whether the plant was watered today
 */
export const checkIfWateredToday = (plant) => {
  if (!plant.lastWatered) return false;
  
  const today = startOfDay(new Date());
  const lastWateredDate = startOfDay(new Date(plant.lastWatered));
  return isSameDay(lastWateredDate, today);
};

/**
 * Updates a plant's watering status
 * @param {number} plantId - The ID of the plant to update
 * @param {boolean} isWatered - Whether the plant should be marked as watered
 * @returns {Object} - Object containing updated plants and success message
 */
export const updatePlantWateringStatus = (plantId, isCurrentlyWatered) => {
  // Get all plants from storage
  const plants = loadPlantsFromStorage();
  let plantName = "";
  let isMarkedAsWatered = false;
  
  // Update the specific plant's lastWatered date
  const updatedPlants = plants.map(plant => {
    if (plant.id === plantId) {
      plantName = plant.name;
      
      // If the plant is already watered today, unmark it
      if (isCurrentlyWatered) {
        // If there was a previous watering date before today, restore it
        // Otherwise set to null or use creation date
        const previousWateringDate = plant.previousWatered || null;
        return {
          ...plant,
          lastWatered: previousWateringDate,
          previousWatered: null // Clear the previous watered date
        };
      } else {
        // Mark as watered - store current lastWatered as previousWatered first
        isMarkedAsWatered = true;
        return {
          ...plant,
          previousWatered: plant.lastWatered, // Store current value
          lastWatered: new Date().toISOString() // Update to current date
        };
      }
    }
    return plant;
  });
  
  // Save the updated plants back to storage
  savePlantsToStorage(updatedPlants);
  
  // Explicitly dispatch plantWateringUpdated event for metrics to listen for
  window.dispatchEvent(new CustomEvent('plantWateringUpdated', {
    detail: { plantId, isWateredNow: isMarkedAsWatered }
  }));
  
  // Return relevant data
  return {
    updatedPlants,
    message: isMarkedAsWatered 
      ? `${toTitleCase(plantName)} has been watered!` 
      : `${toTitleCase(plantName)} marked as not watered.`,
    isMarkedAsWatered
  };
};

/**
 * Gets the USDA hardiness zone information based on user's state
 * @returns {Object} - Object containing hardiness zone information
 */
export const getHardinessZoneInfo = () => {
  // Get user's state preference
  const userState = getUserPreference('userState', '');
  
  // State to hardiness zone mapping
  // This is a simplified mapping - actual zones can vary within states
  const stateToZoneMap = {
    'AL': { primary: '7b-8b', range: '7a-9a' },
    'AK': { primary: '1a-8b', range: '1a-8b' },
    'AZ': { primary: '5a-10b', range: '4b-11a' },
    'AR': { primary: '7a-8a', range: '6b-8b' },
    'CA': { primary: '5a-11a', range: '4b-11b' },
    'CO': { primary: '3b-6a', range: '3a-7a' },
    'CT': { primary: '6a-7a', range: '5b-7b' },
    'DE': { primary: '7a-7b', range: '7a-7b' },
    'FL': { primary: '8b-11a', range: '8a-11b' },
    'GA': { primary: '7a-9a', range: '6b-9b' },
    'HI': { primary: '9b-12b', range: '9a-13a' },
    'ID': { primary: '3b-6b', range: '3a-7b' },
    'IL': { primary: '5a-7a', range: '5a-7a' },
    'IN': { primary: '5b-6b', range: '5a-6b' },
    'IA': { primary: '4b-5b', range: '4a-6a' },
    'KS': { primary: '5b-6b', range: '5a-7a' },
    'KY': { primary: '6a-7a', range: '5b-7b' },
    'LA': { primary: '8a-9b', range: '8a-10a' },
    'ME': { primary: '3b-5b', range: '3b-6a' },
    'MD': { primary: '6b-7b', range: '6a-8a' },
    'MA': { primary: '5b-7a', range: '5a-7b' },
    'MI': { primary: '4a-6a', range: '3b-6b' },
    'MN': { primary: '3a-4b', range: '2b-5a' },
    'MS': { primary: '7b-9a', range: '7a-9b' },
    'MO': { primary: '5b-7a', range: '5a-7b' },
    'MT': { primary: '3a-5b', range: '2b-6a' },
    'NE': { primary: '4b-5b', range: '4a-6a' },
    'NV': { primary: '4a-9a', range: '4a-9b' },
    'NH': { primary: '3b-6a', range: '3b-6b' },
    'NJ': { primary: '6a-7b', range: '6a-7b' },
    'NM': { primary: '5a-8a', range: '4b-9a' },
    'NY': { primary: '3b-7a', range: '3b-7b' },
    'NC': { primary: '6a-8a', range: '5b-8b' },
    'ND': { primary: '3a-4a', range: '3a-4b' },
    'OH': { primary: '5b-6b', range: '5a-7a' },
    'OK': { primary: '6a-7b', range: '6a-8a' },
    'OR': { primary: '5a-9a', range: '4b-9b' },
    'PA': { primary: '5b-7a', range: '5a-7b' },
    'RI': { primary: '6a-7a', range: '6a-7b' },
    'SC': { primary: '7b-8b', range: '7a-9a' },
    'SD': { primary: '3b-5a', range: '3b-5b' },
    'TN': { primary: '6a-7b', range: '5b-8a' },
    'TX': { primary: '6a-9b', range: '6a-10a' },
    'UT': { primary: '4a-8a', range: '4a-8b' },
    'VT': { primary: '3b-5a', range: '3b-5b' },
    'VA': { primary: '6a-7b', range: '5b-8a' },
    'WA': { primary: '4a-8b', range: '4a-9a' },
    'WV': { primary: '5b-7a', range: '5a-7a' },
    'WI': { primary: '3b-5a', range: '3a-5b' },
    'WY': { primary: '3b-5a', range: '3a-5b' },
    'DC': { primary: '7a-7b', range: '7a-7b' },
  };

  // Get zone information based on user's state
  const zoneInfo = userState ? stateToZoneMap[userState] : null;
  
  return {
    ...zoneInfo,
    userState,
    defaultView: false
  };
};

/**
 * Determines if a plant is suitable for the user's hardiness zone
 * @param {Object} plant - The plant object with hardiness data
 * @returns {Object} - Suitability information
 */
export const checkPlantHardinessSuitability = (plant) => {
  if (!plant || !plant.advancedData || !plant.advancedData.hardiness) {
    return { suitable: null, message: 'No hardiness data available' };
  }
  
  const userZoneInfo = getHardinessZoneInfo();
  
  // If user hasn't set their location or primary zone is undefined
  if (!userZoneInfo || userZoneInfo.defaultView || !userZoneInfo.primary) {
    return { suitable: null, message: 'Set your location in Settings to check suitability' };
  }
  
  const plantZoneMin = plant.advancedData.hardiness.min;
  const plantZoneMax = plant.advancedData.hardiness.max;

  // Handle missing plant zone data
  if (!plantZoneMin || !plantZoneMax) {
    return { suitable: null, message: 'Incomplete hardiness zone data for this plant' };
  }

  try {
    // Simple check - this could be improved with more sophisticated zone comparison
    const userZoneMinMatch = userZoneInfo.primary.split('-')[0].match(/\d+/);
    const userZoneMaxMatch = userZoneInfo.primary.split('-')[1].match(/\d+/);
    
    if (!userZoneMinMatch || !userZoneMaxMatch) {
      return { suitable: null, message: 'Unable to parse your zone information' };
    }
    
    const userZoneMin = parseInt(userZoneMinMatch[0], 10);
    const userZoneMax = parseInt(userZoneMaxMatch[0], 10);
    
    // Treat plantZones as a string for comparison (it's not an array)
    const isLikelySuitable = plantZoneMin >= userZoneMin && plantZoneMax <= userZoneMax;

    if (isLikelySuitable) {
      return { 
        suitable: true, 
        message: `This plant is likely suitable for your zone (${userZoneInfo.primary})` 
      };
    } else {
      return { 
        suitable: false, 
        message: `This plant may not be suitable for your zone (${userZoneInfo.primary})` 
      };
    }
  } catch (error) {
    console.error('Error in hardiness zone comparison:', error);
    return { suitable: null, message: 'Error comparing plant hardiness zones' };
  }
};