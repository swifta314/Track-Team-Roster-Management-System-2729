// Add yearGroups
export const yearGroups = {
  freshman: { name: 'Freshman', color: 'bg-green-500' },
  sophomore: { name: 'Sophomore', color: 'bg-blue-500' },
  junior: { name: 'Junior', color: 'bg-purple-500' },
  senior: { name: 'Senior', color: 'bg-yellow-500' },
  fifthYear: { name: '5th Year', color: 'bg-red-500' },
  transfer: { name: 'Transfer', color: 'bg-orange-500' }
};

// Sample athletes data with dollar amounts
export const athletes = [
  {
    id: '1',
    name: 'Marcus Johnson',
    gender: 'M',
    contactInfo: {
      email: 'mjohnson@ballstate.edu',
      phone: '(555) 123-4567',
      address: '123 University Ave, Muncie, IN 47306'
    },
    year: 'junior',
    graduationYear: 2025,
    event: '100m',
    personalBest: '10.45',
    tier: 'elite',
    scholarshipAmount: 15000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 60,
    scholarshipDuration: '4 years',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.2,
    status: 'active',
    academics: {
      major: 'Exercise Science',
      satScore: 1180,
      actScore: 25
    },
    highSchool: 'Lawrence North High School, Indianapolis, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['100m', '200m'],
      personalRecords: { '100m': '10.45', '200m': '21.12' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 2,
        regional: 8,
        national: 25
      }
    }
  },
  {
    id: '2',
    name: 'Sarah Williams',
    gender: 'F',
    contactInfo: {
      email: 'swilliams@ballstate.edu',
      phone: '(555) 234-5678',
      address: '456 College St, Muncie, IN 47306'
    },
    year: 'sophomore',
    graduationYear: 2026,
    event: '800m',
    personalBest: '2:08.34',
    tier: 'competitive',
    scholarshipAmount: 12000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 48,
    scholarshipDuration: '3 years',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.7,
    status: 'active',
    academics: {
      major: 'Sports Management',
      satScore: 1240,
      actScore: 28
    },
    highSchool: 'Carmel High School, Carmel, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['800m', '1500m'],
      personalRecords: { '800m': '2:08.34', '1500m': '4:32.12' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 4,
        regional: 12,
        national: 45
      }
    }
  },
  {
    id: '3',
    name: 'David Chen',
    gender: 'M',
    contactInfo: {
      email: 'dchen@ballstate.edu',
      phone: '(555) 345-6789',
      address: '789 Stadium Dr, Muncie, IN 47306'
    },
    year: 'senior',
    graduationYear: 2024,
    event: 'Long Jump',
    personalBest: '7.45m',
    tier: 'elite',
    scholarshipAmount: 18000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 72,
    scholarshipDuration: '1 year renewable',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.5,
    status: 'active',
    academics: {
      major: 'Kinesiology',
      satScore: 1200,
      actScore: 26
    },
    highSchool: 'North Central High School, Indianapolis, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['Long Jump', 'Triple Jump'],
      personalRecords: { 'Long Jump': '7.45m', 'Triple Jump': '15.23m' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 1,
        regional: 3,
        national: 15
      }
    }
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    gender: 'F',
    contactInfo: {
      email: 'erodriguez@ballstate.edu',
      phone: '(555) 456-7890',
      address: '321 Track Ln, Muncie, IN 47306'
    },
    year: 'freshman',
    graduationYear: 2027,
    event: 'Shot Put',
    personalBest: '14.23m',
    tier: 'developing',
    scholarshipAmount: 8000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 32,
    scholarshipDuration: '4 years',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.8,
    status: 'active',
    academics: {
      major: 'Health Science',
      satScore: 1300,
      actScore: 29
    },
    highSchool: 'Hamilton Southeastern High School, Fishers, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['Shot Put', 'Discus'],
      personalRecords: { 'Shot Put': '14.23m', 'Discus': '42.15m' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 6,
        regional: 18,
        national: null
      }
    }
  },
  {
    id: '5',
    name: 'Michael Thompson',
    gender: 'M',
    contactInfo: {
      email: 'mthompson@ballstate.edu',
      phone: '(555) 567-8901',
      address: '654 Field Ave, Muncie, IN 47306'
    },
    year: 'sophomore',
    graduationYear: 2026,
    event: '5000m',
    personalBest: '14:45.67',
    tier: 'competitive',
    scholarshipAmount: 10000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 40,
    scholarshipDuration: '3 years',
    scholarshipOfferStatus: 'Offer Extended',
    scholarshipAccepted: false,
    gpa: 3.4,
    status: 'active',
    academics: {
      major: 'Exercise Science',
      satScore: 1150,
      actScore: 24
    },
    highSchool: 'Zionsville High School, Zionsville, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['5000m', '10000m'],
      personalRecords: { '5000m': '14:45.67', '10000m': '30:23.45' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 3,
        regional: 9,
        national: 35
      }
    }
  },
  {
    id: '6',
    name: 'Ashley Davis',
    gender: 'F',
    contactInfo: {
      email: 'adavis@ballstate.edu',
      phone: '(555) 678-9012',
      address: '987 Sprint St, Muncie, IN 47306'
    },
    year: 'junior',
    graduationYear: 2025,
    event: '400m',
    personalBest: '55.23',
    tier: 'competitive',
    scholarshipAmount: 11000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 44,
    scholarshipDuration: '2 years',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.6,
    status: 'active',
    academics: {
      major: 'Sports Management',
      satScore: 1220,
      actScore: 27
    },
    highSchool: 'Ben Davis High School, Indianapolis, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['400m', '200m'],
      personalRecords: { '400m': '55.23', '200m': '24.67' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 5,
        regional: 14,
        national: 48
      }
    }
  },
  {
    id: '7',
    name: 'James Wilson',
    gender: 'M',
    contactInfo: {
      email: 'jwilson@ballstate.edu',
      phone: '(555) 789-0123',
      address: '147 Hurdle Way, Muncie, IN 47306'
    },
    year: 'senior',
    graduationYear: 2024,
    event: '110m Hurdles',
    personalBest: '13.89',
    tier: 'elite',
    scholarshipAmount: 16000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 64,
    scholarshipDuration: '1 year renewable',
    scholarshipOfferStatus: 'Offer Accepted',
    scholarshipAccepted: true,
    gpa: 3.3,
    status: 'active',
    academics: {
      major: 'Kinesiology',
      satScore: 1190,
      actScore: 25
    },
    highSchool: 'Warren Central High School, Indianapolis, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['110m Hurdles', '400m Hurdles'],
      personalRecords: { '110m Hurdles': '13.89', '400m Hurdles': '52.34' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 1,
        regional: 4,
        national: 18
      }
    }
  },
  {
    id: '8',
    name: 'Madison Brown',
    gender: 'F',
    contactInfo: {
      email: 'mbrown@ballstate.edu',
      phone: '(555) 890-1234',
      address: '258 Jump Ct, Muncie, IN 47306'
    },
    year: 'freshman',
    graduationYear: 2027,
    event: 'High Jump',
    personalBest: '1.65m',
    tier: 'developing',
    scholarshipAmount: 7000,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 28,
    scholarshipDuration: '4 years',
    scholarshipOfferStatus: 'Offer Extended',
    scholarshipAccepted: false,
    gpa: 3.9,
    status: 'active',
    academics: {
      major: 'Pre-Med',
      satScore: 1350,
      actScore: 31
    },
    highSchool: 'Westfield High School, Westfield, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['High Jump', 'Long Jump'],
      personalRecords: { 'High Jump': '1.65m', 'Long Jump': '5.89m' },
      meetResults: [],
      progression: [],
      rankings: {
        conference: 7,
        regional: 22,
        national: null
      }
    }
  }
];

// Update the initial teamComposition structure
export const teamComposition = {
  eventGroups: {
    sprints: {
      name: 'Sprints',
      rosterSpots: { men: 12, women: 14 },
      filled: { men: 8, women: 10 },
      available: { men: 4, women: 4 }
    },
    middleDistance: {
      name: 'Middle Distance',
      rosterSpots: { men: 10, women: 12 },
      filled: { men: 7, women: 9 },
      available: { men: 3, women: 3 }
    },
    distance: {
      name: 'Distance',
      rosterSpots: { men: 15, women: 15 },
      filled: { men: 12, women: 12 },
      available: { men: 3, women: 3 }
    },
    hurdles: {
      name: 'Hurdles',
      rosterSpots: { men: 6, women: 8 },
      filled: { men: 4, women: 6 },
      available: { men: 2, women: 2 }
    },
    jumps: {
      name: 'Jumps',
      rosterSpots: { men: 8, women: 10 },
      filled: { men: 6, women: 7 },
      available: { men: 2, women: 3 }
    },
    throws: {
      name: 'Throws',
      rosterSpots: { men: 10, women: 12 },
      filled: { men: 8, women: 9 },
      available: { men: 2, women: 3 }
    },
    multis: {
      name: 'Multi-Events',
      rosterSpots: { men: 4, women: 5 },
      filled: { men: 2, women: 3 },
      available: { men: 2, women: 2 }
    }
  },
  genderDistribution: {
    men: { total: 65, filled: 47, available: 18 },
    women: { total: 76, filled: 56, available: 20 }
  },
  graduationTimeline: [
    { year: 2024, graduating: 18 },
    { year: 2025, graduating: 24 },
    { year: 2026, graduating: 25 },
    { year: 2027, graduating: 36 }
  ]
};

// Update the initial scholarshipLimits structure with budget information
export const scholarshipLimits = {
  men: { total: 12.6, allocated: 8.2, available: 4.4, dollarAmount: 25000, totalBudget: 315000 },
  women: { total: 18.0, allocated: 14.7, available: 3.3, dollarAmount: 25000, totalBudget: 450000 }
};

// Update the tierCriteria
export const tierCriteria = {
  elite: {
    name: 'Elite',
    color: 'bg-yellow-500',
    description: 'National caliber athlete',
    criteria: {
      '100m': { men: '10.5', women: '11.8' },
      '200m': { men: '21.2', women: '24.0' },
      '400m': { men: '47.5', women: '54.5' }
    }
  },
  competitive: {
    name: 'Competitive',
    color: 'bg-blue-500',
    description: 'Conference level competitor',
    criteria: {
      '100m': { men: '10.8', women: '12.1' },
      '200m': { men: '21.8', women: '24.8' },
      '400m': { men: '48.5', women: '56.0' }
    }
  },
  developing: {
    name: 'Developing',
    color: 'bg-green-500',
    description: 'Shows potential for growth',
    criteria: {
      '100m': { men: '11.2', women: '12.5' },
      '200m': { men: '22.5', women: '25.5' },
      '400m': { men: '49.5', women: '57.5' }
    }
  },
  prospect: {
    name: 'Prospect',
    color: 'bg-orange-500',
    description: 'Early development stage',
    criteria: {
      '100m': { men: '11.5', women: '12.8' },
      '200m': { men: '23.0', women: '26.0' },
      '400m': { men: '50.5', women: '59.0' }
    }
  }
};

// Export recruitingNeeds
export const recruitingNeeds = {
  priority: [
    {
      eventGroup: 'Sprints',
      gender: 'Men',
      tier: 'Elite/Competitive',
      notes: 'Need immediate impact athletes for 100m and 200m'
    },
    {
      eventGroup: 'Distance',
      gender: 'Women',
      tier: 'Elite',
      notes: 'Looking for 5000m/10000m specialists'
    }
  ],
  secondary: [
    {
      eventGroup: 'Throws',
      gender: 'Both',
      tier: 'Competitive',
      notes: 'Building depth in shot put and discus'
    }
  ],
  future: [
    {
      eventGroup: 'Jumps',
      gender: 'Women',
      tier: 'Developing',
      notes: 'Long-term development prospects'
    }
  ]
};