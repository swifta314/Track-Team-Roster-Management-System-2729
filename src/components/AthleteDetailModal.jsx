import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { tierCriteria, yearGroups } from '../data/mockData';

const { FiUser, FiMail, FiPhone, FiCalendar, FiBookOpen, FiTrendingUp, FiAward, FiDollarSign, FiMapPin, FiCheckCircle, FiX, FiClipboard, FiEdit2, FiMessageSquare, FiFlag, FiMale, FiFemale } = FiIcons;

const AthleteDetailModal = ({ athlete, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [localAthlete, setLocalAthlete] = useState(null);

  useEffect(() => {
    if (athlete) {
      setLocalAthlete(athlete);
    }
  }, [athlete]);

  if (!localAthlete) return null;

  const renderPerformanceHistory = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance History</h3>
        
        {/* Personal Records */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Personal Records</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(localAthlete.athleticPerformance.personalRecords).map(([event, record]) => (
              <div key={event} className="flex justify-between">
                <span className="text-sm text-gray-600">{event}:</span>
                <span className="text-sm font-medium text-gray-900">{record}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress Tracking */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Progression</h4>
          <div className="space-y-2">
            {localAthlete.athleticPerformance.progression.map((progress, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{progress.season} ({progress.year}):</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{progress.event}:</span>
                  <span className="text-sm font-medium text-gray-900">{progress.best}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Meet Results */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Recent Meet Results</h4>
          <div className="space-y-3">
            {localAthlete.athleticPerformance.meetResults.map((meet, index) => (
              <div key={index} className="border-b border-gray-200 pb-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">{meet.meet}</span>
                  <span className="text-xs text-gray-500">{meet.date}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">{meet.event}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{meet.result}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{getPlaceText(meet.place)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rankings */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Rankings</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Conference</p>
              <p className="font-medium text-gray-900">{localAthlete.athleticPerformance.rankings.conference || 'N/A'}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">Regional</p>
              <p className="font-medium text-gray-900">{localAthlete.athleticPerformance.rankings.regional || 'N/A'}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600">National</p>
              <p className="font-medium text-gray-900">{localAthlete.athleticPerformance.rankings.national || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScholarshipInfo = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Scholarship Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Financial Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-gray-900">${localAthlete.scholarshipAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900">{localAthlete.scholarshipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Percentage:</span>
                <span className="text-sm font-medium text-gray-900">{localAthlete.scholarshipPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-medium text-gray-900">{localAthlete.scholarshipDuration}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Renewal Conditions</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Maintain minimum 2.5 GPA</li>
              <li>Complete required practice hours</li>
              <li>Represent team at required competitions</li>
              <li>Adhere to team and NCAA policies</li>
              <li>Annual performance review</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Status Timeline</h4>
          <div className="relative pb-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                <SafeIcon icon={FiClipboard} className="w-4 h-4 text-white" />
              </div>
              <div className="ml-4">
                <h5 className="text-sm font-medium text-gray-900">Initial Offer</h5>
                <p className="text-xs text-gray-500">May 2022</p>
                <p className="text-sm text-gray-600 mt-1">Initial scholarship offer extended</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center z-10">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-white" />
              </div>
              <div className="ml-4">
                <h5 className="text-sm font-medium text-gray-900">Acceptance</h5>
                <p className="text-xs text-gray-500">June 2022</p>
                <p className="text-sm text-gray-600 mt-1">Scholarship offer accepted</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center z-10">
                <SafeIcon icon={FiEdit2} className="w-4 h-4 text-white" />
              </div>
              <div className="ml-4">
                <h5 className="text-sm font-medium text-gray-900">Next Review</h5>
                <p className="text-xs text-gray-500">May 2024</p>
                <p className="text-sm text-gray-600 mt-1">Annual scholarship review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecruitingInfo = () => {
    if (!localAthlete.recruitingStatus) return <div>No recruiting information available</div>;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recruiting Information</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Status Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Offer Status:</p>
              <p className="text-sm font-medium text-gray-900">{localAthlete.recruitingStatus.offerStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Commitment:</p>
              <p className="text-sm font-medium text-gray-900">{localAthlete.recruitingStatus.commitmentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Official Visit:</p>
              <p className="text-sm font-medium text-gray-900">{localAthlete.recruitingStatus.visits.official || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unofficial Visit:</p>
              <p className="text-sm font-medium text-gray-900">{localAthlete.recruitingStatus.visits.unofficial || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paperwork:</p>
              <p className="text-sm font-medium text-gray-900">{localAthlete.recruitingStatus.paperworkStatus}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Communication History</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {localAthlete.recruitingStatus.communicationHistory.map((comm, index) => (
              <div key={index} className="border-b border-gray-200 pb-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">{comm.type}</span>
                  <span className="text-xs text-gray-500">{comm.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{comm.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getPlaceText = (place) => {
    if (place === 1) return '1st';
    if (place === 2) return '2nd';
    if (place === 3) return '3rd';
    return `${place}th`;
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
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${localAthlete.gender === 'M' ? 'bg-blue-100' : 'bg-pink-100'} rounded-full flex items-center justify-center`}>
                    <SafeIcon icon={localAthlete.gender === 'M' ? FiMale : FiFemale} className={`w-6 h-6 ${localAthlete.gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{localAthlete.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${tierCriteria[localAthlete.tier]?.color}`}>
                        {tierCriteria[localAthlete.tier]?.name}
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {yearGroups[localAthlete.year]?.name}
                      </div>
                      <span className="text-sm text-gray-500">{localAthlete.event}</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'info' ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('info')}
                >
                  Personal Info
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'performance' ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('performance')}
                >
                  Performance
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'scholarship' ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('scholarship')}
                >
                  Scholarship
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'recruiting' ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('recruiting')}
                >
                  Recruiting
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${localAthlete.contactInfo.email}`} className="text-sm text-blue-600 hover:underline">
                            {localAthlete.contactInfo.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${localAthlete.contactInfo.phone}`} className="text-sm text-gray-600">
                            {localAthlete.contactInfo.phone}
                          </a>
                        </div>
                        <div className="flex items-start gap-3">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-600">
                            {localAthlete.contactInfo.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Major:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.academics.major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">GPA:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.gpa}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">SAT Score:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.academics.satScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">ACT Score:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.academics.actScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Graduation Year:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.graduationYear}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Athletic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Primary Events:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {localAthlete.athleticPerformance.primaryEvents.join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">High School:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.highSchool}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Eligibility Status:</span>
                          <span className="text-sm font-medium text-gray-900">{localAthlete.eligibilityStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            localAthlete.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {localAthlete.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gender:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            localAthlete.gender === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {localAthlete.gender === 'M' ? 'Male' : 'Female'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Team Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <SafeIcon icon={FiFlag} className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">Event Group:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getEventGroup(localAthlete.athleticPerformance.primaryEvents[0])}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Year:</span>
                          <span className="text-sm font-medium text-gray-900">{yearGroups[localAthlete.year]?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SafeIcon icon={FiAward} className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">Performance Tier:</span>
                          <span className="text-sm font-medium text-gray-900">{tierCriteria[localAthlete.tier]?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && renderPerformanceHistory()}
              {activeTab === 'scholarship' && renderScholarshipInfo()}
              {activeTab === 'recruiting' && renderRecruitingInfo()}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to determine event group
const getEventGroup = (event) => {
  const eventMap = {
    '100m': 'Sprints',
    '200m': 'Sprints',
    '400m': 'Sprints',
    '800m': 'Middle Distance',
    '1500m': 'Middle Distance',
    '3000m': 'Distance',
    '5000m': 'Distance',
    '10000m': 'Distance',
    'Long Jump': 'Jumps',
    'Triple Jump': 'Jumps',
    'High Jump': 'Jumps',
    'Pole Vault': 'Jumps',
    'Shot Put': 'Throws',
    'Discus': 'Throws',
    'Javelin': 'Throws',
    'Hammer': 'Throws'
  };
  return eventMap[event] || 'Other';
};

export default AthleteDetailModal;