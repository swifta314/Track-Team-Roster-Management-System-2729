import React, {useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {tierCriteria} from '../data/mockData';

const {FiUser, FiTrendingUp, FiDollarSign, FiBookOpen, FiInfo, FiMoreVertical, FiTrash2, FiArchive, FiEye, FiEyeOff, FiPercent, FiEdit3} = FiIcons;

const AthleteCard = ({athlete, onClick, onDelete, onArchive, onEdit, showArchived = false}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTierColor = (tier) => {
    return tierCriteria[tier]?.color || 'bg-gray-500';
  };

  const handleMenuAction = (action, e) => {
    e.stopPropagation();
    setShowMenu(false);
    
    if (action === 'delete') {
      onDelete(athlete);
    } else if (action === 'archive') {
      onArchive(athlete);
    } else if (action === 'view') {
      onClick(athlete);
    } else if (action === 'edit') {
      onEdit(athlete);
    }
  };

  // Modified to prevent the card from disappearing when clicked
  const handleCardClick = (e) => {
    // Only trigger onClick if it's provided
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(athlete);
    }
  };

  // Stop menu toggle click from bubbling to the card
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      whileHover={{scale: 1.02}}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:cursor-grabbing relative ${
        athlete.status === 'archived' ? 'opacity-70 border-gray-300 dark:border-gray-600' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Status indicator for archived athletes */}
      {athlete.status === 'archived' && (
        <div className="absolute top-2 right-2">
          <div className="bg-gray-500 dark:bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Archived
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${athlete.gender === 'M' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-pink-100 dark:bg-pink-900'} rounded-full flex items-center justify-center`}>
            <SafeIcon icon={FiUser} className={`w-4 h-4 ${athlete.gender === 'M' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{athlete.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{athlete.event}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTierColor(athlete.tier)}`}>
            {tierCriteria[athlete.tier]?.name}
          </div>
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={(e) => handleMenuAction('view', e)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={(e) => handleMenuAction('edit', e)}
                  className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  Edit
                </button>
                {athlete.status !== 'archived' ? (
                  <button
                    onClick={(e) => handleMenuAction('archive', e)}
                    className="w-full px-3 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2"
                  >
                    <SafeIcon icon={FiArchive} className="w-4 h-4" />
                    Archive
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleMenuAction('archive', e)}
                    className="w-full px-3 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    Restore
                  </button>
                )}
                <button
                  onClick={(e) => handleMenuAction('delete', e)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiTrendingUp} className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-400">PB:</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{athlete.personalBest}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiBookOpen} className="w-3 h-3 text-green-500 dark:text-green-400" />
            <span className="text-gray-600 dark:text-gray-400">GPA:</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{athlete.gpa}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiDollarSign} className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
            <span className="text-gray-600 dark:text-gray-400">Scholarship:</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900 dark:text-white">
              ${athlete.scholarshipAmount.toLocaleString()}
            </span>
            {athlete.scholarshipPercentage > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({athlete.scholarshipPercentage}%)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${
          athlete.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          athlete.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {athlete.status}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(athlete);
          }}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-ballstate-red dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <SafeIcon icon={FiInfo} className="w-4 h-4" />
        </button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default AthleteCard;