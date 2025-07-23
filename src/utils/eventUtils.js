// Re-export functions from eventMapping.js for backward compatibility
import {
  EVENT_GROUPS,
  EVENT_GROUP_NAMES,
  mapEventToGroup as mapEvent,
  getEventGroupName as getGroupName,
  getEventsForGroup,
  isValidEvent,
  getAllEvents
} from './eventMapping';

// For backward compatibility - maintain previous API
export const mapEventToGroup = (event) => {
  return mapEvent(event);
};

export const getEventGroupName = (groupKey) => {
  return getGroupName(groupKey);
};

// Additional utility for event group colors
export const getEventGroupColor = (eventGroup) => {
  const colors = {
    'Sprints': '#EF4444',
    'Middle Distance': '#F97316',
    'Distance': '#EAB308',
    'Jumps': '#22C55E',
    'Throws': '#3B82F6',
    'Hurdles': '#8B5CF6',
    'Multi-Events': '#EC4899'
  };
  
  return colors[eventGroup] || '#6B7280';
};

// Export all new functions and constants
export {
  EVENT_GROUPS,
  EVENT_GROUP_NAMES,
  getEventsForGroup,
  isValidEvent,
  getAllEvents
};