import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PerformanceRecordModal from './performance/PerformanceRecordModal';
import {format} from 'date-fns';

const {FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen, FiTrendingUp, FiDollarSign, FiAward, FiClock, FiEdit3, FiPlus, FiPercent, FiCheck} = FiIcons;

const AthleteDetailModal = ({athlete, isOpen, onClose, onUpdate}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);

  if (!athlete) return null;

  // Handle performance records updates
  const handlePerformanceUpdate = (updatedRecords) => {
    const updatedAthlete = {
      ...athlete,
      athleticPerformance: {
        ...athlete.athleticPerformance,
        meetResults: updatedRecords
      }
    };
    onUpdate(updatedAthlete);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-gray-900">{athlete.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Year / Graduation</p>
              <p className="font-medium text-gray-900">{athlete.year} / {athlete.graduationYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{athlete.contactInfo.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{athlete.contactInfo.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Athletic Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Athletic Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Primary Event</p>
            <p className="text-xl font-bold text-gray-900">{athlete.event}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiAward} className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Personal Best</p>
            <p className="text-xl font-bold text-gray-900">{athlete.personalBest}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">GPA</p>
            <p className="text-xl font-bold text-gray-900">{athlete.gpa}</p>
          </div>
        </div>
      </div>

      {/* Scholarship Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-gray-900">${athlete.scholarshipAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiPercent} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="font-medium text-gray-900">{athlete.scholarshipPercentage}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium text-gray-900">{athlete.scholarshipType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-900">{athlete.scholarshipDuration}</p>
            </div>
          </div>
        </div>
        {/* Scholarship Status */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                athlete.scholarshipOfferStatus === 'Offer Accepted' ? 'bg-green-100 text-green-800' :
                athlete.scholarshipOfferStatus === 'Offer Extended' ? 'bg-blue-100 text-blue-800' :
                athlete.scholarshipOfferStatus === 'Offer Declined' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {athlete.scholarshipOfferStatus}
              </span>
            </div>
            {athlete.scholarshipAccepted && (
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Accepted</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceHistory = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Performance History</h3>
        <button
          onClick={() => setIsPerformanceModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-ballstate-red text-white rounded-lg hover:bg-red-700 text-sm"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {athlete.athleticPerformance?.meetResults?.length > 0 ? (
          <div className="space-y-4">
            {athlete.athleticPerformance.meetResults.map((result, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{result.meet}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {format(new Date(result.date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-gray-600">{result.event}</span>
                      {result.place && (
                        <span className="text-sm text-yellow-600">
                          {result.place === '1' ? '1st' :
                           result.place === '2' ? '2nd' :
                           result.place === '3' ? '3rd' :
                           `${result.place}th`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ballstate-red">{result.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No performance records yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Record" to get started</p>
          </div>
        )}
      </div>

      {/* Performance Record Modal */}
      <PerformanceRecordModal
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        athlete={athlete}
        onSave={handlePerformanceUpdate}
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-medium text-gray-900">{athlete.contactInfo.email || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-medium text-gray-900">{athlete.contactInfo.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium text-gray-900">{athlete.contactInfo.address || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">High School</p>
            <p className="font-medium text-gray-900">{athlete.highSchool || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiUser },
    { id: 'performance', name: 'Performance', icon: FiTrendingUp },
    { id: 'contact', name: 'Contact', icon: FiMail }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={onClose}
        >
          <motion.div className="bg-gray-50 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{scale: 0.9, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.9, opacity: 0}}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${athlete.gender === 'M' ? 'bg-blue-100' : 'bg-pink-100'} rounded-full flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${athlete.gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>
                      {athlete.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{athlete.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-600">{athlete.event}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{athlete.year}</span>
                      <span className="text-gray-600">•</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        athlete.tier === 'elite' ? 'bg-yellow-500' :
                        athlete.tier === 'competitive' ? 'bg-blue-500' :
                        athlete.tier === 'developing' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`}>
                        {athlete.tier}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
                      activeTab === tab.id ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 200px)'}}>
              <motion.div
                key={activeTab}
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.3}}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'performance' && renderPerformanceHistory()}
                {activeTab === 'contact' && renderContactInfo()}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AthleteDetailModal;