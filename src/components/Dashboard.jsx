import React, { useState, useMemo } from 'react';
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
import PerformanceMetrics from './PerformanceMetrics';
import DataManagement from './DataManagement';
import AdvancedSearch from './AdvancedSearch';

const { FiArchive } = FiIcons;

const Dashboard = ({ athletes, teamComposition, globalGenderFilter, setGlobalGenderFilter, setAthletes }) => {
  const [includeArchived, setIncludeArchived] = useState(false);

  const filteredAthletes = useMemo(() => {
    return athletes.filter(athlete => {
      // Filter by archived status
      if (!includeArchived && athlete.status === 'archived') return false;

      // Filter by gender
      if (globalGenderFilter === 'both') return true;
      if (globalGenderFilter === 'men') return athlete.gender === 'M';
      if (globalGenderFilter === 'women') return athlete.gender === 'F';
      return true;
    });
  }, [athletes, includeArchived, globalGenderFilter]);

  const archivedCount = useMemo(() => {
    return athletes.filter(athlete => athlete.status === 'archived').length;
  }, [athletes]);

  const activeCount = useMemo(() => {
    return athletes.filter(athlete => athlete.status !== 'archived').length;
  }, [athletes]);

  const genderTitle = useMemo(() => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  }, [globalGenderFilter]);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {genderTitle}Ball State Track & Field Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
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
              {!includeArchived && archivedCount > 0 && (
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs ml-1">
                  {archivedCount}
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
                {filteredAthletes.length} of {includeArchived ? athletes.length : activeCount}
              </span>
            </div>
            {includeArchived && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Including:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {archivedCount} archived
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <QuickStats athletes={filteredAthletes} />

      <PerformanceMetrics 
        athletes={filteredAthletes}
        globalGenderFilter={globalGenderFilter}
      />

      <AdvancedSearch
        athletes={athletes}
        onFilteredResults={(results) => console.log("Filtered results:", results)}
      />

      <DataManagement
        athletes={athletes}
        setAthletes={setAthletes}
      />

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

export default React.memo(Dashboard);