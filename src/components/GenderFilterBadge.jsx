import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiMale, FiFemale } = FiIcons;

const GenderFilterBadge = ({ globalGenderFilter }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Currently viewing:</span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        globalGenderFilter === 'both' ? 'bg-purple-100 text-purple-800' :
        globalGenderFilter === 'men' ? 'bg-blue-100 text-blue-800' :
        'bg-pink-100 text-pink-800'
      }`}>
        <div className="flex items-center gap-1">
          <SafeIcon 
            icon={
              globalGenderFilter === 'both' ? FiUsers :
              globalGenderFilter === 'men' ? FiMale :
              FiFemale
            } 
            className="w-3 h-3" 
          />
          <span>
            {globalGenderFilter === 'both' ? 'All Athletes' :
            globalGenderFilter === 'men' ? 'Men\'s Team' :
            'Women\'s Team'}
          </span>
        </div>
      </span>
    </div>
  );
};

export default GenderFilterBadge;