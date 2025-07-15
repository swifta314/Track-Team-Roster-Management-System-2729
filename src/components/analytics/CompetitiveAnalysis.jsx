import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiAward, FiBarChart2 } = FiIcons;

const CompetitiveAnalysis = ({ athletes }) => {
  // Calculate rankings distribution
  const calculateRankingsDistribution = () => {
    const conferenceRankings = new Array(10).fill(0).map((_, i) => ({
      ranking: i + 1,
      count: 0
    }));

    const regionalRankings = new Array(10).fill(0).map((_, i) => ({
      ranking: i + 1,
      count: 0
    }));

    athletes.forEach(athlete => {
      const { conference, regional } = athlete.athleticPerformance.rankings;
      if (conference && conference <= 10) {
        conferenceRankings[conference - 1].count++;
      }
      if (regional && regional <= 10) {
        regionalRankings[regional - 1].count++;
      }
    });

    return { conferenceRankings, regionalRankings };
  };

  // Calculate team strengths by event group
  const calculateTeamStrengths = () => {
    const eventGroups = {};
    
    athletes.forEach(athlete => {
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      if (!eventGroups[eventGroup]) {
        eventGroups[eventGroup] = {
          name: eventGroup,
          athletes: 0,
          eliteCount: 0,
          competitiveCount: 0,
          averageRanking: 0,
          totalRankings: 0
        };
      }
      
      eventGroups[eventGroup].athletes++;
      if (athlete.tier === 'elite') eventGroups[eventGroup].eliteCount++;
      if (athlete.tier === 'competitive') eventGroups[eventGroup].competitiveCount++;
      
      if (athlete.athleticPerformance.rankings.conference) {
        eventGroups[eventGroup].totalRankings += athlete.athleticPerformance.rankings.conference;
      }
    });

    // Calculate average rankings
    Object.keys(eventGroups).forEach(group => {
      if (eventGroups[group].athletes > 0) {
        eventGroups[group].averageRanking = eventGroups[group].totalRankings / eventGroups[group].athletes;
      }
    });

    return Object.values(eventGroups);
  };

  const mapEventToGroup = (event) => {
    const eventMap = {
      '100m': 'Sprints',
      '200m': 'Sprints',
      '400m': 'Sprints',
      '800m': 'Middle Distance',
      '1500m': 'Middle Distance',
      '3000m': 'Distance',
      '5000m': 'Distance',
      '10000m': 'Distance',
      'Long Jump': 'Jumps',
      'Triple Jump': 'Jumps',
      'High Jump': 'Jumps',
      'Pole Vault': 'Jumps',
      'Shot Put': 'Throws',
      'Discus': 'Throws',
      'Javelin': 'Throws',
      'Hammer': 'Throws'
    };
    return eventMap[event] || 'Other';
  };

  const { conferenceRankings, regionalRankings } = calculateRankingsDistribution();
  const teamStrengths = calculateTeamStrengths();

  // Calculate key metrics
  const topConferenceAthletes = athletes.filter(a => a.athleticPerformance.rankings.conference <= 3).length;
  const nationalQualifiers = athletes.filter(a => a.athleticPerformance.rankings.national <= 50).length;
  const eliteAthletes = athletes.filter(a => a.tier === 'elite').length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiAward} className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Top Conference</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{topConferenceAthletes}</p>
          <p className="text-sm text-gray-600 mt-1">Athletes ranked top 3 in conference</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">National Qualifiers</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{nationalQualifiers}</p>
          <p className="text-sm text-gray-600 mt-1">Athletes with national rankings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Elite Athletes</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{eliteAthletes}</p>
          <p className="text-sm text-gray-600 mt-1">Championship-level performers</p>
        </motion.div>
      </div>

      {/* Conference Rankings Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conference Rankings Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conferenceRankings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ranking" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#CC0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Team Strengths by Event Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Strengths by Event Group</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamStrengths.map((group, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{group.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Athletes:</span>
                  <span className="font-medium text-gray-900">{group.athletes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Elite Athletes:</span>
                  <span className="font-medium text-yellow-600">{group.eliteCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Competitive Athletes:</span>
                  <span className="font-medium text-blue-600">{group.competitiveCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Conference Ranking:</span>
                  <span className="font-medium text-gray-900">
                    {group.averageRanking > 0 ? group.averageRanking.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Competitive Analysis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Strengths</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• {topConferenceAthletes} athletes ranked in top 3 of conference</li>
              <li>• {eliteAthletes} elite-level performers</li>
              <li>• Strong depth in {teamStrengths.reduce((max, group) => group.athletes > max.athletes ? group : max, teamStrengths[0])?.name}</li>
              <li>• {nationalQualifiers} athletes with potential for national competition</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Focus on developing more top-3 conference performers</li>
              <li>• Strengthen event groups with lower athlete counts</li>
              <li>• Improve average rankings across all event groups</li>
              <li>• Recruit more elite-level athletes for championship success</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompetitiveAnalysis;