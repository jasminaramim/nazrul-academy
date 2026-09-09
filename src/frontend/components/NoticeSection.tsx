import React, { useState } from 'react';
import { Bell, Calendar, Tag, AlertCircle, ArrowRight, X, User } from 'lucide-react';
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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'জরুরি':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'উচ্চ':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/70" id="notices-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#CA0000] uppercase bg-red-50 px-3 py-1 rounded-full border border-red-200">
            নোটিশ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            সর্বশেষ নোটিশ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            পুনর্মিলনী সংক্রান্ত সকল গুরুত্বপূর্ণ তথ্য এবং আপডেট
          </p>
        </div>

        {/* Notice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((notice) => (
            <div
              key={notice.id}
              onClick={() => handleNoticeClick(notice)}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#00732A]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Tag className="w-3 h-3" />
                    <span>{notice.category}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateBengali(notice.date)}</span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#CA0000] transition-colors leading-snug">
                  {notice.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {notice.shortDescription}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00732A] group-hover:text-[#CA0000]">
                <span>কার্ড দেখুন →</span>
                {notice.author && <span className="text-slate-400 font-normal">{notice.author}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* "সব নোটিশ দেখুন" Button */}
        {!showAll && notices.length > 4 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAllModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <span>সব নোটিশ দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Single Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedNotice.category}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(selectedNotice.priority)}`}>
                অগ্রাধিকার: {selectedNotice.priority}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {selectedNotice.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>তারিখ: {formatDateBengali(selectedNotice.date)}</span>
              </span>
              {selectedNotice.author && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>প্রকাশক: {selectedNotice.author}</span>
                </span>
              )}
            </div>

            {selectedNotice.image && (
              <div className="my-4 rounded-xl overflow-hidden border border-slate-200 max-h-60">
                <img
                  src={selectedNotice.image}
                  alt={selectedNotice.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed space-y-3 whitespace-pre-line text-justify">
              <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedNotice.shortDescription}
              </p>
              <p>{selectedNotice.description}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Notices Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#CA0000]" />
                <span>সকল নোটিশ ও বিজ্ঞপ্তি</span>
              </h3>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {notices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setShowAllModal(false);
                    setSelectedNotice(n);
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#00732A] hover:bg-emerald-50/20 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {n.category}
                      </span>
                      <span className="text-xs text-slate-400">{formatDateBengali(n.date)}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.shortDescription}</p>
                  </div>
                  <button className="text-xs font-bold text-[#00732A] hover:text-[#CA0000] shrink-0 self-end sm:self-center">
                    বিস্তারিত →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
