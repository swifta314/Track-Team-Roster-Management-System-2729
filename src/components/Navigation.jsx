import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiBarChart3, FiSettings, FiFileText } = FiIcons;

const Navigation = ({ activeTab, setActiveTab, globalGenderFilter, setGlobalGenderFilter }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FiHome },
    { id: 'athletes', name: 'Athletes', icon: FiUsers },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart3 },
    { id: 'reports', name: 'Reports', icon: FiFileText },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ballstate-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Ball State Track & Field</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Tabs */}
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-ballstate-red text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span className="hidden sm:block">{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;