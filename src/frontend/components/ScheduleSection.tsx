import React, { useState } from 'react';
import { Clock, Calendar, Music, Sparkles, Users, Leaf, TreePine, MapPin } from 'lucide-react';
import { ScheduleItem, CulturalItem } from '../../shared/types';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  culturalSchedule: CulturalItem[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string; hex: string }> = {
  'অভ্যর্থনা':   { bg: 'bg-sky-50',     text: 'text-sky-700',    border: 'border-sky-200',    dot: 'bg-sky-500',    hex: '#0ea5e9' },
  'প্রাতরাশ':    { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500',  hex: '#f59e0b' },
  'উদ্বোধন':     { bg: 'bg-emerald-50', text: 'text-[#00732A]',  border: 'border-emerald-200',dot: 'bg-[#00732A]',  hex: '#00732A' },
  'শোভাযাত্রা':  { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500', hex: '#7c3aed' },
  'সম্মাননা':    { bg: 'bg-rose-50',    text: 'text-[#CA0000]',  border: 'border-rose-200',   dot: 'bg-[#CA0000]',  hex: '#CA0000' },
  'স্মৃতিচারণ':  { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-500',   hex: '#0d9488' },
  'মধ্যাহ্নভোজ': { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', hex: '#ea580c' },
  'ছবি ও আড্ডা': { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-200',   dot: 'bg-pink-500',   hex: '#ec4899' },
};

const getCategory = (cat: string) =>
  categoryColors[cat] ?? { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400', hex: '#64748b' };

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedule, culturalSchedule }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'cultural'>('main');

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#F0FAF4] to-white border-b border-slate-100" id="schedule-section">
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes leaf-sway {
          0%, 100% { transform: rotate(-6deg); }
          50%       { transform: rotate(6deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,115,42,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(0,115,42,0); }
        }

        .sch-card-left  { animation: slideInLeft  0.5s ease both; }
        .sch-card-right { animation: slideInRight 0.5s ease both; }
        .sch-card-up    { animation: slideInUp   0.45s ease both; }
        .leaf-icon { animation: leaf-sway 3s ease-in-out infinite; transform-origin: bottom center; }
        .node-pulse { animation: pulse-dot 2s ease-in-out infinite; }

        /* Mobile: center line */
        .timeline-mobile { position: relative; }
        .timeline-mobile::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #00732A, #a7f3d0, #00732A);
          border-radius: 4px;
        }

        /* Desktop: center trunk */
        @media (min-width: 768px) {
          .timeline-mobile::before { display: none; }
        }
        .timeline-desktop::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #00732A, #a7f3d0, #00732A);
          border-radius: 4px;
        }

        .sch-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.12);
        }
        .sch-hover { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <TreePine className="w-3.5 h-3.5" />
            অনুষ্ঠানসূচি
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            কার্যক্রম ও <span className="text-[#00732A]">সময়সূচি</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            ২৬ মার্চ ২০২৬ · দিনব্যাপী বর্ণাঢ্য পুনর্মিলনী উৎসব ও সাংস্কৃতিক অনুষ্ঠান
          </p>
          <div className="flex justify-center mt-4 gap-1.5">
            <div className="h-[3px] w-10 rounded-full bg-[#00732A]"></div>
            <div className="h-[3px] w-4 rounded-full bg-[#FBBF24]"></div>
            <div className="h-[3px] w-10 rounded-full bg-[#CA0000]"></div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'main'
                  ? 'bg-[#00732A] text-white shadow-md shadow-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>মূল অনুষ্ঠানসূচি</span>
            </button>
            <button
              onClick={() => setActiveTab('cultural')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'cultural'
                  ? 'bg-[#CA0000] text-white shadow-md shadow-red-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">সাংস্কৃতিক ও বিনোদন পর্ব</span>
              <span className="sm:hidden">সাংস্কৃতিক পর্ব</span>
            </button>
          </div>
        </div>

        {/* ════════════ MAIN SCHEDULE ════════════ */}
        {activeTab === 'main' && (
          <div>
            {/* Root icon */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#00732A] flex items-center justify-center shadow-lg shadow-emerald-200 node-pulse">
                <TreePine className="w-7 h-7 text-white" />
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#00732A] to-emerald-200 mt-1"></div>
            </div>

            {/* ── MOBILE: Center timeline ── */}
            <div className="timeline-mobile md:hidden">
              <div className="flex flex-col gap-4">
                {schedule.map((item, idx) => {
                  const cat = getCategory(item.category);
                  return (
                    <div
                      key={item.id || idx}
                      className="sch-card-up flex flex-col items-center"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {/* Center node */}
                      <div className={`relative z-10 w-5 h-5 rounded-full border-4 border-white ${cat.dot} shadow-md ring-2 ring-emerald-200 mb-2`}></div>

                      {/* Card */}
                      <div
                        className={`sch-hover w-full bg-white rounded-2xl overflow-hidden shadow-sm border ${cat.border}`}
                      >
                        <div className="h-1 w-full" style={{ backgroundColor: cat.hex }}></div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-6 h-6 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                                <Clock className={`w-3.5 h-3.5 ${cat.text}`} />
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-800 leading-none">{item.startTime}</div>
                                <div className="text-[9px] text-slate-400 leading-none mt-0.5">→ {item.endTime}</div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── DESKTOP: Dual column zigzag timeline ── */}
            <div className="hidden md:block">
              <div className="relative timeline-desktop">
                <div className="flex flex-col gap-8">
                  {schedule.map((item, idx) => {
                    const isLeft = idx % 2 === 0;
                    const cat = getCategory(item.category);

                    const Card = (
                      <div
                        className={`sch-hover flex-1 rounded-2xl border ${cat.border} bg-white shadow-sm overflow-hidden`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className={`h-1 w-full`} style={{ backgroundColor: cat.hex }}></div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
                              <Clock className={`w-4 h-4 ${cat.text}`} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-800">{item.startTime}</div>
                              <div className="text-[10px] text-slate-400">থেকে {item.endTime}</div>
                            </div>
                            <span className={`ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{item.shortDescription}</p>
                        </div>
                      </div>
                    );

                    return (
                      <div
                        key={item.id || idx}
                        className={`relative flex items-center ${isLeft ? 'sch-card-left' : 'sch-card-right'}`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {isLeft ? (
                          <>
                            <div className="flex-1 flex justify-end pr-6">{Card}</div>
                            <div className="relative z-10 shrink-0 flex items-center justify-center w-8">
                              <div className={`w-5 h-5 rounded-full border-4 border-white ${cat.dot} shadow-md ring-2 ring-emerald-200`}></div>
                            </div>
                            <div className="flex-1 pl-6"></div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 pr-6"></div>
                            <div className="relative z-10 shrink-0 flex items-center justify-center w-8">
                              <div className={`w-5 h-5 rounded-full border-4 border-white ${cat.dot} shadow-md ring-2 ring-emerald-200`}></div>
                            </div>
                            <div className="flex-1 flex justify-start pl-6">{Card}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom finish */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-200 to-[#00732A]"></div>
              <div className="flex items-center gap-2 bg-[#00732A] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-200 mt-1">
                <Leaf className="w-3.5 h-3.5 leaf-icon" />
                পুনর্মিলনী উৎসব ২০২৬ সমাপ্ত
              </div>
            </div>
          </div>
        )}

        {/* ════════════ CULTURAL SCHEDULE ════════════ */}
        {activeTab === 'cultural' && (
          <div>
            {/* Banner */}
            <div className="bg-gradient-to-r from-red-50 via-amber-50 to-rose-50 p-4 sm:p-5 rounded-3xl border border-red-200/80 flex items-start gap-3 mb-10">
              <Sparkles className="w-5 h-5 text-[#CA0000] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                বিকেলের মনোজ্ঞ সাংস্কৃতিক পর্বে নজরুল সংগীত, দেশাত্মবোধক গান, নাটিকা ও বিশেষ স্মৃতিচারণ অনুষ্ঠিত হবে।
              </p>
            </div>

            {/* Music note top */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#CA0000] to-rose-700 flex items-center justify-center shadow-xl shadow-red-200 text-white text-2xl font-black">
                ♪
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#CA0000] to-rose-200 mt-1"></div>
            </div>

            {/* Palettes */}
            {(() => {
              const palettes = [
                { grad: 'from-[#CA0000] to-rose-500', node: 'bg-[#CA0000]', ring: 'ring-red-300',     badge: 'bg-red-50 text-[#CA0000] border-red-200',       hex: '#CA0000', glyph: '♩' },
                { grad: 'from-amber-500 to-orange-400', node: 'bg-amber-500', ring: 'ring-amber-300', badge: 'bg-amber-50 text-amber-700 border-amber-200',     hex: '#f59e0b', glyph: '♪' },
                { grad: 'from-violet-600 to-purple-500', node: 'bg-violet-600', ring: 'ring-violet-300', badge: 'bg-violet-50 text-violet-700 border-violet-200', hex: '#7c3aed', glyph: '♫' },
                { grad: 'from-[#00732A] to-emerald-500', node: 'bg-[#00732A]', ring: 'ring-emerald-300', badge: 'bg-emerald-50 text-[#00732A] border-emerald-200', hex: '#00732A', glyph: '♬' },
                { grad: 'from-sky-500 to-blue-400', node: 'bg-sky-500', ring: 'ring-sky-300',         badge: 'bg-sky-50 text-sky-700 border-sky-200',           hex: '#0ea5e9', glyph: '♩' },
                { grad: 'from-pink-500 to-rose-400', node: 'bg-pink-500', ring: 'ring-pink-300',       badge: 'bg-pink-50 text-pink-700 border-pink-200',         hex: '#ec4899', glyph: '♪' },
              ];

              return (
                <>
                  {/* ── MOBILE: center-column ── */}
                  <div className="md:hidden">
                    <div className="relative">
                      {/* Center trunk line */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CA0000] via-rose-300 to-[#CA0000] -translate-x-1/2 z-0"></div>

                      <div className="flex flex-col gap-4">
                        {culturalSchedule.map((c, idx) => {
                          const p = palettes[idx % palettes.length];
                          return (
                            <div
                              key={c.id || idx}
                              className="sch-card-up flex flex-col items-center"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              {/* Center node */}
                              <div
                                className={`relative z-10 w-10 h-10 rounded-full ${p.node} text-white flex items-center justify-center text-base font-black shadow-lg ring-4 ring-white mb-2`}
                              >
                                {p.glyph}
                              </div>

                              {/* Card */}
                              <div className={`sch-hover w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100`}>
                                <div className={`h-1 bg-gradient-to-r ${p.grad}`}></div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.badge}`}>{c.category}</span>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                                      {c.timeSlot || c.time}
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug mb-1.5">{c.title}</h3>
                                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{c.description}</p>
                                  {c.performers && (
                                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                                      <Users className="w-3 h-3 text-[#00732A] shrink-0" />
                                      <span className="line-clamp-1"><strong>পরিবেশনায়:</strong> {c.performers}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── DESKTOP: dual-column ── */}
                  <div className="hidden md:block">
                    <div className="relative">
                      {/* Center trunk */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CA0000] via-rose-300 to-[#CA0000] -translate-x-1/2 z-0"></div>

                      <div className="flex flex-col gap-8">
                        {culturalSchedule.map((c, idx) => {
                          const isLeft = idx % 2 === 0;
                          const p = palettes[idx % palettes.length];

                          const Card = (
                            <div className={`sch-hover flex-1 rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden`}>
                              <div className={`h-1.5 bg-gradient-to-r ${p.grad}`}></div>
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.badge}`}>{c.category}</span>
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                                    {c.timeSlot || c.time}
                                  </span>
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-900 leading-snug mb-2">{c.title}</h3>
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
                            <div
                              key={c.id || idx}
                              className={`relative flex items-center ${isLeft ? 'sch-card-left' : 'sch-card-right'}`}
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              {isLeft ? (
                                <>
                                  <div className="flex-1 flex justify-end pr-5">{Card}</div>
                                  <div className="relative z-10 shrink-0 flex items-center justify-center w-10">
                                    <div className={`w-10 h-10 rounded-full ${p.node} text-white flex items-center justify-center text-base font-black shadow-lg ring-4 ring-white ${p.ring}`}>
                                      {p.glyph}
                                    </div>
                                  </div>
                                  <div className="flex-1 pl-5"></div>
                                </>
                              ) : (
                                <>
                                  <div className="flex-1 pr-5"></div>
                                  <div className="relative z-10 shrink-0 flex items-center justify-center w-10">
                                    <div className={`w-10 h-10 rounded-full ${p.node} text-white flex items-center justify-center text-base font-black shadow-lg ring-4 ring-white ${p.ring}`}>
                                      {p.glyph}
                                    </div>
                                  </div>
                                  <div className="flex-1 flex justify-start pl-5">{Card}</div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Bottom finale */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-0.5 h-6 bg-gradient-to-b from-rose-300 to-[#CA0000]"></div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#CA0000] to-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-red-200 mt-1">
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
