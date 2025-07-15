import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTarget, FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiStar, FiArrowUp, FiArrowDown } = FiIcons;

const RecruitingPredictions = ({ athletes, teamComposition, historicalData, timeHorizon, confidenceLevel }) => {
  const recruitingForecast = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = timeHorizon === '1year' ? 1 : timeHorizon === '3years' ? 3 : 5;
    
    // Calculate current recruiting metrics
    const currentRecruits = athletes.filter(a => a.year === 'first').length;
    const currentEliteRecruits = athletes.filter(a => a.year === 'first' && a.tier === 'elite').length;
    const currentScholarshipPerRecruit = athletes.filter(a => a.year === 'first').reduce((sum, a) => sum + a.scholarshipAmount, 0) / currentRecruits || 0;
    
    // Growth factors based on confidence level and historical trends
    const growthFactors = {
      low: { recruiting: 0.02, quality: 0.01, scholarship: 0.03 },
      medium: { recruiting: 0.05, quality: 0.03, scholarship: 0.05 },
      high: { recruiting: 0.08, quality: 0.05, scholarship: 0.08 }
    };
    
    const factor = growthFactors[confidenceLevel];
    
    const forecast = [];
    for (let i = 0; i <= years; i++) {
      const year = currentYear + i;
      const growthMultiplier = Math.pow(1 + factor.recruiting, i);
      const qualityMultiplier = Math.pow(1 + factor.quality, i);
      
      // Calculate graduation losses for this year
      const graduatingAthletes = athletes.filter(a => a.graduationYear === year);
      const replacementNeeded = graduatingAthletes.length;
      const eliteReplacementNeeded = graduatingAthletes.filter(a => a.tier === 'elite').length;
      
      // Predict recruiting targets
      const targetRecruits = Math.max(replacementNeeded, Math.round(currentRecruits * growthMultiplier));
      const targetEliteRecruits = Math.max(eliteReplacementNeeded, Math.round(currentEliteRecruits * qualityMultiplier));
      const projectedScholarshipPerRecruit = currentScholarshipPerRecruit * Math.pow(1 + factor.scholarship, i);
      
      forecast.push({
        year,
        targetRecruits,
        targetEliteRecruits,
        replacementNeeded,
        eliteReplacementNeeded,
        projectedScholarshipPerRecruit,
        totalScholarshipNeeded: targetRecruits * projectedScholarshipPerRecruit,
        competitionLevel: calculateCompetitionLevel(year, confidenceLevel),
        successProbability: calculateSuccessProbability(targetRecruits, targetEliteRecruits, confidenceLevel)
      });
    }
    
    return forecast;
  }, [athletes, timeHorizon, confidenceLevel]);

  const calculateCompetitionLevel = (year, confidenceLevel) => {
    // Simulate increasing competition over time
    const baseCompetition = 50;
    const yearFactor = (year - new Date().getFullYear()) * 5;
    const confidenceFactor = confidenceLevel === 'high' ? 10 : confidenceLevel === 'medium' ? 5 : 0;
    
    return Math.min(100, baseCompetition + yearFactor + confidenceFactor);
  };

  const calculateSuccessProbability = (targetRecruits, targetEliteRecruits, confidenceLevel) => {
    const baseProbability = confidenceLevel === 'high' ? 80 : confidenceLevel === 'medium' ? 70 : 60;
    const difficultyPenalty = (targetRecruits - 15) * 2; // Penalty for recruiting more than 15
    const elitePenalty = targetEliteRecruits * 5; // Penalty for elite recruits
    
    return Math.max(30, Math.min(95, baseProbability - difficultyPenalty - elitePenalty));
  };

  const eventGroupRecruitingNeeds = useMemo(() => {
    const eventGroups = ['Sprints', 'Middle Distance', 'Distance', 'Jumps', 'Throws'];
    
    return eventGroups.map(group => {
      const currentAthletes = athletes.filter(athlete => 
        mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]) === group
      );
      
      const graduatingAthletes = currentAthletes.filter(a => 
        a.graduationYear <= new Date().getFullYear() + (timeHorizon === '1year' ? 1 : timeHorizon === '3years' ? 3 : 5)
      );
      
      const currentElite = currentAthletes.filter(a => a.tier === 'elite').length;
      const currentCompetitive = currentAthletes.filter(a => a.tier === 'competitive').length;
      const graduatingElite = graduatingAthletes.filter(a => a.tier === 'elite').length;
      const graduatingCompetitive = graduatingAthletes.filter(a => a.tier === 'competitive').length;
      
      // Calculate recruiting needs
      const eliteNeed = Math.max(0, graduatingElite - Math.floor(currentElite * 0.2)); // Assume 20% internal development
      const competitiveNeed = Math.max(0, graduatingCompetitive - Math.floor(currentCompetitive * 0.3));
      const totalNeed = eliteNeed + competitiveNeed;
      
      // Calculate recruiting difficulty
      const difficulty = calculateRecruitingDifficulty(group, totalNeed);
      
      return {
        eventGroup: group,
        currentAthletes: currentAthletes.length,
        graduatingAthletes: graduatingAthletes.length,
        eliteNeed,
        competitiveNeed,
        totalNeed,
        difficulty,
        priority: totalNeed > 5 ? 'High' : totalNeed > 2 ? 'Medium' : 'Low',
        estimatedCost: (eliteNeed * 8000) + (competitiveNeed * 5000), // Estimated scholarship costs
        timeframe: difficulty > 70 ? 'Long-term' : difficulty > 50 ? 'Medium-term' : 'Short-term'
      };
    });
  }, [athletes, timeHorizon]);

  const calculateRecruitingDifficulty = (eventGroup, totalNeed) => {
    // Base difficulty by event group
    const baseDifficulty = {
      'Sprints': 80,
      'Distance': 70,
      'Middle Distance': 65,
      'Jumps': 75,
      'Throws': 60
    };
    
    const needPenalty = totalNeed * 5; // More need = more difficulty
    return Math.min(100, baseDifficulty[eventGroup] + needPenalty);
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

  const recruitingTrendAnalysis = useMemo(() => {
    const trends = [];
    
    // Analyze total recruiting volume trend
    const totalRecruitingTrend = recruitingForecast.reduce((sum, year) => sum + year.targetRecruits, 0) / recruitingForecast.length;
    const currentAverageRecruits = 18; // Baseline
    
    if (totalRecruitingTrend > currentAverageRecruits * 1.2) {
      trends.push({
        type: 'increasing',
        category: 'Volume',
        description: 'Recruiting volume trending upward',
        impact: 'Need more recruiting resources and staff time',
        recommendation: 'Expand recruiting network and increase budget'
      });
    }
    
    // Analyze elite recruiting trend
    const eliteRecruitingTrend = recruitingForecast.reduce((sum, year) => sum + year.targetEliteRecruits, 0) / recruitingForecast.length;
    const currentAverageElite = 4; // Baseline
    
    if (eliteRecruitingTrend > currentAverageElite * 1.5) {
      trends.push({
        type: 'increasing',
        category: 'Quality',
        description: 'Need for elite recruits increasing',
        impact: 'Higher scholarship costs and recruiting competition',
        recommendation: 'Focus on early identification and relationship building'
      });
    }
    
    // Analyze cost trend
    const avgCostTrend = recruitingForecast.reduce((sum, year) => sum + year.projectedScholarshipPerRecruit, 0) / recruitingForecast.length;
    const currentAvgCost = 5000; // Baseline
    
    if (avgCostTrend > currentAvgCost * 1.3) {
      trends.push({
        type: 'increasing',
        category: 'Cost',
        description: 'Scholarship costs per recruit rising',
        impact: 'Budget pressure and fewer total recruits possible',
        recommendation: 'Optimize scholarship allocation and seek partial commitments'
      });
    }
    
    return trends;
  }, [recruitingForecast]);

  const marketAnalysis = useMemo(() => {
    return {
      nationalTrends: {
        transferPortalImpact: 'High',
        nilInfluence: 'Growing',
        recruitingWindowChanges: 'Shortening',
        competitionLevel: 'Increasing'
      },
      opportunityAreas: [
        {
          area: 'International Recruiting',
          potential: 'High',
          difficulty: 'Medium',
          description: 'Growing pool of international talent'
        },
        {
          area: 'Junior College Transfers',
          potential: 'Medium',
          difficulty: 'Low',
          description: 'Immediate impact players available'
        },
        {
          area: 'Walk-on Development',
          potential: 'Medium',
          difficulty: 'Low',
          description: 'Cost-effective talent development'
        }
      ]
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Recruiting Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg Annual Targets</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(recruitingForecast.reduce((sum, year) => sum + year.targetRecruits, 0) / recruitingForecast.length)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total recruits needed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Elite Targets</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {Math.round(recruitingForecast.reduce((sum, year) => sum + year.targetEliteRecruits, 0) / recruitingForecast.length)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Elite recruits needed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg Cost per Recruit</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${Math.round(recruitingForecast.reduce((sum, year) => sum + year.projectedScholarshipPerRecruit, 0) / recruitingForecast.length).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Scholarship investment</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Success Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {Math.round(recruitingForecast.reduce((sum, year) => sum + year.successProbability, 0) / recruitingForecast.length)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Projected success rate</p>
        </motion.div>
      </div>

      {/* Recruiting Forecast Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruiting Forecast Timeline</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recruitingForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="targetRecruits" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Target Recruits"
              />
              <Line 
                type="monotone" 
                dataKey="targetEliteRecruits" 
                stroke="#EAB308" 
                strokeWidth={2}
                name="Elite Targets"
              />
              <Line 
                type="monotone" 
                dataKey="replacementNeeded" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Replacement Needed"
              />
              <Line 
                type="monotone" 
                dataKey="successProbability" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Success Probability %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Event Group Recruiting Needs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Group Recruiting Needs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventGroupRecruitingNeeds.map((group, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              group.priority === 'High' ? 'border-red-300 bg-red-50' :
              group.priority === 'Medium' ? 'border-yellow-300 bg-yellow-50' :
              'border-green-300 bg-green-50'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{group.eventGroup}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group.priority === 'High' ? 'bg-red-100 text-red-800' :
                  group.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {group.priority}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Need:</span>
                  <span className="font-medium">{group.totalNeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elite Need:</span>
                  <span className="font-medium text-yellow-600">{group.eliteNeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competitive Need:</span>
                  <span className="font-medium text-blue-600">{group.competitiveNeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`font-medium ${
                    group.difficulty > 70 ? 'text-red-600' :
                    group.difficulty > 50 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {group.difficulty}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Cost:</span>
                  <span className="font-medium">${group.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{group.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recruiting Trends Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruiting Trend Analysis</h3>
        <div className="space-y-4">
          {recruitingTrendAnalysis.map((trend, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <SafeIcon 
                  icon={trend.type === 'increasing' ? FiArrowUp : FiArrowDown} 
                  className={`w-5 h-5 mt-0.5 ${trend.type === 'increasing' ? 'text-red-500' : 'text-green-500'}`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{trend.category} Trend</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trend.type === 'increasing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {trend.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Impact:</strong> {trend.impact}</p>
                  <p className="text-sm text-ballstate-red"><strong>Recommendation:</strong> {trend.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Analysis & Opportunities</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">National Recruiting Trends</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transfer Portal Impact:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  marketAnalysis.nationalTrends.transferPortalImpact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {marketAnalysis.nationalTrends.transferPortalImpact}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">NIL Influence:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {marketAnalysis.nationalTrends.nilInfluence}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recruiting Window:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {marketAnalysis.nationalTrends.recruitingWindowChanges}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Competition Level:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {marketAnalysis.nationalTrends.competitionLevel}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Opportunity Areas</h4>
            <div className="space-y-3">
              {marketAnalysis.opportunityAreas.map((opportunity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{opportunity.area}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.potential === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opportunity.potential} Potential
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{opportunity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Difficulty: {opportunity.difficulty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecruitingPredictions;