import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiHome, FiUsers, FiBarChart3, FiSettings, FiFileText, FiMenu} = FiIcons;

const Navigation = ({activeTab, setActiveTab, globalGenderFilter, setGlobalGenderFilter, isDarkMode}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const tabs = [
    {id: 'dashboard', name: 'Dashboard', icon: FiHome},
    {id: 'athletes', name: 'Athletes', icon: FiUsers},
    {id: 'analytics', name: 'Analytics', icon: FiBarChart3},
    {id: 'reports', name: 'Reports', icon: FiFileText},
    {id: 'settings', name: 'Settings', icon: FiSettings}
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabClick = (tabId) => {
    console.log("Navigation: Setting active tab to:", tabId);
    // Call the parent component's function directly
    setActiveTab(tabId);
    
    // Close mobile menu if it's open
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ballstate-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ball State Track & Field
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-ballstate-red hover:bg-gray-100'
                } focus:outline-none`}
                aria-expanded={menuOpen}
              >
                <SafeIcon icon={FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-ballstate-red text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-ballstate-red text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;