import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateImpactScore, calculateRecommendedAmount, formatCurrency } from '../../utils/calculationUtils';
import { mapEventToGroup, getEventGroupName } from '../../utils/eventMapping';

const { 
  FiDollarSign, FiCalculator, FiUsers, FiTarget, FiSearch,
  FiTrendingUp, FiAlertTriangle, FiCheck, FiInfo, FiStar 
} = FiIcons;

const ScholarshipCalculator = ({ 
  athletes, 
  selectedAthletes, 
  toggleAthleteSelection, 
  scholarshipLimits, 
  evaluationResults 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [eventGroupFilter, setEventGroupFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('impact');
  
  // Calculate total scholarship budget by gender
  const totalMenBudget = scholarshipLimits?.men?.totalBudget || 315000;
  const totalWomenBudget = scholarshipLimits?.women?.totalBudget || 450000;
  
  // Get currently allocated amounts
  const currentlyAllocatedMen = athletes
    .filter(a => a.gender === 'M')
    .reduce((sum, a) => sum + a.scholarshipAmount, 0);
    
  const currentlyAllocatedWomen = athletes
    .filter(a => a.gender === 'F')
    .reduce((sum, a) => sum + a.scholarshipAmount, 0);
  
  // Calculate remaining budget
  const remainingMenBudget = totalMenBudget - currentlyAllocatedMen;
  const remainingWomenBudget = totalWomenBudget - currentlyAllocatedWomen;
  
  // Get unique event groups from athletes
  const eventGroups = useMemo(() => {
    const groups = new Set();
    athletes.forEach(athlete => {
      const event = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(event);
      const groupName = getEventGroupName(eventGroup);
      if (groupName) groups.add(groupName);
    });
    return Array.from(groups).sort();
  }, [athletes]);
  
  // Filter and sort athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter(athlete => {
      // Search filter
      const matchesSearch = 
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        athlete.event.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Gender filter
      const matchesGender = 
        genderFilter === 'all' || 
        (genderFilter === 'men' && athlete.gender === 'M') || 
        (genderFilter === 'women' && athlete.gender === 'F');
        
      // Event group filter
      const athleteEventGroup = getEventGroupName(mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]));
      const matchesEventGroup = 
        eventGroupFilter === 'all' || 
        athleteEventGroup === eventGroupFilter;
        
      // Tier filter
      const matchesTier = 
        tierFilter === 'all' || 
        athlete.tier === tierFilter;
        
      return matchesSearch && matchesGender && matchesEventGroup && matchesTier;
    }).map(athlete => {
      // Calculate impact score for each athlete
      const evaluation = evaluationResults[athlete.id];
      const impactScore = calculateImpactScore(evaluation, athlete);
      const recommendedAmount = calculateRecommendedAmount(athlete, evaluation);
      
      return {
        ...athlete,
        impactScore,
        recommendedAmount
      };
    }).sort((a, b) => {
      if (sortBy === 'impact') {
        return b.impactScore.total - a.impactScore.total;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'event') {
        return a.event.localeCompare(b.event);
      } else if (sortBy === 'current') {
        return b.scholarshipAmount - a.scholarshipAmount;
      } else if (sortBy === 'recommended') {
        return b.recommendedAmount - a.recommendedAmount;
      }
      return 0;
    });
  }, [athletes, searchTerm, genderFilter, eventGroupFilter, tierFilter, sortBy, evaluationResults]);
  
  // Calculate budget distribution statistics
  const budgetStats = useMemo(() => {
    // By gender
    const genderData = [
      { name: "Men's Team", value: currentlyAllocatedMen, color: "#3B82F6" },
      { name: "Men's Remaining", value: remainingMenBudget, color: "#93C5FD" },
      { name: "Women's Team", value: currentlyAllocatedWomen, color: "#EC4899" },
      { name: "Women's Remaining", value: remainingWomenBudget, color: "#F9A8D4" },
    ];
    
    // By event group
    const eventGroupData = {};
    athletes.forEach(athlete => {
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      const groupName = getEventGroupName(eventGroup);
      
      if (!eventGroupData[groupName]) {
        eventGroupData[groupName] = {
          name: groupName,
          value: 0,
          count: 0
        };
      }
      
      eventGroupData[groupName].value += athlete.scholarshipAmount;
      eventGroupData[groupName].count++;
    });
    
    // By performance tier
    const tierData = {};
    athletes.forEach(athlete => {
      if (!tierData[athlete.tier]) {
        tierData[athlete.tier] = {
          name: athlete.tier,
          value: 0,
          count: 0,
          color: getTierColor(athlete.tier)
        };
      }
      
      tierData[athlete.tier].value += athlete.scholarshipAmount;
      tierData[athlete.tier].count++;
    });
    
    return {
      genderData,
      eventGroupData: Object.values(eventGroupData),
      tierData: Object.values(tierData)
    };
  }, [athletes, currentlyAllocatedMen, currentlyAllocatedWomen, remainingMenBudget, remainingWomenBudget]);
  
  // Helper function to get tier color
  const getTierColor = (tier) => {
    const colors = {
      'elite': '#EAB308',
      'competitive': '#3B82F6',
      'developing': '#10B981',
      'prospect': '#F97316'
    };
    return colors[tier] || '#6B7280';
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label || payload[0].name}</p>
          <div className="mt-1">
            <p className="text-xs font-medium" style={{ color: payload[0].color || payload[0].fill }}>
              {formatCurrency(payload[0].value)}
            </p>
            {payload[0].payload.count !== undefined && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {payload[0].payload.count} athletes
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {selectedAthletes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Athletes Selected</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Select athletes to calculate recommended scholarship allocations based on their evaluation data.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Filters and Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Scholarship Calculator
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Optimize scholarship allocation based on athlete potential
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search athletes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="all">All Athletes</option>
                  <option value="men">Men Only</option>
                  <option value="women">Women Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Group
                </label>
                <select
                  value={eventGroupFilter}
                  onChange={(e) => setEventGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="all">All Event Groups</option>
                  {eventGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Performance Tier
                </label>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="all">All Tiers</option>
                  <option value="elite">Elite</option>
                  <option value="competitive">Competitive</option>
                  <option value="developing">Developing</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="impact">Impact Score</option>
                  <option value="name">Name</option>
                  <option value="event">Event</option>
                  <option value="current">Current Scholarship</option>
                  <option value="recommended">Recommended Scholarship</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-ballstate-red" />
                Budget Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Men's Team</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Allocated:</span>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(currentlyAllocatedMen)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Remaining:</span>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(remainingMenBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Total Budget:</span>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(totalMenBudget)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Women's Team</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Allocated:</span>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(currentlyAllocatedWomen)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Remaining:</span>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(remainingWomenBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Total Budget:</span>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(totalWomenBudget)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetStats.genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {budgetStats.genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-ballstate-red" />
                Distribution by Performance Tier
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetStats.tierData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Amount">
                      {budgetStats.tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
          
          {/* Athlete Scholarship Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <SafeIcon icon={FiCalculator} className="w-5 h-5 text-ballstate-red" />
                Scholarship Recommendations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on athlete evaluations and potential impact
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Athlete
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Impact Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Current Scholarship
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Recommended
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAthletes.map((athlete) => {
                    const difference = athlete.recommendedAmount - athlete.scholarshipAmount;
                    return (
                      <tr key={athlete.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${athlete.gender === 'M' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-pink-100 dark:bg-pink-900'}`}>
                                <span className={`text-sm font-medium ${athlete.gender === 'M' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`}>
                                  {athlete.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {athlete.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {athlete.gender === 'M' ? 'Men' : 'Women'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{athlete.event}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {getEventGroupName(mapEventToGroup(athlete.event))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white bg-${getTierColor(athlete.tier).replace('#', '')}`}>
                            {athlete.tier.charAt(0).toUpperCase() + athlete.tier.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  athlete.impactScore.total >= 70 ? 'bg-green-500' :
                                  athlete.impactScore.total >= 50 ? 'bg-yellow-500' :
                                  athlete.impactScore.total >= 30 ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${athlete.impactScore.total}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900 dark:text-white">
                              {athlete.impactScore.total}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(athlete.scholarshipAmount)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((athlete.scholarshipAmount / (athlete.gender === 'M' ? totalMenBudget : totalWomenBudget)) * 100)}% of budget
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(athlete.recommendedAmount)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Based on impact score
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            difference > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            difference < 0 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {difference > 0 ? '+' : ''}
                            {formatCurrency(difference)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {filteredAthletes.length === 0 && (
              <div className="p-6 text-center">
                <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No athletes match your filters</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your filter criteria to see more results
                </p>
              </div>
            )}
          </motion.div>
          
          {/* Optimization Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-ballstate-red" />
              Scholarship Allocation Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex items-start">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Optimizing ROI</h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      Focus scholarship dollars on athletes with the highest impact scores to maximize competitive success.
                      Consider reallocating funds from lower impact athletes to higher impact ones.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    Recommended Increases
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                    {filteredAthletes
                      .filter(a => a.recommendedAmount > a.scholarshipAmount)
                      .slice(0, 3)
                      .map(athlete => (
                        <li key={athlete.id} className="flex justify-between">
                          <span>{athlete.name} ({athlete.event})</span>
                          <span>+{formatCurrency(athlete.recommendedAmount - athlete.scholarshipAmount)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4" />
                    Consider Reallocation
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                    {filteredAthletes
                      .filter(a => a.recommendedAmount < a.scholarshipAmount)
                      .slice(0, 3)
                      .map(athlete => (
                        <li key={athlete.id} className="flex justify-between">
                          <span>{athlete.name} ({athlete.event})</span>
                          <span>{formatCurrency(athlete.recommendedAmount - athlete.scholarshipAmount)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <SafeIcon icon={FiStar} className="w-4 h-4" />
                  Budget Allocation Strategy
                </h4>
                <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-400">
                  <li>• Allocate 60-70% of scholarship funds to elite and competitive tier athletes</li>
                  <li>• Reserve 20-25% for developing athletes with high potential</li>
                  <li>• Use remaining 10-15% for strategic recruitment in underrepresented event groups</li>
                  <li>• Consider gender equity and NCAA compliance requirements in all allocation decisions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ScholarshipCalculator;