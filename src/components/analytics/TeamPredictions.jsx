import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiAward, FiStar } = FiIcons;

const TeamPredictions = ({ athletes }) => {
  // Calculate projected points for conference championships
  const calculateProjectedPoints = () => {
    let totalPoints = 0;
    
    athletes.forEach(athlete => {
      if (athlete.athleticPerformance.rankings.conference) {
        // Points based on conference ranking
        if (athlete.athleticPerformance.rankings.conference <= 3) {
          totalPoints += (9 - athlete.athleticPerformance.rankings.conference);
        }
      }
    });
    
    return totalPoints;
  };

  // Identify potential qualifiers for regionals/nationals
  const getPotentialQualifiers = () => {
    return athletes.filter(athlete => 
      athlete.tier === 'elite' || 
      (athlete.tier === 'competitive' && athlete.athleticPerformance.rankings.regional <= 20)
    );
  };

  const projectedPoints = calculateProjectedPoints();
  const potentialQualifiers = getPotentialQualifiers();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Conference Championship Projections</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Projected Points</h4>
            <p className="text-3xl font-bold text-yellow-600">{projectedPoints}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Title Contenders</h4>
            <p className="text-3xl font-bold text-blue-600">
              {potentialQualifiers.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">National Qualifiers</h4>
            <p className="text-3xl font-bold text-purple-600">
              {athletes.filter(a => a.athleticPerformance.rankings.national <= 30).length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Potential Qualifiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SafeIcon icon={FiAward} className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Potential Championship Qualifiers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {potentialQualifiers.slice(0, 6).map((athlete, index) => (
            <div key={athlete.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{athlete.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${athlete.gender === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                    {athlete.gender === 'M' ? 'Men' : 'Women'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {athlete.athleticPerformance.rankings.conference}th
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{athlete.event}</span>
                <span className="font-medium text-gray-900">{athlete.personalBest}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeamPredictions;