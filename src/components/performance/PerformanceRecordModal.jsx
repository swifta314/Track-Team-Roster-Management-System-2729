```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';

const { FiX, FiSave, FiPlus, FiTrash2, FiCalendar, FiAward, FiClock } = FiIcons;

const PerformanceRecordModal = ({ isOpen, onClose, athlete, onSave }) => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    meet: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    event: '',
    result: '',
    place: '',
    notes: ''
  });

  useEffect(() => {
    if (athlete && athlete.athleticPerformance) {
      setRecords(athlete.athleticPerformance.meetResults || []);
    }
  }, [athlete]);

  const handleAddRecord = () => {
    if (!newRecord.meet || !newRecord.event || !newRecord.result) {
      return; // Basic validation
    }

    const updatedRecords = [...records, { ...newRecord }];
    setRecords(updatedRecords);
    setNewRecord({
      meet: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      event: '',
      result: '',
      place: '',
      notes: ''
    });
  };

  const handleRemoveRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleSave = () => {
    // Sort records by date in descending order
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    onSave(sortedRecords);
    onClose();
  };

  // Get available events based on athlete's primary events
  const getAvailableEvents = () => {
    const primaryEvents = athlete?.athleticPerformance?.primaryEvents || [];
    return [...new Set(primaryEvents)];
  };

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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance Records
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {athlete?.name} - {athlete?.event}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Add New Record Form */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add New Record
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meet Name *
                    </label>
                    <input
                      type="text"
                      value={newRecord.meet}
                      onChange={(e) => setNewRecord({ ...newRecord, meet: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      placeholder="e.g., MAC Championships"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event *
                    </label>
                    <select
                      value={newRecord.event}
                      onChange={(e) => setNewRecord({ ...newRecord, event: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                    >
                      <option value="">Select event</option>
                      {getAvailableEvents().map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Result *
                    </label>
                    <input
                      type="text"
                      value={newRecord.result}
                      onChange={(e) => setNewRecord({ ...newRecord, result: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      placeholder="e.g., 11.45, 2:08.34, 6.12m"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Place
                    </label>
                    <input
                      type="number"
                      value={newRecord.place}
                      onChange={(e) => setNewRecord({ ...newRecord, place: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      placeholder="Finishing position"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
                      placeholder="Additional details about the performance"
                      rows="2"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddRecord}
                    className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    Add Record
                  </button>
                </div>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Performance History
                </h3>
                {records.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      No performance records added yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((record, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {record.meet}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                                {format(new Date(record.date), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <SafeIcon icon={FiClock} className="w-4 h-4" />
                                {record.event}
                              </div>
                              {record.place && (
                                <div className="flex items-center gap-1 text-sm">
                                  <SafeIcon icon={FiAward} className="w-4 h-4 text-yellow-500" />
                                  {getPlaceText(record.place)}
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <span className="text-lg font-medium text-ballstate-red">
                                {record.result}
                              </span>
                              {record.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {record.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveRecord(index)}
                            className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                Save Records
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to format place numbers
const getPlaceText = (place) => {
  const num = parseInt(place);
  if (num === 1) return '1st';
  if (num === 2) return '2nd';
  if (num === 3) return '3rd';
  return `${num}th`;
};

export default PerformanceRecordModal;
```