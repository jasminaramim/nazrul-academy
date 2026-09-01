import React, { useState } from 'react';
import { Clock, Calendar, Music, Sparkles, Tag, Award, Users } from 'lucide-react';
import { ScheduleItem, CulturalItem } from '../types';
import { toBengaliNumber } from '../utils/formatters';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  culturalSchedule: CulturalItem[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedule, culturalSchedule }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'cultural'>('main');

  return (
    <section className="py-16 bg-white border-b border-slate-200/70" id="schedule-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            অনুষ্ঠানসূচি
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            কার্যক্রম ও সময়সূচি
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ২৬ মার্চ ২০২৬ - দিনব্যাপী বর্ণাঢ্য পুনর্মিলনী উৎসব ও সাংস্কৃতিক অনুষ্ঠান
          </p>

          {/* Tab Switcher */}
          <div className="mt-6 inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'main'
                  ? 'bg-[#00732A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>মূল অনুষ্ঠানসূচি</span>
            </button>

            <button
              onClick={() => setActiveTab('cultural')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'cultural'
                  ? 'bg-[#CA0000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>সাংস্কৃতিক ও বিনোদন পর্ব</span>
            </button>
          </div>
        </div>

        {/* Main Schedule Timeline */}
        {activeTab === 'main' && (
          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-50 hover:bg-emerald-50/20 rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#00732A]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center shrink-0 shadow-2xs">
                    <Clock className="w-4 h-4 text-[#00732A] mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">
                      {item.startTime}
                    </span>
                    <span className="text-[10px] text-slate-400 block">থেকে {item.endTime}</span>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#00732A] bg-emerald-100/70 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cultural Schedule Section */}
        {activeTab === 'cultural' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-2xl border border-red-200/80 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#CA0000] shrink-0" />
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                বিকেলের মনোজ্ঞ সাংস্কৃতিক পর্বে নজরুল সংগীত, দেশাত্মবোধক গান, নাটিকা ও বিশেষ স্মৃতিচারণ অনুষ্ঠিত হবে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {culturalSchedule.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#CA0000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#00732A]" />
                        <span>{c.time}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  {c.performers && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#00732A] shrink-0" />
                      <span><strong>পরিবেশনায়:</strong> {c.performers}</span>
                    </div>
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
