import React from 'react';
import { Users, UserPlus, Layers, History } from 'lucide-react';
import { StatsData } from '../../shared/types';
import { toBengaliNumber } from '../../shared/utils/formatters';

interface StatsSectionProps {
  stats: StatsData;
  studentsCount?: number;
  familyMembersCount?: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  studentsCount,
  familyMembersCount,
}) => {
  const dynamicStudentsCount =
    typeof studentsCount === 'number' && studentsCount >= 0
      ? studentsCount
      : stats.registeredStudents;

  const dynamicFamilyCount =
    typeof familyMembersCount === 'number' && familyMembersCount >= 0
      ? familyMembersCount
      : stats.familyMembersCount;

  // Extract batch count from custom stats or fallback to design default
  const batchCount = stats.customStats && stats.customStats[0] ? stats.customStats[0].value : '৫৮';
  
  // Format numbers safely handling strings
  const formatValue = (val: string | number) => {
    return toBengaliNumber(val);
  };

  const cards = [
    {
      icon: Users,
      value: `${formatValue(dynamicStudentsCount)}+`,
      valueColor: 'text-[#FBBF24]',
      label: 'নিবন্ধিত শিক্ষার্থী',
      subLabel: 'সকল সেশনের সম্মিলিত প্রাক্তন',
    },
    {
      icon: UserPlus,
      value: `${formatValue(dynamicFamilyCount)}+`,
      valueColor: 'text-white',
      label: 'নিবন্ধিত পরিবারের সদস্য',
      subLabel: 'স্ত্রী/স্বামী ও সন্তানসহ',
    },
    {
      icon: Layers,
      value: formatValue(batchCount),
      valueColor: 'text-[#FBBF24]',
      label: 'অংশগ্রহণকারী ব্যাচ',
      subLabel: '১৯৬৫ থেকে ২০২৫ ব্যাচ',
    },
    {
      icon: History,
      value: '২ দিন',
      valueColor: 'text-white',
      label: 'অনুষ্ঠানের সময়কাল',
      subLabel: '২৬ ও ২৭ মার্চ ২০২৬',
    }
  ];

  return (
    <section className="py-24 bg-[#0A3424]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="bg-amber-900/30 border border-amber-600/30 text-amber-500 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            লাইভ পরিসংখ্যান
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            পুনর্মিলনীর সামগ্রিক চিত্র
          </h2>
          <p className="text-emerald-400 text-sm md:text-base">
            সর্বশেষ হালনাগাদ তথ্যানুযায়ী নিবন্ধনের সংখ্যা ও অগ্রগতি
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#0F4731] rounded-2xl p-10 flex flex-col items-center text-center border border-emerald-800/30 hover:bg-[#125339] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-emerald-100" />
                </div>
                <div className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
                <div className="text-white font-bold text-base mb-2">
                  {card.label}
                </div>
                <div className="text-emerald-400/80 text-xs sm:text-sm">
                  {card.subLabel}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
