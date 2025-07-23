import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiUpload, FiDownload, FiCheck, FiAlertTriangle, FiFileText, FiInfo } = FiIcons;

const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const templateHeaders = [
    'name', 'gender', 'email', 'phone', 'year', 'graduationYear', 
    'event', 'personalBest', 'tier', 'scholarshipAmount', 'gpa', 'major'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      templateHeaders.join(','),
      'John Doe,M,jdoe@example.com,555-0123,freshman,2027,100m,10.5,developing,5000,3.5,Exercise Science',
      'Jane Smith,F,jsmith@example.com,555-0124,sophomore,2026,Long Jump,6.2,competitive,6000,3.8,Sports Management'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'athlete_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateRow = (row, index) => {
    const errors = [];

    // Required fields
    if (!row.name) errors.push(`Row ${index + 1}: Name is required`);
    if (!row.gender || !['M', 'F'].includes(row.gender)) {
      errors.push(`Row ${index + 1}: Gender must be 'M' or 'F'`);
    }
    if (!row.event) errors.push(`Row ${index + 1}: Event is required`);

    // Numeric validations
    if (row.scholarshipAmount && isNaN(parseFloat(row.scholarshipAmount))) {
      errors.push(`Row ${index + 1}: Scholarship amount must be a number`);
    }
    if (row.gpa && (isNaN(parseFloat(row.gpa)) || parseFloat(row.gpa) > 4.0)) {
      errors.push(`Row ${index + 1}: GPA must be a number between 0 and 4.0`);
    }
    if (row.graduationYear && isNaN(parseInt(row.graduationYear))) {
      errors.push(`Row ${index + 1}: Graduation year must be a number`);
    }

    // Year validation
    const validYears = ['freshman', 'sophomore', 'junior', 'senior', 'fifthYear', 'transfer'];
    if (row.year && !validYears.includes(row.year)) {
      errors.push(`Row ${index + 1}: Invalid year. Must be one of: ${validYears.join(',')}`);
    }

    return errors;
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    setErrors([]);
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target.result);
        const allErrors = [];
        
        csvData.forEach((row, index) => {
          const rowErrors = validateRow(row, index);
          allErrors.push(...rowErrors);
        });

        setErrors(allErrors);
        setPreview(csvData.slice(0, 5)); // Show first 5 rows as preview
      } catch (error) {
        setErrors([`Error parsing CSV: ${error.message}`]);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file || errors.length > 0) return;
    
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = parseCSV(e.target.result);
        
        // Transform data to match athlete structure
        const formattedAthletes = csvData.map(row => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: row.name,
          gender: row.gender,
          contactInfo: {
            email: row.email,
            phone: row.phone,
            address: row.address || ''
          },
          year: row.year,
          graduationYear: parseInt(row.graduationYear),
          event: row.event,
          personalBest: row.personalBest,
          tier: row.tier || 'developing',
          scholarshipAmount: parseFloat(row.scholarshipAmount) || 0,
          scholarshipType: row.scholarshipType || 'None',
          scholarshipPercentage: parseFloat(row.scholarshipPercentage) || 0,
          scholarshipDuration: '1 year renewable',
          scholarshipOfferStatus: 'Offer Accepted',
          scholarshipAccepted: true,
          gpa: parseFloat(row.gpa) || 0,
          status: 'active',
          academics: {
            major: row.major || '',
            satScore: parseInt(row.satScore) || 0,
            actScore: parseInt(row.actScore) || 0
          },
          athleticPerformance: {
            primaryEvents: [row.event],
            personalRecords: {
              [row.event]: row.personalBest
            },
            meetResults: [],
            progression: [],
            rankings: {
              conference: null,
              regional: null,
              national: null
            }
          }
        }));

        onImport(formattedAthletes);
        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      setErrors([...errors, 'Error processing file: ' + error.message]);
    } finally {
      setIsProcessing(false);
    }
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <SafeIcon icon={FiUpload} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Import Athletes</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Template Download */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-300">Getting Started</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                      Download the template CSV file to see the required format and example data.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                  <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {file ? file.name : 'Click to upload or drag and drop your CSV file here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Only CSV files are supported</p>
                </div>
              </div>

              {/* Preview */}
              {preview.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Preview (First 5 rows)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {Object.keys(preview[0]).map((header) => (
                            <th
                              key={header}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {preview.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-900 dark:text-red-300">Validation Errors</h3>
                      <ul className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-800 dark:text-red-400">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!file || errors.length > 0 || isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !file || errors.length > 0 || isProcessing
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-ballstate-red text-white hover:bg-red-700'
                }`}
              >
                <SafeIcon icon={isProcessing ? FiUpload : FiCheck} className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Import Athletes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkImportModal;