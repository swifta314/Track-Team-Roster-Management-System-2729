import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { tierCriteria } from '../data/mockData';

const TierDistribution = ({ athletes, genderFilter }) => {
  const filteredAthletes = athletes.filter(athlete => {
    if (genderFilter === 'all') return true;
    if (genderFilter === 'men') return athlete.gender === 'M';
    if (genderFilter === 'women') return athlete.gender === 'F';
    return true;
  });

  const tierData = Object.keys(tierCriteria).map(tier => {
    const count = filteredAthletes.filter(athlete => athlete.tier === tier).length;
    return {
      name: tierCriteria[tier].name,
      value: count,
      color: tierCriteria[tier].color.replace('bg-', '#').replace('-500', '')
    };
  });

  const colorMap = {
    'Elite': '#EAB308',
    'Competitive': '#3B82F6',
    'Developing': '#10B981',
    'Prospect': '#F97316'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} athletes`}</p>
        </div>
      );
    }
    return null;
  };

  const getGenderTitle = () => {
    if (genderFilter === 'men') return "Men's Team - ";
    if (genderFilter === 'women') return "Women's Team - ";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {getGenderTitle()}Performance Tier Distribution
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tier Criteria</h3>
          {Object.entries(tierCriteria).map(([key, tier]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded ${tier.color}`}></div>
                <h4 className="font-semibold text-gray-900">{tier.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
              <div className="text-xs text-gray-500">
                <p>Sample times: 100m Men: {tier.criteria['100m']?.men}, Women: {tier.criteria['100m']?.women}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TierDistribution;