import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ThemeToggle from './ThemeToggle';
import ResetConfirmationModal from './ResetConfirmationModal';
import BulkImportModal from './BulkImportModal';
import GenderFilterBadge from './GenderFilterBadge';

const { FiSettings, FiDatabase, FiUpload, FiDownload, FiTrash2, FiRefreshCw, FiSliders, FiEye, FiMoon, FiSun, FiUsers, FiDollarSign, FiTarget, FiShield, FiBell, FiMail, FiCalendar, FiBookOpen, FiAward, FiBarChart3, FiHelpCircle, FiInfo, FiExternalLink, FiCheck, FiX, FiEdit3, FiSave } = FiIcons;

const Settings = ({ 
  isDarkMode, 
  setIsDarkMode, 
  compactMode, 
  setCompactMode, 
  globalGenderFilter, 
  setGlobalGenderFilter, 
  onResetData,
  athletes,
  setAthletes,
  scholarshipLimits,
  setScholarshipLimits,
  teamComposition,
  setTeamComposition
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingEventGroup, setEditingEventGroup] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    recruiting: true,
    scholarship: true,
    performance: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    analytics: true,
    cookies: true
  });

  const handleResetData = () => {
    onResetData();
    setIsResetModalOpen(false);
  };

  const handleBulkImport = (importedAthletes) => {
    setAthletes(prev => [...prev, ...importedAthletes]);
    console.log('Imported athletes:', importedAthletes.length);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Gender', 'Event', 'Personal Best', 'GPA', 'Scholarship Amount', 'Year', 'Tier'].join(','),
      ...athletes.map(athlete => [
        athlete.name,
        athlete.gender,
        athlete.event,
        athlete.personalBest,
        athlete.gpa,
        athlete.scholarshipAmount,
        athlete.year,
        athlete.tier
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `athletes_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEventGroupUpdate = (groupKey, field, value) => {
    setTeamComposition(prev => ({
      ...prev,
      eventGroups: {
        ...prev.eventGroups,
        [groupKey]: {
          ...prev.eventGroups[groupKey],
          [field]: {
            ...prev.eventGroups[groupKey][field],
            ...value
          }
        }
      }
    }));
  };

  const handleScholarshipBudgetUpdate = (gender, field, value) => {
    setScholarshipLimits(prev => ({
      ...prev,
      [gender]: {
        ...prev[gender],
        [field]: value
      }
    }));
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Display Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Default Team View</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set the default gender filter for all views</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={globalGenderFilter}
                onChange={(e) => {
                  setGlobalGenderFilter(e.target.value);
                  localStorage.setItem('defaultGenderFilter', e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
              >
                <option value="both">All Athletes</option>
                <option value="men">Men's Team</option>
                <option value="women">Women's Team</option>
              </select>
              <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Compact Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing for denser display</p>
            </div>
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={() => setCompactMode(!compactMode)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${compactMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${compactMode ? 'translate-x-5' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {compactMode ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamManagementSettings = () => (
    <div className="space-y-6">
      {/* Roster Limits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Roster Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Team Size Limits</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Men's Team Size
                </label>
                <input
                  type="number"
                  value={teamComposition?.genderDistribution?.men?.total || 65}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setTeamComposition(prev => ({
                      ...prev,
                      genderDistribution: {
                        ...prev.genderDistribution,
                        men: { ...prev.genderDistribution.men, total: newValue }
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Women's Team Size
                </label>
                <input
                  type="number"
                  value={teamComposition?.genderDistribution?.women?.total || 76}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setTeamComposition(prev => ({
                      ...prev,
                      genderDistribution: {
                        ...prev.genderDistribution,
                        women: { ...prev.genderDistribution.women, total: newValue }
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Current Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Men's Team:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {teamComposition?.genderDistribution?.men?.filled || 0} / {teamComposition?.genderDistribution?.men?.total || 65}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Women's Team:</span>
                <span className="font-medium text-pink-600 dark:text-pink-400">
                  {teamComposition?.genderDistribution?.women?.filled || 0} / {teamComposition?.genderDistribution?.women?.total || 76}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Athletes:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {athletes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Group Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Event Group Target Distribution</h3>
        <div className="space-y-4">
          {Object.entries(teamComposition?.eventGroups || {}).map(([key, group]) => (
            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
                <button
                  onClick={() => setEditingEventGroup(editingEventGroup === key ? null : key)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <SafeIcon icon={editingEventGroup === key ? FiSave : FiEdit3} className="w-4 h-4" />
                  {editingEventGroup === key ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Men's Target
                  </label>
                  {editingEventGroup === key ? (
                    <input
                      type="number"
                      value={group.rosterSpots?.men || 0}
                      onChange={(e) => handleEventGroupUpdate(key, 'rosterSpots', { men: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {group.rosterSpots?.men || 0}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Women's Target
                  </label>
                  {editingEventGroup === key ? (
                    <input
                      type="number"
                      value={group.rosterSpots?.women || 0}
                      onChange={(e) => handleEventGroupUpdate(key, 'rosterSpots', { women: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-pink-600 dark:text-pink-400 font-medium">
                        {group.rosterSpots?.women || 0}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Total
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {(group.filled?.men || 0) + (group.filled?.women || 0)} / {(group.rosterSpots?.men || 0) + (group.rosterSpots?.women || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarship Master Budget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Scholarship Master Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Men's Program</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NCAA Scholarship Limit
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scholarshipLimits?.men?.total || 12.6}
                  onChange={(e) => handleScholarshipBudgetUpdate('men', 'total', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Budget ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={scholarshipLimits?.men?.totalBudget || 315000}
                  onChange={(e) => handleScholarshipBudgetUpdate('men', 'totalBudget', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Average Full Scholarship Value ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={scholarshipLimits?.men?.dollarAmount || 25000}
                  onChange={(e) => handleScholarshipBudgetUpdate('men', 'dollarAmount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Women's Program</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NCAA Scholarship Limit
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scholarshipLimits?.women?.total || 18.0}
                  onChange={(e) => handleScholarshipBudgetUpdate('women', 'total', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Budget ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={scholarshipLimits?.women?.totalBudget || 450000}
                  onChange={(e) => handleScholarshipBudgetUpdate('women', 'totalBudget', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Average Full Scholarship Value ($)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={scholarshipLimits?.women?.dollarAmount || 25000}
                  onChange={(e) => handleScholarshipBudgetUpdate('women', 'dollarAmount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Budget Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Budget Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Combined Budget</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ${((scholarshipLimits?.men?.totalBudget || 315000) + (scholarshipLimits?.women?.totalBudget || 450000)).toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">Total Scholarships</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {((scholarshipLimits?.men?.total || 12.6) + (scholarshipLimits?.women?.total || 18.0)).toFixed(1)}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Per Scholarship</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                ${Math.round(((scholarshipLimits?.men?.totalBudget || 315000) + (scholarshipLimits?.women?.totalBudget || 450000)) / ((scholarshipLimits?.men?.total || 12.6) + (scholarshipLimits?.women?.total || 18.0))).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Delivery Methods</h4>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', icon: FiMail },
                { key: 'push', label: 'Push Notifications', icon: FiBell },
                { key: 'sms', label: 'SMS Notifications', icon: FiMail }
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={icon} className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition ${notifications[key] ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications[key] ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Notification Types</h4>
            <div className="space-y-4">
              {[
                { key: 'recruiting', label: 'Recruiting Updates', icon: FiUsers },
                { key: 'scholarship', label: 'Scholarship Changes', icon: FiDollarSign },
                { key: 'performance', label: 'Performance Alerts', icon: FiBarChart3 }
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={icon} className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition ${notifications[key] ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications[key] ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataManagementSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Import & Export</h4>
            <div className="space-y-4">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <SafeIcon icon={FiUpload} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Bulk Import Athletes</span>
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Export Athletes as CSV</span>
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Reset Data</h4>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600 dark:text-red-500" />
              <span className="font-medium">Reset All Data</span>
            </button>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This will delete all athlete data, team settings, and history.
              <span className="block mt-1 text-red-600 dark:text-red-400 font-medium">This action cannot be undone.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Privacy & Security</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Data Sharing</h4>
            <div className="space-y-4">
              {[
                { key: 'shareData', label: 'Share anonymous usage data', desc: 'Help improve the application by sharing anonymous usage statistics' },
                { key: 'analytics', label: 'Enable analytics', desc: 'Allow collection of performance and usage analytics' },
                { key: 'cookies', label: 'Accept cookies', desc: 'Enable cookies for better user experience' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={privacySettings[key]}
                      onChange={() => setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition ${privacySettings[key] ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${privacySettings[key] ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">About Ball State Track & Field</h3>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-ballstate-red rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">BS</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Ball State Track & Field Management</h4>
            <p className="text-gray-600 dark:text-gray-400">Version 1.0.0</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Features</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  Athlete roster management
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  Scholarship tracking
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  Recruiting management
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  Talent assessment tools
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Support</h5>
              <div className="space-y-3">
                <button className="flex items-center gap-2 text-sm text-ballstate-red hover:text-red-700">
                  <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
                  Help Documentation
                  <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-2 text-sm text-ballstate-red hover:text-red-700">
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  Contact Support
                  <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-2 text-sm text-ballstate-red hover:text-red-700">
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                  Release Notes
                  <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2024 Ball State University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: FiEye },
    { id: 'team', name: 'Team Management', icon: FiUsers },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'data', name: 'Data Management', icon: FiDatabase },
    { id: 'privacy', name: 'Privacy & Security', icon: FiShield },
    { id: 'about', name: 'About', icon: FiInfo },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your experience and manage data
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-ballstate-red border-b-2 border-ballstate-red'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'appearance' && renderAppearanceSettings()}
        {activeTab === 'team' && renderTeamManagementSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'data' && renderDataManagementSettings()}
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'about' && renderAboutSettings()}
      </motion.div>

      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        isDarkMode={isDarkMode}
      />

      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
};

export default Settings;