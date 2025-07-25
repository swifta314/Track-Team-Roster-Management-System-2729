import React, {useState, useEffect} from 'react';
import ScholarshipForecasting from './ScholarshipForecasting';
import PerformancePredictions from './PerformancePredictions';
import RecruitingPredictions from './RecruitingPredictions';
import GraduationForecast from './GraduationForecast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {FiDollarSign, FiTrendingUp, FiUsers, FiUserMinus, FiSliders} = FiIcons;

const PredictiveAnalytics = ({athletes, teamComposition, scholarshipLimits, recruitingNeeds}) => {
  console.log("PredictiveAnalytics Rendered with props:", {
    hasAthletes: Boolean(athletes?.length),
    hasTeamComposition: Boolean(Object.keys(teamComposition || {}).length),
    hasScholarshipLimits: Boolean(Object.keys(scholarshipLimits || {}).length),
    hasRecruitingNeeds: Boolean(Object.keys(recruitingNeeds || {}).length)
  });
  
  const [predictiveTab, setPredictiveTab] = useState('scholarship');
  const [timeHorizon, setTimeHorizon] = useState('3years');
  const [confidenceLevel, setConfidenceLevel] = useState('medium');
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Historical data would typically come from an API or database
  const historicalData = {
    performances: [],
    scholarships: [],
    recruiting: []
  };

  // Ensure data is properly initialized before rendering components
  useEffect(() => {
    if (athletes && athletes.length > 0 && 
        teamComposition && Object.keys(teamComposition).length > 0 &&
        scholarshipLimits && Object.keys(scholarshipLimits).length > 0) {
      setComponentLoaded(true);
    }
  }, [athletes, teamComposition, scholarshipLimits]);

  const tabs = [
    {id: 'scholarship', name: 'Scholarship Forecasting', icon: FiDollarSign, component: ScholarshipForecasting},
    {id: 'performance', name: 'Performance Predictions', icon: FiTrendingUp, component: PerformancePredictions},
    {id: 'recruiting', name: 'Recruiting Predictions', icon: FiUsers, component: RecruitingPredictions},
    {id: 'graduation', name: 'Graduation Impact Forecast', icon: FiUserMinus, component: GraduationForecast}
  ];

  const renderPredictiveComponent = () => {
    const TabComponent = tabs.find(tab => tab.id === predictiveTab)?.component;
    console.log('Predictive Active Tab:', predictiveTab);
    console.log('Found Predictive Component:', TabComponent?.name);
    
    if (!componentLoaded) {
      return (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <SafeIcon icon={FiSliders} className="w-5 h-5" />
            </div>
            <span>Initializing predictive analytics...</span>
          </div>
        </div>
      );
    }
    
    if (!TabComponent) {
      console.error("Predictive component not found for tab:", predictiveTab);
      return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Loading component...
        </div>
      );
    }
    
    try {
      return (
        <TabComponent
          athletes={athletes}
          teamComposition={teamComposition}
          scholarshipLimits={scholarshipLimits}
          recruitingNeeds={recruitingNeeds}
          historicalData={historicalData}
          timeHorizon={timeHorizon}
          confidenceLevel={confidenceLevel}
        />
      );
    } catch (error) {
      console.error("Error rendering predictive component:", error);
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h3 className="font-medium mb-2">Error rendering component</h3>
          <p>{error.message}</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Predictive Analytics</h2>
        <p className="text-gray-600 dark:text-gray-300">Advanced forecasting and predictive insights</p>
      </div>

      {/* Settings Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Horizon</label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            >
              <option value="1year">1 Year</option>
              <option value="3years">3 Years</option>
              <option value="5years">5 Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confidence Level</label>
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            >
              <option value="low">Conservative</option>
              <option value="medium">Moderate</option>
              <option value="high">Aggressive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPredictiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap ${
                predictiveTab === tab.id ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
        <div className="p-6">
          {renderPredictiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;