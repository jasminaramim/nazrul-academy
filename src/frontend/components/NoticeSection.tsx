import React, { useState } from 'react';
import { Bell, Calendar, Tag, ArrowRight, X, User, ChevronRight, Megaphone, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { Notice } from '../../shared/types';
import { formatDateBengali } from '../../shared/utils/formatters';

interface NoticeSectionProps {
  notices: Notice[];
  showAll?: boolean;
  onSelectNotice?: (notice: Notice) => void;
}

export const NoticeSection: React.FC<NoticeSectionProps> = ({
  notices,
  showAll = false,
  onSelectNotice,
}) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  const handleNoticeClick = (notice: Notice) => {
    if (onSelectNotice) {
      onSelectNotice(notice);
    } else {
      setSelectedNotice(notice);
    }
  };

  const displayList = showAll ? notices : notices.slice(0, 4);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'জরুরি':
        return {
          badge: 'bg-red-100 text-[#CA0000] border-red-200',
          dot: 'bg-[#CA0000]',
          icon: <AlertTriangle className="w-3 h-3" />,
          glow: 'hover:shadow-red-100',
          topBar: 'from-[#CA0000] to-rose-400',
          animate: true,
        };
      case 'উচ্চ':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: <Megaphone className="w-3 h-3" />,
          glow: 'hover:shadow-amber-100',
          topBar: 'from-amber-500 to-amber-400',
          animate: false,
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-[#00732A]',
          icon: <Info className="w-3 h-3" />,
          glow: 'hover:shadow-emerald-100',
          topBar: 'from-[#00732A] to-emerald-400',
          animate: false,
        };
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100" id="notices-section">
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .pulse-dot { animation: pulse-dot 1.4s ease-in-out infinite; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notice-card { animation: slide-up 0.4s ease-out both; }
        .notice-card:nth-child(1) { animation-delay: 0.05s; }
        .notice-card:nth-child(2) { animation-delay: 0.10s; }
        .notice-card:nth-child(3) { animation-delay: 0.15s; }
        .notice-card:nth-child(4) { animation-delay: 0.20s; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-[#CA0000] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <Bell className="w-3.5 h-3.5" />
            নোটিশ বোর্ড
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            সর্বশেষ <span className="text-[#CA0000]">নোটিশ</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            পুনর্মিলনী সংক্রান্ত সকল গুরুত্বপূর্ণ তথ্য এবং আপডেট
          </p>
          <div className="flex justify-center mt-4 gap-1">
            <div className="h-1 w-8 rounded-full bg-[#00732A]"></div>
            <div className="h-1 w-3 rounded-full bg-[#FBBF24]"></div>
            <div className="h-1 w-8 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>

        {/* Notice Cards Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">কোনো নোটিশ পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayList.map((notice, idx) => {
              const pConfig = getPriorityConfig(notice.priority);
              return (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice)}
                  className={`notice-card group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl ${pConfig.glow} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col`}
                >
                  {/* Animated top gradient bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${pConfig.topBar} transition-all duration-300 group-hover:h-1.5`}></div>

                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>

                  <div className="p-7 flex flex-col flex-1 relative">
                    {/* Badges row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <Tag className="w-3 h-3" />
                        {notice.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${pConfig.badge}`}>
                          {pConfig.icon}
                          <span>{notice.priority}</span>
                          {pConfig.animate && <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot} pulse-dot ml-0.5`}></span>}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateBengali(notice.date)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#00732A] transition-colors leading-snug mb-3">
                      {notice.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
                      {notice.shortDescription}
                    </p>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00732A] group-hover:text-[#CA0000] transition-colors">
                        <span>বিস্তারিত পড়ুন</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                      {notice.author && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <User className="w-3 h-3" />
                          {notice.author}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* "সব নোটিশ দেখুন" Button */}
        {!showAll && notices.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#CA0000] to-rose-600 hover:from-rose-700 hover:to-[#CA0000] shadow-md shadow-red-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>সকল নোটিশ দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ─────────── Single Notice Detail Modal ─────────── */}
      {selectedNotice && (() => {
        const pConfig = getPriorityConfig(selectedNotice.priority);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">

              {/* Modal Top Banner */}
              <div className={`h-2 w-full bg-gradient-to-r ${pConfig.topBar} rounded-t-3xl`}></div>

              <div className="p-7 sm:p-9">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-5 flex-wrap pr-8">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <Tag className="w-3 h-3" />
                    {selectedNotice.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${pConfig.badge}`}>
                    {pConfig.icon}
                    অগ্রাধিকার: {selectedNotice.priority}
                    {pConfig.animate && <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot} pulse-dot ml-0.5`}></span>}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-4">
                  {selectedNotice.title}
                </h3>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5 pb-5 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDateBengali(selectedNotice.date)}
                  </span>
                  {selectedNotice.author && (
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {selectedNotice.author}
                    </span>
                  )}
                </div>

                {/* Image */}
                {selectedNotice.image && (
                  <div className="mb-5 rounded-2xl overflow-hidden border border-slate-200 max-h-52">
                    <img
                      src={selectedNotice.image}
                      alt={selectedNotice.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Short Description Highlight */}
                <div className={`flex gap-3 bg-gradient-to-r from-emerald-50 to-transparent border-l-4 border-[#00732A] p-4 rounded-r-2xl mb-5`}>
                  <Sparkles className="w-4 h-4 text-[#00732A] shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {selectedNotice.shortDescription}
                  </p>
                </div>

                {/* Full Description */}
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                  {selectedNotice.description}
                </div>

                {/* Modal Footer */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" />
                    নজরুল একাডেমি পুনর্মিলনী ২০২৬
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────── All Notices Modal ─────────── */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="h-2 w-full bg-gradient-to-r from-[#CA0000] via-amber-400 to-[#00732A] rounded-t-3xl"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#CA0000]" />
                    সকল নোটিশ ও বিজ্ঞপ্তি
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">মোট {notices.length}টি নোটিশ</p>
                </div>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {notices.map((n) => {
                  const pc = getPriorityConfig(n.priority);
                  return (
                    <div
                      key={n.id}
                      onClick={() => { setShowAllModal(false); setSelectedNotice(n); }}
                      className={`group p-4 rounded-2xl border border-slate-200 hover:border-[#00732A]/50 hover:bg-emerald-50/20 hover:shadow-md ${pc.glow} cursor-pointer transition-all duration-200 flex items-center justify-between gap-3`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${pc.dot} mt-2 shrink-0 ${pc.animate ? 'pulse-dot' : ''}`}></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[11px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {n.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pc.badge}`}>
                              {n.priority}
                            </span>
                            <span className="text-xs text-slate-400">{formatDateBengali(n.date)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#00732A] transition-colors truncate">{n.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.shortDescription}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00732A] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
