import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AthleteBoard from './components/AthleteBoard';
import Analytics from './components/Analytics';
import TalentAssessment from './components/talentAssessment/TalentAssessment';
import Settings from './components/Settings';
import FeedbackButton from './components/FeedbackButton';
import {athletes, teamComposition as initialTeamComposition, scholarshipLimits as initialScholarshipLimits, recruitingNeeds} from './data/mockData';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allAthletes, setAllAthletes] = useState(athletes);
  const [teamComposition, setTeamComposition] = useState(initialTeamComposition);
  const [scholarshipLimits, setScholarshipLimits] = useState(initialScholarshipLimits);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  const [compactMode, setCompactMode] = useState(false);
  const [globalGenderFilter, setGlobalGenderFilter] = useState(() => {
    const savedFilter = localStorage.getItem('defaultGenderFilter');
    return savedFilter || 'both';
  });

  // Apply classes for dark mode and compact mode
  useEffect(() => {
    if (compactMode) {
      document.body.classList.add('compact');
    } else {
      document.body.classList.remove('compact');
    }
  }, [compactMode]);

  // Reset data handler
  const handleResetData = () => {
    setAllAthletes(athletes);
    setTeamComposition(initialTeamComposition);
    setScholarshipLimits(initialScholarshipLimits);
    console.log("Data reset to initial state");
  };

  // Handle tab change with improved logging
  const handleTabChange = (tabId) => {
    console.log("App: Changing active tab to", tabId);
    setActiveTab(tabId);
  };

  // Render the active tab content with improved debugging
  const renderActiveTab = () => {
    console.log("Rendering active tab:", activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            athletes={allAthletes}
            teamComposition={teamComposition}
            scholarshipLimits={scholarshipLimits}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'athletes':
        console.log("Rendering Athletes tab with", allAthletes.length, "athletes");
        return (
          <AthleteBoard
            athletes={allAthletes}
            setAthletes={setAllAthletes}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
            isDarkMode={isDarkMode}
          />
        );
      case 'analytics':
        return (
          <Analytics
            athletes={allAthletes}
            teamComposition={teamComposition}
            scholarshipLimits={scholarshipLimits}
            recruitingNeeds={recruitingNeeds}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'reports':
        return (
          <TalentAssessment
            athletes={allAthletes}
            teamComposition={teamComposition}
            scholarshipLimits={scholarshipLimits}
            globalGenderFilter={globalGenderFilter}
          />
        );
      case 'settings':
        return (
          <Settings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            compactMode={compactMode}
            setCompactMode={setCompactMode}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
            onResetData={handleResetData}
            athletes={allAthletes}
            setAthletes={setAllAthletes}
            scholarshipLimits={scholarshipLimits}
            setScholarshipLimits={setScholarshipLimits}
            teamComposition={teamComposition}
            setTeamComposition={setTeamComposition}
          />
        );
      default:
        console.error("Unknown tab:", activeTab);
        return <div>Page not found</div>;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          globalGenderFilter={globalGenderFilter}
          setGlobalGenderFilter={setGlobalGenderFilter}
          isDarkMode={isDarkMode}
        />
        <main className="pb-12">
          {renderActiveTab()}
        </main>
      </div>
      <FeedbackButton />
    </div>
  );
};

export default App;