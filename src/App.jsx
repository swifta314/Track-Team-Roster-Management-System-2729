import React, { useState } from 'react';
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

  // Debug logging for Analytics
  console.log("App State for Analytics:", {
    athleteCount: athletes.length,
    hasTeamComposition: Boolean(Object.keys(teamComposition).length),
    hasScholarshipLimits: Boolean(Object.keys(scholarshipLimits).length),
    hasRecruitingNeeds: Boolean(Object.keys(recruitingNeeds).length),
    globalGenderFilter
  });

  const renderContent = () => {
    console.log("Active tab:", activeTab);
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            athletes={athletes}
            teamComposition={teamComposition}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'athletes':
        return (
          <AthleteBoard
            athletes={athletes}
            setAthletes={setAthletes}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'analytics':
        console.log("Rendering Analytics component with props:", {
          athletes: athletes.length,
          teamComposition: Object.keys(teamComposition),
          scholarshipLimits: Object.keys(scholarshipLimits),
          recruitingNeeds: Object.keys(recruitingNeeds),
          globalGenderFilter
        });
        return (
          <Analytics
            athletes={athletes}
            teamComposition={teamComposition}
            scholarshipLimits={scholarshipLimits}
            recruitingNeeds={recruitingNeeds}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'reports':
        return (
          <ScholarshipReport
            athletes={athletes}
            scholarshipLimits={scholarshipLimits}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      case 'settings':
        return (
          <Settings
            teamComposition={teamComposition}
            setTeamComposition={setTeamComposition}
            scholarshipLimits={scholarshipLimits}
            setScholarshipLimits={setScholarshipLimits}
            tierCriteria={tierCriteria}
            setTierCriteria={setTierCriteria}
            recruitingNeeds={recruitingNeeds}
            setRecruitingNeeds={setRecruitingNeeds}
            athletes={athletes}
            setAthletes={setAthletes}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
      default:
        return (
          <Dashboard
            athletes={athletes}
            teamComposition={teamComposition}
            globalGenderFilter={globalGenderFilter}
            setGlobalGenderFilter={setGlobalGenderFilter}
          />
        );
    }
  };

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
          {renderContent()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;