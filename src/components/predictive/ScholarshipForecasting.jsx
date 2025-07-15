import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiDollarSign, FiTrendingUp, FiAlertTriangle, FiTarget } = FiIcons;

const ScholarshipForecasting = ({ 
  athletes = [], 
  scholarshipLimits = {}, 
  historicalData = {}, 
  timeHorizon = '3years', 
  confidenceLevel = 'medium' 
}) => {
  console.log("ScholarshipForecasting rendered with:", {
    athletesCount: athletes.length,
    scholarshipLimits: Object.keys(scholarshipLimits),
    timeHorizon,
    confidenceLevel
  });

  const forecastData = useMemo(() => {
    console.log("Calculating forecast data");
    const currentYear = new Date().getFullYear();
    const years = timeHorizon === '1year' ? 1 : timeHorizon === '3years' ? 3 : 5;

    // Calculate base scholarship spending
    const currentSpending = athletes.reduce((sum, athlete) => sum + athlete.scholarshipAmount, 0);

    // Growth factors based on confidence level
    const growthFactors = {
      low: { annual: 0.03, volatility: 0.1 },
      medium: { annual: 0.05, volatility: 0.15 },
      high: { annual: 0.08, volatility: 0.2 }
    };
    const factor = growthFactors[confidenceLevel];

    // Generate forecast data
    const forecast = [];
    for (let i = 0; i <= years; i++) {
      const year = currentYear + i;
      const baseGrowth = Math.pow(1 + factor.annual, i);
      const volatility = (Math.random() - 0.5) * factor.volatility;

      // Default values if scholarshipLimits is not properly defined
      const menLimit = scholarshipLimits.men?.total ? scholarshipLimits.men.total * 10000 : 126000;
      const womenLimit = scholarshipLimits.women?.total ? scholarshipLimits.women.total * 10000 : 180000;

      const menSpending = (currentSpending * 0.4) * baseGrowth * (1 + volatility);
      const womenSpending = (currentSpending * 0.6) * baseGrowth * (1 + volatility);

      forecast.push({
        year,
        menSpending: Math.round(menSpending),
        womenSpending: Math.round(womenSpending),
        totalSpending: Math.round(menSpending + womenSpending),
        menLimit,
        womenLimit,
        totalLimit: menLimit + womenLimit,
        menUtilization: ((menSpending / menLimit) * 100).toFixed(1),
        womenUtilization: ((womenSpending / womenLimit) * 100).toFixed(1)
      });
    }

    return forecast;
  }, [athletes, scholarshipLimits, timeHorizon, confidenceLevel]);

  const budgetRecommendations = useMemo(() => {
    if (!forecastData || forecastData.length === 0) {
      return [];
    }

    const lastForecast = forecastData[forecastData.length - 1];
    const currentForecast = forecastData[0];
    const recommendations = [];

    // Check for budget overruns
    if (lastForecast.menSpending > lastForecast.menLimit) {
      recommendations.push({
        type: 'warning',
        title: 'Men\'s Scholarship Budget Risk',
        description: `Projected to exceed NCAA limit by $${(lastForecast.menSpending - lastForecast.menLimit).toLocaleString()} by ${lastForecast.year}`,
        action: 'Consider reducing average scholarship amounts or roster size'
      });
    }

    if (lastForecast.womenSpending > lastForecast.womenLimit) {
      recommendations.push({
        type: 'warning',
        title: 'Women\'s Scholarship Budget Risk',
        description: `Projected to exceed NCAA limit by $${(lastForecast.womenSpending - lastForecast.womenLimit).toLocaleString()} by ${lastForecast.year}`,
        action: 'Consider reducing average scholarship amounts or roster size'
      });
    }

    // Check for underutilization
    if (lastForecast.menUtilization < 80) {
      recommendations.push({
        type: 'opportunity',
        title: 'Men\'s Scholarship Underutilization',
        description: `Only using ${lastForecast.menUtilization}% of available scholarships`,
        action: 'Consider increasing recruiting or scholarship amounts'
      });
    }

    if (lastForecast.womenUtilization < 80) {
      recommendations.push({
        type: 'opportunity',
        title: 'Women\'s Scholarship Underutilization',
        description: `Only using ${lastForecast.womenUtilization}% of available scholarships`,
        action: 'Consider increasing recruiting or scholarship amounts'
      });
    }

    // Growth recommendations
    const totalGrowth = ((lastForecast.totalSpending - currentForecast.totalSpending) / currentForecast.totalSpending) * 100;
    if (totalGrowth > 30) {
      recommendations.push({
        type: 'info',
        title: 'Rapid Budget Growth',
        description: `Total scholarship spending projected to grow ${totalGrowth.toFixed(1)}% over ${timeHorizon}`,
        action: 'Plan for increased budget allocation and review scholarship strategy'
      });
    }

    return recommendations;
  }, [forecastData, timeHorizon]);

  const eventGroupProjections = useMemo(() => {
    // Calculate current spending by event group
    const eventGroupSpending = {};

    athletes.forEach(athlete => {
      if (!athlete.athleticPerformance?.primaryEvents?.[0]) {
        return;
      }
      
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      if (!eventGroupSpending[eventGroup]) {
        eventGroupSpending[eventGroup] = {
          current: 0,
          projected: 0
        };
      }
      
      eventGroupSpending[eventGroup].current += athlete.scholarshipAmount;
    });

    // Project future spending
    Object.keys(eventGroupSpending).forEach(group => {
      const growthRate = confidenceLevel === 'low' ? 1.15 : confidenceLevel === 'medium' ? 1.25 : 1.4;
      eventGroupSpending[group].projected = eventGroupSpending[group].current * growthRate;
    });

    return Object.entries(eventGroupSpending).map(([group, data]) => ({
      eventGroup: group,
      current: data.current,
      projected: data.projected,
      growth: ((data.projected - data.current) / data.current * 100).toFixed(1)
    }));
  }, [athletes, confidenceLevel]);

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
        Loading forecast data...
      </div>
    );
  }

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
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Current Spending</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${forecastData[0]?.totalSpending.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total scholarship allocation</p>
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
            <h3 className="font-semibold text-gray-900">Projected Growth</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {forecastData.length > 1 ? 
              (((forecastData[forecastData.length - 1].totalSpending - forecastData[0].totalSpending) / 
                forecastData[0].totalSpending) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Over {timeHorizon} horizon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Budget Utilization</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {forecastData[0] ? 
              (((forecastData[0].totalSpending / forecastData[0].totalLimit) * 100).toFixed(1)) : 0}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Of NCAA limits</p>
        </motion.div>
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Scholarship Spending Forecast</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="menSpending"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Men's Spending"
              />
              <Area
                type="monotone"
                dataKey="womenSpending"
                stackId="1"
                stroke="#EC4899"
                fill="#EC4899"
                fillOpacity={0.6}
                name="Women's Spending"
              />
              <Line
                type="monotone"
                dataKey="totalLimit"
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="NCAA Limit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Event Group Projections */}
      {eventGroupProjections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Group Spending Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventGroupProjections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eventGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#94A3B8" name="Current" />
                  <Bar dataKey="projected" fill="#CC0000" name="Projected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {eventGroupProjections.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{group.eventGroup}</h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      parseFloat(group.growth) > 20 ? 'bg-red-100 text-red-800' :
                      parseFloat(group.growth) > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      +{group.growth}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Current: ${group.current.toLocaleString()}</p>
                    <p>Projected: ${group.projected.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {budgetRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h3>
          <div className="space-y-4">
            {budgetRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'warning' ? 'bg-red-50 border-red-500' :
                  rec.type === 'opportunity' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <SafeIcon
                    icon={rec.type === 'warning' ? FiAlertTriangle : rec.type === 'opportunity' ? FiTarget : FiTrendingUp}
                    className={`w-5 h-5 mt-0.5 ${
                      rec.type === 'warning' ? 'text-red-600' :
                      rec.type === 'opportunity' ? 'text-green-600' :
                      'text-blue-600'
                    }`}
                  />
                  <div>
                    <h4 className={`font-medium ${
                      rec.type === 'warning' ? 'text-red-800' :
                      rec.type === 'opportunity' ? 'text-green-800' :
                      'text-blue-800'
                    }`}>
                      {rec.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      rec.type === 'warning' ? 'text-red-700' :
                      rec.type === 'opportunity' ? 'text-green-700' :
                      'text-blue-700'
                    }`}>
                      {rec.description}
                    </p>
                    <p className={`text-sm mt-2 font-medium ${
                      rec.type === 'warning' ? 'text-red-800' :
                      rec.type === 'opportunity' ? 'text-green-800' :
                      'text-blue-800'
                    }`}>
                      Recommendation: {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Show a basic message if no recommendations */}
      {budgetRecommendations.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No specific budget recommendations at this time.</p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipForecasting;