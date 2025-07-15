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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${label}: ${payload[0].value} athletes`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Class Size Distribution</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={classData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#CC0000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {classData.map((item, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-600">{item.year}</p>
            <p className="text-lg font-bold text-ballstate-red">{item.count}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClassSizeChart;