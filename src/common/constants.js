
// Common styling classes and constants
export const COMMON_STYLES = {
  card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg",
  cardHeader: "p-6 border-b border-gray-200 dark:border-gray-700",
  cardBody: "p-6",
  button: {
    primary: "px-4 py-2 bg-ballstate-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors",
    secondary: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors",
    danger: "px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
  },
  input: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red",
  select: "px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red",
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    container: "bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
  }
};

export const RISK_LEVELS = {
  HIGH: { 
    color: 'text-red-600', 
    bg: 'bg-red-100', 
    badge: 'bg-red-100 text-red-800' 
  },
  MEDIUM: { 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-100', 
    badge: 'bg-yellow-100 text-yellow-800' 
  },
  LOW: { 
    color: 'text-green-600', 
    bg: 'bg-green-100', 
    badge: 'bg-green-100 text-green-800' 
  }
};

export const ELIGIBILITY_STATUS_OPTIONS = [
  'Eligible',
  'Pending', 
  'Ineligible',
  'Redshirt'
];

export const TIME_HORIZON_OPTIONS = [
  { value: '1year', label: '1 Year' },
  { value: '3years', label: '3 Years' },
  { value: '5years', label: '5 Years' }
];

export const CONFIDENCE_LEVEL_OPTIONS = [
  { value: 'low', label: 'Conservative' },
  { value: 'medium', label: 'Moderate' },
  { value: 'high', label: 'Aggressive' }
];
