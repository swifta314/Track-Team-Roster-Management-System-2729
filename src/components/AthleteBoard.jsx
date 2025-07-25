import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AddAthleteModal from './AddAthleteModal';
import EditAthleteModal from './EditAthleteModal';
import AthleteDetailModal from './AthleteDetailModal';
import AthleteCard from './AthleteCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import GenderToggle from './GenderToggle';
import {tierCriteria} from '../data/mockData';

const {FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiArchive, FiUsers, FiEye, FiEyeOff} = FiIcons;

const AthleteBoard = ({athletes, setAthletes, globalGenderFilter, setGlobalGenderFilter, isDarkMode}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    athlete: null,
    action: 'delete'
  });
  const [showArchived, setShowArchived] = useState(false);

  // Filter athletes based on all criteria
  const filteredAthletes = athletes.filter(athlete => {
    // Search filter
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (athlete.event && athlete.event.toLowerCase().includes(searchTerm.toLowerCase()));

    // Tier filter
    const matchesTier = selectedTier === 'all' || athlete.tier === selectedTier;

    // Year filter
    const matchesYear = selectedYear === 'all' || athlete.year === selectedYear;

    // Event filter
    const matchesEvent = selectedEvent === 'all' || athlete.event === selectedEvent;

    // Gender filter
    const matchesGender = globalGenderFilter === 'both' ||
      (globalGenderFilter === 'men' && athlete.gender === 'M') ||
      (globalGenderFilter === 'women' && athlete.gender === 'F');

    // Archived filter
    const matchesArchived = showArchived || athlete.status !== 'archived';

    return matchesSearch && matchesTier && matchesYear && matchesEvent && matchesGender && matchesArchived;
  });

  // Get unique values for filter dropdowns
  const uniqueTiers = [...new Set(athletes.map(a => a.tier))];
  const uniqueYears = [...new Set(athletes.map(a => a.year))];
  const uniqueEvents = [...new Set(athletes.filter(a => a.event).map(a => a.event))];

  const getArchivedCount = () => {
    return athletes.filter(athlete => athlete.status === 'archived').length;
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddAthlete = (newAthlete) => {
    setAthletes(prev => [...prev, newAthlete]);
  };

  // Handle athlete click to view details
  const handleAthleteClick = (athlete) => {
    if (athlete) {
      setSelectedAthlete(athlete);
      setIsDetailModalOpen(true);
    }
  };

  // Handle athlete edit
  const handleAthleteEdit = (athlete) => {
    if (athlete) {
      setSelectedAthlete(athlete);
      setIsEditModalOpen(true);
    }
  };

  const handleAthleteUpdate = (updatedAthlete) => {
    setAthletes(prev => prev.map(athlete => 
      athlete.id === updatedAthlete.id ? updatedAthlete : athlete
    ));
    // Update selectedAthlete if it's the one being updated
    if (selectedAthlete && selectedAthlete.id === updatedAthlete.id) {
      setSelectedAthlete(updatedAthlete);
    }
  };

  const handleDeleteClick = (athlete) => {
    setDeleteConfirmation({
      isOpen: true,
      athlete,
      action: 'delete'
    });
  };

  const handleArchiveClick = (athlete) => {
    const action = athlete.status === 'archived' ? 'restore' : 'archive';
    setDeleteConfirmation({
      isOpen: true,
      athlete,
      action
    });
  };

  const handleConfirmAction = () => {
    const {athlete, action} = deleteConfirmation;
    
    if (action === 'delete') {
      setAthletes(prev => prev.filter(a => a.id !== athlete.id));
    } else if (action === 'archive') {
      setAthletes(prev => prev.map(a => 
        a.id === athlete.id ? {...a, status: 'archived'} : a
      ));
    } else if (action === 'restore') {
      setAthletes(prev => prev.map(a => 
        a.id === athlete.id ? {...a, status: 'active'} : a
      ));
    }
    
    setDeleteConfirmation({
      isOpen: false,
      athlete: null,
      action: 'delete'
    });
  };

  const handleCancelAction = () => {
    setDeleteConfirmation({
      isOpen: false,
      athlete: null,
      action: 'delete'
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredAthletes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the original athletes array maintaining the new order
    const updatedAthletes = [...athletes];
    const reorderedIds = items.map(item => item.id);

    // Sort athletes to match the new order for filtered items
    const otherAthletes = updatedAthletes.filter(athlete => !reorderedIds.includes(athlete.id));
    const reorderedFiltered = reorderedIds.map(id => updatedAthletes.find(athlete => athlete.id === id));

    setAthletes([...reorderedFiltered, ...otherAthletes]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTier('all');
    setSelectedYear('all');
    setSelectedEvent('all');
  };

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  // Fix for the includeArchived variable being undefined
  const includeArchived = showArchived;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGenderTitle()}Athlete Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your team roster and athlete information
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GenderToggle 
            globalGenderFilter={globalGenderFilter} 
            setGlobalGenderFilter={setGlobalGenderFilter} 
          />
          <div className="flex gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add Athlete
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search athletes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
              />
            </div>
          </div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
          >
            <option value="all">All Tiers</option>
            {uniqueTiers.map(tier => (
              <option key={tier} value={tier}>{tierCriteria[tier]?.name || tier}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
          >
            <option value="all">All Years</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red"
          >
            <option value="all">All Events</option>
            {uniqueEvents.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAthletes.length} of {athletes.length} athletes
              </span>
            </div>
            {/* Archived Toggle */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={() => setShowArchived(!showArchived)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition ${showArchived ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showArchived ? 'translate-x-5' : ''}`}></div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <SafeIcon icon={FiArchive} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Include Archived
                  </span>
                  {getArchivedCount() > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {getArchivedCount()}
                    </span>
                  )}
                </div>
              </label>
            </div>
            {includeArchived && getArchivedCount() > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Including:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {getArchivedCount()} archived
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-ballstate-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-ballstate-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Athletes Grid/List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="athletes" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              <AnimatePresence>
                {filteredAthletes.map((athlete, index) => (
                  <Draggable key={athlete.id} draggableId={athlete.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none'
                        }}
                      >
                        <motion.div
                          layout
                          initial={{opacity: 0, scale: 0.8}}
                          animate={{opacity: 1, scale: 1}}
                          exit={{opacity: 0, scale: 0.8}}
                          transition={{duration: 0.2}}
                        >
                          <AthleteCard
                            athlete={athlete}
                            onClick={handleAthleteClick}
                            onEdit={handleAthleteEdit}
                            onDelete={handleDeleteClick}
                            onArchive={handleArchiveClick}
                            showArchived={showArchived}
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {filteredAthletes.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No athletes found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || selectedTier !== 'all' || selectedYear !== 'all' || selectedEvent !== 'all'
              ? "Try adjusting your filters to see more results"
              : "Get started by adding your first athlete to the roster"}
          </p>
          <div className="flex gap-2 justify-center">
            {(searchTerm || selectedTier !== 'all' || selectedYear !== 'all' || selectedEvent !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-ballstate-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Add First Athlete
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddAthleteModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddAthlete={handleAddAthlete}
      />

      <EditAthleteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateAthlete={handleAthleteUpdate}
        athlete={selectedAthlete}
      />

      <AthleteDetailModal
        athlete={selectedAthlete}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdate={handleAthleteUpdate}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        athlete={deleteConfirmation.athlete}
        action={deleteConfirmation.action}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};

export default AthleteBoard;