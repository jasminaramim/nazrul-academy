import React from 'react';
import { TeacherMessage } from '../types';

interface TeacherCallSectionProps {
  messages: TeacherMessage[];
}

export const TeacherCallSection: React.FC<TeacherCallSectionProps> = ({ messages }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            বাণী ও আশীর্বাদ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            প্রাক্তনদের প্রতি আহবান
          </h2>
          <div className="w-16 h-1 bg-[#CA0000] mx-auto mt-3 rounded-full" />
        </div>

        {/* Message Cards Grid */}
        <div className="space-y-10">
          {messages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle green top bar accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00732A] via-emerald-500 to-[#CA0000]" />

              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                {/* Teacher Avatar & Identity */}
                <div className="flex flex-col items-center text-center w-full md:w-64 shrink-0 bg-slate-50/80 p-5 rounded-xl border border-slate-100">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-3 ring-2 ring-[#00732A]/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#CA0000] mt-1">
                    {item.designation}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 leading-snug">
                    {item.schoolName}
                  </span>
                </div>

                {/* Message Body */}
                <div className="flex-1 space-y-4 text-left">
                  {/* Bismillah Text */}
                  <div className="text-center md:text-left">
                    <p className="text-sm font-semibold text-slate-500 tracking-wider font-serif">
                      {item.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
                    </p>
                    <p className="text-xs text-slate-400">পরম করুণাময় আল্লাহর নামে</p>
                  </div>

                  {/* Heading */}
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {item.heading}
                  </h4>

                  {/* Greeting */}
                  {item.greeting && (
                    <p className="text-sm font-bold text-[#00732A]">
                      {item.greeting}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal text-justify">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
