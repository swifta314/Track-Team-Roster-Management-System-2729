import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const { 
  FiUsers, FiAlertTriangle, FiDownload, FiBarChart2, 
  FiPieChart, FiCheckCircle, FiXCircle, FiInfo
} = FiIcons;

const ComparisonTools = ({ 
  athletes, 
  selectedAthletes, 
  toggleAthleteSelection, 
  evaluationResults,
  tierCriteria 
}) => {
  const [chartType, setChartType] = useState('radar');
  const [metricType, setMetricType] = useState('all');

  // Get the tier color
  const getTierColor = (tier) => {
    return tierCriteria[tier]?.color?.replace('bg-', '') || 'gray-500';
  };

  // Prepare data for comparison charts
  const comparisonData = useMemo(() => {
    if (!selectedAthletes || selectedAthletes.length === 0) {
      return [];
    }

    return selectedAthletes.map(athlete => {
      const evaluation = evaluationResults[athlete.id] || {};
      
      // Function to convert string ratings to numbers
      const getRating = (field) => {
        const value = evaluation[field];
        return value ? parseInt(value) : 0;
      };
      
      // Calculate average scores
      const performanceAvg = (
        getRating('technicalSkill') + 
        getRating('athleticAbility') + 
        getRating('competitiveInstinct')
      ) / 3 || 0;
      
      const characterAvg = (
        getRating('workEthic') + 
        getRating('teamCulture') + 
        getRating('coachability')
      ) / 3 || 0;
      
      const overallAvg = (
        performanceAvg + 
        characterAvg + 
        getRating('academicPotential')
      ) / 3 || 0;
      
      return {
        name: athlete.name,
        gender: athlete.gender,
        event: athlete.event,
        currentTier: athlete.tier,
        potentialTier: evaluation.potentialTier || athlete.tier,
        // Performance metrics
        technicalSkill: getRating('technicalSkill'),
        athleticAbility: getRating('athleticAbility'),
        competitiveInstinct: getRating('competitiveInstinct'),
        // Academic metrics
        academicPotential: getRating('academicPotential'),
        // Character metrics
        workEthic: getRating('workEthic'),
        teamCulture: getRating('teamCulture'),
        coachability: getRating('coachability'),
        // Averages
        performanceAvg,
        characterAvg,
        overallAvg
      };
    });
  }, [selectedAthletes, evaluationResults]);

  // Filter metrics based on selected metric type
  const getMetrics = () => {
    switch (metricType) {
      case 'performance':
        return ['technicalSkill', 'athleticAbility', 'competitiveInstinct'];
      case 'character':
        return ['workEthic', 'teamCulture', 'coachability'];
      case 'academic':
        return ['academicPotential'];
      case 'averages':
        return ['performanceAvg', 'characterAvg', 'academicPotential', 'overallAvg'];
      default:
        return [
          'technicalSkill', 'athleticAbility', 'competitiveInstinct',
          'academicPotential', 'workEthic', 'teamCulture', 'coachability'
        ];
    }
  };

  // Get friendly names for metrics
  const getMetricName = (metric) => {
    const names = {
      technicalSkill: 'Technical Skill',
      athleticAbility: 'Athletic Ability',
      competitiveInstinct: 'Competitive Instinct',
      academicPotential: 'Academic Potential',
      workEthic: 'Work Ethic',
      teamCulture: 'Team Culture Fit',
      coachability: 'Coachability',
      performanceAvg: 'Performance Avg',
      characterAvg: 'Character Avg',
      overallAvg: 'Overall Avg'
    };
    return names[metric] || metric;
  };

  // Get a color for each athlete in charts
  const getAthleteColor = (index) => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
    return colors[index % colors.length];
  };

  // Prepare data for radar chart
  const radarData = useMemo(() => {
    const metrics = getMetrics();
    return metrics.map(metric => {
      const data = { metric: getMetricName(metric) };
      comparisonData.forEach((athlete, index) => {
        data[athlete.name] = athlete[metric];
      });
      return data;
    });
  }, [comparisonData, metricType]);

  // Prepare data for bar chart
  const barData = useMemo(() => {
    return comparisonData.map(athlete => {
      const data = { name: athlete.name };
      getMetrics().forEach(metric => {
        data[getMetricName(metric)] = athlete[metric];
      });
      return data;
    });
  }, [comparisonData, metricType]);

  // CustomTooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Download comparison data as CSV
  const downloadCSV = () => {
    if (comparisonData.length === 0) return;
    
    // Get all unique fields from all athletes
    const fields = ['name', 'gender', 'event', 'currentTier', 'potentialTier', ...getMetrics()];
    
    // Create CSV header
    let csv = fields.map(field => getMetricName(field)).join(',') + '\n';
    
    // Add data rows
    comparisonData.forEach(athlete => {
      const row = fields.map(field => {
        const value = athlete[field] || '';
        // If the value contains a comma, enclose it in quotes
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',');
      csv += row + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'athlete_comparison.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Please select at least one athlete from the Evaluation Forms tab to compare. 
              You can select multiple athletes to see how they compare across different metrics.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Comparison Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Comparing {selectedAthletes.length} Athlete{selectedAthletes.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View side-by-side comparisons of athlete evaluations
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span className="text-sm">Export CSV</span>
                </button>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="radar">Radar Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                >
                  <option value="all">All Metrics</option>
                  <option value="performance">Performance Metrics</option>
                  <option value="character">Character Metrics</option>
                  <option value="academic">Academic Metrics</option>
                  <option value="averages">Average Scores</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'radar' ? (
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    {comparisonData.map((athlete, index) => (
                      <Radar
                        key={athlete.name}
                        name={athlete.name}
                        dataKey={athlete.name}
                        stroke={getAthleteColor(index)}
                        fill={getAthleteColor(index)}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                ) : (
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {getMetrics().map((metric, index) => (
                      <Bar
                        key={metric}
                        dataKey={getMetricName(metric)}
                        fill={getAthleteColor(index)}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <SafeIcon icon={FiUsers} className="w-5 h-5 text-ballstate-red" />
                Athlete Comparison Table
              </h3>
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
                      Current Tier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Potential Tier
                    </th>
                    {getMetrics().map(metric => (
                      <th key={metric} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {getMetricName(metric)}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Overall Avg
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {comparisonData.map((athlete, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {athlete.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {athlete.gender === 'M' ? 'Male' : 'Female'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{athlete.event}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {athlete.currentTier ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white bg-${getTierColor(athlete.currentTier)}`}>
                            {tierCriteria[athlete.currentTier]?.name}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Not Set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {athlete.potentialTier ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white bg-${getTierColor(athlete.potentialTier)}`}>
                            {tierCriteria[athlete.potentialTier]?.name}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Not Set</span>
                        )}
                      </td>
                      {getMetrics().map(metric => (
                        <td key={metric} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  athlete[metric] >= 4 ? 'bg-green-500' : 
                                  athlete[metric] >= 3 ? 'bg-yellow-500' : 
                                  athlete[metric] > 0 ? 'bg-red-500' :
                                  'bg-gray-300 dark:bg-gray-600'
                                }`} 
                                style={{ width: `${athlete[metric] * 20}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900 dark:text-white">
                              {athlete[metric] ? athlete[metric].toFixed(1) : 'N/A'}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                athlete.overallAvg >= 4 ? 'bg-green-500' : 
                                athlete.overallAvg >= 3 ? 'bg-yellow-500' : 
                                athlete.overallAvg > 0 ? 'bg-red-500' :
                                'bg-gray-300 dark:bg-gray-600'
                              }`} 
                              style={{ width: `${athlete.overallAvg * 20}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {athlete.overallAvg ? athlete.overallAvg.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interpretation Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500" />
              Comparison Interpretation Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Chart Types</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <SafeIcon icon={FiPieChart} className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong>Radar Chart:</strong> Shows multiple metrics at once, good for seeing overall profile shape
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <SafeIcon icon={FiBarChart2} className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong>Bar Chart:</strong> Better for direct metric-to-metric comparison between athletes
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How to Use Comparisons</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Compare athletes in similar events to identify relative strengths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Look for complementary skill sets when building relay teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SafeIcon icon={FiXCircle} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Avoid comparing athletes across very different events (e.g., sprinters vs. throwers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SafeIcon icon={FiXCircle} className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Don't use comparisons as the only factor in decision-making</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonTools;