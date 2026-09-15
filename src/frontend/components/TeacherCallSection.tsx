import React from 'react';
import { TeacherMessage } from '../../shared/types';
import { User, GraduationCap, ScrollText, Award, Heart, Star, Quote } from 'lucide-react';

interface TeacherCallSectionProps {
  messages: TeacherMessage[];
}

export const TeacherCallSection: React.FC<TeacherCallSectionProps> = ({ messages }) => {
  const getTheme = (index: number) => {
    const themes = [
      {
        borderTop: 'border-t-[#00732A]',
        iconBorder: 'border-[#00732A]',
        iconColor: 'text-[#00732A]',
        iconBg: 'bg-emerald-50',
        roleColor: 'text-red-400',
        quoteColor: 'text-emerald-400',
        Icon: User,
        bottomIcon: <Award className="w-5 h-5 text-amber-500" />,
        badge: null
      },
      {
        borderTop: 'border-t-[#CA0000]',
        iconBorder: 'border-[#CA0000]',
        iconColor: 'text-[#CA0000]',
        iconBg: 'bg-red-50',
        roleColor: 'text-[#00732A]',
        quoteColor: 'text-slate-600',
        Icon: GraduationCap,
        bottomIcon: <Heart className="w-5 h-5 text-[#CA0000] fill-[#CA0000]" />,
        badge: 'বিশেষ বার্তা'
      },
      {
        borderTop: 'border-t-amber-500',
        iconBorder: 'border-amber-500',
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        roleColor: 'text-amber-500',
        quoteColor: 'text-amber-400',
        Icon: ScrollText,
        bottomIcon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
        badge: null
      }
    ];
    return themes[index % themes.length];
  };

  // Duplicate messages for seamless marquee effect
  const marqueeItems = [...messages, ...messages, ...messages];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-[#F4F7F8] overflow-hidden">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .mask-edges {
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}
      </style>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-red-500 bg-red-100 px-4 py-1 rounded-full mb-4">
            বাণী ও আশীর্বচন
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            প্রাক্তনদের প্রতি আহ্বান ও শুভেচ্ছা বার্তা
          </h2>
          <div className="flex justify-center h-1 w-24 mx-auto rounded-full overflow-hidden">
            <div className="w-1/2 bg-[#00732A]"></div>
            <div className="w-1/2 bg-[#CA0000]"></div>
          </div>
        </div>

        {/* Conditional rendering based on messages */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm mx-auto max-w-2xl">
            <ScrollText className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium">কোনো শুভেচ্ছা বার্তা পাওয়া যায়নি</p>
            <p className="text-sm mt-1">শিগগিরই বার্তা যুক্ত করা হবে</p>
          </div>
        ) : (
          <div className="mask-edges overflow-hidden py-4">
            {/* Marquee Wrapper with edge blur */}
            <div className="flex w-max gap-6 animate-marquee">
              {marqueeItems.map((item, index) => {
                const theme = getTheme(index);
                const IconComponent = theme.Icon;
                
                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden border-t-4 ${theme.borderTop} w-[280px] sm:w-[320px] md:w-[400px] shrink-0`}
                  >
                    {/* Badge if exists */}
                    {theme.badge && (
                      <div className="absolute top-0 right-6 md:right-8 bg-[#CA0000] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 rounded-b-lg">
                        {theme.badge}
                      </div>
                    )}

                    <div className="p-5 md:p-8 h-full flex flex-col">
                      {/* Header: Icon + Info */}
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 ${theme.iconBorder} ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <h4 className={`text-[10px] md:text-xs font-bold ${theme.roleColor} mb-0.5 md:mb-1`}>
                            {item.heading}
                          </h4>
                          <h3 className="text-sm md:text-lg font-extrabold text-slate-900 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-[9px] md:text-[11px] text-slate-500 mt-0.5">
                            {item.designation}
                          </p>
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-1">
                        <span className={`text-3xl md:text-4xl font-serif leading-none ${theme.quoteColor}`}>
                          “
                        </span>
                        <p className="text-xs md:text-sm text-slate-500 italic leading-relaxed pt-1 md:pt-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className={`text-[11px] font-medium ${index % 3 === 1 ? 'text-[#CA0000]' : 'text-slate-600'}`}>
                          {item.schoolName}
                        </span>
                        <div>
                          {theme.bottomIcon}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
