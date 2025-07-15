import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import GenderFilterBadge from './GenderFilterBadge';
import PerformanceTrends from './analytics/PerformanceTrends';
import ScholarshipAnalysis from './analytics/ScholarshipAnalysis';
import TeamPredictions from './analytics/TeamPredictions';
import GraduationImpact from './analytics/GraduationImpact';
import RecruitingInsights from './analytics/RecruitingInsights';
import CompetitiveAnalysis from './analytics/CompetitiveAnalysis';
import PredictiveAnalytics from './predictive/PredictiveAnalytics';

const { FiTrendingUp, FiDollarSign, FiTarget, FiUserCheck, FiUsers, FiAward, FiZap } = FiIcons;

const Analytics = ({ 
  athletes, 
  teamComposition, 
  scholarshipLimits, 
  recruitingNeeds, 
  globalGenderFilter, 
  setGlobalGenderFilter 
}) => {
  const [activeTab, setActiveTab] = useState('performance');

  // Filter athletes based on global gender filter
  const filteredAthletes = athletes.filter(athlete => {
    if (globalGenderFilter === 'both') return true;
    if (globalGenderFilter === 'men') return athlete.gender === 'M';
    if (globalGenderFilter === 'women') return athlete.gender === 'F';
    return true;
  });

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  const tabs = [
    {
      id: 'performance',
      name: 'Performance Trends',
      icon: FiTrendingUp,
      component: PerformanceTrends,
      description: 'Track athlete progression and identify performance patterns'
    },
    {
      id: 'scholarship',
      name: 'Scholarship Analysis',
      icon: FiDollarSign,
      component: ScholarshipAnalysis,
      description: 'Analyze scholarship allocation and ROI'
    },
    {
      id: 'predictions',
      name: 'Team Predictions',
      icon: FiTarget,
      component: TeamPredictions,
      description: 'Forecast team performance and championship potential'
    },
    {
      id: 'graduation',
      name: 'Graduation Impact',
      icon: FiUserCheck,
      component: GraduationImpact,
      description: 'Assess impact of graduating athletes'
    },
    {
      id: 'recruiting',
      name: 'Recruiting Insights',
      icon: FiUsers,
      component: RecruitingInsights,
      description: 'Data-driven recruiting recommendations'
    },
    {
      id: 'competitive',
      name: 'Competitive Analysis',
      icon: FiAward,
      component: CompetitiveAnalysis,
      description: 'Conference and national rankings analysis'
    },
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      icon: FiZap,
      component: PredictiveAnalytics,
      description: 'Advanced forecasting and predictive insights'
    }
  ];

  const renderActiveComponent = () => {
    const TabComponent = tabs.find(tab => tab.id === activeTab)?.component;
    
    console.log('Active Tab:', activeTab);
    console.log('Found Component:', TabComponent?.name);
    console.log('Props being passed:', {
      athletes: filteredAthletes?.length,
      teamComposition: Object.keys(teamComposition || {}).length,
      scholarshipLimits: Object.keys(scholarshipLimits || {}).length,
      recruitingNeeds: Object.keys(recruitingNeeds || {}).length,
      globalGenderFilter
    });

    if (!TabComponent) {
      console.error("Component not found for tab:", activeTab);
      return <div className="p-4 text-red-600">Component not found</div>;
    }

    return (
      <TabComponent
        athletes={filteredAthletes}
        teamComposition={teamComposition}
        scholarshipLimits={scholarshipLimits}
        recruitingNeeds={recruitingNeeds}
        globalGenderFilter={globalGenderFilter}
      />
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGenderTitle()}Team Analytics
        </h1>
        <p className="text-gray-600">
          Comprehensive analysis and predictions to support coaching decisions
        </p>
      </div>

      {/* Current Filter Indicator */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
          <span className="text-sm text-gray-600">
            ({filteredAthletes.length} athletes)
          </span>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border transition-all ${
              activeTab === tab.id
                ? 'border-ballstate-red bg-red-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-ballstate-red text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className={`font-semibold ${
                  activeTab === tab.id ? 'text-ballstate-red' : 'text-gray-900'
                }`}>
                  {tab.name}
                </h3>
                <p className="text-sm text-gray-500">{tab.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Active Component */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderActiveComponent()}
      </motion.div>
    </div>
  );
};

export default Analytics;