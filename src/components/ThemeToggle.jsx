import React, { useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMoon, FiSun } = FiIcons;

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  // Apply dark mode class to the document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <SafeIcon
        icon={isDarkMode ? FiSun : FiMoon}
        className={`w-5 h-5 ${isDarkMode ? 'text-yellow-300' : 'text-gray-700'}`}
      />
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;