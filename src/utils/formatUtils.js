/**
 * Utility functions for formatting data for display
 */
import { format } from 'date-fns';

/**
 * Formats a date using date-fns
 * @param {string|Date} date - The date to format
 * @param {string} formatString - The format string
 * @returns {string} The formatted date string
 */
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

/**
 * Gets the ordinal text for a place number (1st, 2nd, 3rd, etc.)
 * @param {string|number} place - The place number
 * @returns {string} The place with ordinal suffix
 */
export const getPlaceText = (place) => {
  const num = parseInt(place);
  if (num === 1) return '1st';
  if (num === 2) return '2nd';
  if (num === 3) return '3rd';
  return `${num}th`;
};

/**
 * Gets the tier display name
 * @param {string} tier - The tier key
 * @param {object} tierCriteria - The tier criteria definitions
 * @returns {string} The display name for the tier
 */
export const getTierName = (tier, tierCriteria) => {
  return tierCriteria[tier]?.name || 'Unknown';
};

/**
 * Gets the CSS class for a tier color
 * @param {string} tier - The tier key
 * @param {object} tierCriteria - The tier criteria definitions
 * @returns {string} The CSS class for the tier's color
 */
export const getTierColor = (tier, tierCriteria) => {
  return tierCriteria[tier]?.color || 'bg-gray-500';
};

/**
 * Gets the CSS class for a rating value
 * @param {string|number} rating - The rating value (1-5)
 * @returns {string} The CSS class for the rating
 */
export const getRatingColorClass = (rating) => {
  switch (String(rating)) {
    case '1': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case '2': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case '3': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case '4': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case '5': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

/**
 * Gets the text label for a rating value
 * @param {string|number} rating - The rating value (1-5)
 * @returns {string} The text label for the rating
 */
export const getRatingLabel = (rating) => {
  switch (String(rating)) {
    case '1': return 'Poor';
    case '2': return 'Below Average';
    case '3': return 'Average';
    case '4': return 'Good';
    case '5': return 'Excellent';
    default: return 'Not Rated';
  }
};