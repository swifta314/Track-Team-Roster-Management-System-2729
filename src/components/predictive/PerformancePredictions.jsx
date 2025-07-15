import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiAward, FiTarget, FiUsers, FiBarChart2, FiStar } = FiIcons;

const PerformancePredictions = ({ athletes, historicalData, timeHorizon, confidenceLevel }) => {
  const performanceForecast = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = timeHorizon === '1year' ? 1 : timeHorizon === '3years' ? 3 : 5;
    
    // Calculate current performance metrics
    const currentMetrics = {
      eliteAthletes: athletes.filter(a => a.tier === 'elite').length,
      competitiveAthletes: athletes.filter(a => a.tier === 'competitive').length,
      nationalQualifiers: athletes.filter(a => a.athleticPerformance.rankings.national <= 50).length,
      conferenceChampions: athletes.filter(a => a.athleticPerformance.rankings.conference <= 3).length,
      averageGPA: athletes.reduce((sum, a) => sum + a.gpa, 0) / athletes.length
    };

    // Growth factors based on confidence level
    const growthFactors = {
      low: { performance: 0.02, retention: 0.85, improvement: 0.03 },
      medium: { performance: 0.05, retention: 0.90, improvement: 0.07 },
      high: { performance: 0.08, retention: 0.95, improvement: 0.12 }
    };

    const factor = growthFactors[confidenceLevel];
    
    const forecast = [];
    for (let i = 0; i <= years; i++) {
      const year = currentYear + i;
      const performanceGrowth = Math.pow(1 + factor.performance, i);
      const retentionEffect = Math.pow(factor.retention, i);
      
      forecast.push({
        year,
        eliteAthletes: Math.round(currentMetrics.eliteAthletes * performanceGrowth * retentionEffect),
        competitiveAthletes: Math.round(currentMetrics.competitiveAthletes * performanceGrowth * retentionEffect),
        nationalQualifiers: Math.round(currentMetrics.nationalQualifiers * performanceGrowth),
        conferenceChampions: Math.round(currentMetrics.conferenceChampions * performanceGrowth),
        teamScore: Math.round(
          (currentMetrics.eliteAthletes * 10 + currentMetrics.competitiveAthletes * 5) * performanceGrowth
        ),
        averageGPA: Math.min(4.0, currentMetrics.averageGPA * (1 + factor.improvement * i))
      });
    }
    
    return forecast;
  }, [athletes, timeHorizon, confidenceLevel]);

  const eventGroupPredictions = useMemo(() => {
    const eventGroups = ['Sprints', 'Middle Distance', 'Distance', 'Jumps', 'Throws'];
    
    return eventGroups.map(group => {
      const groupAthletes = athletes.filter(athlete => 
        mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]) === group
      );
      
      const currentStrength = groupAthletes.filter(a => a.tier === 'elite' || a.tier === 'competitive').length;
      const totalAthletes = groupAthletes.length;
      
      // Predict future strength based on current performance and recruiting
      const strengthGrowth = confidenceLevel === 'low' ? 1.1 : confidenceLevel === 'medium' ? 1.25 : 1.4;
      const projectedStrength = Math.round(currentStrength * strengthGrowth);
      
      return {
        eventGroup: group,
        currentStrength,
        projectedStrength,
        totalAthletes,
        strengthRatio: totalAthletes > 0 ? (currentStrength / totalAthletes * 100).toFixed(1) : 0,
        projectedRatio: totalAthletes > 0 ? (projectedStrength / totalAthletes * 100).toFixed(1) : 0,
        competitiveIndex: calculateCompetitiveIndex(groupAthletes)
      };
    });
  }, [athletes, confidenceLevel]);

  const calculateCompetitiveIndex = (athletes) => {
    if (athletes.length === 0) return 0;
    
    const tierWeights = { elite: 4, competitive: 3, developing: 2, prospect: 1 };
    const totalWeight = athletes.reduce((sum, athlete) => sum + tierWeights[athlete.tier], 0);
    
    return Math.round((totalWeight / athletes.length) * 25); // Scale to 100
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

  const championshipPredictions = useMemo(() => {
    const lastForecast = performanceForecast[performanceForecast.length - 1];
    
    const predictions = [];
    
    // Conference Championship Prediction
    const conferenceScore = lastForecast.conferenceChampions * 10 + lastForecast.eliteAthletes * 5;
    const conferenceProbability = Math.min(95, Math.max(5, conferenceScore * 2));
    
    predictions.push({
      competition: 'Conference Championship',
      probability: conferenceProbability,
      expectedPlace: conferenceProbability > 70 ? '1st-2nd' : conferenceProbability > 50 ? '2nd-3rd' : '3rd-5th',
      keyFactors: ['Elite athlete development', 'Conference competition strength', 'Injury prevention']
    });
    
    // Regional Championship Prediction
    const regionalScore = lastForecast.nationalQualifiers * 3 + lastForecast.eliteAthletes * 2;
    const regionalProbability = Math.min(85, Math.max(10, regionalScore * 1.5));
    
    predictions.push({
      competition: 'Regional Championship',
      probability: regionalProbability,
      expectedPlace: regionalProbability > 60 ? '1st-3rd' : regionalProbability > 40 ? '3rd-5th' : '5th-8th',
      keyFactors: ['National qualifier development', 'Regional competition depth', 'Peak performance timing']
    });
    
    // National Championship Prediction
    const nationalScore = lastForecast.nationalQualifiers + lastForecast.eliteAthletes * 2;
    const nationalProbability = Math.min(75, Math.max(5, nationalScore));
    
    predictions.push({
      competition: 'National Championship',
      probability: nationalProbability,
      expectedPlace: nationalProbability > 50 ? 'Top 10' : nationalProbability > 30 ? 'Top 20' : 'Top 30',
      keyFactors: ['Elite athlete performance', 'National competition level', 'Team depth']
    });
    
    return predictions;
  }, [performanceForecast]);

  const radarData = eventGroupPredictions.map(group => ({
    eventGroup: group.eventGroup,
    current: group.competitiveIndex,
    projected: Math.min(100, group.competitiveIndex * 1.3)
  }));

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiAward} className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Elite Athletes</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-yellow-600">
              {performanceForecast[0]?.eliteAthletes}
            </p>
            <p className="text-sm text-gray-600">→</p>
            <p className="text-xl font-bold text-yellow-600">
              {performanceForecast[performanceForecast.length - 1]?.eliteAthletes}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Current → Projected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">National Qualifiers</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-blue-600">
              {performanceForecast[0]?.nationalQualifiers}
            </p>
            <p className="text-sm text-gray-600">→</p>
            <p className="text-xl font-bold text-blue-600">
              {performanceForecast[performanceForecast.length - 1]?.nationalQualifiers}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Current → Projected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Team Score</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600">
              {performanceForecast[0]?.teamScore}
            </p>
            <p className="text-sm text-gray-600">→</p>
            <p className="text-xl font-bold text-green-600">
              {performanceForecast[performanceForecast.length - 1]?.teamScore}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Competitive index</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Average GPA</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-purple-600">
              {performanceForecast[0]?.averageGPA.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">→</p>
            <p className="text-xl font-bold text-purple-600">
              {performanceForecast[performanceForecast.length - 1]?.averageGPA.toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Academic performance</p>
        </motion.div>
      </div>

      {/* Performance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trend Forecast</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="eliteAthletes" 
                stroke="#EAB308" 
                strokeWidth={2}
                name="Elite Athletes"
              />
              <Line 
                type="monotone" 
                dataKey="competitiveAthletes" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Competitive Athletes"
              />
              <Line 
                type="monotone" 
                dataKey="nationalQualifiers" 
                stroke="#10B981" 
                strokeWidth={2}
                name="National Qualifiers"
              />
              <Line 
                type="monotone" 
                dataKey="conferenceChampions" 
                stroke="#DC2626" 
                strokeWidth={2}
                name="Conference Champions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Event Group Strength Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Group Strength Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="eventGroup" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Current Strength"
                  dataKey="current"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Projected Strength"
                  dataKey="projected"
                  stroke="#CC0000"
                  fill="#CC0000"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {eventGroupPredictions.map((group, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{group.eventGroup}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Strength:</span>
                    <span className="font-medium text-gray-900">{group.competitiveIndex}/100</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Current Strong Athletes:</p>
                    <p className="font-medium">{group.currentStrength}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Projected Strong Athletes:</p>
                    <p className="font-medium">{group.projectedStrength}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Championship Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Championship Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {championshipPredictions.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-gray-900">{prediction.competition}</h4>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Success Probability</span>
                  <span className="font-medium text-gray-900">{prediction.probability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      prediction.probability > 70 ? 'bg-green-500' :
                      prediction.probability > 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600">Expected Placement:</p>
                <p className="font-medium text-gray-900">{prediction.expectedPlace}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Key Factors:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {prediction.keyFactors.map((factor, idx) => (
                    <li key={idx}>• {factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformancePredictions;