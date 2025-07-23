import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { tierCriteria } from '../data/mockData';

const { FiMoreVertical, FiEye, FiEdit, FiTrash2, FiArchive, FiUser, FiInfo, FiMale, FiFemale, FiEyeOff } = FiIcons;

const AthleteCard = ({ athlete, onClick, onEdit, onDelete, onArchive, showArchived }) => {
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
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative ${
        athlete.status === 'archived' ? 'opacity-70 border-gray-300' : ''
      }`}
    >
      {/* Status indicator for archived athletes */}
      {athlete.status === 'archived' && (
        <div className="absolute top-2 right-2">
          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Archived
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${athlete.gender === 'M' ? 'bg-blue-100' : 'bg-pink-100'} rounded-full flex items-center justify-center`}>
            <SafeIcon icon={FiUser} className={`w-4 h-4 ${athlete.gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{athlete.name}</h4>
            <p className="text-xs text-gray-500">{athlete.event}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTierColor(athlete.tier)}`}>
            {tierCriteria[athlete.tier]?.name}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onClick && onClick(athlete);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEdit && onEdit(athlete);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                Edit Athlete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onArchive && onArchive(athlete);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <SafeIcon icon={FiArchive} className="w-4 h-4" />
                {athlete.status === 'archived' ? 'Restore' : 'Archive'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete && onDelete(athlete);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
            <SafeIcon icon={FiTrendingUp} className="w-3 h-3 text-blue-500" />
            <span className="text-gray-600">PB:</span>
          </div>
          <span className="font-medium text-gray-900">{athlete.personalBest}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiBookOpen} className="w-3 h-3 text-green-500" />
            <span className="text-gray-600">GPA:</span>
          </div>
          <span className="font-medium text-gray-900">{athlete.gpa}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiDollarSign} className="w-3 h-3 text-yellow-500" />
            <span className="text-gray-600">Scholarship:</span>
          </div>
          <span className="font-medium text-gray-900">
            ${athlete.scholarshipAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${
          athlete.status === 'active' ? 'bg-green-100 text-green-800' :
          athlete.status === 'archived' ? 'bg-gray-100 text-gray-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {athlete.status}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(athlete);
          }}
          className="p-1.5 text-gray-400 hover:text-ballstate-red hover:bg-gray-100 rounded-full transition-colors"
        >
          <SafeIcon icon={FiInfo} className="w-4 h-4" />
        </button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default AthleteCard;