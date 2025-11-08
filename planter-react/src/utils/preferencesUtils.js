// filepath: /home/ethanwst/plant-planner/planter-react/src/utils/preferencesUtils.js
import { auth } from '../firebaseConfig';

/**
 * Gets a user preference value with an optional default value
 * @param {string} key - Preference key
 * @param {any} defaultValue - Default value if preference doesn't exist
 * @returns {any} - The preference value or default
 */
export const getUserPreference = (key, defaultValue = null) => {
  try {
    const user = auth.currentUser;
    if (!user) return defaultValue;
    
    const prefsKey = `userPrefs_${user.uid}`;
    const storedPrefs = localStorage.getItem(prefsKey);
    
    if (!storedPrefs) return defaultValue;
    
    const prefs = JSON.parse(storedPrefs);
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  } catch (error) {
    console.error('Error loading user preference:', error);
    return defaultValue;
  }
};

/**
 * Sets a user preference value
 * @param {string} key - Preference key
 * @param {any} value - Value to store
 */
export const setUserPreference = (key, value) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    const prefsKey = `userPrefs_${user.uid}`;
    const storedPrefs = localStorage.getItem(prefsKey);
    
    let prefs = {};
    if (storedPrefs) {
      prefs = JSON.parse(storedPrefs);
    }
    
    prefs[key] = value;
    localStorage.setItem(prefsKey, JSON.stringify(prefs));
    
    // Dispatch event to notify components about updated preferences
    window.dispatchEvent(new CustomEvent('userPreferencesUpdated', {
      detail: { key, value }
    }));
  } catch (error) {
    console.error('Error saving user preference:', error);
  }
};

/**
 * Gets all user preferences
 * @returns {Object} - All user preferences
 */
export const getAllUserPreferences = () => {
  try {
    const user = auth.currentUser;
    if (!user) return {};
    
    const prefsKey = `userPrefs_${user.uid}`;
    const storedPrefs = localStorage.getItem(prefsKey);
    
    if (!storedPrefs) return {};
    
    return JSON.parse(storedPrefs);
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {};
  }
};