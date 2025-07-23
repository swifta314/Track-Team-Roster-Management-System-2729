/**
 * Utility functions for common calculations used throughout the application
 */

/**
 * Calculates impact score based on evaluation metrics
 * @param {Object} evaluation - The evaluation data
 * @param {Object} athlete - The athlete data
 * @returns {Object} The calculated impact scores
 */
export const calculateImpactScore = (evaluation, athlete) => {
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

/**
 * Calculates recommended scholarship amount based on impact score
 * @param {Object} athlete - The athlete data
 * @param {Object} evaluation - The evaluation data
 * @returns {number} The recommended scholarship amount
 */
export const calculateRecommendedAmount = (athlete, evaluation) => {
  const impactScore = calculateImpactScore(evaluation, athlete).total;
  const maxScholarship = 10000; // Base max scholarship amount
  return Math.round((impactScore / 100) * maxScholarship / 100) * 100;
};

/**
 * Calculates remaining scholarship budget for a gender
 * @param {string} gender - 'M' or 'F'
 * @param {Array} athletes - The athletes data
 * @param {Object} scholarshipLimits - The scholarship limits data
 * @returns {number} The remaining scholarship budget
 */
export const calculateRemainingBudget = (gender, athletes, scholarshipLimits) => {
  const limit = gender === 'M' ? scholarshipLimits.men : scholarshipLimits.women;
  const allocated = athletes
    .filter(a => a.gender === gender && a.status !== 'archived')
    .reduce((sum, a) => sum + (a.scholarshipAmount / 10000), 0);
  
  return limit.total - allocated;
};

/**
 * Calculates the competitive index of a group of athletes
 * @param {Array} athletes - The athletes to calculate index for
 * @returns {number} The competitive index value (0-100)
 */
export const calculateCompetitiveIndex = (athletes) => {
  if (athletes.length === 0) return 0;
  
  const tierWeights = {
    elite: 4,
    competitive: 3,
    developing: 2,
    prospect: 1
  };
  
  const totalWeight = athletes.reduce((sum, athlete) => 
    sum + tierWeights[athlete.tier], 0);
    
  return Math.round((totalWeight / athletes.length) * 25); // Scale to 100
};

/**
 * Formats currency values with locale formatting
 * @param {number} value - The currency value to format
 * @param {boolean} includeSymbol - Whether to include the $ symbol
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (value, includeSymbol = true) => {
  return `${includeSymbol ? '$' : ''}${value.toLocaleString()}`;
};

/**
 * Converts a percentage to a dollar amount
 * @param {number} percentage - The percentage (0-100)
 * @param {number} budget - The total budget
 * @returns {number} The dollar amount
 */
export const percentageToDollars = (percentage, budget) => {
  return (percentage / 100) * budget;
};

/**
 * Converts a dollar amount to a percentage
 * @param {number} amount - The dollar amount
 * @param {number} budget - The total budget
 * @returns {number} The percentage (0-100)
 */
export const dollarsToPercentage = (amount, budget) => {
  return (amount / budget) * 100;
};