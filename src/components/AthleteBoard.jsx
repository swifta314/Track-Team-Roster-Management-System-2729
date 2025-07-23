import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AthleteCard from './AthleteCard';
import AthleteDetailModal from './AthleteDetailModal';
import AddAthleteModal from './AddAthleteModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import GenderFilterBadge from './GenderFilterBadge';
import { yearGroups, tierCriteria } from '../data/mockData';

const { FiFilter, FiPlus, FiEye, FiArchive } = FiIcons;

const AthleteBoard = ({ athletes, setAthletes, globalGenderFilter, setGlobalGenderFilter }) => {
  const [viewMode, setViewMode] = useState('year'); // 'year' or 'tier'
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [archiveConfirmation, setArchiveConfirmation] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const updatedAthletes = athletes.map(athlete => {
      if (athlete.id === draggableId) {
        if (viewMode === 'year') {
          return { ...athlete, year: destination.droppableId };
        } else {
          return { ...athlete, tier: destination.droppableId };
        }
      }
      return athlete;
    });

    setAthletes(updatedAthletes);
  };

  const filteredAthletes = athletes.filter(athlete => {
    // Filter by archived status
    if (!showArchived && athlete.status === 'archived') return false;
    if (showArchived && athlete.status !== 'archived') return false;

    // Filter by gender
    if (globalGenderFilter === 'both') return true;
    if (globalGenderFilter === 'men') return athlete.gender === 'M';
    if (globalGenderFilter === 'women') return athlete.gender === 'F';
    return true;
  });

  const getColumns = () => {
    if (viewMode === 'year') {
      return Object.keys(yearGroups).map(year => ({
        id: year,
        title: yearGroups[year].name,
        color: yearGroups[year].color,
        athletes: filteredAthletes.filter(athlete => athlete.year === year)
      }));
    } else {
      return Object.keys(tierCriteria).map(tier => ({
        id: tier,
        title: tierCriteria[tier].name,
        color: tierCriteria[tier].color,
        athletes: filteredAthletes.filter(athlete => athlete.tier === tier)
      }));
    }
  };

  const handleAthleteClick = (athlete) => {
    setSelectedAthlete(athlete);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

    const handleEditAthlete = (athlete) => {
        setEditingAthlete(athlete);
        setIsEditModalOpen(true);
    };

  const handleAddAthlete = (newAthlete) => {
    setAthletes(prev => [...prev, newAthlete]);
  };

  const handleDeleteAthlete = (athlete) => {
    setDeleteConfirmation(athlete);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setAthletes(prev => prev.filter(athlete => athlete.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    }
  };

  const handleArchiveAthlete = (athlete) => {
    setArchiveConfirmation(athlete);
  };

  const confirmArchive = () => {
    if (archiveConfirmation) {
      setAthletes(prev => prev.map(athlete =>
        athlete.id === archiveConfirmation.id
          ? { ...athlete, status: athlete.status === 'archived' ? 'active' : 'archived' }
          : athlete
      ));
      setArchiveConfirmation(null);
    }
  };

  const getArchivedCount = () => {
    return athletes.filter(athlete => athlete.status === 'archived').length;
  };

  const getActiveCount = () => {
    return athletes.filter(athlete => athlete.status !== 'archived').length;
  };

  const getGenderTitle = () => {
    if (globalGenderFilter === 'men') return "Men's Team - ";
    if (globalGenderFilter === 'women') return "Women's Team - ";
    return "";
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGenderTitle()}Athlete Management Board
        </h1>
        <div className="flex flex-wrap gap-2">
          {/* Add Athlete Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            Add Athlete
          </button>

          {/* Archive Toggle */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showArchived
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <SafeIcon icon={showArchived ? FiEye : FiArchive} className="w-4 h-4" />
            {showArchived ? 'Show Active' : 'Show Archived'}
            {!showArchived && getArchivedCount() > 0 && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs ml-1">
                {getArchivedCount()}
              </span>
            )}
          </button>

          {/* View Mode Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'year'
                  ? 'bg-ballstate-red text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Year
            </button>
            <button
              onClick={() => setViewMode('tier')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'tier'
                  ? 'bg-ballstate-red text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Tier
            </button>
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Current Filter</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              showArchived ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {showArchived ? 'Archived Athletes' : 'Active Athletes'}
            </span>
          </div>
          <GenderFilterBadge globalGenderFilter={globalGenderFilter} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Grouping:</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              By {viewMode === 'year' ? 'Year' : 'Performance Tier'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Athletes Shown:</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {filteredAthletes.length} of {showArchived ? getArchivedCount() : getActiveCount()}
            </span>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getColumns().map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className={`${column.color} p-4`}>
                <h3 className="font-bold text-gray-900">{column.title}</h3>
                <p className="text-sm text-gray-600">{column.athletes.length} athletes</p>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[400px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="space-y-3">
                      {column.athletes.map((athlete) => (
                        <Draggable
                          key={athlete.id}
                          draggableId={athlete.id}
                          index={index}
                          isDragDisabled={athlete.status === 'archived'}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging ? 'rotate-2 scale-105' : ''
                              }`}
                            >
                              <AthleteCard
                                athlete={athlete}
                                onClick={handleAthleteClick}
                                onEdit={handleEditAthlete}
                                onDelete={handleDeleteAthlete}
                                onArchive={handleArchiveAthlete}
                                showArchived={showArchived}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      <AthleteDetailModal
        athlete={selectedAthlete}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <AddAthleteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAthlete={handleAddAthlete}
      />

        <AddAthleteModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onAddAthlete={handleAddAthlete}
            athlete={editingAthlete}
            isEditing={true}
        />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteConfirmation}
        athlete={deleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmation(null)}
        action="delete"
      />

      {/* Archive Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!archiveConfirmation}
        athlete={archiveConfirmation}
        onConfirm={confirmArchive}
        onCancel={() => setArchiveConfirmation(null)}
        action={archiveConfirmation?.status === 'archived' ? 'restore' : 'archive'}
      />
    </div>
  );
};

export default AthleteBoard;