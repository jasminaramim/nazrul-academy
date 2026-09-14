import React, { useState } from 'react';
import { Clock, Calendar, Music, Sparkles, Users, Leaf, TreePine } from 'lucide-react';
import { ScheduleItem, CulturalItem } from '../../shared/types';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  culturalSchedule: CulturalItem[];
}

// Each schedule category gets a color accent
const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'অভ্যর্থনা':   { bg: 'bg-sky-50',     text: 'text-sky-700',    border: 'border-sky-200',    dot: 'bg-sky-500' },
  'প্রাতরাশ':    { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  'উদ্বোধন':     { bg: 'bg-emerald-50', text: 'text-[#00732A]',  border: 'border-emerald-200',dot: 'bg-[#00732A]' },
  'শোভাযাত্রা':  { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  'সম্মাননা':    { bg: 'bg-rose-50',    text: 'text-[#CA0000]',  border: 'border-rose-200',   dot: 'bg-[#CA0000]' },
  'স্মৃতিচারণ':  { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-500' },
  'মধ্যাহ্নভোজ': { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  'ছবি ও আড্ডা': { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-200',   dot: 'bg-pink-500' },
};

const getCategory = (cat: string) =>
  categoryColors[cat] ?? { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedule, culturalSchedule }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'cultural'>('main');

  return (
    <section className="py-20 bg-[#F9FBF9] border-b border-slate-100" id="schedule-section">
      <style>{`
        /* Tree trunk line */
        .tree-trunk::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 3px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #00732A, #a7f3d0, #00732A);
          border-radius: 4px;
          z-index: 0;
        }
        .tree-branch-left::after,
        .tree-branch-right::after {
          content: '';
          position: absolute;
          top: 50%;
          height: 3px;
          width: 40px;
          background: linear-gradient(to right, #00732A, #a7f3d0);
          border-radius: 4px;
          z-index: 0;
        }
        .tree-branch-left::after  { right: -40px; }
        .tree-branch-right::after { left: -40px; background: linear-gradient(to left, #00732A, #a7f3d0); }

        @keyframes branch-in {
          from { opacity: 0; transform: translateX(var(--tx, -24px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .branch-item { animation: branch-in 0.45s ease-out both; }
        .branch-item:nth-child(1)  { animation-delay: 0.05s; }
        .branch-item:nth-child(2)  { animation-delay: 0.12s; }
        .branch-item:nth-child(3)  { animation-delay: 0.19s; }
        .branch-item:nth-child(4)  { animation-delay: 0.26s; }
        .branch-item:nth-child(5)  { animation-delay: 0.33s; }
        .branch-item:nth-child(6)  { animation-delay: 0.40s; }
        .branch-item:nth-child(7)  { animation-delay: 0.47s; }
        .branch-item:nth-child(8)  { animation-delay: 0.54s; }

        @keyframes leaf-sway {
          0%, 100% { transform: rotate(-6deg); }
          50%       { transform: rotate(6deg); }
        }
        .leaf-icon { animation: leaf-sway 3s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <TreePine className="w-3.5 h-3.5" />
            অনুষ্ঠানসূচি
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            কার্যক্রম ও <span className="text-[#00732A]">সময়সূচি</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            ২৬ মার্চ ২০২৬ · দিনব্যাপী বর্ণাঢ্য পুনর্মিলনী উৎসব ও সাংস্কৃতিক অনুষ্ঠান
          </p>
          <div className="flex justify-center mt-4 gap-1">
            <div className="h-1 w-8 rounded-full bg-[#00732A]"></div>
            <div className="h-1 w-3 rounded-full bg-[#FBBF24]"></div>
            <div className="h-1 w-8 rounded-full bg-[#CA0000]"></div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'main'
                  ? 'bg-[#00732A] text-white shadow-md shadow-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              মূল অনুষ্ঠানসূচি
            </button>
            <button
              onClick={() => setActiveTab('cultural')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'cultural'
                  ? 'bg-[#CA0000] text-white shadow-md shadow-red-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Music className="w-4 h-4" />
              সাংস্কৃতিক ও বিনোদন পর্ব
            </button>
          </div>
        </div>

        {/* ═══════════ TREE TIMELINE — Main Schedule ═══════════ */}
        {activeTab === 'main' && (
          <div className="relative">
            {/* Root decoration */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#00732A] flex items-center justify-center shadow-lg shadow-emerald-300">
                <TreePine className="w-7 h-7 text-white" />
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#00732A] to-emerald-200 mt-1"></div>
            </div>

            {/* Continuous trunk */}
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00732A] via-emerald-300 to-[#00732A] -translate-x-1/2 z-0"></div>

              <div className="flex flex-col gap-8">
                {schedule.map((item, idx) => {
                  const isLeft = idx % 2 === 0;
                  const cat = getCategory(item.category);

                  const Card = (
                    <div className={`flex-1 rounded-2xl border ${cat.border} bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 group cursor-default`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-xl ${cat.bg} ${cat.text} flex items-center justify-center shrink-0`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800">{item.startTime}</div>
                          <div className="text-[10px] text-slate-400">থেকে {item.endTime}</div>
                        </div>
                        <span className={`ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {item.shortDescription}
                      </p>
                    </div>
                  );

                  return (
                    <div key={item.id || idx} className="relative flex items-center gap-0">
                      {isLeft ? (
                        <>
                          {/* Card LEFT */}
                          <div className="flex-1 flex justify-end pr-6">{Card}</div>
                          {/* Node */}
                          <div className="relative z-10 shrink-0 flex items-center justify-center" style={{ width: '2rem' }}>
                            <div className={`w-5 h-5 rounded-full border-4 border-white ${cat.dot} shadow-md ring-2 ring-emerald-200`}></div>
                          </div>
                          {/* Spacer */}
                          <div className="flex-1 pl-6"></div>
                        </>
                      ) : (
                        <>
                          {/* Spacer */}
                          <div className="flex-1 pr-6"></div>
                          {/* Node */}
                          <div className="relative z-10 shrink-0 flex items-center justify-center" style={{ width: '2rem' }}>
                            <div className={`w-5 h-5 rounded-full border-4 border-white ${cat.dot} shadow-md ring-2 ring-emerald-200`}></div>
                          </div>
                          {/* Card RIGHT */}
                          <div className="flex-1 flex justify-start pl-6">{Card}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Root (bottom) */}
            <div className="flex flex-col items-center mt-6">
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-200 to-[#00732A]"></div>
              <div className="flex items-center gap-2 bg-[#00732A] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg shadow-emerald-200 mt-1">
                <Leaf className="w-3.5 h-3.5 leaf-icon" />
                পুনর্মিলনী উৎসব ২০২৬ সমাপ্ত
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ Cultural Schedule — Vertical Music Tree ═══════════ */}
        {activeTab === 'cultural' && (
          <div>
            {/* Banner */}
            <div className="bg-gradient-to-r from-red-50 via-amber-50 to-rose-50 p-5 rounded-3xl border border-red-200/80 flex items-start gap-3 mb-10">
              <Sparkles className="w-5 h-5 text-[#CA0000] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                বিকেলের মনোজ্ঞ সাংস্কৃতিক পর্বে নজরুল সংগীত, দেশাত্মবোধক গান, নাটিকা ও বিশেষ স্মৃতিচারণ অনুষ্ঠিত হবে।
              </p>
            </div>

            {/* Music Note top */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#CA0000] to-rose-700 flex items-center justify-center shadow-xl shadow-red-200 text-white text-2xl font-black">
                ♪
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#CA0000] to-rose-200 mt-1"></div>
            </div>

            {/* Vertical Cultural Tree — fixed alignment */}
            <div className="relative">
              {/* Continuous trunk line behind everything */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CA0000] via-rose-300 to-[#CA0000] -translate-x-1/2 z-0"></div>

              <div className="flex flex-col gap-8">
                {culturalSchedule.map((c, idx) => {
                  const isLeft = idx % 2 === 0;

                  const palettes = [
                    { grad: 'from-[#CA0000] to-rose-500', node: 'bg-[#CA0000]', ring: 'ring-red-300', badge: 'bg-red-50 text-[#CA0000] border-red-200', hoverBorder: 'hover:border-red-300', hoverShadow: 'hover:shadow-red-100', glyph: '♩' },
                    { grad: 'from-amber-500 to-orange-400', node: 'bg-amber-500', ring: 'ring-amber-300', badge: 'bg-amber-50 text-amber-700 border-amber-200', hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-amber-100', glyph: '♪' },
                    { grad: 'from-violet-600 to-purple-500', node: 'bg-violet-600', ring: 'ring-violet-300', badge: 'bg-violet-50 text-violet-700 border-violet-200', hoverBorder: 'hover:border-violet-300', hoverShadow: 'hover:shadow-violet-100', glyph: '♫' },
                    { grad: 'from-[#00732A] to-emerald-500', node: 'bg-[#00732A]', ring: 'ring-emerald-300', badge: 'bg-emerald-50 text-[#00732A] border-emerald-200', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100', glyph: '♬' },
                    { grad: 'from-sky-500 to-blue-400', node: 'bg-sky-500', ring: 'ring-sky-300', badge: 'bg-sky-50 text-sky-700 border-sky-200', hoverBorder: 'hover:border-sky-300', hoverShadow: 'hover:shadow-sky-100', glyph: '♩' },
                    { grad: 'from-pink-500 to-rose-400', node: 'bg-pink-500', ring: 'ring-pink-300', badge: 'bg-pink-50 text-pink-700 border-pink-200', hoverBorder: 'hover:border-pink-300', hoverShadow: 'hover:shadow-pink-100', glyph: '♪' },
                  ];
                  const p = palettes[idx % palettes.length];

                  const Card = (
                    <div className={`flex-1 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl ${p.hoverBorder} ${p.hoverShadow} hover:-translate-y-1 transition-all duration-300 overflow-hidden group`}>
                      <div className={`h-1.5 bg-gradient-to-r ${p.grad}`}></div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.badge}`}>{c.category}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                            {c.timeSlot || c.time}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#CA0000] transition-colors leading-snug mb-2">
                          {c.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{c.description}</p>
                        {c.performers && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Users className="w-3 h-3 text-[#00732A] shrink-0" />
                            <span className="line-clamp-1"><strong>পরিবেশনায়:</strong> {c.performers}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <div key={c.id || idx} className="relative flex items-center gap-0">
                      {isLeft ? (
                        <>
                          {/* LEFT card */}
                          <div className="flex-1 flex justify-end pr-5">
                            {Card}
                          </div>

                          {/* Center node */}
                          <div className="relative z-10 shrink-0 flex items-center justify-center" style={{ width: '2.5rem' }}>
                            <div className={`w-10 h-10 rounded-full ${p.node} text-white flex items-center justify-center text-base font-black shadow-lg ring-4 ring-white ${p.ring}`}>
                              {p.glyph}
                            </div>
                          </div>

                          {/* RIGHT spacer */}
                          <div className="flex-1 pl-5"></div>
                        </>
                      ) : (
                        <>
                          {/* LEFT spacer */}
                          <div className="flex-1 pr-5"></div>

                          {/* Center node */}
                          <div className="relative z-10 shrink-0 flex items-center justify-center" style={{ width: '2.5rem' }}>
                            <div className={`w-10 h-10 rounded-full ${p.node} text-white flex items-center justify-center text-base font-black shadow-lg ring-4 ring-white ${p.ring}`}>
                              {p.glyph}
                            </div>
                          </div>

                          {/* RIGHT card */}
                          <div className="flex-1 flex justify-start pl-5">
                            {Card}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom finale */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-0.5 h-6 bg-gradient-to-b from-rose-300 to-[#CA0000]"></div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#CA0000] to-rose-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg shadow-red-200 mt-1">
                <span className="text-base">🎶</span>
                সাংস্কৃতিক পর্ব সমাপ্ত — শুভ রাত্রি
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
