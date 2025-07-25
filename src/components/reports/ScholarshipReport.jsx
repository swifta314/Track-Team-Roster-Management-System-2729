```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import GenderFilterBadge from '../GenderFilterBadge';
import GenderToggle from '../GenderToggle'; // Add this import

const { FiDownload, FiFilter, FiPrinter, FiCalendar, FiDollarSign, FiBarChart2, FiUsers } = FiIcons;

const ScholarshipReport = ({ athletes, scholarshipLimits, globalGenderFilter, setGlobalGenderFilter }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('year');
  const [includeArchived, setIncludeArchived] = useState(false);

  // Add gender toggle control
  const handleGenderFilterChange = (filter) => {
    setGlobalGenderFilter(filter);
  };

  // Rest of your existing code...

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGenderTitle()}Scholarship Report
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of scholarship program enrollment
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={FiPrinter} className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Add Gender Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <GenderToggle
              globalGenderFilter={globalGenderFilter}
              setGlobalGenderFilter={handleGenderFilterChange}
            />
          </div>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Report</option>
            <option value="compliance">NCAA Compliance</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
          >
            <option value="year">Academic Year</option>
            <option value="semester">Current Semester</option>
            <option value="month">Last 30 Days</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
              className="w-4 h-4 text-ballstate-red focus:ring-ballstate-red border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Include Archived</span>
          </label>

          <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
        </div>
      </div>

      {/* Report Content */}
      {renderSummaryReport()}
    </div>
  );
};

export default ScholarshipReport;
```