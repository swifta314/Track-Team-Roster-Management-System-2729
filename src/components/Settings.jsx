import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ResetConfirmationModal from './ResetConfirmationModal';

const { FiSettings, FiUsers, FiDollarSign, FiTarget, FiSave, FiRefreshCw, FiAlertCircle, FiCheck, FiEdit3, FiTrash2, FiPlus, FiInfo, FiPercent, FiDollar, FiRepeat, FiShuffle, FiEye, FiCpu, FiDatabase, FiMale, FiFemale, FiToggleLeft, FiToggleRight, FiMoon, FiSun, FiGrid } = FiIcons;

const Settings = ({
  teamComposition,
  setTeamComposition,
  scholarshipLimits,
  setScholarshipLimits,
  tierCriteria,
  setTierCriteria,
  recruitingNeeds,
  setRecruitingNeeds,
  athletes,
  setAthletes,
  globalGenderFilter,
  setGlobalGenderFilter
}) => {
  const [activeTab, setActiveTab] = useState('global');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Local state for editing
  const [localTeamComposition, setLocalTeamComposition] = useState(teamComposition);
  const [localScholarshipLimits, setLocalScholarshipLimits] = useState(scholarshipLimits);
  const [localTierCriteria, setLocalTierCriteria] = useState(tierCriteria);
  const [localRecruitingNeeds, setLocalRecruitingNeeds] = useState(recruitingNeeds);

  // Display settings
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get from localStorage with fallback to user's system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isCompactView, setIsCompactView] = useState(() => {
    return localStorage.getItem('compactView') === 'true';
  });

  // New state for enhanced features
  const [showScholarshipAs, setShowScholarshipAs] = useState('dollars'); // 'dollars' or 'percentage'
  const [scholarshipBudget, setScholarshipBudget] = useState({
    men: 200000, // Default budget amount
    women: 300000
  });

  // Scholarship value settings
  const [scholarshipValues, setScholarshipValues] = useState({
    men: {
      inState: 25000,
      outOfState: 45000
    },
    women: {
      inState: 25000,
      outOfState: 45000
    }
  });

  // For roster limit validation
  const [rosterLimitError, setRosterLimitError] = useState(null);

  // For automated recruiting suggestions
  const [suggestedNeeds, setSuggestedNeeds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset confirmation modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Apply dark mode when the state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Apply compact view when the state changes
  useEffect(() => {
    if (isCompactView) {
      document.documentElement.classList.add('compact');
    } else {
      document.documentElement.classList.remove('compact');
    }
    localStorage.setItem('compactView', isCompactView);
  }, [isCompactView]);

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  // Track changes
  useEffect(() => {
    const hasRosterChanges = JSON.stringify(localTeamComposition) !== JSON.stringify(teamComposition);
    const hasScholarshipChanges = JSON.stringify(localScholarshipLimits) !== JSON.stringify(scholarshipLimits);
    const hasTierChanges = JSON.stringify(localTierCriteria) !== JSON.stringify(tierCriteria);
    const hasRecruitingChanges = JSON.stringify(localRecruitingNeeds) !== JSON.stringify(recruitingNeeds);
    
    setHasChanges(hasRosterChanges || hasScholarshipChanges || hasTierChanges || hasRecruitingChanges);
  }, [
    localTeamComposition,
    localScholarshipLimits,
    localTierCriteria,
    localRecruitingNeeds,
    teamComposition,
    scholarshipLimits,
    tierCriteria,
    recruitingNeeds
  ]);

  // Validate roster limits
  useEffect(() => {
    // Calculate sum of all event group roster spots
    const menTotal = Object.values(localTeamComposition.eventGroups).reduce(
      (sum, group) => sum + group.rosterSpots.men, 0
    );
    const womenTotal = Object.values(localTeamComposition.eventGroups).reduce(
      (sum, group) => sum + group.rosterSpots.women, 0
    );

    // Check if event group totals exceed overall team limits
    if (menTotal > localTeamComposition.genderDistribution.men.total) {
      setRosterLimitError(`Men's event groups total (${menTotal}) exceeds overall team limit (${localTeamComposition.genderDistribution.men.total})`);
    } else if (womenTotal > localTeamComposition.genderDistribution.women.total) {
      setRosterLimitError(`Women's event groups total (${womenTotal}) exceeds overall team limit (${localTeamComposition.genderDistribution.women.total})`);
    } else {
      setRosterLimitError(null);
    }
  }, [localTeamComposition]);

  // Generate recruiting suggestions based on current roster
  const generateRecruitingSuggestions = () => {
    // Count athletes by event group and gender
    const eventGroupCounts = {};
    const eventGroups = Object.keys(localTeamComposition.eventGroups);
    
    // Initialize counts
    eventGroups.forEach(group => {
      eventGroupCounts[group] = { men: 0, women: 0 };
    });

    // Count current athletes
    athletes.forEach(athlete => {
      // Determine event group based on primary event
      const primaryEvent = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(primaryEvent);
      if (eventGroup && eventGroupCounts[eventGroup]) {
        if (athlete.gender === 'M') {
          eventGroupCounts[eventGroup].men++;
        } else {
          eventGroupCounts[eventGroup].women++;
        }
      }
    });

    // Generate suggestions based on gaps
    const suggestions = [];
    eventGroups.forEach(group => {
      const groupData = localTeamComposition.eventGroups[group];
      const menGap = groupData.rosterSpots.men - eventGroupCounts[group].men;
      const womenGap = groupData.rosterSpots.women - eventGroupCounts[group].women;

      // Suggest where we have significant gaps
      if (menGap >= 3) {
        suggestions.push({
          eventGroup: groupData.name,
          gender: 'Men',
          tier: menGap >= 5 ? 'Elite/Competitive' : 'Any',
          notes: `Need ${menGap} more athletes to reach roster target of ${groupData.rosterSpots.men}`
        });
      }
      if (womenGap >= 3) {
        suggestions.push({
          eventGroup: groupData.name,
          gender: 'Women',
          tier: womenGap >= 5 ? 'Elite/Competitive' : 'Any',
          notes: `Need ${womenGap} more athletes to reach roster target of ${groupData.rosterSpots.women}`
        });
      }
    });

    // Add graduation-based suggestions
    const graduatingAthletes = athletes.filter(a => a.graduationYear === 2024);
    const gradEventGroups = {};
    graduatingAthletes.forEach(athlete => {
      const primaryEvent = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(primaryEvent);
      if (eventGroup) {
        if (!gradEventGroups[eventGroup]) {
          gradEventGroups[eventGroup] = { men: 0, women: 0 };
        }
        if (athlete.gender === 'M') {
          gradEventGroups[eventGroup].men++;
        } else {
          gradEventGroups[eventGroup].women++;
        }
      }
    });

    // Add graduation-based suggestions
    Object.entries(gradEventGroups).forEach(([group, counts]) => {
      const groupName = localTeamComposition.eventGroups[group]?.name || group;
      if (counts.men >= 2) {
        suggestions.push({
          eventGroup: groupName,
          gender: 'Men',
          tier: 'Competitive',
          notes: `Replace ${counts.men} graduating seniors in ${new Date().getFullYear()}`
        });
      }
      if (counts.women >= 2) {
        suggestions.push({
          eventGroup: groupName,
          gender: 'Women',
          tier: 'Competitive',
          notes: `Replace ${counts.women} graduating seniors in ${new Date().getFullYear()}`
        });
      }
    });

    setSuggestedNeeds(suggestions);
    setShowSuggestions(true);
  };

  // Map an event to its event group
  const mapEventToGroup = (event) => {
    const eventMap = {
      // Sprints
      '100m': 'sprints',
      '200m': 'sprints',
      '400m': 'sprints',
      // Middle Distance
      '800m': 'middleDistance',
      '1500m': 'middleDistance',
      // Distance
      '3000m': 'distance',
      '5000m': 'distance',
      '10000m': 'distance',
      // Jumps
      'Long Jump': 'jumps',
      'Triple Jump': 'jumps',
      'High Jump': 'jumps',
      'Pole Vault': 'jumps',
      // Throws
      'Shot Put': 'throws',
      'Discus': 'throws',
      'Javelin': 'throws',
      'Hammer': 'throws',
    };
    return eventMap[event] || null;
  };

  // Add a suggested need to the recruiting needs
  const addSuggestedNeed = (need) => {
    setLocalRecruitingNeeds(prev => ({
      ...prev,
      priority: [...prev.priority, need]
    }));
  };

  const handleSave = () => {
    // Validate before saving
    if (rosterLimitError) {
      alert(`Cannot save settings: ${rosterLimitError}`);
      return;
    }

    setTeamComposition(localTeamComposition);
    setScholarshipLimits(localScholarshipLimits);
    setTierCriteria(localTierCriteria);
    setRecruitingNeeds(localRecruitingNeeds);

    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    setLocalTeamComposition(teamComposition);
    setLocalScholarshipLimits(scholarshipLimits);
    setLocalTierCriteria(tierCriteria);
    setLocalRecruitingNeeds(recruitingNeeds);

    setSaveStatus('reset');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handle reset all data
  const handleResetAllData = () => {
    setIsResetModalOpen(true);
  };

  // Perform the actual data reset
  const performDataReset = () => {
    // Reset all data to initial state
    const defaultAthletes = [];
    setAthletes(defaultAthletes);

    // Reset team composition
    const defaultTeamComposition = {
      eventGroups: {
        sprints: {
          name: 'Sprints',
          rosterSpots: {men: 10, women: 10},
          filled: {men: 0, women: 0},
          available: {men: 10, women: 10}
        },
        middleDistance: {
          name: 'Middle Distance',
          rosterSpots: {men: 8, women: 8},
          filled: {men: 0, women: 0},
          available: {men: 8, women: 8}
        },
        distance: {
          name: 'Distance',
          rosterSpots: {men: 10, women: 10},
          filled: {men: 0, women: 0},
          available: {men: 10, women: 10}
        },
        jumps: {
          name: 'Jumps',
          rosterSpots: {men: 6, women: 6},
          filled: {men: 0, women: 0},
          available: {men: 6, women: 6}
        },
        throws: {
          name: 'Throws',
          rosterSpots: {men: 6, women: 6},
          filled: {men: 0, women: 0},
          available: {men: 6, women: 6}
        }
      },
      genderDistribution: {
        men: {total: 40, filled: 0, available: 40},
        women: {total: 40, filled: 0, available: 40}
      },
      graduationTimeline: []
    };

    // Reset scholarship limits
    const defaultScholarshipLimits = {
      men: {total: 12.6, allocated: 0, available: 12.6},
      women: {total: 18.0, allocated: 0, available: 18.0}
    };

    // Reset recruiting needs
    const defaultRecruitingNeeds = {
      priority: [],
      secondary: [],
      future: []
    };

    // Update all state
    setTeamComposition(defaultTeamComposition);
    setLocalTeamComposition(defaultTeamComposition);
    setScholarshipLimits(defaultScholarshipLimits);
    setLocalScholarshipLimits(defaultScholarshipLimits);
    setRecruitingNeeds(defaultRecruitingNeeds);
    setLocalRecruitingNeeds(defaultRecruitingNeeds);

    // Show success message
    setSaveStatus('reset-all');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Reset an individual event group to match the original data
  const resetEventGroup = (eventKey) => {
    setLocalTeamComposition(prev => ({
      ...prev,
      eventGroups: {
        ...prev.eventGroups,
        [eventKey]: {...teamComposition.eventGroups[eventKey]}
      }
    }));
  };

  const updateEventGroup = (eventKey, field, gender, value) => {
    setLocalTeamComposition(prev => ({
      ...prev,
      eventGroups: {
        ...prev.eventGroups,
        [eventKey]: {
          ...prev.eventGroups[eventKey],
          [field]: {
            ...prev.eventGroups[eventKey][field],
            [gender]: parseInt(value) || 0
          }
        }
      }
    }));
  };

  const updateScholarshipLimit = (gender, field, value) => {
    setLocalScholarshipLimits(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  // Toggle between percentage and dollar amount for scholarships
  const toggleScholarshipDisplay = () => {
    setShowScholarshipAs(prev => prev === 'dollars' ? 'percentage' : 'dollars');
  };

  // Calculate percentage from dollar amount
  const calculatePercentage = (amount, gender) => {
    return ((amount / scholarshipBudget[gender]) * 100).toFixed(1);
  };

  // Calculate dollar amount from percentage
  const calculateDollarAmount = (percentage, gender) => {
    return ((percentage / 100) * scholarshipBudget[gender]).toFixed(2);
  };

  const updateTierCriteria = (tier, field, value) => {
    setLocalTierCriteria(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value
      }
    }));
  };

  const updateTierEventCriteria = (tier, event, gender, value) => {
    setLocalTierCriteria(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        criteria: {
          ...prev[tier].criteria,
          [event]: {
            ...prev[tier].criteria[event],
            [gender]: value
          }
        }
      }
    }));
  };

  const addRecruitingNeed = (priority) => {
    const newNeed = {
      eventGroup: 'New Event Group',
      gender: 'Both',
      tier: 'Competitive',
      notes: 'Add description here...'
    };
    setLocalRecruitingNeeds(prev => ({
      ...prev,
      [priority]: [...prev[priority], newNeed]
    }));
  };

  const updateRecruitingNeed = (priority, index, field, value) => {
    setLocalRecruitingNeeds(prev => ({
      ...prev,
      [priority]: prev[priority].map((need, i) => 
        i === index ? {...need, [field]: value} : need
      )
    }));
  };

  const removeRecruitingNeed = (priority, index) => {
    setLocalRecruitingNeeds(prev => ({
      ...prev,
      [priority]: prev[priority].filter((_, i) => i !== index)
    }));
  };

  // Calculate total roster spots for event groups
  const calculateEventGroupTotals = () => {
    return {
      men: Object.values(localTeamComposition.eventGroups).reduce(
        (sum, group) => sum + group.rosterSpots.men, 0
      ),
      women: Object.values(localTeamComposition.eventGroups).reduce(
        (sum, group) => sum + group.rosterSpots.women, 0
      )
    };
  };

  const eventGroupTotals = calculateEventGroupTotals();

  // Apply team focus distribution based on selected focus
  const applyTeamFocusDistribution = (focus) => {
    const menTotal = localTeamComposition.genderDistribution.men.total;
    const womenTotal = localTeamComposition.genderDistribution.women.total;

    // Define distribution percentages for each focus
    const distributionProfiles = {
      sprint: {
        sprints: 0.35,
        middleDistance: 0.15,
        distance: 0.10,
        jumps: 0.15,
        throws: 0.15,
        hurdles: 0.10
      },
      distance: {
        sprints: 0.10,
        middleDistance: 0.20,
        distance: 0.40,
        jumps: 0.10,
        throws: 0.10,
        hurdles: 0.10
      },
      jump: {
        sprints: 0.20,
        middleDistance: 0.10,
        distance: 0.10,
        jumps: 0.35,
        throws: 0.15,
        hurdles: 0.10
      },
      throw: {
        sprints: 0.15,
        middleDistance: 0.10,
        distance: 0.10,
        jumps: 0.15,
        throws: 0.35,
        hurdles: 0.15
      },
      hurdle: {
        sprints: 0.25,
        middleDistance: 0.15,
        distance: 0.10,
        jumps: 0.15,
        throws: 0.10,
        hurdles: 0.25
      },
      balanced: {
        sprints: 0.20,
        middleDistance: 0.15,
        distance: 0.20,
        jumps: 0.15,
        throws: 0.15,
        hurdles: 0.15
      }
    };

    const profile = distributionProfiles[focus];
    if (!profile) return;

    const newEventGroups = {};
    const eventGroupKeys = Object.keys(localTeamComposition.eventGroups);

    // Calculate target numbers for each event group
    eventGroupKeys.forEach(key => {
      const percentage = profile[key] || 0.15; // Default to 15% if not specified
      const menTarget = Math.round(menTotal * percentage);
      const womenTarget = Math.round(womenTotal * percentage);

      newEventGroups[key] = {
        ...localTeamComposition.eventGroups[key],
        rosterSpots: {
          men: menTarget,
          women: womenTarget
        }
      };
    });

    // Adjust for rounding errors to match exact totals
    const currentMenTotal = Object.values(newEventGroups).reduce((sum, group) => sum + group.rosterSpots.men, 0);
    const currentWomenTotal = Object.values(newEventGroups).reduce((sum, group) => sum + group.rosterSpots.women, 0);

    const menDiff = menTotal - currentMenTotal;
    const womenDiff = womenTotal - currentWomenTotal;

    // Apply differences to the first event group that has the highest allocation
    if (menDiff !== 0 || womenDiff !== 0) {
      const primaryGroup = Object.keys(profile).reduce((a, b) => profile[a] > profile[b] ? a : b);
      if (newEventGroups[primaryGroup]) {
        newEventGroups[primaryGroup].rosterSpots.men += menDiff;
        newEventGroups[primaryGroup].rosterSpots.women += womenDiff;
      }
    }

    setLocalTeamComposition(prev => ({
      ...prev,
      eventGroups: newEventGroups
    }));
  };

  // Filter recruiting needs based on gender filter
  const filterRecruitingNeeds = (needs) => {
    if (globalGenderFilter === 'both') return needs;
    return needs.filter(need => {
      if (globalGenderFilter === 'men') return need.gender === 'Men' || need.gender === 'Both';
      if (globalGenderFilter === 'women') return need.gender === 'Women' || need.gender === 'Both';
      return true;
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Toggle compact view
  const toggleCompactView = () => {
    setIsCompactView(prev => !prev);
  };

  const renderGlobalSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Global Application Settings</h3>
        
        <div className="space-y-6">
          {/* Gender Filter */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Team Gender Filter</h4>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select which team's data to display throughout the application. This setting affects all screens and reports.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setGlobalGenderFilter('men')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  globalGenderFilter === 'men' 
                    ? 'bg-blue-600 text-white dark:bg-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SafeIcon icon={FiMale} className="w-5 h-5" />
                <span className="font-medium">Men's Team Only</span>
              </button>
              
              <button
                onClick={() => setGlobalGenderFilter('women')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  globalGenderFilter === 'women' 
                    ? 'bg-pink-600 text-white dark:bg-pink-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SafeIcon icon={FiFemale} className="w-5 h-5" />
                <span className="font-medium">Women's Team Only</span>
              </button>
              
              <button
                onClick={() => setGlobalGenderFilter('both')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  globalGenderFilter === 'both' 
                    ? 'bg-purple-600 text-white dark:bg-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SafeIcon icon={FiUsers} className="w-5 h-5" />
                <span className="font-medium">Both Teams</span>
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Current Setting:</span> {' '}
                {globalGenderFilter === 'both' 
                  ? 'Showing data for both Men\'s and Women\'s teams' 
                  : globalGenderFilter === 'men'
                    ? 'Showing data for Men\'s team only'
                    : 'Showing data for Women\'s team only'
                }
              </p>
            </div>
          </div>
          
          {/* Display Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <SafeIcon icon={FiEye} className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Display Settings</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={isDarkMode ? FiMoon : FiSun} className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-amber-500'}`} />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                    <div className={`w-14 h-7 rounded-full transition ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${isDarkMode ? 'translate-x-7' : ''}`}></div>
                  </div>
                </label>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Status:</span> {isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={FiGrid} className={`w-5 h-5 ${isCompactView ? 'text-green-500' : 'text-gray-500'}`} />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Compact View</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show more data in less space</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isCompactView}
                      onChange={toggleCompactView}
                    />
                    <div className={`w-14 h-7 rounded-full transition ${isCompactView ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${isCompactView ? 'translate-x-7' : ''}`}></div>
                  </div>
                </label>
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    <span className="font-medium">Status:</span> {isCompactView ? 'Compact view enabled' : 'Standard view enabled'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">About Display Settings</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <SafeIcon icon={FiInfo} className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>Dark mode reduces eye strain in low-light environments and may conserve battery on OLED screens</span>
                </li>
                <li className="flex items-start gap-2">
                  <SafeIcon icon={FiInfo} className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>Compact view reduces padding and increases information density throughout the application</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRosterSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Group Roster Limits</h3>
          {rosterLimitError && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg">
              <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
              <span className="text-sm">{rosterLimitError}</span>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Roster Totals by Event Groups</h4>
              <div className="flex gap-6 mt-2">
                {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600 dark:text-blue-400">Men:</span>
                    <span className="text-sm font-medium dark:text-white">
                      {eventGroupTotals.men} / {localTeamComposition.genderDistribution.men.total}
                    </span>
                    <span className={`text-xs ${
                      eventGroupTotals.men > localTeamComposition.genderDistribution.men.total
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      ({eventGroupTotals.men > localTeamComposition.genderDistribution.men.total
                        ? 'Over by'
                        : 'Under by'} {Math.abs(eventGroupTotals.men - localTeamComposition.genderDistribution.men.total)})
                    </span>
                  </div>
                )}
                {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-pink-600 dark:text-pink-400">Women:</span>
                    <span className="text-sm font-medium dark:text-white">
                      {eventGroupTotals.women} / {localTeamComposition.genderDistribution.women.total}
                    </span>
                    <span className={`text-xs ${
                      eventGroupTotals.women > localTeamComposition.genderDistribution.women.total
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      ({eventGroupTotals.women > localTeamComposition.genderDistribution.women.total
                        ? 'Over by'
                        : 'Under by'} {Math.abs(eventGroupTotals.women - localTeamComposition.genderDistribution.women.total)})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Focus:</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      applyTeamFocusDistribution(e.target.value);
                      e.target.value = ''; // Reset dropdown
                    }
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue=""
                >
                  <option value="">Select Focus...</option>
                  <option value="sprint">Sprint Focused</option>
                  <option value="distance">Distance Focused</option>
                  <option value="jump">Jump Focused</option>
                  <option value="throw">Throw Focused</option>
                  <option value="hurdle">Hurdle Focused</option>
                  <option value="balanced">Balanced Program</option>
                </select>
              </div>
              <button
                onClick={() => {
                  // Auto-balance roster spots to match team totals
                  const eventGroups = Object.keys(localTeamComposition.eventGroups);
                  const menPerGroup = Math.floor(localTeamComposition.genderDistribution.men.total / eventGroups.length);
                  const womenPerGroup = Math.floor(localTeamComposition.genderDistribution.women.total / eventGroups.length);

                  // Distribute evenly with remainder going to first groups
                  let menRemaining = localTeamComposition.genderDistribution.men.total - (menPerGroup * eventGroups.length);
                  let womenRemaining = localTeamComposition.genderDistribution.women.total - (womenPerGroup * eventGroups.length);

                  const newEventGroups = {};
                  eventGroups.forEach(key => {
                    const extraMen = menRemaining > 0 ? 1 : 0;
                    const extraWomen = womenRemaining > 0 ? 1 : 0;
                    newEventGroups[key] = {
                      ...localTeamComposition.eventGroups[key],
                      rosterSpots: {
                        men: menPerGroup + extraMen,
                        women: womenPerGroup + extraWomen
                      }
                    };
                    menRemaining -= extraMen;
                    womenRemaining -= extraWomen;
                  });

                  setLocalTeamComposition(prev => ({
                    ...prev,
                    eventGroups: newEventGroups
                  }));
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              >
                <SafeIcon icon={FiShuffle} className="w-4 h-4" />
                Even Distribution
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-medium text-gray-900 dark:text-white">Event Group</th>
                {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                  <th className="text-center p-3 font-medium text-blue-600 dark:text-blue-400">Men's Spots</th>
                )}
                {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                  <th className="text-center p-3 font-medium text-pink-600 dark:text-pink-400">Women's Spots</th>
                )}
                {globalGenderFilter === 'both' && (
                  <th className="text-center p-3 font-medium text-gray-600 dark:text-gray-300">Total</th>
                )}
                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(localTeamComposition.eventGroups).map(([key, group]) => (
                <tr key={key} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{group.name}</td>
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={group.rosterSpots.men}
                        onChange={(e) => updateEventGroup(key, 'rosterSpots', 'men', e.target.value)}
                        className={`w-20 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          eventGroupTotals.men > localTeamComposition.genderDistribution.men.total
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}
                      />
                    </td>
                  )}
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={group.rosterSpots.women}
                        onChange={(e) => updateEventGroup(key, 'rosterSpots', 'women', e.target.value)}
                        className={`w-20 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          eventGroupTotals.women > localTeamComposition.genderDistribution.women.total
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}
                      />
                    </td>
                  )}
                  {globalGenderFilter === 'both' && (
                    <td className="p-3 text-center font-medium text-gray-600 dark:text-gray-300">
                      {group.rosterSpots.men + group.rosterSpots.women}
                    </td>
                  )}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => resetEventGroup(key)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                      title="Reset to original values"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Team Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">Men's Team</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Roster Spots</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localTeamComposition.genderDistribution.men.total}
                  onChange={(e) => setLocalTeamComposition(prev => ({
                    ...prev,
                    genderDistribution: {
                      ...prev.genderDistribution,
                      men: {
                        ...prev.genderDistribution.men,
                        total: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    eventGroupTotals.men > localTeamComposition.genderDistribution.men.total
                      ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}
                />
                {eventGroupTotals.men > localTeamComposition.genderDistribution.men.total && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Roster limit is lower than the sum of event group spots ({eventGroupTotals.men})
                  </p>
                )}
              </div>
            </div>
          )}
          {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
            <div className="space-y-4">
              <h4 className="font-medium text-pink-600 dark:text-pink-400">Women's Team</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Roster Spots</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localTeamComposition.genderDistribution.women.total}
                  onChange={(e) => setLocalTeamComposition(prev => ({
                    ...prev,
                    genderDistribution: {
                      ...prev.genderDistribution,
                      women: {
                        ...prev.genderDistribution.women,
                        total: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    eventGroupTotals.women > localTeamComposition.genderDistribution.women.total
                      ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}
                />
                {eventGroupTotals.women > localTeamComposition.genderDistribution.women.total && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Roster limit is lower than the sum of event group spots ({eventGroupTotals.women})
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderScholarshipSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">NCAA Scholarship Limits</h3>
          <button
            onClick={toggleScholarshipDisplay}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <SafeIcon icon={showScholarshipAs === 'dollars' ? FiPercent : FiDollar} className="w-4 h-4" />
            <span>Show as {showScholarshipAs === 'dollars' ? 'Percentage' : 'Dollars'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">Men's Team</h4>
              {/* Scholarship Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scholarship Budget</label>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={scholarshipBudget.men}
                    onChange={(e) => setScholarshipBudget(prev => ({
                      ...prev,
                      men: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This is your total scholarship budget for men's team (can be set to $0)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Scholarships Available</label>
                <div className="flex items-center">
                  {showScholarshipAs === 'percentage' && <span className="text-gray-500 dark:text-gray-400 mr-2">%</span>}
                  {showScholarshipAs === 'dollars' && <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>}
                  <input
                    type="number"
                    step={showScholarshipAs === 'percentage' ? "0.1" : "100"}
                    min="0"
                    max={showScholarshipAs === 'percentage' ? "100" : "1000000"}
                    value={
                      showScholarshipAs === 'percentage'
                        ? calculatePercentage(localScholarshipLimits.men.total * scholarshipBudget.men / 12.6, 'men')
                        : localScholarshipLimits.men.total * scholarshipBudget.men / 12.6
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const newValue = showScholarshipAs === 'percentage'
                        ? (value / 100) * 12.6 * scholarshipBudget.men / scholarshipBudget.men
                        : (value / scholarshipBudget.men) * 12.6;
                      updateScholarshipLimit('men', 'total', newValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {showScholarshipAs === 'percentage'
                    ? `Equivalent to $${(calculatePercentage(localScholarshipLimits.men.total * scholarshipBudget.men / 12.6, 'men') * scholarshipBudget.men / 100).toFixed(2)}`
                    : `Equivalent to ${(localScholarshipLimits.men.total * scholarshipBudget.men / 12.6 / scholarshipBudget.men * 100).toFixed(1)}% of budget`
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currently Allocated</label>
                <div className="flex items-center">
                  {showScholarshipAs === 'percentage' && <span className="text-gray-500 dark:text-gray-400 mr-2">%</span>}
                  {showScholarshipAs === 'dollars' && <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>}
                  <input
                    type="number"
                    step={showScholarshipAs === 'percentage' ? "0.1" : "100"}
                    min="0"
                    max={showScholarshipAs === 'percentage' ? "100" : scholarshipBudget.men}
                    value={
                      showScholarshipAs === 'percentage'
                        ? calculatePercentage(localScholarshipLimits.men.allocated * scholarshipBudget.men / 12.6, 'men')
                        : localScholarshipLimits.men.allocated * scholarshipBudget.men / 12.6
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const newValue = showScholarshipAs === 'percentage'
                        ? (value / 100) * 12.6 * scholarshipBudget.men / scholarshipBudget.men
                        : (value / scholarshipBudget.men) * 12.6;
                      updateScholarshipLimit('men', 'allocated', newValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {showScholarshipAs === 'percentage'
                    ? `Equivalent to $${(calculatePercentage(localScholarshipLimits.men.allocated * scholarshipBudget.men / 12.6, 'men') * scholarshipBudget.men / 100).toFixed(2)}`
                    : `Equivalent to ${(localScholarshipLimits.men.allocated * scholarshipBudget.men / 12.6 / scholarshipBudget.men * 100).toFixed(1)}% of budget`
                  }
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Available: </span>
                  {showScholarshipAs === 'percentage'
                    ? `${(calculatePercentage((localScholarshipLimits.men.total - localScholarshipLimits.men.allocated) * scholarshipBudget.men / 12.6, 'men'))}%`
                    : `$${((localScholarshipLimits.men.total - localScholarshipLimits.men.allocated) * scholarshipBudget.men / 12.6).toFixed(2)}`
                  }
                  <span className="text-xs ml-1">
                    ({(localScholarshipLimits.men.total - localScholarshipLimits.men.allocated).toFixed(1)} NCAA scholarships)
                  </span>
                </p>
              </div>

              {/* Average Full Scholarship Values */}
              <div className="border-t border-blue-200 dark:border-blue-700 pt-4 mt-4">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Average Full Scholarship Value</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">In-State ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={scholarshipValues.men.inState}
                      onChange={(e) => setScholarshipValues(prev => ({
                        ...prev,
                        men: { ...prev.men, inState: Math.max(0, parseInt(e.target.value) || 0) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Out-of-State ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={scholarshipValues.men.outOfState}
                      onChange={(e) => setScholarshipValues(prev => ({
                        ...prev,
                        men: { ...prev.men, outOfState: Math.max(0, parseInt(e.target.value) || 0) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  These values represent the cost of a full scholarship for in-state vs out-of-state athletes
                </p>
              </div>
            </div>
          )}

          {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
            <div className="space-y-4">
              <h4 className="font-medium text-pink-600 dark:text-pink-400">Women's Team</h4>
              {/* Scholarship Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scholarship Budget</label>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={scholarshipBudget.women}
                    onChange={(e) => setScholarshipBudget(prev => ({
                      ...prev,
                      women: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This is your total scholarship budget for women's team (can be set to $0)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Scholarships Available</label>
                <div className="flex items-center">
                  {showScholarshipAs === 'percentage' && <span className="text-gray-500 dark:text-gray-400 mr-2">%</span>}
                  {showScholarshipAs === 'dollars' && <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>}
                  <input
                    type="number"
                    step={showScholarshipAs === 'percentage' ? "0.1" : "100"}
                    min="0"
                    max={showScholarshipAs === 'percentage' ? "100" : "1000000"}
                    value={
                      showScholarshipAs === 'percentage'
                        ? calculatePercentage(localScholarshipLimits.women.total * scholarshipBudget.women / 18.0, 'women')
                        : localScholarshipLimits.women.total * scholarshipBudget.women / 18.0
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const newValue = showScholarshipAs === 'percentage'
                        ? (value / 100) * 18.0 * scholarshipBudget.women / scholarshipBudget.women
                        : (value / scholarshipBudget.women) * 18.0;
                      updateScholarshipLimit('women', 'total', newValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {showScholarshipAs === 'percentage'
                    ? `Equivalent to $${(calculatePercentage(localScholarshipLimits.women.total * scholarshipBudget.women / 18.0, 'women') * scholarshipBudget.women / 100).toFixed(2)}`
                    : `Equivalent to ${(localScholarshipLimits.women.total * scholarshipBudget.women / 18.0 / scholarshipBudget.women * 100).toFixed(1)}% of budget`
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currently Allocated</label>
                <div className="flex items-center">
                  {showScholarshipAs === 'percentage' && <span className="text-gray-500 dark:text-gray-400 mr-2">%</span>}
                  {showScholarshipAs === 'dollars' && <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>}
                  <input
                    type="number"
                    step={showScholarshipAs === 'percentage' ? "0.1" : "100"}
                    min="0"
                    max={showScholarshipAs === 'percentage' ? "100" : scholarshipBudget.women}
                    value={
                      showScholarshipAs === 'percentage'
                        ? calculatePercentage(localScholarshipLimits.women.allocated * scholarshipBudget.women / 18.0, 'women')
                        : localScholarshipLimits.women.allocated * scholarshipBudget.women / 18.0
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const newValue = showScholarshipAs === 'percentage'
                        ? (value / 100) * 18.0 * scholarshipBudget.women / scholarshipBudget.women
                        : (value / scholarshipBudget.women) * 18.0;
                      updateScholarshipLimit('women', 'allocated', newValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {showScholarshipAs === 'percentage'
                    ? `Equivalent to $${(calculatePercentage(localScholarshipLimits.women.allocated * scholarshipBudget.women / 18.0, 'women') * scholarshipBudget.women / 100).toFixed(2)}`
                    : `Equivalent to ${(localScholarshipLimits.women.allocated * scholarshipBudget.women / 18.0 / scholarshipBudget.women * 100).toFixed(1)}% of budget`
                  }
                </p>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-lg">
                <p className="text-sm text-pink-800 dark:text-pink-200">
                  <span className="font-medium">Available: </span>
                  {showScholarshipAs === 'percentage'
                    ? `${(calculatePercentage((localScholarshipLimits.women.total - localScholarshipLimits.women.allocated) * scholarshipBudget.women / 18.0, 'women'))}%`
                    : `$${((localScholarshipLimits.women.total - localScholarshipLimits.women.allocated) * scholarshipBudget.women / 18.0).toFixed(2)}`
                  }
                  <span className="text-xs ml-1">
                    ({(localScholarshipLimits.women.total - localScholarshipLimits.women.allocated).toFixed(1)} NCAA scholarships)
                  </span>
                </p>
              </div>

              {/* Average Full Scholarship Values */}
              <div className="border-t border-pink-200 dark:border-pink-700 pt-4 mt-4">
                <h5 className="font-medium text-pink-800 dark:text-pink-200 mb-3">Average Full Scholarship Value</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">In-State ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={scholarshipValues.women.inState}
                      onChange={(e) => setScholarshipValues(prev => ({
                        ...prev,
                        women: { ...prev.women, inState: Math.max(0, parseInt(e.target.value) || 0) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Out-of-State ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={scholarshipValues.women.outOfState}
                      onChange={(e) => setScholarshipValues(prev => ({
                        ...prev,
                        women: { ...prev.women, outOfState: Math.max(0, parseInt(e.target.value) || 0) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  These values represent the cost of a full scholarship for in-state vs out-of-state athletes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scholarship Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">NCAA Rules</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Men's Track & Field: 12.6 scholarships maximum</li>
              <li>• Women's Track & Field: 18.0 scholarships maximum</li>
              <li>• Scholarships can be split among multiple athletes</li>
              <li>• Academic requirements must be maintained</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Best Practices</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Reserve 10-15% for recruiting adjustments</li>
              <li>• Balance between performance and potential</li>
              <li>• Consider academic merit scholarships</li>
              <li>• Plan for multi-year commitments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Tier Criteria</h3>
        {Object.entries(localTierCriteria).map(([tier, criteria]) => (
          <div key={tier} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-4 h-4 rounded ${criteria.color}`}></div>
              <h4 className="font-medium text-gray-900 dark:text-white">{criteria.name}</h4>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={criteria.description}
                onChange={(e) => updateTierCriteria(tier, 'description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(criteria.criteria).map(([event, times]) => (
                <div key={event} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{event}</label>
                  <div className="flex gap-2">
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                      <input
                        type="text"
                        placeholder="Men's time"
                        value={times.men}
                        onChange={(e) => updateTierEventCriteria(tier, event, 'men', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                      <input
                        type="text"
                        placeholder="Women's time"
                        value={times.women}
                        onChange={(e) => updateTierEventCriteria(tier, event, 'women', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecruitingSettings = () => (
    <div className="space-y-6">
      {/* Auto-suggestion feature */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recruiting Needs Analysis</h3>
          <button
            onClick={generateRecruitingSuggestions}
            className="flex items-center gap-2 px-3 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiCpu} className="w-4 h-4" />
            Generate Suggestions
          </button>
        </div>
        {showSuggestions && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Suggested Recruiting Needs</h4>
            {suggestedNeeds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedNeeds
                  .filter(need => {
                    if (globalGenderFilter === 'both') return true;
                    if (globalGenderFilter === 'men') return need.gender === 'Men';
                    if (globalGenderFilter === 'women') return need.gender === 'Women';
                    return true;
                  })
                  .map((need, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{need.eventGroup}</span>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              need.gender === 'Men' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              need.gender === 'Women' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {need.gender}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                              {need.tier}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => addSuggestedNeed(need)}
                          className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-xs"
                        >
                          Add to Priority
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{need.notes}</p>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Click "Generate Suggestions" to analyze your roster and identify recruiting needs</p>
              </div>
            )}
          </div>
        )}
      </div>

      {Object.entries(localRecruitingNeeds).map(([priority, needs]) => (
        <div key={priority} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{priority} Recruiting Needs</h3>
            <button
              onClick={() => addRecruitingNeed(priority)}
              className="flex items-center gap-2 px-3 py-1 bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add Need
            </button>
          </div>
          <div className="space-y-4">
            {filterRecruitingNeeds(needs).map((need, index) => {
              const originalIndex = needs.findIndex(n => n === need);
              return (
                <div key={originalIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Group</label>
                      <input
                        type="text"
                        value={need.eventGroup}
                        onChange={(e) => updateRecruitingNeed(priority, originalIndex, 'eventGroup', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                      <select
                        value={need.gender}
                        onChange={(e) => updateRecruitingNeed(priority, originalIndex, 'gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tier</label>
                      <select
                        value={need.tier}
                        onChange={(e) => updateRecruitingNeed(priority, originalIndex, 'tier', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      >
                        <option value="Elite">Elite</option>
                        <option value="Elite/Competitive">Elite/Competitive</option>
                        <option value="Competitive">Competitive</option>
                        <option value="Competitive/Developing">Competitive/Developing</option>
                        <option value="Developing">Developing</option>
                        <option value="Any">Any</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeRecruitingNeed(priority, originalIndex)}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea
                      value={need.notes}
                      onChange={(e) => updateRecruitingNeed(priority, originalIndex, 'notes', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danger Zone</h3>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg mb-6">
          <p className="text-sm text-red-700 dark:text-red-300">
            The actions in this section are destructive and cannot be undone. Please proceed with caution.
          </p>
        </div>
        <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reset All Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                This will permanently delete all athlete profiles, performance data, scholarship information, and custom settings. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleResetAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'global', name: 'Global Settings', icon: FiSettings },
    { id: 'roster', name: 'Roster Limits', icon: FiUsers },
    { id: 'scholarships', name: 'Scholarships', icon: FiDollarSign },
    { id: 'performance', name: 'Performance Tiers', icon: FiTarget },
    { id: 'recruiting', name: 'Recruiting Needs', icon: FiEdit3 },
    { id: 'danger', name: 'Danger Zone', icon: FiTrash2 }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGenderTitle()}Team Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Configure roster limits, scholarships, and recruiting priorities</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
              saveStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
              saveStatus === 'reset-all' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
            }`}>
              <SafeIcon icon={
                saveStatus === 'success' ? FiCheck :
                saveStatus === 'reset-all' ? FiTrash2 :
                FiRefreshCw
              } className="w-4 h-4" />
              <span className="text-sm">
                {saveStatus === 'success' ? 'Settings saved!' :
                 saveStatus === 'reset-all' ? 'All data reset!' :
                 'Settings reset!'}
              </span>
            </div>
          )}
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-lg">
              <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || rosterLimitError}
            className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Current Filter Indicator */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuring:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            globalGenderFilter === 'both' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
            globalGenderFilter === 'men' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
          }`}>
            {globalGenderFilter === 'both' ? 'All Team Settings' :
             globalGenderFilter === 'men' ? 'Men\'s Team Settings' :
             'Women\'s Team Settings'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-ballstate-red dark:text-red-400 border-b-2 border-ballstate-red dark:border-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'global' && renderGlobalSettings()}
        {activeTab === 'roster' && renderRosterSettings()}
        {activeTab === 'scholarships' && renderScholarshipSettings()}
        {activeTab === 'performance' && renderPerformanceSettings()}
        {activeTab === 'recruiting' && renderRecruitingSettings()}
        {activeTab === 'danger' && renderDangerZone()}
      </motion.div>

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={performDataReset}
      />
    </div>
  );
};

export default Settings;