import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const {
  FiBarChart2, FiAlertTriangle, FiUsers, FiTrendingUp,
  FiAward, FiCheck, FiInfo, FiTarget, FiRefreshCw
} = FiIcons;

const PotentialImpactAnalysis = ({ 
  athletes, 
  selectedAthletes, 
  teamComposition, 
  evaluationResults 
}) => {
  const [selectedAthlete, setSelectedAthlete] = useState(selectedAthletes[0]?.id || null);
  const [projectionYears, setProjectionYears] = useState(4);
  
  // Map an event to its event group
  const mapEventToGroup = (event) => {
    const eventMap = {
      // Sprints
      '100m': 'sprints',
      '200m': 'sprints',
      '400m': 'sprints',
      // Middle Distance
      '800m': 'middleDistance',
      '1500m': 'middleDistance',
      // Distance
      '3000m': 'distance',
      '5000m': 'distance',
      '10000m': 'distance',
      // Jumps
      'Long Jump': 'jumps',
      'Triple Jump': 'jumps',
      'High Jump': 'jumps',
      'Pole Vault': 'jumps',
      // Throws
      'Shot Put': 'throws',
      'Discus': 'throws',
      'Javelin': 'throws',
      'Hammer': 'throws',
    };
    return eventMap[event] || null;
  };

  // Get friendly name for event group
  const getEventGroupName = (groupKey) => {
    const names = {
      'sprints': 'Sprints',
      'middleDistance': 'Middle Distance',
      'distance': 'Distance',
      'jumps': 'Jumps',
      'throws': 'Throws',
      'hurdles': 'Hurdles',
      'multis': 'Multi-Events'
    };
    return names[groupKey] || groupKey;
  };
  
  // Calculate impact score based on evaluation
  const calculateImpactScore = (evaluation, athlete) => {
    if (!evaluation) return { total: 0, performance: 0, character: 0, academic: 0 };
    
    // Get numeric rating or 0 if not available
    const getRating = (field) => {
      const value = evaluation[field];
      return value ? parseInt(value) : 0;
    };
    
    // Calculate scores for each category
    const performanceScore = (
      getRating('technicalSkill') + 
      getRating('athleticAbility') + 
      getRating('competitiveInstinct')
    ) / 3 * 10; // Scale to 0-50
    
    const characterScore = (
      getRating('workEthic') + 
      getRating('teamCulture') + 
      getRating('coachability')
    ) / 3 * 10; // Scale to 0-50
    
    const academicScore = getRating('academicPotential') * 4; // Scale to 0-20
    
    // Apply multiplier based on potential tier
    let tierMultiplier = 1.0;
    if (evaluation.potentialTier) {
      switch (evaluation.potentialTier) {
        case 'elite': tierMultiplier = 1.5; break;
        case 'competitive': tierMultiplier = 1.2; break;
        case 'developing': tierMultiplier = 1.0; break;
        case 'prospect': tierMultiplier = 0.8; break;
        default: tierMultiplier = 1.0;
      }
    } else if (athlete.tier) {
      // Use current tier if potential not specified
      switch (athlete.tier) {
        case 'elite': tierMultiplier = 1.3; break;
        case 'competitive': tierMultiplier = 1.1; break;
        case 'developing': tierMultiplier = 0.9; break;
        case 'prospect': tierMultiplier = 0.7; break;
        default: tierMultiplier = 1.0;
      }
    }
    
    // Calculate total score with tier multiplier
    const rawTotal = performanceScore + characterScore + academicScore;
    const totalScore = Math.round(rawTotal * tierMultiplier);
    
    return {
      total: totalScore,
      performance: Math.round(performanceScore),
      character: Math.round(characterScore),
      academic: Math.round(academicScore),
      multiplier: tierMultiplier
    };
  };
  
  // Calculate team impact data
  const teamImpactData = useMemo(() => {
    // Group current athletes by event group
    const currentTeam = {};
    
    // Initialize with empty groups
    Object.keys(teamComposition.eventGroups).forEach(group => {
      currentTeam[group] = [];
    });
    
    // Add athletes to their event groups
    athletes.forEach(athlete => {
      const event = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(event);
      if (eventGroup && currentTeam[eventGroup]) {
        currentTeam[eventGroup].push(athlete);
      }
    });
    
    // Calculate averages and gaps by event group
    return Object.entries(currentTeam).map(([group, groupAthletes]) => {
      // Calculate average impact score for current group
      let totalImpact = 0;
      let athletesWithEval = 0;
      
      groupAthletes.forEach(athlete => {
        const evaluation = evaluationResults[athlete.id];
        if (evaluation) {
          totalImpact += calculateImpactScore(evaluation, athlete).total;
          athletesWithEval++;
        }
      });
      
      const averageImpact = athletesWithEval > 0 ? totalImpact / athletesWithEval : 0;
      const rosterTarget = (teamComposition.eventGroups[group]?.rosterSpots?.men || 0) + 
                          (teamComposition.eventGroups[group]?.rosterSpots?.women || 0);
      const currentCount = groupAthletes.length;
      const rosterGap = Math.max(0, rosterTarget - currentCount);
      
      return {
        group,
        groupName: getEventGroupName(group),
        athleteCount: currentCount, 
        rosterTarget,
        rosterGap,
        averageImpact,
        needScore: rosterGap * 10 + (50 - averageImpact)
      };
    }).sort((a, b) => b.needScore - a.needScore);
  }, [athletes, teamComposition, evaluationResults]);
  
  // Get athlete impact data
  const athleteImpactData = useMemo(() => {
    return selectedAthletes.map(athlete => {
      const evaluation = evaluationResults[athlete.id];
      const event = athlete.athleticPerformance.primaryEvents[0];
      const eventGroup = mapEventToGroup(event);
      const eventGroupName = getEventGroupName(eventGroup);
      const impactScore = calculateImpactScore(evaluation, athlete);
      
      // Find this event group in the team impact data
      const groupData = teamImpactData.find(g => g.group === eventGroup);
      
      // Calculate the impact percentage relative to group average
      const relativeImpact = groupData && groupData.averageImpact > 0 
        ? (impactScore.total / groupData.averageImpact) - 1 
        : 0;
      
      // Calculate projected improvement over time
      const projectedScores = [];
      const baseImprovement = impactScore.total * 0.05; // 5% improvement per year
      
      // Adjust improvement rate based on current tier
      let improvementRate = 0.05; // Default 5% per year
      if (athlete.tier === 'elite') improvementRate = 0.03; // Slower improvement for elite
      if (athlete.tier === 'prospect') improvementRate = 0.08; // Faster improvement for prospects
      
      // Generate projection for specified years
      for (let i = 0; i <= projectionYears; i++) {
        const yearImprovement = impactScore.total * Math.pow(1 + improvementRate, i) - impactScore.total;
        projectedScores.push({
          year: new Date().getFullYear() + i,
          score: Math.round(impactScore.total + yearImprovement)
        });
      }
      
      return {
        id: athlete.id,
        name: athlete.name,
        gender: athlete.gender,
        event: athlete.event,
        eventGroup,
        eventGroupName,
        currentTier: athlete.tier,
        potentialTier: evaluation?.potentialTier || athlete.tier,
        impactScore,
        groupAverage: groupData?.averageImpact || 0,
        relativeImpact,
        rosterGap: groupData?.rosterGap || 0,
        needScore: groupData?.needScore || 0,
        projectedScores
      };
    }).sort((a, b) => b.impactScore.total - a.impactScore.total);
  }, [selectedAthletes, evaluationResults, teamImpactData, projectionYears]);

  // Get data for the currently selected athlete
  const currentAthleteData = useMemo(() => {
    return athleteImpactData.find(a => a.id === selectedAthlete) || athleteImpactData[0];
  }, [athleteImpactData, selectedAthlete]);
  
  // Prepare data for impact breakdown chart
  const impactBreakdownData = useMemo(() => {
    if (!currentAthleteData) return [];
    
    return [
      { name: 'Performance', value: currentAthleteData.impactScore.performance, color: '#3B82F6' },
      { name: 'Character', value: currentAthleteData.impactScore.character, color: '#10B981' },
      { name: 'Academic', value: currentAthleteData.impactScore.academic, color: '#8B5CF6' }
    ];
  }, [currentAthleteData]);

  // Prepare data for team needs chart
  const teamNeedsData = useMemo(() => {
    return teamImpactData
      .filter(group => group.rosterGap > 0)
      .map(group => ({
        name: group.groupName,
        gap: group.rosterGap,
        average: Math.round(group.averageImpact),
        needScore: group.needScore
      }))
      .sort((a, b) => b.needScore - a.needScore)
      .slice(0, 5); // Top 5 needs
  }, [teamImpactData]);
  
  // Get the impact assessment text
  const getImpactAssessment = (athlete) => {
    if (!athlete) return { text: 'Not enough data', color: 'text-gray-500' };
    
    const score = athlete.impactScore.total;
    const relativeImpact = athlete.relativeImpact;
    
    if (score >= 80) {
      return { 
        text: 'Exceptional Impact', 
        color: 'text-green-600 dark:text-green-400',
        description: 'This athlete is projected to make an exceptional impact on the team. Likely to be a conference champion and national qualifier.'
      };
    } else if (score >= 65) {
      return { 
        text: 'High Impact', 
        color: 'text-blue-600 dark:text-blue-400',
        description: 'This athlete is projected to make a significant positive impact on the team. Should be a consistent scorer at the conference level.'
      };
    } else if (score >= 50) {
      return { 
        text: 'Positive Impact', 
        color: 'text-teal-600 dark:text-teal-400',
        description: 'This athlete is projected to make a positive contribution to the team. Likely to develop into a conference-level competitor.'
      };
    } else if (score >= 35) {
      return { 
        text: 'Moderate Impact', 
        color: 'text-yellow-600 dark:text-yellow-400',
        description: 'This athlete is projected to have a moderate impact. May need time to develop before contributing significantly.'
      };
    } else {
      return { 
        text: 'Developing Impact', 
        color: 'text-orange-600 dark:text-orange-400',
        description: 'This athlete is projected to need significant development. Long-term project with uncertain impact.'
      };
    }
  };
  
  // Get the team fit assessment text
  const getTeamFitAssessment = (athlete) => {
    if (!athlete) return { text: 'Not enough data', color: 'text-gray-500' };
    
    const { rosterGap, needScore, relativeImpact } = athlete;
    
    if (rosterGap >= 3 && relativeImpact > 0.1) {
      return { 
        text: 'Critical Team Need', 
        color: 'text-green-600 dark:text-green-400',
        description: 'This athlete fills a critical roster gap and offers above-average impact for their event group.'
      };
    } else if (rosterGap >= 2 || relativeImpact > 0.05) {
      return { 
        text: 'Strong Team Fit', 
        color: 'text-blue-600 dark:text-blue-400',
        description: 'This athlete addresses a roster need or provides above-average impact for their event group.'
      };
    } else if (rosterGap >= 1 || relativeImpact >= 0) {
      return { 
        text: 'Good Team Fit', 
        color: 'text-teal-600 dark:text-teal-400',
        description: 'This athlete fills a roster spot and provides average or better impact for their event group.'
      };
    } else if (relativeImpact >= -0.1) {
      return { 
        text: 'Adequate Team Fit', 
        color: 'text-yellow-600 dark:text-yellow-400',
        description: 'This athlete provides near-average impact but does not address a primary roster need.'
      };
    } else {
      return { 
        text: 'Questionable Team Fit', 
        color: 'text-orange-600 dark:text-orange-400',
        description: 'This athlete is below average for their event group and does not fill a roster gap.'
      };
    }
  };

  // CustomTooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
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
              Please select at least one athlete from the Evaluation Forms tab to analyze their potential impact.
              Impact analysis helps determine how an athlete might contribute to team success.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Impact Analysis
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analyze potential contribution to team success
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Athlete
                  </label>
                  <select
                    value={selectedAthlete || ''}
                    onChange={(e) => setSelectedAthlete(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-ballstate-red focus:border-ballstate-red"
                  >
                    {athleteImpactData.map(athlete => (
                      <option key={athlete.id} value={athlete.id}>
                        {athlete.name} ({athlete.event})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Projection Years
                  </label>
                  <select
                    value={projectionYears}
                    onChange={(e) => setProjectionYears(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-ballstate-red focus:border-ballstate-red"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Athlete Impact Analysis */}
          {currentAthleteData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Impact Score Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <SafeIcon icon={FiAward} className="w-5 h-5 text-ballstate-red" />
                  Impact Score
                </h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={currentAthleteData.impactScore.total >= 65 ? '#10B981' : 
                                currentAthleteData.impactScore.total >= 50 ? '#3B82F6' : 
                                currentAthleteData.impactScore.total >= 35 ? '#F59E0B' : 
                                '#EF4444'}
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * currentAthleteData.impactScore.total / 100)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {currentAthleteData.impactScore.total}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        of 100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h4 className={`text-xl font-semibold ${getImpactAssessment(currentAthleteData).color}`}>
                    {getImpactAssessment(currentAthleteData).text}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getImpactAssessment(currentAthleteData).description}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${(currentAthleteData.impactScore.performance / 50) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {currentAthleteData.impactScore.performance}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Character</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${(currentAthleteData.impactScore.character / 50) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {currentAthleteData.impactScore.character}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Academic</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: `${(currentAthleteData.impactScore.academic / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {currentAthleteData.impactScore.academic}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tier Multiplier</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentAthleteData.impactScore.multiplier.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Fit Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <SafeIcon icon={FiUsers} className="w-5 h-5 text-ballstate-red" />
                  Team Fit Analysis
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Group</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                      {currentAthleteData.eventGroupName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Roster</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {teamImpactData.find(g => g.group === currentAthleteData.eventGroup)?.athleteCount || 0} athletes
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Roster Gap</span>
                    <span className={`text-sm ${currentAthleteData.rosterGap > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {currentAthleteData.rosterGap > 0 ? `${currentAthleteData.rosterGap} needed` : 'No gap'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Average Impact</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {Math.round(currentAthleteData.groupAverage)} points
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Impact vs. Group Average</span>
                      <span className={`text-sm font-medium ${
                        currentAthleteData.relativeImpact > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(currentAthleteData.relativeImpact * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          currentAthleteData.relativeImpact > 0
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.max(0, 50 + currentAthleteData.relativeImpact * 200))}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Below Average</span>
                      <span>Average</span>
                      <span>Above Average</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h4 className={`text-xl font-semibold ${getTeamFitAssessment(currentAthleteData).color}`}>
                    {getTeamFitAssessment(currentAthleteData).text}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getTeamFitAssessment(currentAthleteData).description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentAthleteData.rosterGap > 0 && (
                      <li className="flex items-start gap-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Fills a roster gap in {currentAthleteData.eventGroupName}</span>
                      </li>
                    )}
                    {currentAthleteData.relativeImpact > 0 && (
                      <li className="flex items-start gap-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Provides above-average impact for their event group</span>
                      </li>
                    )}
                    {currentAthleteData.impactScore.performance > 40 && (
                      <li className="flex items-start gap-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Exceptional performance metrics indicate high competitive potential</span>
                      </li>
                    )}
                    {currentAthleteData.impactScore.character > 40 && (
                      <li className="flex items-start gap-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Strong character metrics suggest positive team culture contribution</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Development Projection */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-ballstate-red" />
                  Development Projection
                </h3>
                <div className="h-[250px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={currentAthleteData.projectedScores}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Impact Score"
                        stroke="#CC0000"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Impact</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {currentAthleteData.impactScore.total} points
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Year {projectionYears} Projection
                    </span>
                    <span className="text-sm font-bold text-ballstate-red">
                      {currentAthleteData.projectedScores[projectionYears]?.score} points
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Projected Growth
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      +{currentAthleteData.projectedScores[projectionYears]?.score - currentAthleteData.impactScore.total} points
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Development Notes</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiInfo} className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span>
                        Projection assumes normal development curve for a 
                        {currentAthleteData.currentTier ? ` ${currentAthleteData.currentTier} ` : ' '} 
                        tier athlete
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiInfo} className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span>Actual development can vary based on training response, injuries, and motivation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiInfo} className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span>
                        {currentAthleteData.impactScore.character > 35 
                          ? 'High character scores suggest good development potential'
                          : 'Focus on character development may accelerate performance growth'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Team Needs Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-ballstate-red" />
              Team Needs Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top Roster Needs by Event Group</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamNeedsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 'dataMax + 1']} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="gap" name="Roster Gap" fill="#EF4444" />
                      <Bar dataKey="average" name="Avg Impact" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Athlete Impact Breakdown</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactBreakdownData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        {impactBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recruiting Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Priority Event Groups</h5>
                  <ul className="space-y-2">
                    {teamNeedsData.slice(0, 3).map((group, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {index + 1}. {group.name}
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-xs">
                          Need {group.gap} athletes
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Impact Analysis</h5>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>
                        {currentAthleteData?.eventGroupName} is a 
                        {teamNeedsData.findIndex(g => g.name === currentAthleteData?.eventGroupName) < 3 
                          ? ' high' 
                          : ' moderate'} 
                        priority need
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>
                        This athlete's impact score is 
                        {currentAthleteData?.relativeImpact > 0 
                          ? ' above' 
                          : ' below'} 
                        the current group average
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>
                        {currentAthleteData?.impactScore.total >= 65 
                          ? 'High impact athletes should be prioritized for scholarships' 
                          : currentAthleteData?.impactScore.total >= 50 
                            ? 'Good impact athletes should be considered for partial scholarships'
                            : 'Lower impact athletes may be better as walk-on candidates'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PotentialImpactAnalysis;