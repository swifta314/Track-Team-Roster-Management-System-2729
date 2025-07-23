/**
 * Shared utilities for analytics components
 */
import React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';

/**
 * Custom tooltip component for charts
 */
export const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color || entry.stroke }}>
              {entry.name}: {formatter ? formatter(entry.value, entry.name) : entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Creates a tooltip component with custom formatting
 */
export const createTooltip = (formatter) => {
  return (props) => <CustomTooltip {...props} formatter={formatter} />;
};

/**
 * Empty state component for when no data is available
 */
export const EmptyState = ({ icon: Icon, message, subMessage }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <Icon className="w-16 h-16 mx-auto" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{message}</h3>
    {subMessage && <p className="text-gray-500 dark:text-gray-400 mb-4">{subMessage}</p>}
  </div>
);

/**
 * Loading state component for async data loading
 */
export const LoadingState = () => (
  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
    <div className="animate-pulse flex space-x-4 justify-center">
      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
      <div className="flex-1 space-y-6 py-1 max-w-md">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
  </div>
);

/**
 * Error state component for error handling
 */
export const ErrorState = ({ error, retry }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
    <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading data</p>
    <p className="text-sm text-red-500 dark:text-red-300 mb-4">{error?.message || 'Please try again'}</p>
    {retry && (
      <button
        onClick={retry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Retry
      </button>
    )}
  </div>
);

/**
 * Standardized metric card component
 */
export const MetricCard = ({ title, value, icon: Icon, color, description, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 ${color || 'bg-blue-100 dark:bg-blue-900'} rounded-lg`}>
        <Icon className={`w-5 h-5 ${color?.replace('bg-', 'text-').replace('100', '600')} dark:${color?.replace('bg-', 'text-').replace('100', '400')}`} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
    {trend && (
      <div className="mt-2 flex items-center gap-1">
        <span className={`text-sm ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.value}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{trend.label}</span>
      </div>
    )}
  </div>
);

/**
 * Combine multiple analytics components into a single layout
 */
export const AnalyticsLayout = ({ children, title, description, filters }) => (
  <div className="space-y-6">
    {(title || description) && (
      <div>
        {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>}
        {description && <p className="text-gray-600 dark:text-gray-300">{description}</p>}
      </div>
    )}
    
    {filters && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          {filters}
        </div>
      </div>
    )}
    
    {children}
  </div>
);