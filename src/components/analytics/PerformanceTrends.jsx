import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiArrowUp, FiArrowDown, FiAward } = FiIcons;

const PerformanceTrends = ({ athletes }) => {
  const [selectedEvent, setSelectedEvent] = useState('100m');
  const [timeframe, setTimeframe] = useState('season'); // 'season' or 'year'
  const [genderFilter, setGenderFilter] = useState('all');

  // Get unique events from athletes
  const events = useMemo(() => {
    const eventSet = new Set();
    athletes.forEach(athlete => {
      athlete.athleticPerformance.primaryEvents.forEach(event => {
        eventSet.add(event);
      });
    });
    return Array.from(eventSet).sort();
  }, [athletes]);

  // Process performance data for the selected event
  const performanceData = useMemo(() => {
    const relevantAthletes = athletes.filter(athlete => {
      const genderMatch = genderFilter === 'all' || 
        (genderFilter === 'men' && athlete.gender === 'M') ||
        (genderFilter === 'women' && athlete.gender === 'F');
      return athlete.athleticPerformance.primaryEvents.includes(selectedEvent) && genderMatch;
    });

    const progressions = relevantAthletes.flatMap(athlete => 
      athlete.athleticPerformance.progression
        .filter(p => p.event === selectedEvent)
        .map(p => ({
          ...p,
          athleteName: athlete.name,
          gender: athlete.gender
        }))
    );

    // Group by timeframe
    const groupedData = progressions.reduce((acc, curr) => {
      const key = timeframe === 'season' ? curr.season : curr.year;
      if (!acc[key]) {
        acc[key] = {
          timepoint: key,
          average: 0,
          best: Number.POSITIVE_INFINITY,
          worst: Number.NEGATIVE_INFINITY,
          count: 0
        };
      }
      const value = parseFloat(curr.best);
      acc[key].average += value;
      acc[key].best = Math.min(acc[key].best, value);
      acc[key].worst = Math.max(acc[key].worst, value);
      acc[key].count++;
      return acc;
    }, {});

    // Calculate averages and convert to array
    return Object.values(groupedData).map(data => ({
      ...data,
      average: data.average / data.count
    })).sort((a, b) => 
      timeframe === 'season' 
        ? a.timepoint.localeCompare(b.timepoint)
        : a.timepoint - b.timepoint
    );
  }, [athletes, selectedEvent, timeframe, genderFilter]);

  // Calculate improvement metrics
  const improvementMetrics = useMemo(() => {
    if (performanceData.length < 2) return null;
    
    const first = performanceData[0];
    const last = performanceData[performanceData.length - 1];
    
    const averageImprovement = ((first.average - last.average) / first.average) * 100;
    const bestImprovement = ((first.best - last.best) / first.best) * 100;
    
    return {
      averageImprovement,
      bestImprovement,
      isPositiveTrend: averageImprovement > 0
    };
  }, [performanceData]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            >
              {events.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            >
              <option value="season">By Season</option>
              <option value="year">By Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            >
              <option value="all">All Athletes</option>
              <option value="men">Men Only</option>
              <option value="women">Women Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {improvementMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Average Improvement</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {Math.abs(improvementMetrics.averageImprovement).toFixed(2)}%
            </p>
            <div className="flex items-center gap-2 mt-2">
              <SafeIcon
                icon={improvementMetrics.isPositiveTrend ? FiArrowUp : FiArrowDown}
                className={`w-4 h-4 ${
                  improvementMetrics.isPositiveTrend ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {improvementMetrics.isPositiveTrend ? 'Improving' : 'Declining'} trend
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <SafeIcon icon={FiAward} className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Best Performance</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {performanceData[performanceData.length - 1]?.best}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Latest recorded best time/distance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Best Improvement</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {Math.abs(improvementMetrics.bestImprovement).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Improvement in best performance
            </p>
          </motion.div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {selectedEvent} Performance Trends
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timepoint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#CC0000"
                name="Average"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="best"
                stroke="#10B981"
                name="Best"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="worst"
                stroke="#6B7280"
                name="Worst"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
              <p className="text-sm text-gray-600">
                {improvementMetrics?.isPositiveTrend
                  ? `Team is showing consistent improvement in ${selectedEvent} with an average improvement of ${Math.abs(improvementMetrics.averageImprovement).toFixed(2)}%`
                  : `Team performance in ${selectedEvent} has declined by ${Math.abs(improvementMetrics?.averageImprovement).toFixed(2)}%. Consider reviewing training programs.`
                }
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Focus on maintaining consistent improvement rates</li>
                <li>• Address performance gaps between best and worst times</li>
                <li>• Consider specialized training for underperforming athletes</li>
                <li>• Track individual progress against team averages</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Distribution
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Top Performers</h4>
              <div className="space-y-2">
                {performanceData.length > 0 && athletes
                  .filter(a => a.athleticPerformance.primaryEvents.includes(selectedEvent))
                  .sort((a, b) => {
                    const aTime = parseFloat(a.personalBest);
                    const bTime = parseFloat(b.personalBest);
                    return aTime - bTime;
                  })
                  .slice(0, 3)
                  .map((athlete, index) => (
                    <div key={athlete.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {index + 1}. {athlete.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {athlete.personalBest}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Performance Groups</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Elite</span>
                  <span className="text-sm font-medium text-gray-900">
                    {athletes.filter(a => 
                      a.athleticPerformance.primaryEvents.includes(selectedEvent) && 
                      a.tier === 'elite'
                    ).length} athletes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Competitive</span>
                  <span className="text-sm font-medium text-gray-900">
                    {athletes.filter(a => 
                      a.athleticPerformance.primaryEvents.includes(selectedEvent) && 
                      a.tier === 'competitive'
                    ).length} athletes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Developing</span>
                  <span className="text-sm font-medium text-gray-900">
                    {athletes.filter(a => 
                      a.athleticPerformance.primaryEvents.includes(selectedEvent) && 
                      a.tier === 'developing'
                    ).length} athletes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrends;