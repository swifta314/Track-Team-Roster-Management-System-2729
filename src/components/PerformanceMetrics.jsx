
import React, { useMemo } from 'react';
import MotionCard from './MotionCard';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiAward, FiTarget, FiCalendar } = FiIcons;

const PerformanceMetrics = ({ athletes, globalGenderFilter }) => {
  const metrics = useMemo(() => {
    const filteredAthletes = athletes.filter(athlete => 
      globalGenderFilter === 'both' || athlete.gender === (globalGenderFilter === 'men' ? 'M' : 'F')
    );

    const totalPRs = filteredAthletes.reduce((sum, athlete) => {
      return sum + Object.keys(athlete.athleticPerformance?.personalRecords || {}).length;
    }, 0);

    const avgGPA = filteredAthletes.reduce((sum, athlete) => sum + (athlete.academics?.gpa || 0), 0) / filteredAthletes.length;

    const nationalQualifiers = filteredAthletes.filter(athlete => 
      athlete.athleticPerformance?.rankings?.national
    ).length;

    const recentImprovements = filteredAthletes.filter(athlete => {
      const progression = athlete.athleticPerformance?.progression || [];
      return progression.length > 1 && progression[progression.length - 1].improvement > 0;
    }).length;

    return {
      totalPRs,
      avgGPA: avgGPA.toFixed(2),
      nationalQualifiers,
      recentImprovements
    };
  }, [athletes, globalGenderFilter]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MotionCard delay={0}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total PRs</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{metrics.totalPRs}</p>
          <p className="text-sm text-gray-600 mt-1">Personal records tracked</p>
        </div>
      </MotionCard>

      <MotionCard delay={0.1}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SafeIcon icon={FiAward} className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Team GPA</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{metrics.avgGPA}</p>
          <p className="text-sm text-gray-600 mt-1">Average team GPA</p>
        </div>
      </MotionCard>

      <MotionCard delay={0.2}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">National Qualifiers</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{metrics.nationalQualifiers}</p>
          <p className="text-sm text-gray-600 mt-1">Athletes with national marks</p>
        </div>
      </MotionCard>

      <MotionCard delay={0.3}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recent Improvements</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{metrics.recentImprovements}</p>
          <p className="text-sm text-gray-600 mt-1">Athletes showing progress</p>
        </div>
      </MotionCard>
    </div>
  );
};

export default PerformanceMetrics;
