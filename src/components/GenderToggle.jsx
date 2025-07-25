import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMale, FiFemale, FiUsers } = FiIcons;

const GenderToggle = ({ globalGenderFilter, setGlobalGenderFilter }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
      <span className="text-sm font-medium text-gray-700">View:</span>
      <div className="flex gap-1">
        <button
          onClick={() => setGlobalGenderFilter('men')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            globalGenderFilter === 'men'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <SafeIcon icon={FiMale} className="w-3 h-3" />
          Men
        </button>
        <button
          onClick={() => setGlobalGenderFilter('women')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            globalGenderFilter === 'women'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <SafeIcon icon={FiFemale} className="w-3 h-3" />
          Women
        </button>
        <button
          onClick={() => setGlobalGenderFilter('both')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            globalGenderFilter === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <SafeIcon icon={FiUsers} className="w-3 h-3" />
          Both
        </button>
      </div>
    </div>
  );
};

export default GenderToggle;