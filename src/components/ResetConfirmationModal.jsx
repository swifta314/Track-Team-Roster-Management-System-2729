import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiAlertTriangle, FiTrash2, FiCheck, FiArrowRight, FiLock, FiUnlock } = FiIcons;

const ResetConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [unlockCode, setUnlockCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setConfirmText('');
      setUnlockCode('');
      
      // Generate a random 6-digit code when the modal opens
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalConfirm = () => {
    onConfirm();
    onClose();
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return confirmText !== 'DELETE';
    } else if (currentStep === 2) {
      return unlockCode !== generatedCode;
    }
    return false;
  };

  const renderStep1 = () => (
    <div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              This action will permanently delete all data
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              All athlete records, team settings, and performance data will be permanently erased. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          To confirm deletion, type <strong className="font-bold">DELETE</strong> in the box below:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Type DELETE here"
        />
      </div>
      <div className="mt-6 mb-2 space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">The following data will be deleted:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
          <li>• All athlete profiles and contact information</li>
          <li>• Performance history and records</li>
          <li>• Scholarship information and allocations</li>
          <li>• Team composition and roster settings</li>
          <li>• Recruiting data and notes</li>
        </ul>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SafeIcon icon={FiLock} className="w-5 h-5 text-orange-500 dark:text-orange-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Security verification required
            </p>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
              Please enter the verification code below to continue with data deletion.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          To proceed, enter the following security code: <span className="font-bold text-red-600 dark:text-red-400 text-lg font-mono">{generatedCode}</span>
        </p>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Verification Code
        </label>
        <input
          type="text"
          value={unlockCode}
          onChange={(e) => setUnlockCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Enter verification code"
        />
      </div>
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This step helps prevent accidental data loss and ensures you have authorization to perform this action.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="p-4 bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SafeIcon icon={FiUnlock} className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Final confirmation
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              You are about to permanently delete all data. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Summary of the data that will be deleted:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li className="flex items-start">
            <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <span><strong>{8}</strong> athlete profiles and all associated personal information</span>
          </li>
          <li className="flex items-start">
            <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <span>All performance records and competition results</span>
          </li>
          <li className="flex items-start">
            <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <span>All scholarship allocations and financial data</span>
          </li>
          <li className="flex items-start">
            <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <span>Team composition settings and roster limits</span>
          </li>
          <li className="flex items-start">
            <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
            <span>Recruiting information, notes, and targeting data</span>
          </li>
        </ul>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          By clicking "Reset All Data" below, you acknowledge that:
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
          <li>• This action is permanent and cannot be reversed</li>
          <li>• You have backed up any important data you wish to keep</li>
          <li>• You have proper authorization to delete this information</li>
        </ul>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset All Data</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
              {/* Step indicator */}
              <div className="flex items-center mt-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 2 ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 3 ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  3
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </motion.div>
            </div>
            {/* Footer */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 flex justify-between`}>
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-colors`}
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-colors`}
                >
                  Cancel
                </button>
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isNextDisabled()
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Next Step
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalConfirm}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    Reset All Data
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetConfirmationModal;