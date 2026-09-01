import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Calendar, Clock, Sparkles } from 'lucide-react';
import { StatsData } from '../types';
import { toBengaliNumber } from '../utils/formatters';

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

  // Simple countdown to festival date
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    // Target date 26 March 2026
    const targetDate = new Date('2026-03-26T09:00:00+06:00').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [stats.festivalDate]);

  return (
    <section className="py-14 bg-white border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            পরিসংখ্যান
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            পুনর্মিলনীর সামগ্রিক চিত্র
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            পুনর্মিলনী সংক্রান্ত সকল গুরুত্বপূর্ণ তথ্য এবং একনজরে পরিসংখ্যান
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Registered Students */}
          <div className="bg-amber-50/40 rounded-2xl p-7 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden group">
            <div className="w-14 h-14 rounded-full bg-amber-100/90 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <span className="text-4xl sm:text-5xl font-black text-amber-700 tracking-tight">
              {toBengaliNumber(dynamicStudentsCount)}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-2">
              নিবন্ধিত শিক্ষার্থী
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              নজরুল একাডেমির বিভিন্ন ব্যাচের প্রাক্তন ছাত্র-ছাত্রী
            </p>
          </div>

          {/* Card 2: Family Members */}
          <div className="bg-emerald-50/40 rounded-2xl p-7 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden group">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#00732A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCheck className="w-7 h-7" />
            </div>
            <span className="text-4xl sm:text-5xl font-black text-[#00732A] tracking-tight">
              {toBengaliNumber(dynamicFamilyCount)}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-2">
              নিবন্ধিত শিক্ষার্থীর পরিবারের সদস্য
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              উৎসবে সাথে আসা পরিবারবর্গ ও অতিথি
            </p>
          </div>

          {/* Card 3: Festival Date, Time & Countdown */}
          <div className="bg-rose-50/40 rounded-2xl p-7 border border-rose-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden group">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-[#CA0000] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>

            {/* Countdown timer blocks */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                <span className="text-lg font-black text-[#CA0000] leading-none">
                  {toBengaliNumber(timeLeft.days)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">দিন</span>
              </div>
              <span className="text-[#CA0000] font-bold">:</span>
              <div className="flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                <span className="text-lg font-black text-[#CA0000] leading-none">
                  {toBengaliNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">ঘণ্টা</span>
              </div>
              <span className="text-[#CA0000] font-bold">:</span>
              <div className="flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                <span className="text-lg font-black text-[#CA0000] leading-none">
                  {toBengaliNumber(timeLeft.mins)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">মিনিট</span>
              </div>
              <span className="text-[#CA0000] font-bold">:</span>
              <div className="flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                <span className="text-lg font-black text-[#CA0000] leading-none">
                  {toBengaliNumber(timeLeft.secs)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">সেকেন্ড</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 mt-1">
              অনুষ্ঠান শুরুর দিন ও সময়
            </h3>
            <p className="text-xs text-[#CA0000] font-semibold mt-0.5 flex items-center gap-1 justify-center">
              <Clock className="w-3 h-3" />
              <span>{stats.festivalDate} ({stats.festivalTime})</span>
            </p>
          </div>
        </div>

        {/* Additional Custom Stats Grid if available */}
        {stats.customStats && stats.customStats.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {stats.customStats.map((cStat) => (
                <div
                  key={cStat.id}
                  className="bg-slate-50/80 hover:bg-emerald-50/30 p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all text-center group"
                >
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[#00732A] transition-colors">
                    {cStat.value}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{cStat.label}</h4>
                  {cStat.note && (
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{cStat.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
