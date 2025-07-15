import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUserMinus, FiDollarSign, FiUsers, FiAlertTriangle, FiTrendingDown, FiRefreshCw } = FiIcons;

const GraduationForecast = ({ athletes, timeHorizon, confidenceLevel }) => {
  const graduationData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = timeHorizon === '1year' ? 1 : timeHorizon === '3years' ? 3 : 5;
    
    const forecast = [];
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      const graduatingAthletes = athletes.filter(athlete => athlete.graduationYear === year);
      
      // Calculate impact metrics
      const scholarshipImpact = graduatingAthletes.reduce((sum, athlete) => sum + athlete.scholarshipAmount, 0);
      const eliteAthletes = graduatingAthletes.filter(a => a.tier === 'elite').length;
      const competitiveAthletes = graduatingAthletes.filter(a => a.tier === 'competitive').length;
      const nationalQualifiers = graduatingAthletes.filter(a => a.athleticPerformance.rankings.national <= 50).length;
      
      // Calculate by event group
      const eventGroupImpact = {};
      graduatingAthletes.forEach(athlete => {
        const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
        if (!eventGroupImpact[eventGroup]) {
          eventGroupImpact[eventGroup] = {
            count: 0,
            scholarships: 0,
            eliteCount: 0,
            competitiveCount: 0
          };
        }
        eventGroupImpact[eventGroup].count++;
        eventGroupImpact[eventGroup].scholarships += athlete.scholarshipAmount;
        if (athlete.tier === 'elite') eventGroupImpact[eventGroup].eliteCount++;
        if (athlete.tier === 'competitive') eventGroupImpact[eventGroup].competitiveCount++;
      });
      
      forecast.push({
        year,
        graduatingCount: graduatingAthletes.length,
        scholarshipImpact,
        eliteAthletes,
        competitiveAthletes,
        nationalQualifiers,
        eventGroupImpact,
        performanceImpact: calculatePerformanceImpact(graduatingAthletes),
        replacementNeeded: calculateReplacementNeeds(graduatingAthletes)
      });
    }
    
    return forecast;
  }, [athletes, timeHorizon]);

  const calculatePerformanceImpact = (graduatingAthletes) => {
    // Calculate the performance impact based on rankings and tier
    let impact = 0;
    graduatingAthletes.forEach(athlete => {
      const tierWeights = { elite: 10, competitive: 6, developing: 3, prospect: 1 };
      const rankingBonus = athlete.athleticPerformance.rankings.conference <= 3 ? 5 : 
                          athlete.athleticPerformance.rankings.conference <= 8 ? 2 : 0;
      impact += tierWeights[athlete.tier] + rankingBonus;
    });
    return impact;
  };

  const calculateReplacementNeeds = (graduatingAthletes) => {
    const needs = {};
    graduatingAthletes.forEach(athlete => {
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      if (!needs[eventGroup]) {
        needs[eventGroup] = { count: 0, minTier: 'developing', scholarshipBudget: 0 };
      }
      needs[eventGroup].count++;
      needs[eventGroup].scholarshipBudget += athlete.scholarshipAmount;
      
      // Determine minimum tier needed for replacement
      if (athlete.tier === 'elite' && needs[eventGroup].minTier !== 'elite') {
        needs[eventGroup].minTier = 'elite';
      } else if (athlete.tier === 'competitive' && needs[eventGroup].minTier === 'developing') {
        needs[eventGroup].minTier = 'competitive';
      }
    });
    return needs;
  };

  const mapEventToGroup = (event) => {
    const eventMap = {
      '100m': 'Sprints', '200m': 'Sprints', '400m': 'Sprints',
      '800m': 'Middle Distance', '1500m': 'Middle Distance',
      '3000m': 'Distance', '5000m': 'Distance', '10000m': 'Distance',
      'Long Jump': 'Jumps', 'Triple Jump': 'Jumps', 'High Jump': 'Jumps', 'Pole Vault': 'Jumps',
      'Shot Put': 'Throws', 'Discus': 'Throws', 'Javelin': 'Throws', 'Hammer': 'Throws'
    };
    return eventMap[event] || 'Other';
  };

  const totalImpactAnalysis = useMemo(() => {
    const totalGraduating = graduationData.reduce((sum, year) => sum + year.graduatingCount, 0);
    const totalScholarshipImpact = graduationData.reduce((sum, year) => sum + year.scholarshipImpact, 0);
    const totalEliteImpact = graduationData.reduce((sum, year) => sum + year.eliteAthletes, 0);
    const totalPerformanceImpact = graduationData.reduce((sum, year) => sum + year.performanceImpact, 0);
    
    return {
      totalGraduating,
      totalScholarshipImpact,
      totalEliteImpact,
      totalPerformanceImpact,
      averagePerYear: totalGraduating / graduationData.length,
      riskLevel: totalEliteImpact > 10 ? 'High' : totalEliteImpact > 5 ? 'Medium' : 'Low'
    };
  }, [graduationData]);

  const eventGroupAnalysis = useMemo(() => {
    const eventGroups = ['Sprints', 'Middle Distance', 'Distance', 'Jumps', 'Throws'];
    
    return eventGroups.map(group => {
      let totalLosses = 0;
      let totalScholarships = 0;
      let eliteLosses = 0;
      let competitiveLosses = 0;
      
      graduationData.forEach(year => {
        const groupData = year.eventGroupImpact[group];
        if (groupData) {
          totalLosses += groupData.count;
          totalScholarships += groupData.scholarships;
          eliteLosses += groupData.eliteCount;
          competitiveLosses += groupData.competitiveCount;
        }
      });
      
      return {
        eventGroup: group,
        totalLosses,
        totalScholarships,
        eliteLosses,
        competitiveLosses,
        impactLevel: eliteLosses > 3 ? 'High' : eliteLosses > 1 ? 'Medium' : 'Low'
      };
    });
  }, [graduationData]);

  const recruitingPriorities = useMemo(() => {
    const priorities = [];
    
    eventGroupAnalysis.forEach(group => {
      if (group.impactLevel === 'High') {
        priorities.push({
          eventGroup: group.eventGroup,
          priority: 'Critical',
          recruitsNeeded: group.eliteLosses + Math.ceil(group.competitiveLosses / 2),
          targetTier: 'Elite/Competitive',
          scholarshipBudget: group.totalScholarships * 0.8, // Assume 80% replacement
          timeframe: 'Immediate'
        });
      } else if (group.impactLevel === 'Medium') {
        priorities.push({
          eventGroup: group.eventGroup,
          priority: 'High',
          recruitsNeeded: Math.ceil(group.totalLosses / 2),
          targetTier: 'Competitive',
          scholarshipBudget: group.totalScholarships * 0.6,
          timeframe: 'Next cycle'
        });
      } else if (group.totalLosses > 0) {
        priorities.push({
          eventGroup: group.eventGroup,
          priority: 'Medium',
          recruitsNeeded: Math.ceil(group.totalLosses / 3),
          targetTier: 'Developing',
          scholarshipBudget: group.totalScholarships * 0.4,
          timeframe: 'Future planning'
        });
      }
    });
    
    return priorities.sort((a, b) => {
      const priorityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [eventGroupAnalysis]);

  const pieData = eventGroupAnalysis.map(group => ({
    name: group.eventGroup,
    value: group.totalLosses,
    color: getEventGroupColor(group.eventGroup)
  }));

  const getEventGroupColor = (eventGroup) => {
    const colors = {
      'Sprints': '#EF4444',
      'Middle Distance': '#F97316',
      'Distance': '#EAB308',
      'Jumps': '#22C55E',
      'Throws': '#3B82F6'
    };
    return colors[eventGroup] || '#6B7280';
  };

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <SafeIcon icon={FiUserMinus} className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Graduating</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {totalImpactAnalysis.totalGraduating}
          </p>
          <p className="text-sm text-gray-600 mt-1">Over {timeHorizon} horizon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Scholarship Impact</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalImpactAnalysis.totalScholarshipImpact.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Released for recruiting</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiTrendingDown} className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Elite Athletes Lost</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {totalImpactAnalysis.totalEliteImpact}
          </p>
          <p className="text-sm text-gray-600 mt-1">Top performers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              totalImpactAnalysis.riskLevel === 'High' ? 'bg-red-100' :
              totalImpactAnalysis.riskLevel === 'Medium' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <SafeIcon icon={FiAlertTriangle} className={`w-5 h-5 ${
                totalImpactAnalysis.riskLevel === 'High' ? 'text-red-600' :
                totalImpactAnalysis.riskLevel === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900">Impact Risk</h3>
          </div>
          <p className={`text-3xl font-bold ${
            totalImpactAnalysis.riskLevel === 'High' ? 'text-red-600' :
            totalImpactAnalysis.riskLevel === 'Medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {totalImpactAnalysis.riskLevel}
          </p>
          <p className="text-sm text-gray-600 mt-1">Performance impact</p>
        </motion.div>
      </div>

      {/* Graduation Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Graduation Impact Timeline</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graduationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="graduatingCount" fill="#94A3B8" name="Total Graduating" />
              <Bar dataKey="eliteAthletes" fill="#EAB308" name="Elite Athletes" />
              <Bar dataKey="competitiveAthletes" fill="#3B82F6" name="Competitive Athletes" />
              <Bar dataKey="nationalQualifiers" fill="#10B981" name="National Qualifiers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Event Group Impact Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Group Impact Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {eventGroupAnalysis.map((group, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{group.eventGroup}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.impactLevel === 'High' ? 'bg-red-100 text-red-800' :
                    group.impactLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {group.impactLevel} Impact
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Losses:</p>
                    <p className="font-medium">{group.totalLosses}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Elite Losses:</p>
                    <p className="font-medium text-red-600">{group.eliteLosses}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Scholarship Impact:</p>
                    <p className="font-medium">${group.totalScholarships.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Competitive Losses:</p>
                    <p className="font-medium text-blue-600">{group.competitiveLosses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recruiting Priorities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-ballstate-red" />
          <h3 className="text-lg font-semibold text-gray-900">Replacement Recruiting Priorities</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recruitingPriorities.map((priority, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              priority.priority === 'Critical' ? 'border-red-300 bg-red-50' :
              priority.priority === 'High' ? 'border-yellow-300 bg-yellow-50' :
              'border-blue-300 bg-blue-50'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{priority.eventGroup}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  priority.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  priority.priority === 'High' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {priority.priority}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recruits Needed:</span>
                  <span className="font-medium">{priority.recruitsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Tier:</span>
                  <span className="font-medium">{priority.targetTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Available:</span>
                  <span className="font-medium">${priority.scholarshipBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{priority.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GraduationForecast;