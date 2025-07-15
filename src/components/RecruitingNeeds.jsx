import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { recruitingNeeds } from '../data/mockData';

const { FiTarget, FiPlus, FiCheck, FiClock, FiTrendingUp } = FiIcons;

const RecruitingNeeds = ({ genderFilter }) => {
  const filterNeeds = (needs) => {
    if (genderFilter === 'all') return needs;
    
    return needs.filter(need => {
      if (genderFilter === 'men') return need.gender === 'Men' || need.gender === 'Both';
      if (genderFilter === 'women') return need.gender === 'Women' || need.gender === 'Both';
      return true;
    });
  };

  const renderNeedsList = (needs, icon, colorClass) => {
    const filteredNeeds = filterNeeds(needs);
    
    if (filteredNeeds.length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No recruiting needs for this category</p>
        </div>
      );
    }
    
    return filteredNeeds.map((need, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
            <SafeIcon icon={icon} className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{need.eventGroup}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                need.gender === 'Men' 
                  ? 'bg-blue-100 text-blue-800'
                  : need.gender === 'Women'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-purple-100 text-purple-800'
              }`}>
                {need.gender}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                need.tier.includes('Elite') 
                  ? 'bg-yellow-100 text-yellow-800'
                  : need.tier.includes('Competitive')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {need.tier}
              </span>
            </div>
            <p className="text-sm text-gray-600">{need.notes}</p>
          </div>
        </div>
      </motion.div>
    ));
  };

  const getGenderTitle = () => {
    if (genderFilter === 'men') return "Men's Team - ";
    if (genderFilter === 'women') return "Women's Team - ";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">{getGenderTitle()}Recruiting Priorities</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiTarget} className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Priority Needs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderNeedsList(recruitingNeeds.priority, FiTarget, 'bg-red-600')}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Secondary Needs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderNeedsList(recruitingNeeds.secondary, FiTrendingUp, 'bg-blue-600')}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiClock} className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Future Considerations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderNeedsList(recruitingNeeds.future, FiClock, 'bg-purple-600')}
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruiting Process Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <SafeIcon icon={FiPlus} className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Initial Contact</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Identify prospect</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Send introductory email</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Follow-up call</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Share program information</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Evaluation</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Review competition results</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Watch video/live performance</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Check academic eligibility</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Assess team fit</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Commitment</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Campus visit</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Scholarship discussion</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">Offer letter</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-600">NCAA eligibility clearance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecruitingNeeds;