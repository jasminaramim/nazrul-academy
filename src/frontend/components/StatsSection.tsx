import React from 'react';
import { Users, UserPlus, Layers, History, Award, Gift, Music, Star, Heart, Smile } from 'lucide-react';
import { StatsData } from '../../shared/types';
import { toBengaliNumber } from '../../shared/utils/formatters';

interface StatsSectionProps {
  stats: StatsData;
  studentsCount?: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  studentsCount,
}) => {
  const dynamicStudentsCount =
    typeof studentsCount === 'number' && studentsCount >= 0
      ? studentsCount
      : stats.registeredStudents;




  
  // Format numbers safely handling strings
  const formatValue = (val: string | number) => {
    return toBengaliNumber(val);
  };

  // Helper to get icon by string name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'UserPlus': return UserPlus;
      case 'Layers': return Layers;
      case 'History': return History;
      case 'Award': return Award;
      case 'Gift': return Gift;
      case 'Music': return Music;
      case 'Star': return Star;
      case 'Heart': return Heart;
      case 'Smile': return Smile;
      default: return Star;
    }
  };

  const cards = [
    {
      icon: Users,
      value: `${formatValue(dynamicStudentsCount)}+`,
      valueColor: 'text-[#FBBF24]',
      label: 'নিবন্ধিত শিক্ষার্থী',
      subLabel: 'সকল সেশনের সম্মিলিত প্রাক্তন',
    }
  ];

  if (stats.customStats && stats.customStats.length > 0) {
    stats.customStats.slice(0, 3).forEach((cStat, index) => {
      cards.push({
        icon: getIcon(cStat.icon || 'Star'),
        value: formatValue(cStat.value),
        valueColor: index % 2 === 0 ? 'text-[#FBBF24]' : 'text-white',
        label: cStat.label,
        subLabel: cStat.note || cStat.unit || '',
      });
    });
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#0A3424]">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#0F4731] rounded-2xl p-4 sm:p-8 lg:p-10 flex flex-col items-center text-center border border-emerald-800/30 hover:bg-[#125339] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-100" />
                </div>
                <div className={`text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
                <div className="text-white font-bold text-xs sm:text-base mb-1 sm:mb-2">
                  {card.label}
                </div>
                <div className="text-emerald-400/80 text-[10px] sm:text-sm">
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
