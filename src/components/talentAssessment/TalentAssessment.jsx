import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { tierCriteria } from '../../data/mockData';
import EvaluationForm from './EvaluationForm';
import ComparisonTools from './ComparisonTools';
import PotentialImpactAnalysis from './PotentialImpactAnalysis';
import ScholarshipCalculator from './ScholarshipCalculator';

const { FiClipboard, FiUsers, FiBarChart2, FiDollarSign, FiFilter, FiArrowRight } = FiIcons;

const TalentAssessment = ({ athletes, teamComposition, scholarshipLimits, globalGenderFilter }) => {
  const [activeTab, setActiveTab] = useState('evaluation');
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState({});

  // Filter athletes based on the global gender filter
  const filteredAthletes = useMemo(() => {
    if (globalGenderFilter === 'men') {
      return athletes.filter(athlete => athlete.gender === 'M');
    } else if (globalGenderFilter === 'women') {
      return athletes.filter(athlete => athlete.gender === 'F');
    }
    return athletes;
  }, [athletes, globalGenderFilter]);

  // Save evaluation results to state
  const saveEvaluation = (athleteId, evaluation) => {
    setEvaluationResults(prev => ({ ...prev, [athleteId]: evaluation }));
  };

  // Add or remove athlete from selection
  const toggleAthleteSelection = (athleteId) => {
    if (selectedAthletes.includes(athleteId)) {
      setSelectedAthletes(prev => prev.filter(id => id !== athleteId));
    } else {
      setSelectedAthletes(prev => [...prev, athleteId]);
    }
  };

  // Clear all selected athletes
  const clearSelectedAthletes = () => {
    setSelectedAthletes([]);
  };

  // Get the selected athletes' full data
  const selectedAthletesData = useMemo(() => {
    return filteredAthletes.filter(athlete => selectedAthletes.includes(athlete.id));
  }, [filteredAthletes, selectedAthletes]);

  // Get the title based on the gender filter
  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  const tabs = [
    { id: 'evaluation', name: 'Evaluation Forms', icon: FiClipboard },
    { id: 'comparison', name: 'Comparison Tools', icon: FiUsers },
    { id: 'impact', name: 'Potential Impact', icon: FiBarChart2 },
    { id: 'calculator', name: 'Scholarship Calculator', icon: FiDollarSign },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGenderTitle()}Talent Assessment
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive tools for evaluating athlete potential and making data-driven recruiting decisions
        </p>
      </div>

      {/* Current Filter Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Viewing:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                globalGenderFilter === 'all'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : globalGenderFilter === 'men'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
              }`}
            >
              {globalGenderFilter === 'all'
                ? 'All Athletes'
                : globalGenderFilter === 'men'
                ? 'Men\'s Team'
                : 'Women\'s Team'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Athletes Selected:</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {selectedAthletes.length} of {filteredAthletes.length}
            </span>
            {selectedAthletes.length > 0 && (
              <button
                onClick={clearSelectedAthletes}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {selectedAthletes.length > 0 && activeTab !== 'comparison' && (
            <button
              onClick={() => setActiveTab('comparison')}
              className="flex items-center gap-2 px-3 py-1 ml-auto bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Compare Selected ({selectedAthletes.length})
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
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

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'evaluation' && (
          <EvaluationForm
            athletes={filteredAthletes}
            selectedAthletes={selectedAthletes}
            toggleAthleteSelection={toggleAthleteSelection}
            evaluationResults={evaluationResults}
            saveEvaluation={saveEvaluation}
            tierCriteria={tierCriteria}
          />
        )}
        {activeTab === 'comparison' && (
          <ComparisonTools
            athletes={filteredAthletes}
            selectedAthletes={selectedAthletesData}
            toggleAthleteSelection={toggleAthleteSelection}
            evaluationResults={evaluationResults}
            tierCriteria={tierCriteria}
          />
        )}
        {activeTab === 'impact' && (
          <PotentialImpactAnalysis
            athletes={filteredAthletes}
            selectedAthletes={selectedAthletesData}
            teamComposition={teamComposition}
            evaluationResults={evaluationResults}
          />
        )}
        {activeTab === 'calculator' && (
          <ScholarshipCalculator
            athletes={filteredAthletes}
            selectedAthletes={selectedAthletesData}
            toggleAthleteSelection={toggleAthleteSelection}
            scholarshipLimits={scholarshipLimits}
            evaluationResults={evaluationResults}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TalentAssessment;