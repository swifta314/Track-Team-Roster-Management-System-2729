
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCommonStyles } from '../hooks/useCommonStyles';

const { FiSearch, FiFilter, FiX } = FiIcons;

const AdvancedSearch = ({ athletes, onFilteredResults }) => {
  const { getCardClasses, getButtonClasses } = useCommonStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tier: '',
    year: '',
    event: '',
    scholarshipStatus: '',
    gpaRange: { min: '', max: '' },
    scholarshipRange: { min: '', max: '' }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredAthletes = useMemo(() => {
    let results = athletes.filter(athlete => {
      const matchesSearch = !searchTerm || 
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.highSchool?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTier = !filters.tier || athlete.tier === filters.tier;
      const matchesYear = !filters.year || athlete.year === filters.year;
      const matchesEvent = !filters.event || athlete.event === filters.event;
      
      const matchesGPA = (!filters.gpaRange.min || athlete.academics?.gpa >= parseFloat(filters.gpaRange.min)) &&
                        (!filters.gpaRange.max || athlete.academics?.gpa <= parseFloat(filters.gpaRange.max));
      
      const matchesScholarship = (!filters.scholarshipRange.min || athlete.scholarshipAmount >= parseFloat(filters.scholarshipRange.min)) &&
                                (!filters.scholarshipRange.max || athlete.scholarshipAmount <= parseFloat(filters.scholarshipRange.max));

      return matchesSearch && matchesTier && matchesYear && matchesEvent && matchesGPA && matchesScholarship;
    });

    onFilteredResults(results);
    return results;
  }, [athletes, searchTerm, filters, onFilteredResults]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      tier: '',
      year: '',
      event: '',
      scholarshipStatus: '',
      gpaRange: { min: '', max: '' },
      scholarshipRange: { min: '', max: '' }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={getCardClasses()}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={getButtonClasses('secondary')}
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, event, or high school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
            />
          </div>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 border-t pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red"
                >
                  <option value="">All Tiers</option>
                  <option value="elite">Elite</option>
                  <option value="competitive">Competitive</option>
                  <option value="developing">Developing</option>
                  <option value="prospect">Prospect</option>
                </select>

                <select
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red"
                >
                  <option value="">All Years</option>
                  <option value="freshman">Freshman</option>
                  <option value="sophomore">Sophomore</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                </select>

                <input
                  type="text"
                  placeholder="Event filter"
                  value={filters.event}
                  onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ballstate-red"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredAthletes.length} of {athletes.length} athletes
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-ballstate-red hover:text-red-700 flex items-center gap-1"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedSearch;
