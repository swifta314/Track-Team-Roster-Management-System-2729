import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiTrash2, FiArchive, FiEye, FiAlertTriangle } = FiIcons;

const DeleteConfirmationModal = ({ isOpen, athlete, onConfirm, onCancel, action = 'delete' }) => {
  if (!athlete) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'delete':
        return {
          title: 'Delete Athlete',
          message: 'Are you sure you want to permanently delete this athlete? This action cannot be undone.',
          icon: FiTrash2,
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          confirmText: 'Delete',
          confirmClass: 'bg-red-600 hover:bg-red-700',
          warningText: 'This will permanently remove all athlete data including performance history, scholarship information, and recruiting records.'
        };
      case 'archive':
        return {
          title: 'Archive Athlete',
          message: 'Are you sure you want to archive this athlete? They will be hidden from the main roster but can be restored later.',
          icon: FiArchive,
          iconColor: 'text-orange-600',
          iconBg: 'bg-orange-100',
          confirmText: 'Archive',
          confirmClass: 'bg-orange-600 hover:bg-orange-700',
          warningText: 'Archived athletes will not appear in active roster views but their data will be preserved.'
        };
      case 'restore':
        return {
          title: 'Restore Athlete',
          message: 'Are you sure you want to restore this athlete to active status?',
          icon: FiEye,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
          confirmText: 'Restore',
          confirmClass: 'bg-green-600 hover:bg-green-700',
          warningText: 'This will make the athlete visible in active roster views and available for team activities.'
        };
      default:
        return {
          title: 'Confirm Action',
          message: 'Are you sure you want to perform this action?',
          icon: FiAlertTriangle,
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          confirmText: 'Confirm',
          confirmClass: 'bg-gray-600 hover:bg-gray-700',
          warningText: ''
        };
    }
  };

  const config = getActionConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${config.iconBg}`}>
                    <SafeIcon icon={config.icon} className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
                </div>
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Athlete Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${athlete.gender === 'M' ? 'bg-blue-100' : 'bg-pink-100'} rounded-full flex items-center justify-center`}>
                    <span className={`text-sm font-medium ${athlete.gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>
                      {athlete.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{athlete.event}</span>
                      <span>•</span>
                      <span>{athlete.personalBest}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="mb-4">
                <p className="text-gray-700 mb-3">{config.message}</p>
                {config.warningText && (
                  <div className={`p-3 rounded-lg ${config.iconBg} border-l-4 ${
                    action === 'delete' ? 'border-red-500' : 
                    action === 'archive' ? 'border-orange-500' : 'border-green-500'
                  }`}>
                    <p className="text-sm text-gray-700">{config.warningText}</p>
                  </div>
                )}
              </div>

              {/* Additional Info for Delete */}
              {action === 'delete' && (
                <div className="mb-4 space-y-2">
                  <h4 className="font-medium text-gray-900">This will remove:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Personal and contact information</li>
                    <li>• Academic records and test scores</li>
                    <li>• Performance history and meet results</li>
                    <li>• Scholarship details and financial records</li>
                    <li>• Recruiting communication history</li>
                  </ul>
                </div>
              )}

              {/* Scholarship Warning for Delete */}
              {action === 'delete' && athlete.scholarshipAmount > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Scholarship Alert</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    This athlete has a ${athlete.scholarshipAmount.toLocaleString()} scholarship. 
                    Consider updating your scholarship allocation after deletion.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${config.confirmClass}`}
              >
                {config.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;