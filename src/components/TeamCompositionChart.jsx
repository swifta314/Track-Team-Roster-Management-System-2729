import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeamCompositionChart = ({ genderFilter, teamComposition }) => {
  // Prepare data based on gender filter
  const getEventGroupData = () => {
    if (genderFilter === 'men') {
      return Object.values(teamComposition.eventGroups).map(group => ({
        name: group.name,
        filled: group.filled.men,
        available: group.available.men
      }));
    } else if (genderFilter === 'women') {
      return Object.values(teamComposition.eventGroups).map(group => ({
        name: group.name,
        filled: group.filled.women,
        available: group.available.women
      }));
    } else {
      return Object.values(teamComposition.eventGroups).map(group => ({
        name: group.name,
        menFilled: group.filled.men,
        menAvailable: group.available.men,
        womenFilled: group.filled.women,
        womenAvailable: group.available.women
      }));
    }
  };

  const eventGroupData = getEventGroupData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (genderFilter === 'men' || genderFilter === 'women') {
        return (
          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className={`${genderFilter === 'men' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'} font-medium`}>
                  {genderFilter === 'men' ? 'Men' : 'Women'}:
                </span>{' '}
                <span>{data.filled} filled</span> / <span>{data.filled + data.available} total</span>
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 font-medium">Men:</span>{' '}
                <span>{data.menFilled} filled</span> / <span>{data.menFilled + data.menAvailable} total</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="text-pink-600 dark:text-pink-400 font-medium">Women:</span>{' '}
                <span>{data.womenFilled} filled</span> / <span>{data.womenFilled + data.womenAvailable} total</span>
              </p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const renderChart = () => {
    if (genderFilter === 'men' || genderFilter === 'women') {
      const barColor = genderFilter === 'men' ? '#3B82F6' : '#EC4899';
      const barColorLight = genderFilter === 'men' ? '#93C5FD' : '#F9A8D4';
      return (
        <BarChart
          data={eventGroupData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis dataKey="name" className="dark:text-gray-400" />
          <YAxis className="dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            name={`${genderFilter === 'men' ? 'Men' : 'Women'} (Filled)`}
            dataKey="filled"
            stackId="a"
            fill={barColor}
          />
          <Bar
            name={`${genderFilter === 'men' ? 'Men' : 'Women'} (Available)`}
            dataKey="available"
            stackId="a"
            fill={barColorLight}
          />
        </BarChart>
      );
    } else {
      return (
        <BarChart
          data={eventGroupData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis dataKey="name" className="dark:text-gray-400" />
          <YAxis className="dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar name="Men (Filled)" dataKey="menFilled" stackId="men" fill="#3B82F6" />
          <Bar name="Men (Available)" dataKey="menAvailable" stackId="men" fill="#93C5FD" />
          <Bar name="Women (Filled)" dataKey="womenFilled" stackId="women" fill="#EC4899" />
          <Bar name="Women (Available)" dataKey="womenAvailable" stackId="women" fill="#F9A8D4" />
        </BarChart>
      );
    }
  };

  const renderGenderDistribution = () => {
    if (genderFilter === 'men') {
      return (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Men's Team</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {teamComposition.genderDistribution.men.filled} / {teamComposition.genderDistribution.men.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {teamComposition.genderDistribution.men.available} spots available
          </p>
        </div>
      );
    } else if (genderFilter === 'women') {
      return (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Women's Team</p>
          <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
            {teamComposition.genderDistribution.women.filled} / {teamComposition.genderDistribution.women.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {teamComposition.genderDistribution.women.available} spots available
          </p>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Men's Team</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {teamComposition.genderDistribution.men.filled} / {teamComposition.genderDistribution.men.total}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {teamComposition.genderDistribution.men.available} spots available
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Women's Team</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
              {teamComposition.genderDistribution.women.filled} / {teamComposition.genderDistribution.women.total}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {teamComposition.genderDistribution.women.available} spots available
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {genderFilter === 'men' ? "Men's " : genderFilter === 'women' ? "Women's " : ""}
        Team Composition by Event Group
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gender Distribution</h3>
          {renderGenderDistribution()}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Graduation Timeline</h3>
          <div className="space-y-2">
            {teamComposition.graduationTimeline.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Class of {item.year}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.graduating} athletes</span>
                  <div
                    className="h-3 bg-ballstate-red dark:bg-red-500 rounded-full"
                    style={{ width: `${Math.min(100, (item.graduating / 40) * 100)}px` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCompositionChart;