import React from 'react';
import {
  Bell,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  Printer,
  User,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Notice } from '../../shared/types';
import { formatDateBengali } from '../../shared/utils/formatters';

interface NoticeDetailPageProps {
  notice: Notice;
  onBack: () => void;
  allNotices?: Notice[];
  onSelectNotice?: (notice: Notice) => void;
}

export const NoticeDetailPage: React.FC<NoticeDetailPageProps> = ({
  notice,
  onBack,
  allNotices = [],
  onSelectNotice,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  // Filter other notices
  const relatedNotices = allNotices.filter((n) => n.id !== notice.id).slice(0, 3);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Back Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল নোটিশে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="নোটিশ লিংক কপি করুন"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>শেয়ার করুন</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Main Notice Article Paper */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Tag className="w-3 h-3" />
                <span>{notice.category}</span>
              </span>

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(notice.priority)}`}>
                অগ্রাধিকার: {notice.priority}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>প্রকাশের তারিখ: {formatDateBengali(notice.date)}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {notice.title}
            </h1>

            {notice.author && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 pt-1">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>বিজ্ঞপ্তি প্রদানকারী: <strong className="text-slate-800 font-semibold">{notice.author}</strong></span>
              </div>
            )}
          </div>

          {/* Highlight Short Overview */}
          {notice.shortDescription && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
              <p>{notice.shortDescription}</p>
            </div>
          )}

          {/* Notice Attached Image if any */}
          {notice.image && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm max-h-[500px]">
              <img
                src={notice.image}
                alt={notice.title}
                className="w-full h-full object-contain mx-auto max-h-[480px]"
              />
            </div>
          )}

          {/* Full Body Content */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line text-justify pt-2">
            {notice.description}
          </div>

          {/* Signature / Footer Banner */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/80 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 rounded-b-3xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00732A] text-white flex items-center justify-center font-bold">
                না
              </div>
              <div>
                <p className="font-bold text-slate-800">ত্রিশাল সরকারি নজরুল একাডেমি</p>
                <p className="text-[11px] text-slate-500">পুনর্মিলনী উদযাপন কমিটি ২০২৬</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-semibold text-slate-700">যোগাযোগ ও তথ্য সহায়তা</p>
              <p className="text-[11px] text-emerald-800 font-mono">nazrulacademy.trishal@gmail.com</p>
            </div>
          </div>
        </article>

        {/* Other Recent Notices */}
        {relatedNotices.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#CA0000]" />
              <span>অন্যান্য সাম্প্রতিক নোটিশসমূহ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedNotices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    if (onSelectNotice) onSelectNotice(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#00732A] hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-2">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{formatDateBengali(rel.date)}</span>
                    <span className="text-[#00732A] font-bold">বিস্তারিত →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
