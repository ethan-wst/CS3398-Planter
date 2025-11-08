/**
 * Helper utilities for rendering plant data in the profile
 */

/**
 * Safely renders complex data objects as strings
 * @param {any} value - Value to render, can be string, number, object, or array
 * @returns {string} - Safe string representation of the value
 */
export const safeRender = (value) => {
  if (value === null || value === undefined) {
    return 'Not available';
  }
  
  if (typeof value === 'object') {
    // Handle object with type, min_value, max_value, unit structure
    if (value.min_value !== undefined && value.max_value !== undefined) {
      return `${value.min_value} - ${value.max_value} ${value.unit || ''}`.trim();
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // For other objects, return a JSON string
    return JSON.stringify(value);
  }
  
  // Return value as is for strings, numbers, etc.
  return value;
};