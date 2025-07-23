
import { COMMON_STYLES, RISK_LEVELS } from '../common/constants';

export const useCommonStyles = () => {
  const getRiskStyles = (riskLevel) => {
    const level = riskLevel?.toUpperCase();
    return RISK_LEVELS[level] || RISK_LEVELS.LOW;
  };

  const getCardClasses = (variant = 'default') => {
    switch (variant) {
      case 'danger':
        return `${COMMON_STYLES.card} border-l-4 border-red-500`;
      case 'warning':
        return `${COMMON_STYLES.card} border-l-4 border-yellow-500`;
      case 'success':
        return `${COMMON_STYLES.card} border-l-4 border-green-500`;
      default:
        return COMMON_STYLES.card;
    }
  };

  const getButtonClasses = (variant = 'primary') => {
    return COMMON_STYLES.button[variant] || COMMON_STYLES.button.primary;
  };

  return {
    styles: COMMON_STYLES,
    getRiskStyles,
    getCardClasses,
    getButtonClasses
  };
};
