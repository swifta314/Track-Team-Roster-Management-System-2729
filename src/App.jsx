import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AthleteBoard from './components/AthleteBoard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import ScholarshipReport from './components/reports/ScholarshipReport';
import {
  athletes as initialAthletes,
  teamComposition as initialTeamComposition,
  scholarshipLimits as initialScholarshipLimits,
  tierCriteria as initialTierCriteria,
  recruitingNeeds as initialRecruitingNeeds
} from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [athletes, setAthletes] = useState(initialAthletes);
  
  // Global gender filter state
  const [globalGenderFilter, setGlobalGenderFilter] = useState('both'); // 'men', 'women', 'both'
  
  // Settings state
  const [teamComposition, setTeamComposition] = useState(initialTeamComposition);
  const [scholarshipLimits, setScholarshipLimits] = useState(initialScholarshipLimits);
  const [tierCriteria, setTierCriteria] = useState(initialTierCriteria);
  const [recruitingNeeds, setRecruitingNeeds] = useState(initialRecruitingNeeds);

  const renderContent = useMemo(() => {
    const commonProps = {
      athletes,
      globalGenderFilter,
      setGlobalGenderFilter
    };

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            {...commonProps}
            teamComposition={teamComposition}
          />
        );
      case 'athletes':
        return (
          <AthleteBoard
            {...commonProps}
            setAthletes={setAthletes}
          />
        );
      case 'analytics':
        return (
          <Analytics
            {...commonProps}
            teamComposition={teamComposition}
            scholarshipLimits={scholarshipLimits}
            recruitingNeeds={recruitingNeeds}
          />
        );
      case 'reports':
        return (
          <ScholarshipReport
            {...commonProps}
            scholarshipLimits={scholarshipLimits}
          />
        );
      case 'settings':
        return (
          <Settings
            {...commonProps}
            setAthletes={setAthletes}
            teamComposition={teamComposition}
            setTeamComposition={setTeamComposition}
            scholarshipLimits={scholarshipLimits}
            setScholarshipLimits={setScholarshipLimits}
            tierCriteria={tierCriteria}
            setTierCriteria={setTierCriteria}
            recruitingNeeds={recruitingNeeds}
            setRecruitingNeeds={setRecruitingNeeds}
          />
        );
      default:
        return (
          <Dashboard
            {...commonProps}
            teamComposition={teamComposition}
          />
        );
    }
  }, [activeTab, athletes, teamComposition, scholarshipLimits, tierCriteria, recruitingNeeds, globalGenderFilter, setGlobalGenderFilter, setAthletes, setTeamComposition, setScholarshipLimits, setTierCriteria, setRecruitingNeeds]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {renderContent}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;