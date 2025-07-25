import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { mapEventToGroup, getEventGroupName } from '../../utils/eventMapping';
import { formatCurrency } from '../../utils/calculationUtils';
import { CustomTooltip, MetricCard } from './AnalyticsUtils';

const { FiDollarSign, FiTrendingUp, FiUsers } = FiIcons;

const ScholarshipAnalysis = ({ athletes, scholarshipLimits }) => {
  // Calculate scholarship distribution by event group
  const scholarshipData = useMemo(() => {
    const eventGroups = {};
    
    athletes.forEach(athlete => {
      const event = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(event);
      const groupName = getEventGroupName(eventGroup);
      
      if (!eventGroups[groupName]) {
        eventGroups[groupName] = {
          name: groupName,
          total: 0,
          athletes: 0,
          menAmount: 0,
          womenAmount: 0
        };
      }
      
      eventGroups[groupName].total += athlete.scholarshipAmount;
      eventGroups[groupName].athletes += 1;
      
      if (athlete.gender === 'M') {
        eventGroups[groupName].menAmount += athlete.scholarshipAmount;
      } else {
        eventGroups[groupName].womenAmount += athlete.scholarshipAmount;
      }
    });
    
    return Object.values(eventGroups);
  }, [athletes]);

  const totalScholarships = athletes.reduce((sum, athlete) => sum + athlete.scholarshipAmount, 0);
  const averageScholarship = totalScholarships / athletes.length;
  const maxScholarship = Math.max(...athletes.map(a => a.scholarshipAmount));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MetricCard
            title="Total Scholarships"
            value={formatCurrency(totalScholarships)}
            icon={FiDollarSign}
            color="bg-green-100"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Average Scholarship"
            value={formatCurrency(averageScholarship.toFixed(2))}
            icon={FiTrendingUp}
            color="bg-blue-100"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Highest Scholarship"
            value={formatCurrency(maxScholarship)}
            icon={FiUsers}
            color="bg-purple-100"
          />
        </motion.div>
      </div>

      {/* Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Scholarship Distribution by Event Group
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scholarshipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={<CustomTooltip
                  formatter={(value, name) => {
                    return `$${value.toLocaleString()}`;
                  }}
                />}
              />
              <Legend />
              <Bar dataKey="menAmount" name="Men's Scholarships" fill="#3B82F6" />
              <Bar dataKey="womenAmount" name="Women's Scholarships" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Scholarship Efficiency Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Scholarship Allocation Efficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">NCAA Compliance</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Men's Team Usage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(athletes.filter(a => a.gender === 'M').reduce((sum, a) => sum + a.scholarshipAmount, 0) / (scholarshipLimits.men.total * 10000) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(100, (athletes.filter(a => a.gender === 'M').reduce((sum, a) => sum + a.scholarshipAmount, 0) / (scholarshipLimits.men.total * 10000)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Women's Team Usage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(athletes.filter(a => a.gender === 'F').reduce((sum, a) => sum + a.scholarshipAmount, 0) / (scholarshipLimits.women.total * 10000) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full rounded-full bg-pink-500"
                    style={{
                      width: `${Math.min(100, (athletes.filter(a => a.gender === 'F').reduce((sum, a) => sum + a.scholarshipAmount, 0) / (scholarshipLimits.women.total * 10000)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Distribution by Performance Tier</h4>
            <div className="space-y-4">
              {['elite', 'competitive', 'developing', 'prospect'].map(tier => {
                const tierAthletes = athletes.filter(a => a.tier === tier);
                const tierAmount = tierAthletes.reduce((sum, a) => sum + a.scholarshipAmount, 0);
                const percentage = totalScholarships > 0 ? (tierAmount / totalScholarships * 100) : 0;
                
                return (
                  <div key={tier}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{tier}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(tierAmount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          tier === 'elite' ? 'bg-yellow-500' :
                          tier === 'competitive' ? 'bg-blue-500' :
                          tier === 'developing' ? 'bg-green-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Allocation Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-500 mt-0.5" />
              <span>
                Optimize elite athlete scholarships for maximum competitive advantage
              </span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon icon={FiUsers} className="w-4 h-4 text-blue-500 mt-0.5" />
              <span>
                Consider increasing scholarship investment in {
                  scholarshipData.sort((a, b) => a.total - b.total)[0]?.name
                } to improve balance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-purple-500 mt-0.5" />
              <span>
                Review allocation efficiency across performance tiers to ensure optimal ROI
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ScholarshipAnalysis;