import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { mapEventToGroup, getEventGroupName } from '../../utils/eventMapping';

const { FiUserMinus, FiDollarSign, FiAward } = FiIcons;

const GraduationImpact = ({ athletes }) => {
  const currentYear = new Date().getFullYear();
  const graduatingAthletes = athletes.filter(a => a.graduationYear === currentYear);

  const calculateImpact = () => {
    const impact = {
      scholarshipReleased: graduatingAthletes.reduce((sum, a) => sum + a.scholarshipAmount, 0),
      pointsLost: graduatingAthletes.filter(a => a.athleticPerformance.rankings.conference <= 8).length * 5,
      eliteAthletes: graduatingAthletes.filter(a => a.tier === 'elite').length,
      byEventGroup: {}
    };

    graduatingAthletes.forEach(athlete => {
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      const groupName = getEventGroupName(eventGroup);
      
      if (!impact.byEventGroup[groupName]) {
        impact.byEventGroup[groupName] = {
          count: 0,
          scholarships: 0,
          eliteCount: 0
        };
      }
      
      impact.byEventGroup[groupName].count++;
      impact.byEventGroup[groupName].scholarships += athlete.scholarshipAmount;
      if (athlete.tier === 'elite') {
        impact.byEventGroup[groupName].eliteCount++;
      }
    });

    return impact;
  };

  const impact = calculateImpact();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <SafeIcon icon={FiUserMinus} className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Graduation Impact Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Graduating Athletes</h4>
            <p className="text-3xl font-bold text-red-600">{graduatingAthletes.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total departing athletes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Scholarship Released</h4>
            <p className="text-3xl font-bold text-green-600">
              ${impact.scholarshipReleased.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Available for recruitment</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Elite Athletes Lost</h4>
            <p className="text-3xl font-bold text-yellow-600">{impact.eliteAthletes}</p>
            <p className="text-sm text-gray-600 mt-1">Top performers graduating</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Impact by Event Group</h4>
          {Object.entries(impact.byEventGroup).map(([group, data]) => (
            <div key={group} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900">{group}</h5>
                <span className="text-sm text-gray-600">
                  {data.count} athlete{data.count !== 1 ? 's' : ''} graduating
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Scholarship Impact</p>
                  <p className="font-medium text-green-600">
                    ${data.scholarships.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Elite Athletes</p>
                  <p className="font-medium text-yellow-600">{data.eliteCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Graduating Athletes Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Graduating Athletes Detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {graduatingAthletes.map(athlete => (
            <div key={athlete.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium text-gray-900">{athlete.name}</span>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${athlete.gender === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                      {athlete.gender === 'M' ? 'Men' : 'Women'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {athlete.event}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                    <span className="font-medium">${athlete.scholarshipAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600 mt-1">
                    <SafeIcon icon={FiAward} className="w-4 h-4" />
                    <span className="text-sm">{athlete.tier}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Personal Best: {athlete.personalBest}</p>
                <p>Conference Ranking: {athlete.athleticPerformance.rankings.conference || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GraduationImpact;