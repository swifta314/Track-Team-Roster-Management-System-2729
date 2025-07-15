// Mock data for athletes and scholarships
export const athletes = [
  {
    id: '1',
    name: 'Sarah Johnson',
    gender: 'F',
    contactInfo: {
      email: 'sjohnson@ballstate.edu',
      phone: '317-555-1234',
      address: '2000 W University Ave, Muncie, IN 47306'
    },
    year: 'freshman',
    graduationYear: 2027,
    event: '100m',
    personalBest: '11.45',
    tier: 'elite',
    scholarshipAmount: 8500,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 60,
    scholarshipDuration: '1 year renewable',
    gpa: 3.8,
    status: 'active',
    academics: {
      major: 'Exercise Science',
      satScore: 1280,
      actScore: 28
    },
    highSchool: 'Central High School, Indianapolis',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['100m', '200m', '4x100m Relay'],
      personalRecords: {'100m': '11.45', '200m': '23.62', '60m': '7.38'},
      meetResults: [
        {meet: 'MAC Indoor Championships', date: '2023-02-24', event: '60m', result: '7.42', place: 3},
        {meet: 'Redbird Invite', date: '2023-01-15', event: '60m', result: '7.38', place: 1}
      ],
      progression: [
        {season: 'High School Senior', year: 2022, event: '100m', best: '11.68'},
        {season: 'College Freshman', year: 2023, event: '100m', best: '11.45'}
      ],
      rankings: {conference: 2, regional: 15, national: 78}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2022-04-15', type: 'Email', notes: 'Initial contact'},
        {date: '2022-05-10', type: 'Phone call', notes: 'Discussed scholarship options'},
        {date: '2022-06-20', type: 'Official visit', notes: 'Campus tour and meeting with coach'}
      ],
      visits: {official: '2022-06-20', unofficial: '2022-05-05'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '2',
    name: 'Marcus Williams',
    gender: 'M',
    contactInfo: {
      email: 'mwilliams@ballstate.edu',
      phone: '765-555-2468',
      address: '1900 W University Ave, Muncie, IN 47306'
    },
    year: 'sophomore',
    graduationYear: 2026,
    event: '400m',
    personalBest: '46.12',
    tier: 'competitive',
    scholarshipAmount: 6000,
    scholarshipType: 'Athletic/Academic Split',
    scholarshipPercentage: 40,
    scholarshipDuration: '1 year renewable',
    gpa: 3.5,
    status: 'active',
    academics: {
      major: 'Business Administration',
      satScore: 1340,
      actScore: 29
    },
    highSchool: 'Lawrence North High School, Indianapolis',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['400m', '200m', '4x400m Relay'],
      personalRecords: {'400m': '46.12', '200m': '21.34', '300m': '33.56'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: '400m', result: '46.12', place: 2},
        {meet: 'Ball State Challenge', date: '2023-04-02', event: '400m', result: '46.78', place: 1}
      ],
      progression: [
        {season: 'Freshman', year: 2022, event: '400m', best: '47.23'},
        {season: 'Sophomore', year: 2023, event: '400m', best: '46.12'}
      ],
      rankings: {conference: 2, regional: 12, national: 45}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2021-03-10', type: 'Email', notes: 'Initial contact'},
        {date: '2021-04-05', type: 'Phone call', notes: 'Discussed program details'},
        {date: '2021-05-15', type: 'Official visit', notes: 'Met with team and coaches'}
      ],
      visits: {official: '2021-05-15', unofficial: '2021-04-20'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '3',
    name: 'Emma Davis',
    gender: 'F',
    contactInfo: {
      email: 'edavis@ballstate.edu',
      phone: '317-555-3698',
      address: '2100 W University Ave, Muncie, IN 47306'
    },
    year: 'junior',
    graduationYear: 2025,
    event: '800m',
    personalBest: '2:08.34',
    tier: 'developing',
    scholarshipAmount: 4000,
    scholarshipType: 'Partial Athletic',
    scholarshipPercentage: 25,
    scholarshipDuration: '1 year renewable',
    gpa: 3.9,
    status: 'active',
    academics: {
      major: 'Biology',
      satScore: 1450,
      actScore: 32
    },
    highSchool: 'Carmel High School, Carmel, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['800m', '1500m', '4x800m Relay'],
      personalRecords: {'800m': '2:08.34', '1500m': '4:28.67', '400m': '58.42'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: '800m', result: '2:08.34', place: 5},
        {meet: 'Illini Classic', date: '2023-04-08', event: '800m', result: '2:09.12', place: 3}
      ],
      progression: [
        {season: 'Freshman', year: 2021, event: '800m', best: '2:12.45'},
        {season: 'Sophomore', year: 2022, event: '800m', best: '2:10.21'},
        {season: 'Junior', year: 2023, event: '800m', best: '2:08.34'}
      ],
      rankings: {conference: 5, regional: 25, national: 120}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2020-02-15', type: 'Email', notes: 'Initial contact'},
        {date: '2020-03-20', type: 'Phone call', notes: 'Discussed academic programs'},
        {date: '2020-04-25', type: 'Unofficial visit', notes: 'Campus tour'}
      ],
      visits: {official: '2020-09-10', unofficial: '2020-04-25'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '4',
    name: 'Tyler Brown',
    gender: 'M',
    contactInfo: {
      email: 'tbrown@ballstate.edu',
      phone: '765-555-7890',
      address: '2200 W University Ave, Muncie, IN 47306'
    },
    year: 'senior',
    graduationYear: 2024,
    event: '1500m',
    personalBest: '3:42.18',
    tier: 'competitive',
    scholarshipAmount: 7200,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 50,
    scholarshipDuration: '1 year renewable',
    gpa: 3.6,
    status: 'active',
    academics: {
      major: 'Kinesiology',
      satScore: 1320,
      actScore: 28
    },
    highSchool: 'Fishers High School, Fishers, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['1500m', '3000m', '5000m'],
      personalRecords: {'1500m': '3:42.18', '3000m': '8:05.67', '5000m': '14:12.36'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: '1500m', result: '3:42.18', place: 1},
        {meet: 'Drake Relays', date: '2023-04-28', event: '1500m', result: '3:43.56', place: 4}
      ],
      progression: [
        {season: 'Freshman', year: 2020, event: '1500m', best: '3:49.32'},
        {season: 'Sophomore', year: 2021, event: '1500m', best: '3:46.78'},
        {season: 'Junior', year: 2022, event: '1500m', best: '3:44.12'},
        {season: 'Senior', year: 2023, event: '1500m', best: '3:42.18'}
      ],
      rankings: {conference: 1, regional: 8, national: 35}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2019-02-10', type: 'Email', notes: 'Initial contact'},
        {date: '2019-03-15', type: 'Phone call', notes: 'Discussed program fit'},
        {date: '2019-05-20', type: 'Official visit', notes: 'Met with distance coach'}
      ],
      visits: {official: '2019-05-20', unofficial: '2019-04-05'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '5',
    name: 'Jessica Chen',
    gender: 'F',
    contactInfo: {
      email: 'jchen@ballstate.edu',
      phone: '317-555-4321',
      address: '2300 W University Ave, Muncie, IN 47306'
    },
    year: 'freshman',
    graduationYear: 2027,
    event: 'Long Jump',
    personalBest: '6.12m',
    tier: 'elite',
    scholarshipAmount: 9000,
    scholarshipType: 'Full Athletic',
    scholarshipPercentage: 75,
    scholarshipDuration: '1 year renewable',
    gpa: 3.95,
    status: 'active',
    academics: {
      major: 'Computer Science',
      satScore: 1520,
      actScore: 34
    },
    highSchool: 'Zionsville Community High School, Zionsville, IN',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['Long Jump', 'Triple Jump', '100m'],
      personalRecords: {'Long Jump': '6.12m', 'Triple Jump': '12.34m', '100m': '12.21'},
      meetResults: [
        {meet: 'MAC Indoor Championships', date: '2023-02-24', event: 'Long Jump', result: '6.05m', place: 1},
        {meet: 'Redbird Invite', date: '2023-01-15', event: 'Long Jump', result: '6.12m', place: 1}
      ],
      progression: [
        {season: 'High School Senior', year: 2022, event: 'Long Jump', best: '5.85m'},
        {season: 'College Freshman', year: 2023, event: 'Long Jump', best: '6.12m'}
      ],
      rankings: {conference: 1, regional: 5, national: 25}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2022-03-05', type: 'Email', notes: 'Initial contact'},
        {date: '2022-04-10', type: 'Phone call', notes: 'Discussed scholarship package'},
        {date: '2022-05-15', type: 'Official visit', notes: 'Met with jumps coach'}
      ],
      visits: {official: '2022-05-15', unofficial: '2022-04-20'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '6',
    name: 'David Miller',
    gender: 'M',
    contactInfo: {
      email: 'dmiller@ballstate.edu',
      phone: '765-555-8765',
      address: '2400 W University Ave, Muncie, IN 47306'
    },
    year: 'sophomore',
    graduationYear: 2026,
    event: 'Shot Put',
    personalBest: '16.45m',
    tier: 'developing',
    scholarshipAmount: 3500,
    scholarshipType: 'Partial Athletic',
    scholarshipPercentage: 20,
    scholarshipDuration: '1 year renewable',
    gpa: 3.2,
    status: 'active',
    academics: {
      major: 'Construction Management',
      satScore: 1180,
      actScore: 26
    },
    highSchool: 'Warren Central High School, Indianapolis',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['Shot Put', 'Discus', 'Hammer'],
      personalRecords: {'Shot Put': '16.45m', 'Discus': '48.76m', 'Hammer': '52.34m'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: 'Shot Put', result: '16.24m', place: 7},
        {meet: 'Ball State Challenge', date: '2023-04-02', event: 'Shot Put', result: '16.45m', place: 3}
      ],
      progression: [
        {season: 'Freshman', year: 2022, event: 'Shot Put', best: '15.67m'},
        {season: 'Sophomore', year: 2023, event: 'Shot Put', best: '16.45m'}
      ],
      rankings: {conference: 7, regional: 35, national: null}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2021-04-10', type: 'Email', notes: 'Initial contact'},
        {date: '2021-05-15', type: 'Phone call', notes: 'Discussed walk-on opportunity'},
        {date: '2021-06-20', type: 'Unofficial visit', notes: 'Met throws coach'}
      ],
      visits: {official: null, unofficial: '2021-06-20'},
      offerStatus: 'Walk-on',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '7',
    name: 'Ashley Taylor',
    gender: 'F',
    contactInfo: {
      email: 'ataylor@ballstate.edu',
      phone: '317-555-9876',
      address: '2500 W University Ave, Muncie, IN 47306'
    },
    year: 'fifthYear',
    graduationYear: 2024,
    event: '5000m',
    personalBest: '16:45.23',
    tier: 'competitive',
    scholarshipAmount: 5500,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 35,
    scholarshipDuration: '1 year renewable',
    gpa: 3.7,
    status: 'active',
    academics: {
      major: 'Nutrition Science',
      satScore: 1380,
      actScore: 30
    },
    highSchool: 'Noblesville High School, Noblesville, IN',
    eligibilityStatus: 'Eligible - COVID year',
    athleticPerformance: {
      primaryEvents: ['5000m', '10000m', '3000m Steeplechase'],
      personalRecords: {'5000m': '16:45.23', '10000m': '34:56.78', '3000m Steeplechase': '10:12.34'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: '5000m', result: '16:45.23', place: 2},
        {meet: 'Penn Relays', date: '2023-04-27', event: '5000m', result: '16:52.45', place: 8}
      ],
      progression: [
        {season: 'Freshman', year: 2019, event: '5000m', best: '17:45.67'},
        {season: 'Sophomore', year: 2020, event: '5000m', best: '17:15.34'},
        {season: 'Junior', year: 2021, event: '5000m', best: '16:58.76'},
        {season: 'Senior', year: 2022, event: '5000m', best: '16:50.12'},
        {season: '5th Year', year: 2023, event: '5000m', best: '16:45.23'}
      ],
      rankings: {conference: 2, regional: 18, national: 85}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2018-03-15', type: 'Email', notes: 'Initial contact'},
        {date: '2018-04-20', type: 'Phone call', notes: 'Discussed program details'},
        {date: '2018-06-10', type: 'Official visit', notes: 'Campus tour and team meeting'}
      ],
      visits: {official: '2018-06-10', unofficial: '2018-05-05'},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '8',
    name: 'Ryan Garcia',
    gender: 'M',
    contactInfo: {
      email: 'rgarcia@ballstate.edu',
      phone: '765-555-3456',
      address: '2600 W University Ave, Muncie, IN 47306'
    },
    year: 'junior',
    graduationYear: 2025,
    event: 'High Jump',
    personalBest: '2.05m',
    tier: 'prospect',
    scholarshipAmount: 2000,
    scholarshipType: 'Academic/Athletic Split',
    scholarshipPercentage: 15,
    scholarshipDuration: '1 year renewable',
    gpa: 3.3,
    status: 'active',
    academics: {
      major: 'Sports Administration',
      satScore: 1200,
      actScore: 25
    },
    highSchool: 'Southport High School, Indianapolis',
    eligibilityStatus: 'Eligible',
    athleticPerformance: {
      primaryEvents: ['High Jump', 'Long Jump'],
      personalRecords: {'High Jump': '2.05m', 'Long Jump': '6.78m'},
      meetResults: [
        {meet: 'MAC Indoor Championships', date: '2023-02-24', event: 'High Jump', result: '2.00m', place: 8},
        {meet: 'Hoosier Invite', date: '2023-01-28', event: 'High Jump', result: '2.05m', place: 5}
      ],
      progression: [
        {season: 'Freshman', year: 2021, event: 'High Jump', best: '1.95m'},
        {season: 'Sophomore', year: 2022, event: 'High Jump', best: '2.00m'},
        {season: 'Junior', year: 2023, event: 'High Jump', best: '2.05m'}
      ],
      rankings: {conference: 8, regional: null, national: null}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2020-09-10', type: 'Email', notes: 'Walk-on inquiry'},
        {date: '2020-10-15', type: 'Phone call', notes: 'Discussed tryout opportunity'},
        {date: '2020-11-20', type: 'Tryout', notes: 'Successful walk-on tryout'}
      ],
      visits: {official: null, unofficial: '2020-10-25'},
      offerStatus: 'Walk-on',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  },
  {
    id: '9',
    name: 'Michael Johnson',
    gender: 'M',
    contactInfo: {
      email: 'mjohnson@ballstate.edu',
      phone: '765-555-7777',
      address: '2200 W University Ave, Muncie, IN 47306'
    },
    year: 'transfer',
    graduationYear: 2025,
    event: '400m',
    personalBest: '47.21',
    tier: 'competitive',
    scholarshipAmount: 6800,
    scholarshipType: 'Athletic',
    scholarshipPercentage: 45,
    scholarshipDuration: '2 years',
    gpa: 3.4,
    status: 'active',
    academics: {
      major: 'Sports Marketing',
      satScore: 1260,
      actScore: 27
    },
    highSchool: 'North Central High School, Indianapolis',
    eligibilityStatus: 'Eligible - Transfer',
    athleticPerformance: {
      primaryEvents: ['400m', '200m', '4x400m Relay'],
      personalRecords: {'400m': '47.21', '200m': '21.84', '300m': '34.12'},
      meetResults: [
        {meet: 'MAC Outdoor Championships', date: '2023-05-14', event: '400m', result: '47.31', place: 4},
        {meet: 'Ball State Challenge', date: '2023-04-02', event: '400m', result: '47.21', place: 2}
      ],
      progression: [
        {season: 'Freshman (Ohio State)', year: 2021, event: '400m', best: '48.04'},
        {season: 'Sophomore (Ohio State)', year: 2022, event: '400m', best: '47.76'},
        {season: 'Junior (Ball State)', year: 2023, event: '400m', best: '47.21'}
      ],
      rankings: {conference: 4, regional: 22, national: null}
    },
    recruitingStatus: {
      communicationHistory: [
        {date: '2022-12-10', type: 'Email', notes: 'Transfer inquiry'},
        {date: '2022-12-18', type: 'Phone call', notes: 'Discussed transfer process'},
        {date: '2023-01-15', type: 'Official visit', notes: 'Met with sprint coach'}
      ],
      visits: {official: '2023-01-15', unofficial: null},
      offerStatus: 'Accepted',
      commitmentStatus: 'Committed',
      paperworkStatus: 'Complete'
    }
  }
];

export let scholarshipLimits = {
  men: {total: 12.6, allocated: 8.2, available: 4.4},
  women: {total: 18.0, allocated: 14.7, available: 3.3}
};

// Update available scholarships whenever allocated changes
export const updateScholarshipLimits = (newLimits) => {
  scholarshipLimits = {
    men: {...newLimits.men, available: newLimits.men.total - newLimits.men.allocated},
    women: {...newLimits.women, available: newLimits.women.total - newLimits.women.allocated}
  };
};

export let tierCriteria = {
  elite: {
    name: 'Elite',
    color: 'bg-yellow-500',
    description: 'Top performers with championship potential and national ranking capability',
    criteria: {
      '100m': {men: '10.30', women: '11.50'},
      '200m': {men: '20.80', women: '23.50'},
      '400m': {men: '46.50', women: '53.00'},
      '800m': {men: '1:48.00', women: '2:08.00'},
      '1500m': {men: '3:40.00', women: '4:15.00'},
      '5000m': {men: '14:20.00', women: '16:30.00'},
      '10000m': {men: '29:30.00', women: '34:00.00'}
    }
  },
  competitive: {
    name: 'Competitive',
    color: 'bg-blue-500',
    description: 'Strong contributors to team success with consistent performance',
    criteria: {
      '100m': {men: '10.60', women: '11.80'},
      '200m': {men: '21.50', women: '24.20'},
      '400m': {men: '48.00', women: '55.00'},
      '800m': {men: '1:52.00', women: '2:12.00'},
      '1500m': {men: '3:50.00', women: '4:25.00'},
      '5000m': {men: '15:00.00', women: '17:30.00'},
      '10000m': {men: '31:00.00', women: '36:00.00'}
    }
  },
  developing: {
    name: 'Developing',
    color: 'bg-green-500',
    description: 'Athletes with growth potential and room for improvement',
    criteria: {
      '100m': {men: '11.00', women: '12.20'},
      '200m': {men: '22.50', women: '25.00'},
      '400m': {men: '50.00', women: '58.00'},
      '800m': {men: '1:58.00', women: '2:18.00'},
      '1500m': {men: '4:05.00', women: '4:40.00'},
      '5000m': {men: '16:00.00', women: '18:30.00'},
      '10000m': {men: '33:00.00', women: '38:00.00'}
    }
  },
  prospect: {
    name: 'Prospect',
    color: 'bg-orange-500',
    description: 'New recruits and walk-ons with potential for development',
    criteria: {
      '100m': {men: '11.50+', women: '12.80+'},
      '200m': {men: '23.50+', women: '26.00+'},
      '400m': {men: '52.00+', women: '1:02.00+'},
      '800m': {men: '2:05.00+', women: '2:25.00+'},
      '1500m': {men: '4:20.00+', women: '5:00.00+'},
      '5000m': {men: '17:00.00+', women: '20:00.00+'},
      '10000m': {men: '35:00.00+', women: '40:00.00+'}
    }
  }
};

export const yearGroups = {
  freshman: {name: 'Freshman', color: 'bg-purple-100'},
  sophomore: {name: 'Sophomore', color: 'bg-blue-100'},
  junior: {name: 'Junior', color: 'bg-green-100'},
  senior: {name: 'Senior', color: 'bg-yellow-100'},
  fifthYear: {name: '5th Year', color: 'bg-orange-100'},
  transfer: {name: 'Transfer', color: 'bg-red-100'}
};

export let teamComposition = {
  eventGroups: {
    sprints: {
      name: 'Sprints',
      rosterSpots: {men: 12, women: 14},
      filled: {men: 8, women: 10},
      available: {men: 4, women: 4}
    },
    middleDistance: {
      name: 'Middle Distance',
      rosterSpots: {men: 10, women: 12},
      filled: {men: 7, women: 9},
      available: {men: 3, women: 3}
    },
    distance: {
      name: 'Distance',
      rosterSpots: {men: 15, women: 15},
      filled: {men: 12, women: 12},
      available: {men: 3, women: 3}
    },
    hurdles: {
      name: 'Hurdles',
      rosterSpots: {men: 6, women: 8},
      filled: {men: 4, women: 6},
      available: {men: 2, women: 2}
    },
    jumps: {
      name: 'Jumps',
      rosterSpots: {men: 8, women: 10},
      filled: {men: 6, women: 7},
      available: {men: 2, women: 3}
    },
    throws: {
      name: 'Throws',
      rosterSpots: {men: 10, women: 12},
      filled: {men: 8, women: 9},
      available: {men: 2, women: 3}
    },
    multis: {
      name: 'Multi-Events',
      rosterSpots: {men: 4, women: 5},
      filled: {men: 2, women: 3},
      available: {men: 2, women: 2}
    }
  },
  genderDistribution: {
    men: {total: 65, filled: 47, available: 18},
    women: {total: 76, filled: 56, available: 20}
  },
  graduationTimeline: [
    {year: 2024, graduating: 18},
    {year: 2025, graduating: 24},
    {year: 2026, graduating: 25},
    {year: 2027, graduating: 36}
  ]
};

export let recruitingNeeds = {
  priority: [
    {eventGroup: 'Throws', gender: 'Men', tier: 'Elite', notes: 'Need shot put specialists for conference championships'},
    {eventGroup: 'Sprints', gender: 'Women', tier: 'Elite/Competitive', notes: 'Focus on 100m/200m for relay teams'},
    {eventGroup: 'Distance', gender: 'Both', tier: 'Competitive', notes: '5000m/10000m specialists for cross country depth'}
  ],
  secondary: [
    {eventGroup: 'Jumps', gender: 'Women', tier: 'Competitive', notes: 'High jump and triple jump depth needed'},
    {eventGroup: 'Hurdles', gender: 'Men', tier: 'Competitive/Developing', notes: '110mH and 400mH for complete program'},
    {eventGroup: 'Middle Distance', gender: 'Both', tier: 'Developing', notes: 'Building depth in 800m for relay teams'}
  ],
  future: [
    {eventGroup: 'Multis', gender: 'Both', tier: 'Any', notes: 'Building program for future years - heptathlon/decathlon'},
    {eventGroup: 'Pole Vault', gender: 'Women', tier: 'Any', notes: 'Rebuilding after graduations - critical need'}
  ]
};