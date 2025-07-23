
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCommonStyles } from '../hooks/useCommonStyles';

const { FiDownload, FiUpload, FiFileText, FiDatabase } = FiIcons;

const DataManagement = ({ athletes, setAthletes }) => {
  const { getCardClasses, getButtonClasses } = useCommonStyles();
  const [importing, setImporting] = useState(false);

  const exportToCSV = () => {
    const headers = ['Name', 'Gender', 'Year', 'Event', 'Personal Best', 'Tier', 'GPA', 'Scholarship Amount'];
    const csvData = athletes.map(athlete => [
      athlete.name,
      athlete.gender,
      athlete.year,
      athlete.event,
      athlete.personalBest,
      athlete.tier,
      athlete.academics?.gpa || '',
      athlete.scholarshipAmount || 0
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ballstate-roster-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        const importedAthletes = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            return {
              id: `imported-${Date.now()}-${index}`,
              name: values[0] || '',
              gender: values[1] || 'M',
              year: values[2] || 'freshman',
              event: values[3] || '',
              personalBest: values[4] || '',
              tier: values[5] || 'prospect',
              academics: { gpa: parseFloat(values[6]) || 0 },
              scholarshipAmount: parseFloat(values[7]) || 0,
              status: 'active'
            };
          });
        
        setAthletes(prev => [...prev, ...importedAthletes]);
      } catch (error) {
        console.error('Import error:', error);
      }
      setImporting(false);
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={getCardClasses()}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <button
              onClick={exportToCSV}
              className={`${getButtonClasses('primary')} w-full flex items-center justify-center gap-2`}
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              Export to CSV
            </button>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Import Data</h4>
            <label className={`${getButtonClasses('secondary')} w-full flex items-center justify-center gap-2 cursor-pointer`}>
              <SafeIcon icon={FiUpload} className="w-4 h-4" />
              {importing ? 'Importing...' : 'Import from CSV'}
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataManagement;
