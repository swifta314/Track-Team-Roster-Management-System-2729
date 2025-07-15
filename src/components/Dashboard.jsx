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

const { FiArchive } = FiIcons;

const Dashboard = ({ athletes, teamComposition, globalGenderFilter, setGlobalGenderFilter }) => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGenderTitle()}Ball State Track & Field Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive roster and scholarship management
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Archive Toggle */}
            <button
              onClick={() => setIncludeArchived(!includeArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                includeArchived
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <SafeIcon icon={FiArchive} className="w-4 h-4" />
              {includeArchived ? 'Exclude Archived' : 'Include Archived'}
              {!includeArchived && getArchivedCount() > 0 && (
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs ml-1">
                  {getArchivedCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter indicator */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Athletes:</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filteredAthletes.length} of {includeArchived ? athletes.length : getActiveCount()}
              </span>
            </div>
            {includeArchived && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Including:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {getArchivedCount()} archived
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <QuickStats athletes={filteredAthletes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScholarshipOverview genderFilter={globalGenderFilter} athletes={filteredAthletes} />
        <ClassSizeChart athletes={filteredAthletes} />
      </div>

      <TeamCompositionChart genderFilter={globalGenderFilter} teamComposition={teamComposition} />

      <TierDistribution athletes={filteredAthletes} genderFilter={globalGenderFilter} />

      <RecruitingNeeds genderFilter={globalGenderFilter} />
    </div>
  );
};

export default Dashboard;