import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiTrendingUp, FiDollarSign, FiAward } = FiIcons;

const QuickStats = ({ athletes }) => {
  const totalAthletes = athletes.length;
  const averageGPA = totalAthletes > 0 
    ? (athletes.reduce((sum, athlete) => sum + athlete.gpa, 0) / totalAthletes).toFixed(2)
    : "N/A";
  const totalScholarships = athletes.reduce((sum, athlete) => sum + athlete.scholarshipAmount, 0);
  const eliteAthletes = athletes.filter(athlete => athlete.tier === 'elite').length;
  
  const stats = [
    {
      title: 'Total Athletes',
      value: totalAthletes,
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Average GPA',
      value: averageGPA,
      icon: FiTrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Scholarship Funds',
      value: `$${totalScholarships.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Elite Athletes',
      value: eliteAthletes,
      icon: FiAward,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;