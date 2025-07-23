// Centralized event mapping utility to fix inconsistencies

export const EVENT_GROUPS = {
  SPRINTS: 'sprints',
  MIDDLE_DISTANCE: 'middleDistance', 
  DISTANCE: 'distance',
  HURDLES: 'hurdles',
  JUMPS: 'jumps',
  THROWS: 'throws',
  MULTIS: 'multis'
};

export const EVENT_GROUP_NAMES = {
  [EVENT_GROUPS.SPRINTS]: 'Sprints',
  [EVENT_GROUPS.MIDDLE_DISTANCE]: 'Middle Distance',
  [EVENT_GROUPS.DISTANCE]: 'Distance',
  [EVENT_GROUPS.HURDLES]: 'Hurdles',
  [EVENT_GROUPS.JUMPS]: 'Jumps',
  [EVENT_GROUPS.THROWS]: 'Throws',
  [EVENT_GROUPS.MULTIS]: 'Multi-Events'
};

export const mapEventToGroup = (event) => {
  if (!event) return null;
  
  const eventMap = {
    // Sprints
    '100m': EVENT_GROUPS.SPRINTS,
    '200m': EVENT_GROUPS.SPRINTS,
    '400m': EVENT_GROUPS.SPRINTS,
    
    // Hurdles
    '110m Hurdles': EVENT_GROUPS.HURDLES,
    '100m Hurdles': EVENT_GROUPS.HURDLES,
    '400m Hurdles': EVENT_GROUPS.HURDLES,
    
    // Middle Distance
    '800m': EVENT_GROUPS.MIDDLE_DISTANCE,
    '1500m': EVENT_GROUPS.MIDDLE_DISTANCE,
    '1600m': EVENT_GROUPS.MIDDLE_DISTANCE,
    'Mile': EVENT_GROUPS.MIDDLE_DISTANCE,
    
    // Distance
    '3000m': EVENT_GROUPS.DISTANCE,
    '5000m': EVENT_GROUPS.DISTANCE,
    '10000m': EVENT_GROUPS.DISTANCE,
    '3000m Steeplechase': EVENT_GROUPS.DISTANCE,
    'Cross Country': EVENT_GROUPS.DISTANCE,
    'Half Marathon': EVENT_GROUPS.DISTANCE,
    'Marathon': EVENT_GROUPS.DISTANCE,
    
    // Jumps
    'Long Jump': EVENT_GROUPS.JUMPS,
    'Triple Jump': EVENT_GROUPS.JUMPS,
    'High Jump': EVENT_GROUPS.JUMPS,
    'Pole Vault': EVENT_GROUPS.JUMPS,
    
    // Throws
    'Shot Put': EVENT_GROUPS.THROWS,
    'Discus': EVENT_GROUPS.THROWS,
    'Javelin': EVENT_GROUPS.THROWS,
    'Hammer': EVENT_GROUPS.THROWS,
    'Weight Throw': EVENT_GROUPS.THROWS,
    
    // Multi-Events
    'Decathlon': EVENT_GROUPS.MULTIS,
    'Heptathlon': EVENT_GROUPS.MULTIS,
    'Pentathlon': EVENT_GROUPS.MULTIS,
    'Octathlon': EVENT_GROUPS.MULTIS
  };
  
  return eventMap[event] || null;
};

// Get friendly name for event group
export const getEventGroupName = (groupKey) => {
  return EVENT_GROUP_NAMES[groupKey] || groupKey;
};

// Get all events for a specific group
export const getEventsForGroup = (groupKey) => {
  const eventMap = {
    [EVENT_GROUPS.SPRINTS]: ['100m', '200m', '400m'],
    [EVENT_GROUPS.HURDLES]: ['110m Hurdles', '100m Hurdles', '400m Hurdles'],
    [EVENT_GROUPS.MIDDLE_DISTANCE]: ['800m', '1500m', '1600m', 'Mile'],
    [EVENT_GROUPS.DISTANCE]: ['3000m', '5000m', '10000m', '3000m Steeplechase', 'Cross Country'],
    [EVENT_GROUPS.JUMPS]: ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault'],
    [EVENT_GROUPS.THROWS]: ['Shot Put', 'Discus', 'Javelin', 'Hammer', 'Weight Throw'],
    [EVENT_GROUPS.MULTIS]: ['Decathlon', 'Heptathlon', 'Pentathlon', 'Octathlon']
  };
  
  return eventMap[groupKey] || [];
};

// Check if an event is valid
export const isValidEvent = (event) => {
  return mapEventToGroup(event) !== null;
};

// Get all available events
export const getAllEvents = () => {
  return Object.values(EVENT_GROUPS).flatMap(group => getEventsForGroup(group));
};