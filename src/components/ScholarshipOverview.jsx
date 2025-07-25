import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ScholarshipOverview = ({ genderFilter, athletes }) => {
  const [scholarshipData, setScholarshipData] = useState({
    men: { 
      total: 12.6,
      allocated: 0,
      available: 12.6
    },
    women: { 
      total: 18.0,
      allocated: 0,
      available: 18.0
    }
  });

  // Calculate scholarship allocation based on current athlete data
  useEffect(() => {
    if (!athletes || athletes.length === 0) return;

    let menAllocated = 0;
    let womenAllocated = 0;

    athletes.forEach(athlete => {
      // Skip archived athletes in the calculation
      if (athlete.status === 'archived') return;
      
      // Use scholarship percentage if available, otherwise calculate from amount
      let scholarshipEquivalent = 0;
      if (athlete.scholarshipPercentage && athlete.scholarshipPercentage > 0) {
        scholarshipEquivalent = athlete.scholarshipPercentage / 100;
      } else if (athlete.scholarshipAmount > 0) {
        // Estimate percentage based on typical full scholarship value
        const estimatedFullValue = athlete.gender === 'M' ? 20000 : 25000;
        scholarshipEquivalent = athlete.scholarshipAmount / estimatedFullValue;
      }
      
      if (athlete.gender === 'M') {
        menAllocated += scholarshipEquivalent;
      } else if (athlete.gender === 'F') {
        womenAllocated += scholarshipEquivalent;
      }
    });

    // Cap at NCAA limits
    menAllocated = Math.min(menAllocated, 12.6);
    womenAllocated = Math.min(womenAllocated, 18.0);

    setScholarshipData({
      men: {
        total: 12.6,
        allocated: parseFloat(menAllocated.toFixed(1)),
        available: parseFloat((12.6 - menAllocated).toFixed(1))
      },
      women: {
        total: 18.0, 
        allocated: parseFloat(womenAllocated.toFixed(1)),
        available: parseFloat((18.0 - womenAllocated).toFixed(1))
      }
    });
  }, [athletes]);

  const menData = [
    { name: 'Allocated', value: scholarshipData.men.allocated, color: '#CC0000' },
    { name: 'Available', value: scholarshipData.men.available, color: '#E5E7EB' }
  ];

  const womenData = [
    { name: 'Allocated', value: scholarshipData.women.allocated, color: '#CC0000' },
    { name: 'Available', value: scholarshipData.women.available, color: '#E5E7EB' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (genderFilter === 'men') {
      return (
        <div className="grid place-items-center">
          <h3 className="text-lg font-semibold text-center mb-4 text-ballstate-red">
            Men's Team Scholarships
          </h3>
          <div className="w-full max-w-md">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={menData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {menData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                {scholarshipData.men.allocated} / {scholarshipData.men.total} scholarships
              </p>
              <p className="text-lg font-bold text-gray-900">
                {scholarshipData.men.available.toFixed(1)} available
              </p>
            </div>
          </div>
        </div>
      );
    } else if (genderFilter === 'women') {
      return (
        <div className="grid place-items-center">
          <h3 className="text-lg font-semibold text-center mb-4 text-ballstate-red">
            Women's Team Scholarships
          </h3>
          <div className="w-full max-w-md">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={womenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {womenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                {scholarshipData.women.allocated} / {scholarshipData.women.total} scholarships
              </p>
              <p className="text-lg font-bold text-gray-900">
                {scholarshipData.women.available.toFixed(1)} available
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-center mb-4 text-ballstate-red">
              Men's Team
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={menData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {menData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                {scholarshipData.men.allocated} / {scholarshipData.men.total} scholarships
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-center mb-4 text-ballstate-red">
              Women's Team
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={womenData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {womenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                {scholarshipData.women.allocated} / {scholarshipData.women.total} scholarships
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  // Calculate total available and allocated scholarships
  const totalAvailable = (
    genderFilter === 'men' ? scholarshipData.men.available :
    genderFilter === 'women' ? scholarshipData.women.available :
    (scholarshipData.men.available + scholarshipData.women.available)
  ).toFixed(1);

  const totalAllocated = (
    genderFilter === 'men' ? scholarshipData.men.allocated :
    genderFilter === 'women' ? scholarshipData.women.allocated :
    (scholarshipData.men.allocated + scholarshipData.women.allocated)
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Scholarship Allocation</h2>
      {renderContent()}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900">Total Available</h4>
          <p className="text-2xl font-bold text-ballstate-red">
            {totalAvailable}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900">Total Allocated</h4>
          <p className="text-2xl font-bold text-gray-700">
            {totalAllocated}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScholarshipOverview;