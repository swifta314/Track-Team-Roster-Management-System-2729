import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {tierCriteria, yearGroups} from '../data/mockData';

const {FiX, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBookOpen, FiTrendingUp, FiDollarSign, FiMale, FiFemale, FiCheck, FiClock, FiTarget, FiAlertCircle, FiRefreshCw, FiAward, FiPercent} = FiIcons;

const EditAthleteModal = ({isOpen, onClose, onUpdateAthlete, athlete}) => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    gender: 'M',
    year: 'freshman',
    graduationYear: new Date().getFullYear() + 4,
    
    // Contact Info
    email: '',
    phone: '',
    address: '',
    
    // Academic Info
    major: '',
    gpa: '',
    satScore: '',
    actScore: '',
    
    // Athletic Info
    event: '',
    personalBest: '',
    tier: 'prospect',
    highSchool: '',
    eligibilityStatus: 'Eligible',
    
    // Scholarship Info
    scholarshipAmount: 0,
    scholarshipType: 'None',
    scholarshipPercentage: 0,
    scholarshipDuration: '1 year renewable',
    scholarshipOfferStatus: 'No Offer',
    scholarshipAccepted: false,
    
    // Status
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [autoTierAssigned, setAutoTierAssigned] = useState(false);
  const [manualTierOverride, setManualTierOverride] = useState(false);

  // Initialize form data when athlete prop changes
  useEffect(() => {
    if (athlete && isOpen) {
      setFormData({
        name: athlete.name || '',
        gender: athlete.gender || 'M',
        year: athlete.year || 'freshman',
        graduationYear: athlete.graduationYear || new Date().getFullYear() + 4,
        email: athlete.contactInfo?.email || '',
        phone: athlete.contactInfo?.phone || '',
        address: athlete.contactInfo?.address || '',
        major: athlete.academics?.major || '',
        gpa: athlete.gpa || '',
        satScore: athlete.academics?.satScore || '',
        actScore: athlete.academics?.actScore || '',
        event: athlete.event || '',
        personalBest: athlete.personalBest || '',
        tier: athlete.tier || 'prospect',
        highSchool: athlete.highSchool || '',
        eligibilityStatus: athlete.eligibilityStatus || 'Eligible',
        scholarshipAmount: athlete.scholarshipAmount || 0,
        scholarshipType: athlete.scholarshipType || 'None',
        scholarshipPercentage: athlete.scholarshipPercentage || 0,
        scholarshipDuration: athlete.scholarshipDuration || '1 year renewable',
        scholarshipOfferStatus: athlete.scholarshipOfferStatus || 'No Offer',
        scholarshipAccepted: athlete.scholarshipAccepted || false,
        status: athlete.status || 'active'
      });
      setErrors({});
      setActiveTab('basic');
      setAutoTierAssigned(false);
      setManualTierOverride(false);
    }
  }, [athlete, isOpen]);

  // Calculate scholarship percentage when dollar amount changes
  useEffect(() => {
    if (formData.scholarshipAmount > 0) {
      const fullScholarshipAmount = 25000; // Typical full scholarship amount
      const percentage = (formData.scholarshipAmount / fullScholarshipAmount) * 100;
      setFormData(prev => ({
        ...prev,
        scholarshipPercentage: Math.min(100, Math.round(percentage))
      }));
    }
  }, [formData.scholarshipAmount]);

  // Calculate dollar amount when percentage changes
  const handlePercentageChange = (percentage) => {
    const fullScholarshipAmount = 25000;
    const dollarAmount = (percentage / 100) * fullScholarshipAmount;
    setFormData(prev => ({
      ...prev,
      scholarshipPercentage: percentage,
      scholarshipAmount: Math.round(dollarAmount)
    }));
  };

  // Auto-assign performance tier based on personal best and gender
  const assignPerformanceTier = (event, time, gender) => {
    if (!event || !time) return 'prospect';

    const parseTime = (timeStr) => {
      if (!timeStr) return Infinity;
      if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        const minutes = parseInt(parts[0]);
        const seconds = parseFloat(parts[1]);
        return minutes * 60 + seconds;
      } else if (timeStr.includes('m')) {
        return parseFloat(timeStr.replace('m', ''));
      } else {
        return parseFloat(timeStr);
      }
    };

    const userTime = parseTime(time);
    const genderKey = gender === 'M' ? 'men' : 'women';

    const tiers = ['elite', 'competitive', 'developing', 'prospect'];
    for (const tier of tiers) {
      const criteria = tierCriteria[tier]?.criteria[event];
      if (!criteria || !criteria[genderKey]) continue;

      const tierTime = parseTime(criteria[genderKey]);
      
      // For jumping/throwing events, higher is better.
      if (event.includes('Jump') || event.includes('Put') || event.includes('Discus') || event.includes('Javelin') || event.includes('Hammer')) {
        if (userTime >= tierTime) {
          return tier;
        }
      } else { // For running events, lower is better.
        if (userTime <= tierTime) {
          return tier;
        }
      }
    }
    return 'prospect';
  };

  // Auto update graduation year when school year changes
  useEffect(() => {
    const yearToGraduationMap = {
      'freshman': 4,
      'sophomore': 3,
      'junior': 2,
      'senior': 1,
      'fifthYear': 0,
      'transfer': 2
    };
    
    const currentYear = new Date().getFullYear();
    const yearsToGraduation = yearToGraduationMap[formData.year] || 4;
    
    setFormData(prev => ({
      ...prev,
      graduationYear: currentYear + yearsToGraduation
    }));
  }, [formData.year]);

  // Auto-assign tier when primary event or personal best changes
  useEffect(() => {
    if (formData.event && formData.personalBest && !manualTierOverride) {
      const suggestedTier = assignPerformanceTier(formData.event, formData.personalBest, formData.gender);
      if (suggestedTier !== formData.tier) {
        setFormData(prev => ({
          ...prev,
          tier: suggestedTier
        }));
        setAutoTierAssigned(true);
      }
    }
  }, [formData.event, formData.personalBest, formData.gender, manualTierOverride]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.event.trim()) newErrors.event = 'Primary event is required';
    if (!formData.personalBest.trim()) newErrors.personalBest = 'Personal best is required';

    // Email validation (only if provided)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Other validations
    if (formData.gpa && (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4.0)) newErrors.gpa = 'GPA must be between 0.0 and 4.0';
    if (formData.satScore && (parseInt(formData.satScore) < 400 || parseInt(formData.satScore) > 1600)) newErrors.satScore = 'SAT score must be between 400 and 1600';
    if (formData.actScore && (parseInt(formData.actScore) < 1 || parseInt(formData.actScore) > 36)) newErrors.actScore = 'ACT score must be between 1 and 36';
    if (formData.scholarshipAmount < 0) newErrors.scholarshipAmount = 'Scholarship amount cannot be negative';
    if (formData.scholarshipPercentage < 0 || formData.scholarshipPercentage > 100) newErrors.scholarshipPercentage = 'Scholarship percentage must be between 0 and 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Create updated athlete object from form data
    const updatedAthlete = {
      ...athlete,
      name: formData.name,
      gender: formData.gender,
      contactInfo: {
        ...athlete.contactInfo,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      year: formData.year,
      graduationYear: parseInt(formData.graduationYear),
      event: formData.event,
      personalBest: formData.personalBest,
      tier: formData.tier,
      scholarshipAmount: parseFloat(formData.scholarshipAmount) || 0,
      scholarshipType: formData.scholarshipType,
      scholarshipPercentage: parseFloat(formData.scholarshipPercentage) || 0,
      scholarshipDuration: formData.scholarshipDuration,
      scholarshipOfferStatus: formData.scholarshipOfferStatus,
      scholarshipAccepted: formData.scholarshipAccepted,
      gpa: parseFloat(formData.gpa) || 0,
      status: formData.status,
      academics: {
        ...athlete.academics,
        major: formData.major,
        satScore: parseInt(formData.satScore) || 0,
        actScore: parseInt(formData.actScore) || 0
      },
      highSchool: formData.highSchool,
      eligibilityStatus: formData.eligibilityStatus,
      athleticPerformance: {
        ...athlete.athleticPerformance,
        primaryEvents: formData.event ? [formData.event] : athlete.athleticPerformance?.primaryEvents || [],
        personalRecords: {
          ...athlete.athleticPerformance?.personalRecords,
          [formData.event]: formData.personalBest
        }
      },
      recruitingStatus: {
        ...athlete.recruitingStatus,
        offerStatus: formData.scholarshipOfferStatus,
        commitmentStatus: formData.scholarshipAccepted ? 'Committed' : 'Uncommitted'
      }
    };

    onUpdateAthlete(updatedAthlete);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '', gender: 'M', year: 'freshman', graduationYear: new Date().getFullYear() + 4,
      email: '', phone: '', address: '',
      major: '', gpa: '', satScore: '', actScore: '',
      event: '', personalBest: '', tier: 'prospect',
      highSchool: '', eligibilityStatus: 'Eligible',
      scholarshipAmount: 0, scholarshipType: 'None', scholarshipPercentage: 0,
      scholarshipDuration: '1 year renewable', scholarshipOfferStatus: 'No Offer', scholarshipAccepted: false,
      status: 'active'
    });
    setErrors({});
    setActiveTab('basic');
    setAutoTierAssigned(false);
    setManualTierOverride(false);
    onClose();
  };
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const eventOptions = [
    '100m', '200m', '400m', '800m', '1500m', '3000m', '5000m', '10000m',
    '110m Hurdles', '400m Hurdles', '3000m Steeplechase',
    'Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault',
    'Shot Put', 'Discus', 'Javelin', 'Hammer',
    'Decathlon', 'Heptathlon'
  ];
  
  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: FiUser },
    { id: 'academic', name: 'Academic', icon: FiBookOpen },
    { id: 'athletic', name: 'Athletic', icon: FiTrendingUp },
    { id: 'scholarship', name: 'Scholarship', icon: FiDollarSign }
  ];
  
  const renderContent = () => {
    switch (activeTab) {
      case 'academic': return renderAcademicInfo();
      case 'athletic': return renderAthleticInfo();
      case 'scholarship': return renderScholarshipInfo();
      case 'basic':
      default:
        return renderBasicInfo();
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      {/* Name and Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input type="text" value={formData.name} onChange={(e) => updateFormData('name', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter full name"/>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={(e) => updateFormData('gender', e.target.value)} className="mr-2" />
              <SafeIcon icon={FiMale} className="w-4 h-4 text-blue-600 mr-1" />Male
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={(e) => updateFormData('gender', e.target.value)} className="mr-2" />
              <SafeIcon icon={FiFemale} className="w-4 h-4 text-pink-600 mr-1" />Female
            </label>
          </div>
        </div>
      </div>
      {/* Year and Graduation Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year in School *</label>
          <select value={formData.year} onChange={(e) => updateFormData('year', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            {Object.entries(yearGroups).map(([key, group]) => (
              <option key={key} value={key}>{group.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
          <input type="number" value={formData.graduationYear} onChange={(e) => updateFormData('graduationYear', e.target.value)} min={new Date().getFullYear()} max={new Date().getFullYear() + 6} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`} placeholder="athlete@ballstate.edu" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="(555) 123-4567" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input type="text" value={formData.address} onChange={(e) => updateFormData('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Street address, City, State ZIP" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">High School</label>
        <input type="text" value={formData.highSchool} onChange={(e) => updateFormData('highSchool', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="High School Name, City, State" />
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="space-y-4">
      {/* Major and GPA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
          <input type="text" value={formData.major} onChange={(e) => updateFormData('major', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Exercise Science"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
          <input type="number" step="0.01" min="0" max="4.0" value={formData.gpa} onChange={(e) => updateFormData('gpa', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.gpa ? 'border-red-300' : 'border-gray-300'}`} placeholder="3.50"/>
          {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SAT Score</label>
          <input type="number" min="400" max="1600" value={formData.satScore} onChange={(e) => updateFormData('satScore', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.satScore ? 'border-red-300' : 'border-gray-300'}`} placeholder="1200" />
          {errors.satScore && <p className="text-red-500 text-xs mt-1">{errors.satScore}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ACT Score</label>
          <input type="number" min="1" max="36" value={formData.actScore} onChange={(e) => updateFormData('actScore', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.actScore ? 'border-red-300' : 'border-gray-300'}`} placeholder="28" />
          {errors.actScore && <p className="text-red-500 text-xs mt-1">{errors.actScore}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Status</label>
        <select value={formData.eligibilityStatus} onChange={(e) => updateFormData('eligibilityStatus', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="Eligible">Eligible</option>
          <option value="Pending">Pending</option>
          <option value="Ineligible">Ineligible</option>
          <option value="Redshirt">Redshirt</option>
        </select>
      </div>
    </div>
  );
  
  const renderAthleticInfo = () => (
      <div className="space-y-4">
        {/* Primary Event and Personal Best */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Event *</label>
            <select value={formData.event} onChange={(e) => updateFormData('event', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.event ? 'border-red-300' : 'border-gray-300'}`}>
              <option value="">Select primary event</option>
              {eventOptions.map(event => (<option key={event} value={event}>{event}</option>))}
            </select>
            {errors.event && <p className="text-red-500 text-xs mt-1">{errors.event}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Best *</label>
            <input type="text" value={formData.personalBest} onChange={(e) => updateFormData('personalBest', e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.personalBest ? 'border-red-300' : 'border-gray-300'}`} placeholder="e.g., 11.45, 2:08.34, 6.12m"/>
            {errors.personalBest && <p className="text-red-500 text-xs mt-1">{errors.personalBest}</p>}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Performance Tier</label>
            <div className="flex items-center gap-2">
              {autoTierAssigned && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  <SafeIcon icon={FiTarget} className="w-3 h-3" />
                  Auto-assigned
                </div>
              )}
              {manualTierOverride && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  <SafeIcon icon={FiUser} className="w-3 h-3" />
                  Manual override
                </div>
              )}
            </div>
          </div>
          <select 
            value={formData.tier} 
            onChange={(e) => {
              updateFormData('tier', e.target.value);
              setManualTierOverride(true);
              setAutoTierAssigned(false);
            }} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {Object.entries(tierCriteria).map(([key, tier]) => (
              <option key={key} value={key}>{tier.name}</option>
            ))}
          </select>
        </div>
      </div>
  );
  
  const renderScholarshipInfo = () => (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Offer Status</label>
            <select value={formData.scholarshipOfferStatus} onChange={(e) => updateFormData('scholarshipOfferStatus', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="No Offer">No Offer</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Offer Pending">Offer Pending</option>
              <option value="Offer Declined">Offer Declined</option>
              <option value="Offer Accepted">Offer Accepted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Acceptance</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center">
                <input type="checkbox" checked={formData.scholarshipAccepted} onChange={(e) => updateFormData('scholarshipAccepted', e.target.checked)} className="mr-2 w-4 h-4 text-ballstate-red focus:ring-ballstate-red border-gray-300 rounded" />
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 mr-1" />
                Scholarship Accepted
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Type</label>
            <select value={formData.scholarshipType} onChange={(e) => updateFormData('scholarshipType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="None">None</option>
              <option value="Athletic">Athletic</option>
              <option value="Academic">Academic</option>
              <option value="Athletic/Academic Split">Athletic/Academic Split</option>
              <option value="Partial Athletic">Partial Athletic</option>
              <option value="Full Athletic">Full Athletic</option>
              <option value="Walk-On">Walk-On</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select value={formData.scholarshipDuration} onChange={(e) => updateFormData('scholarshipDuration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="1 year renewable">1 year renewable</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4 years">4 years</option>
              <option value="1 semester">1 semester</option>
            </select>
          </div>
        </div>
        {/* Dollar Amount and Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <SafeIcon icon={FiDollarSign} className="w-4 h-4 inline mr-1" />
              Scholarship Amount ($)
            </label>
            <input 
              type="number" 
              min="0" 
              max="50000" 
              step="100" 
              value={formData.scholarshipAmount} 
              onChange={(e) => updateFormData('scholarshipAmount', e.target.value)} 
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red ${errors.scholarshipAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              placeholder="5000"
            />
            {errors.scholarshipAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.scholarshipAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <SafeIcon icon={FiPercent} className="w-4 h-4 inline mr-1" />
              Scholarship Percentage (%)
            </label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              step="1" 
              value={formData.scholarshipPercentage} 
              onChange={(e) => handlePercentageChange(parseFloat(e.target.value))} 
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ballstate-red focus:border-ballstate-red ${errors.scholarshipPercentage ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              placeholder="25"
            />
            {errors.scholarshipPercentage && (
              <p className="text-red-500 text-xs mt-1">{errors.scholarshipPercentage}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={formData.status} onChange={(e) => updateFormData('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="active">Active</option>
            <option value="injured">Injured</option>
            <option value="suspended">Suspended</option>
            <option value="redshirt">Redshirt</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {/* Scholarship Status Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Scholarship Status Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                formData.scholarshipOfferStatus === 'No Offer' ? 'bg-gray-100 text-gray-800' :
                formData.scholarshipOfferStatus === 'Offer Extended' ? 'bg-blue-100 text-blue-800' :
                formData.scholarshipOfferStatus === 'Offer Accepted' ? 'bg-green-100 text-green-800' :
                formData.scholarshipOfferStatus === 'Offer Declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                {formData.scholarshipOfferStatus}
              </div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formData.scholarshipAccepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                <SafeIcon icon={formData.scholarshipAccepted ? FiCheck : FiClock} className="w-4 h-4 mr-1" />
                {formData.scholarshipAccepted ? 'Accepted' : 'Pending'}
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                ${formData.scholarshipAmount.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <SafeIcon icon={FiPercent} className="w-4 h-4 mr-1" />
                {formData.scholarshipPercentage}%
              </div>
            </div>
          </div>
          {formData.scholarshipAmount > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <SafeIcon icon={FiTarget} className="w-4 h-4" />
                Based on ${formData.scholarshipAmount.toLocaleString()} scholarship ({formData.scholarshipPercentage}% of full ride)
              </p>
            </div>
          )}
        </div>
      </div>
  );

  if (!athlete) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={handleClose}
        >
          <motion.div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            initial={{scale: 0.9, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.9, opacity: 0}}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Athlete: {athlete.name}</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? 'text-ballstate-red border-b-2 border-ballstate-red' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 200px)'}}>
                <motion.div
                  key={activeTab}
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.3}}
                >
                  {renderContent()}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-ballstate-red text-white rounded-lg font-medium hover:bg-red-700"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  Update Athlete
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAthleteModal;