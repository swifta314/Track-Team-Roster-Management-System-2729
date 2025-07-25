import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { yearGroups } from '../data/mockData';

const ClassSizeChart = ({ athletes }) => {
  const classData = Object.keys(yearGroups).map(year => {
    const count = athletes.filter(athlete => athlete.year === year).length;
    return {
      year: yearGroups[year].name,
      count,
      color: yearGroups[year].color
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {`${label}: ${payload[0].value} athletes`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Class Size Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={classData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis dataKey="year" className="dark:text-gray-400" />
          <YAxis className="dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#CC0000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {classData.map((item, index) => (
          <div
            key={index}
            className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.year}</p>
            <p className="text-lg font-bold text-ballstate-red dark:text-red-400">{item.count}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClassSizeChart;