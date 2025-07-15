import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiUser, FiSearch, FiMale, FiFemale, FiCheckSquare, FiSquare, 
  FiSave, FiEdit3, FiChevronDown, FiChevronUp, FiCheck, FiAlertTriangle, 
  FiClipboard, FiStar
} = FiIcons;

const EvaluationForm = ({ 
  athletes, 
  selectedAthletes, 
  toggleAthleteSelection, 
  evaluationResults, 
  saveEvaluation,
  tierCriteria 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAthlete, setExpandedAthlete] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState({});
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showEvaluated, setShowEvaluated] = useState(false);

  // Filter athletes based on search term
  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    athlete.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Further filter to show only evaluated athletes if that filter is enabled
  const displayedAthletes = showEvaluated 
    ? filteredAthletes.filter(athlete => evaluationResults[athlete.id]) 
    : filteredAthletes;

  // Calculate the completion percentage of the evaluation form
  const calculateCompletionPercentage = (evaluation) => {
    if (!evaluation) return 0;
    
    const totalFields = 9; // Update this if you add more fields
    const filledFields = Object.values(evaluation).filter(val => val !== undefined && val !== '').length;
    return Math.round((filledFields / totalFields) * 100);
  };

  // Start or continue an evaluation
  const handleStartEvaluation = (athlete) => {
    setExpandedAthlete(athlete.id);
    setCurrentEvaluation(evaluationResults[athlete.id] || {
      athleteId: athlete.id,
      // Performance metrics
      technicalSkill: '',
      athleticAbility: '',
      competitiveInstinct: '',
      // Academic metrics
      academicPotential: '',
      // Character metrics
      workEthic: '',
      teamCulture: '',
      coachability: '',
      // Overall assessment
      potentialTier: '',
      notes: ''
    });
  };

  // Close the evaluation form
  const handleCloseEvaluation = () => {
    setExpandedAthlete(null);
    setCurrentEvaluation({});
  };

  // Update the current evaluation
  const handleEvaluationChange = (field, value) => {
    setCurrentEvaluation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save the evaluation
  const handleSaveEvaluation = () => {
    saveEvaluation(currentEvaluation.athleteId, currentEvaluation);
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  // Get the rating label
  const getRatingLabel = (rating) => {
    switch (rating) {
      case '1': return 'Poor';
      case '2': return 'Below Average';
      case '3': return 'Average';
      case '4': return 'Good';
      case '5': return 'Excellent';
      default: return 'Not Rated';
    }
  };

  // Get the color class for a rating
  const getRatingColorClass = (rating) => {
    switch (rating) {
      case '1': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '2': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case '3': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case '4': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '5': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Get the tier color
  const getTierColor = (tier) => {
    return tierCriteria[tier]?.color || 'bg-gray-500';
  };

  // Render the star rating input
  const StarRating = ({ value, onChange, label, description }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {value && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${getRatingColorClass(value)}`}>
            {getRatingLabel(value)}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => onChange(String(rating))}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              value === String(rating) 
                ? 'bg-ballstate-red text-white' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={getRatingLabel(String(rating))}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ballstate-red focus:border-ballstate-red sm:text-sm"
              placeholder="Search athletes by name or event..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showEvaluated}
                onChange={() => setShowEvaluated(!showEvaluated)}
                className="sr-only"
              />
              <div className={`relative w-11 h-6 rounded-full transition ${
                showEvaluated ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  showEvaluated ? 'translate-x-5' : ''
                }`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Show evaluated only
              </span>
            </label>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {displayedAthletes.length} of {athletes.length} athletes
            </div>
          </div>
        </div>
      </div>

      {/* Athlete List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <SafeIcon icon={FiClipboard} className="w-5 h-5 text-ballstate-red" />
            Standardized Evaluation Forms
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select an athlete to complete a standardized evaluation form. Evaluations help with team decisions and scholarship allocations.
          </p>
        </div>
        
        {displayedAthletes.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedAthletes.map(athlete => {
              const isSelected = selectedAthletes.includes(athlete.id);
              const isExpanded = expandedAthlete === athlete.id;
              const evaluation = evaluationResults[athlete.id];
              const completionPercentage = calculateCompletionPercentage(evaluation);
              
              return (
                <li key={athlete.id} className={`relative ${isExpanded ? 'bg-gray-50 dark:bg-gray-750' : ''}`}>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => toggleAthleteSelection(athlete.id)}
                          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          <SafeIcon 
                            icon={isSelected ? FiCheckSquare : FiSquare} 
                            className={`w-5 h-5 ${isSelected ? 'text-ballstate-red' : ''}`} 
                          />
                        </button>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className={`w-8 h-8 ${athlete.gender === 'M' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-pink-100 dark:bg-pink-900'} rounded-full flex items-center justify-center`}>
                          <SafeIcon 
                            icon={athlete.gender === 'M' ? FiMale : FiFemale} 
                            className={`w-4 h-4 ${athlete.gender === 'M' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`} 
                          />
                        </div>
                        <div className="ml-3 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {athlete.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {athlete.event}
                            </span>
                            {athlete.tier && (
                              <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getTierColor(athlete.tier)}`}>
                                {tierCriteria[athlete.tier]?.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {evaluation && (
                        <div className="hidden md:flex items-center">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                completionPercentage >= 75 ? 'bg-green-500' : 
                                completionPercentage >= 50 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`} 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {completionPercentage}%
                          </span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleStartEvaluation(athlete)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${
                          evaluation 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50' 
                            : 'bg-ballstate-red text-white hover:bg-red-700'
                        } transition-colors`}
                      >
                        <SafeIcon icon={evaluation ? FiEdit3 : FiClipboard} className="w-4 h-4" />
                        {evaluation ? 'Edit' : 'Evaluate'}
                      </button>
                      
                      <button
                        onClick={() => isExpanded ? handleCloseEvaluation() : handleStartEvaluation(athlete)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                      >
                        <SafeIcon icon={isExpanded ? FiChevronUp : FiChevronDown} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Evaluation Form */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Talent Evaluation: {athlete.name}
                          </h3>
                          {showSavedMessage && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <SafeIcon icon={FiCheck} className="w-4 h-4" />
                              <span className="text-sm">Evaluation saved!</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Performance Metrics */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StarRating 
                              value={currentEvaluation.technicalSkill} 
                              onChange={(value) => handleEvaluationChange('technicalSkill', value)} 
                              label="Technical Skill" 
                              description="Technique, form, and skill mastery"
                            />
                            
                            <StarRating 
                              value={currentEvaluation.athleticAbility} 
                              onChange={(value) => handleEvaluationChange('athleticAbility', value)} 
                              label="Athletic Ability" 
                              description="Speed, strength, power, endurance"
                            />
                            
                            <StarRating 
                              value={currentEvaluation.competitiveInstinct} 
                              onChange={(value) => handleEvaluationChange('competitiveInstinct', value)} 
                              label="Competitive Instinct" 
                              description="Drive to win, performs under pressure"
                            />
                          </div>
                        </div>
                        
                        {/* Academic Metrics */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Academic Metrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StarRating 
                              value={currentEvaluation.academicPotential} 
                              onChange={(value) => handleEvaluationChange('academicPotential', value)} 
                              label="Academic Potential" 
                              description="Ability to maintain eligibility and excel in studies"
                            />
                          </div>
                        </div>
                        
                        {/* Character Metrics */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Character Metrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StarRating 
                              value={currentEvaluation.workEthic} 
                              onChange={(value) => handleEvaluationChange('workEthic', value)} 
                              label="Work Ethic" 
                              description="Dedication, discipline, and effort"
                            />
                            
                            <StarRating 
                              value={currentEvaluation.teamCulture} 
                              onChange={(value) => handleEvaluationChange('teamCulture', value)} 
                              label="Team Culture Fit" 
                              description="Compatibility with program values and culture"
                            />
                            
                            <StarRating 
                              value={currentEvaluation.coachability} 
                              onChange={(value) => handleEvaluationChange('coachability', value)} 
                              label="Coachability" 
                              description="Receptiveness to feedback and instruction"
                            />
                          </div>
                        </div>
                        
                        {/* Overall Assessment */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Overall Assessment</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Potential Performance Tier
                              </label>
                              <select
                                value={currentEvaluation.potentialTier}
                                onChange={(e) => handleEvaluationChange('potentialTier', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-ballstate-red focus:border-ballstate-red"
                              >
                                <option value="">Select potential tier</option>
                                {Object.entries(tierCriteria).map(([key, tier]) => (
                                  <option key={key} value={key}>{tier.name}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Evaluation Notes
                              </label>
                              <textarea
                                value={currentEvaluation.notes || ''}
                                onChange={(e) => handleEvaluationChange('notes', e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-ballstate-red focus:border-ballstate-red"
                                placeholder="Add any additional notes or observations..."
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-3">
                          <button
                            onClick={handleCloseEvaluation}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEvaluation}
                            className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-md hover:bg-red-700"
                          >
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                            Save Evaluation
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No athletes found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {showEvaluated 
                ? "No athletes have been evaluated yet. Try disabling the 'Show evaluated only' filter."
                : "No athletes match your search criteria. Try adjusting your search term."}
            </p>
          </div>
        )}
      </div>

      {/* Evaluation Guidelines */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-500" />
          Evaluation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rating Scale</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">1 - Poor</span>
                <span className="text-gray-600 dark:text-gray-400">Significantly below NCAA Division I standards</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs">2 - Below Average</span>
                <span className="text-gray-600 dark:text-gray-400">Below average for NCAA Division I</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs">3 - Average</span>
                <span className="text-gray-600 dark:text-gray-400">Average for NCAA Division I</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">4 - Good</span>
                <span className="text-gray-600 dark:text-gray-400">Above average for NCAA Division I</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">5 - Excellent</span>
                <span className="text-gray-600 dark:text-gray-400">Elite level for NCAA Division I</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best Practices</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Evaluate athletes based on multiple observations when possible</li>
              <li>• Consider both current performance and future potential</li>
              <li>• Be consistent in how you apply ratings across different athletes</li>
              <li>• Update evaluations as athletes develop or circumstances change</li>
              <li>• Use evaluations as one of multiple factors in decision-making</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;