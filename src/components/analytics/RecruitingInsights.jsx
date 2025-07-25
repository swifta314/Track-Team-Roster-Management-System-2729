import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { mapEventToGroup, getEventGroupName } from '../../utils/eventMapping';

const { FiTarget, FiUsers, FiTrendingUp } = FiIcons;

const RecruitingInsights = ({ recruitingNeeds, athletes }) => {
  const currentYear = new Date().getFullYear();
  const graduatingAthletes = athletes.filter(a => a.graduationYear === currentYear);

  const calculateEventGroupNeeds = () => {
    const needs = {};

    graduatingAthletes.forEach(athlete => {
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      const groupName = getEventGroupName(eventGroup);
      
      if (!needs[groupName]) {
        needs[groupName] = {
          replacing: 0,
          scholarshipAvailable: 0,
          priority: 'low'
        };
      }
      
      needs[groupName].replacing++;
      needs[groupName].scholarshipAvailable += athlete.scholarshipAmount;
    });

    // Set priority based on number of athletes to replace
    Object.keys(needs).forEach(group => {
      if (needs[group].replacing >= 3) needs[group].priority = 'high';
      else if (needs[group].replacing >= 2) needs[group].priority = 'medium';
    });

    return needs;
  };

  const eventGroupNeeds = calculateEventGroupNeeds();
  const priorityColorMap = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SafeIcon icon={FiTarget} className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recruiting Priorities</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(eventGroupNeeds).map(([group, data]) => (
            <div key={group} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{group}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColorMap[data.priority]}`}>
                  {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)} Priority
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Replacing:</span>
                  <span className="font-medium text-gray-900">{data.replacing} athletes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Scholarship Available:</span>
                  <span className="font-medium text-green-600">
                    ${data.scholarshipAvailable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recruiting Needs Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recruiting Needs Analysis</h3>
        </div>

        <div className="space-y-6">
          {Object.entries(recruitingNeeds).map(([priority, needs]) => (
            <div key={priority} className="space-y-4">
              <h4 className="font-medium text-gray-900 capitalize">{priority} Priority Needs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {needs.map((need, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{need.eventGroup}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        need.gender === 'Men' ? 'bg-blue-100 text-blue-800' : 
                        need.gender === 'Women' ? 'bg-pink-100 text-pink-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {need.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{need.tier} Level</span>
                    </div>
                    <p className="text-sm text-gray-600">{need.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RecruitingInsights;