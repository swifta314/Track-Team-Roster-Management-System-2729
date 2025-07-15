import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import GenderFilterBadge from '../GenderFilterBadge';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const { FiDownload, FiFilter, FiPrinter, FiCalendar, FiDollarSign, FiBarChart2, FiUsers } = FiIcons;

const ScholarshipReport = ({ athletes, scholarshipLimits, globalGenderFilter }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('year');
  const [includeArchived, setIncludeArchived] = useState(false);

  // Filter athletes based on global gender filter
  const filteredAthletes = athletes.filter(athlete => {
    // Filter by archived status
    if (!includeArchived && athlete.status === 'archived') return false;
    
    // Filter by gender
    if (globalGenderFilter === 'both') return true;
    if (globalGenderFilter === 'men') return athlete.gender === 'M';
    if (globalGenderFilter === 'women') return athlete.gender === 'F';
    return true;
  });

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  const calculateScholarshipStats = () => {
    const stats = {
      total: { men: 0, women: 0 },
      byEventGroup: {},
      byYear: {},
      averages: { men: 0, women: 0 },
      recipients: { men: 0, women: 0 }
    };

    filteredAthletes.forEach(athlete => {
      if (!includeArchived && athlete.status === 'archived') return;

      const gender = athlete.gender === 'M' ? 'men' : 'women';
      const amount = athlete.scholarshipAmount;
      const eventGroup = mapEventToGroup(athlete.athleticPerformance.primaryEvents[0]);
      const year = athlete.year;

      // Total scholarships
      stats.total[gender] += amount;

      // Recipients count
      if (amount > 0) {
        stats.recipients[gender]++;
      }

      // By event group
      if (!stats.byEventGroup[eventGroup]) {
        stats.byEventGroup[eventGroup] = { men: 0, women: 0 };
      }
      stats.byEventGroup[eventGroup][gender] += amount;

      // By year
      if (!stats.byYear[year]) {
        stats.byYear[year] = { men: 0, women: 0 };
      }
      stats.byYear[year][gender] += amount;
    });

    // Calculate averages
    stats.averages.men = stats.recipients.men > 0 ? stats.total.men / stats.recipients.men : 0;
    stats.averages.women = stats.recipients.women > 0 ? stats.total.women / stats.recipients.women : 0;

    return stats;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const stats = calculateScholarshipStats();

    // Title
    doc.setFontSize(20);
    doc.text(`${getGenderTitle()}Scholarship Program Report`, 20, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 20, 30);

    // Filter info
    doc.setFontSize(12);
    doc.text(`Filter: ${globalGenderFilter === 'both' ? 'All Athletes' : 
              globalGenderFilter === 'men' ? 'Men\'s Team Only' : 'Women\'s Team Only'}`, 20, 40);

    // Summary Table
    const summaryData = [];
    if (globalGenderFilter === 'both' || globalGenderFilter === 'men') {
      summaryData.push([
        'Men\'s Team',
        stats.total.men.toLocaleString(),
        stats.recipients.men,
        stats.averages.men.toFixed(2)
      ]);
    }
    if (globalGenderFilter === 'both' || globalGenderFilter === 'women') {
      summaryData.push([
        'Women\'s Team',
        stats.total.women.toLocaleString(),
        stats.recipients.women,
        stats.averages.women.toFixed(2)
      ]);
    }
    if (globalGenderFilter === 'both') {
      summaryData.push([
        'Total',
        (stats.total.men + stats.total.women).toLocaleString(),
        stats.recipients.men + stats.recipients.women,
        ((stats.averages.men + stats.averages.women) / 2).toFixed(2)
      ]);
    }

    doc.autoTable({
      startY: 50,
      head: [['Team', 'Total Scholarships ($)', 'Recipients', 'Average Award ($)']],
      body: summaryData
    });

    // Event Group Distribution
    const eventGroupData = Object.entries(stats.byEventGroup).map(([group, amounts]) => {
      const row = [group];
      if (globalGenderFilter === 'both' || globalGenderFilter === 'men') {
        row.push(amounts.men.toLocaleString());
      }
      if (globalGenderFilter === 'both' || globalGenderFilter === 'women') {
        row.push(amounts.women.toLocaleString());
      }
      if (globalGenderFilter === 'both') {
        row.push((amounts.men + amounts.women).toLocaleString());
      }
      return row;
    });

    const eventGroupHeaders = ['Event Group'];
    if (globalGenderFilter === 'both' || globalGenderFilter === 'men') {
      eventGroupHeaders.push('Men ($)');
    }
    if (globalGenderFilter === 'both' || globalGenderFilter === 'women') {
      eventGroupHeaders.push('Women ($)');
    }
    if (globalGenderFilter === 'both') {
      eventGroupHeaders.push('Total ($)');
    }

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [eventGroupHeaders],
      body: eventGroupData
    });

    // NCAA Compliance
    const complianceData = [];
    if (globalGenderFilter === 'both' || globalGenderFilter === 'men') {
      const menNcaaPercentage = (stats.total.men / (scholarshipLimits.men.total * 10000)) * 100;
      complianceData.push([
        'Men\'s Team',
        stats.total.men.toLocaleString(),
        (scholarshipLimits.men.total * 10000).toLocaleString(),
        `${menNcaaPercentage.toFixed(1)}%`
      ]);
    }
    if (globalGenderFilter === 'both' || globalGenderFilter === 'women') {
      const womenNcaaPercentage = (stats.total.women / (scholarshipLimits.women.total * 10000)) * 100;
      complianceData.push([
        'Women\'s Team',
        stats.total.women.toLocaleString(),
        (scholarshipLimits.women.total * 10000).toLocaleString(),
        `${womenNcaaPercentage.toFixed(1)}%`
      ]);
    }

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['NCAA Compliance', 'Used', 'Limit', 'Percentage']],
      body: complianceData
    });

    doc.save(`${globalGenderFilter}-scholarship-report.pdf`);
  };

  const stats = calculateScholarshipStats();

  const renderSummaryReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Scholarships</h3>
          </div>
          <div className="space-y-2">
            {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Men's Team:</span>
                <span className="font-medium text-gray-900">
                  ${stats.total.men.toLocaleString()}
                </span>
              </div>
            )}
            {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Women's Team:</span>
                <span className="font-medium text-gray-900">
                  ${stats.total.women.toLocaleString()}
                </span>
              </div>
            )}
            {globalGenderFilter === 'both' && (
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="font-bold text-gray-900">
                    ${(stats.total.men + stats.total.women).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recipients</h3>
          </div>
          <div className="space-y-2">
            {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Men's Team:</span>
                <span className="font-medium text-gray-900">
                  {stats.recipients.men} athletes
                </span>
              </div>
            )}
            {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Women's Team:</span>
                <span className="font-medium text-gray-900">
                  {stats.recipients.women} athletes
                </span>
              </div>
            )}
            {globalGenderFilter === 'both' && (
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="font-bold text-gray-900">
                    {stats.recipients.men + stats.recipients.women} athletes
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Average Award</h3>
          </div>
          <div className="space-y-2">
            {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Men's Team:</span>
                <span className="font-medium text-gray-900">
                  ${stats.averages.men.toFixed(2)}
                </span>
              </div>
            )}
            {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Women's Team:</span>
                <span className="font-medium text-gray-900">
                  ${stats.averages.women.toFixed(2)}
                </span>
              </div>
            )}
            {globalGenderFilter === 'both' && (
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Overall:</span>
                  <span className="font-bold text-gray-900">
                    ${((stats.averages.men + stats.averages.women) / 2).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Distribution Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution by Event Group
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Event Group</th>
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                    <th className="text-right py-2">Men</th>
                  )}
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                    <th className="text-right py-2">Women</th>
                  )}
                  {globalGenderFilter === 'both' && (
                    <th className="text-right py-2">Total</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.byEventGroup).map(([group, amounts]) => (
                  <tr key={group} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-gray-900">{group}</td>
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                      <td className="text-right py-2">${amounts.men.toLocaleString()}</td>
                    )}
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                      <td className="text-right py-2">${amounts.women.toLocaleString()}</td>
                    )}
                    {globalGenderFilter === 'both' && (
                      <td className="text-right py-2 font-medium">
                        ${(amounts.men + amounts.women).toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution by Year
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Year</th>
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                    <th className="text-right py-2">Men</th>
                  )}
                  {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                    <th className="text-right py-2">Women</th>
                  )}
                  {globalGenderFilter === 'both' && (
                    <th className="text-right py-2">Total</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.byYear).map(([year, amounts]) => (
                  <tr key={year} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-gray-900">{year}</td>
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
                      <td className="text-right py-2">${amounts.men.toLocaleString()}</td>
                    )}
                    {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
                      <td className="text-right py-2">${amounts.women.toLocaleString()}</td>
                    )}
                    {globalGenderFilter === 'both' && (
                      <td className="text-right py-2 font-medium">
                        ${(amounts.men + amounts.women).toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NCAA Compliance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          NCAA Compliance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(globalGenderFilter === 'both' || globalGenderFilter === 'men') && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Men's Team</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Used:</span>
                  <span className="font-medium text-gray-900">
                    ${stats.total.men.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">NCAA Limit:</span>
                  <span className="font-medium text-gray-900">
                    ${(scholarshipLimits.men.total * 10000).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Percentage Used:</span>
                  <span className="font-medium text-gray-900">
                    {((stats.total.men / (scholarshipLimits.men.total * 10000)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          {(globalGenderFilter === 'both' || globalGenderFilter === 'women') && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Women's Team</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Used:</span>
                  <span className="font-medium text-gray-900">
                    ${stats.total.women.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">NCAA Limit:</span>
                  <span className="font-medium text-gray-900">
                    ${(scholarshipLimits.women.total * 10000).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Percentage Used:</span>
                  <span className="font-medium text-gray-900">
                    {((stats.total.women / (scholarshipLimits.women.total * 10000)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
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

// Helper function to map events to groups
const mapEventToGroup = (event) => {
  const eventMap = {
    '100m': 'Sprints',
    '200m': 'Sprints',
    '400m': 'Sprints',
    '800m': 'Middle Distance',
    '1500m': 'Middle Distance',
    '3000m': 'Distance',
    '5000m': 'Distance',
    '10000m': 'Distance',
    'Long Jump': 'Jumps',
    'Triple Jump': 'Jumps',
    'High Jump': 'Jumps',
    'Pole Vault': 'Jumps',
    'Shot Put': 'Throws',
    'Discus': 'Throws',
    'Javelin': 'Throws',
    'Hammer': 'Throws'
  };
  return eventMap[event] || 'Other';
};

export default ScholarshipReport;