import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ScholarshipOverview from './ScholarshipOverview';
import ClassSizeChart from './ClassSizeChart';
import TierDistribution from './TierDistribution';
import TeamCompositionChart from './TeamCompositionChart';
import RecruitingNeeds from './RecruitingNeeds';
import QuickStats from './QuickStats';
import GenderFilterBadge from './GenderFilterBadge';

const { FiArchive, FiFilter, FiToggleLeft, FiToggleRight } = FiIcons;

const Dashboard = ({ athletes, teamComposition, scholarshipLimits, globalGenderFilter, setGlobalGenderFilter }) => {
  const [includeArchived, setIncludeArchived] = useState(false);

  const filteredAthletes = athletes.filter(athlete => {
    // Filter by archived status
    if (!includeArchived && athlete.status === 'archived') return false;
    
    // Filter by gender
    if (globalGenderFilter === 'both') return true;
    if (globalGenderFilter === 'men') return athlete.gender === 'M';
    if (globalGenderFilter === 'women') return athlete.gender === 'F';
    return true;
  });

  const getArchivedCount = () => {
    return athletes.filter(athlete => athlete.status === 'archived').length;
  };

  const getActiveCount = () => {
    return athletes.filter(athlete => athlete.status !== 'archived').length;
  };

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getGenderTitle()}Ball State Track & Field Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive roster and scholarship management
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Athletes:</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {filteredAthletes.length} of {includeArchived ? athletes.length : getActiveCount()}
              </span>
            </div>

            {/* Archived Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeArchived}
                  onChange={() => setIncludeArchived(!includeArchived)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${includeArchived ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${includeArchived ? 'translate-x-5' : ''}`}></div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <SafeIcon icon={FiArchive} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Include Archived
                  </span>
                  {getArchivedCount() > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {getArchivedCount()}
                    </span>
                  )}
                </div>
              </label>
            </div>

            {includeArchived && getArchivedCount() > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Including:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {getArchivedCount()} archived
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <QuickStats athletes={filteredAthletes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScholarshipOverview 
          genderFilter={globalGenderFilter} 
          athletes={filteredAthletes} 
          scholarshipLimits={scholarshipLimits} 
        />
        <ClassSizeChart athletes={filteredAthletes} />
      </div>

      <TeamCompositionChart genderFilter={globalGenderFilter} teamComposition={teamComposition} />

      <TierDistribution athletes={filteredAthletes} genderFilter={globalGenderFilter} />

      <RecruitingNeeds genderFilter={globalGenderFilter} />
    </div>
  );
};

export default Dashboard;