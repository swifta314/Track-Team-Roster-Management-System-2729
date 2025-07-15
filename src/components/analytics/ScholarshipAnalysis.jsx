import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiDollarSign, FiTrendingUp, FiUsers } = FiIcons;

const ScholarshipAnalysis = ({ athletes, scholarshipLimits }) => {
  // Calculate scholarship distribution by event group
  const calculateScholarshipsByEvent = () => {
    const eventGroups = {};
    athletes.forEach(athlete => {
      const event = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(event);
      if (!eventGroups[eventGroup]) {
        eventGroups[eventGroup] = {
          name: eventGroup,
          total: 0,
          athletes: 0,
          menAmount: 0,
          womenAmount: 0
        };
      }
      eventGroups[eventGroup].total += athlete.scholarshipAmount;
      eventGroups[eventGroup].athletes += 1;
      if (athlete.gender === 'M') {
        eventGroups[eventGroup].menAmount += athlete.scholarshipAmount;
      } else {
        eventGroups[eventGroup].womenAmount += athlete.scholarshipAmount;
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

  const scholarshipData = calculateScholarshipsByEvent();

  const totalScholarships = athletes.reduce((sum, athlete) => sum + athlete.scholarshipAmount, 0);
  const averageScholarship = totalScholarships / athletes.length;
  const maxScholarship = Math.max(...athletes.map(a => a.scholarshipAmount));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              Total: ${payload[0].payload.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              Athletes: {payload[0].payload.athletes}
            </p>
            <p className="text-xs text-blue-600">
              Men: ${payload[0].payload.menAmount.toLocaleString()}
            </p>
            <p className="text-xs text-pink-600">
              Women: ${payload[0].payload.womenAmount.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
            <h3 className="font-semibold text-gray-900">Total Scholarships</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalScholarships.toLocaleString()}
          </p>
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
            <h3 className="font-semibold text-gray-900">Average Scholarship</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${averageScholarship.toFixed(2)}
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
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Highest Scholarship</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            ${maxScholarship.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Scholarship Distribution by Event Group
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scholarshipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="menAmount" name="Men's Scholarships" fill="#3B82F6" />
              <Bar dataKey="womenAmount" name="Women's Scholarships" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ScholarshipAnalysis;