import React, { useState } from 'react';
import { BookOpen, Download, User, Calendar, FileText, X, Sparkles, Send } from 'lucide-react';
import { MagazineArticle } from '../types';
import { formatDateBengali } from '../utils/formatters';

interface MagazineSectionProps {
  articles: MagazineArticle[];
}

export const MagazineSection: React.FC<MagazineSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/70" id="magazine-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            স্মৃতির পাতা
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            পুনর্মিলনী স্মারক ম্যাগাজিন
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            নজরুল একাডেমি প্রাঙ্গণের শতবর্ষের ইতিহাস, স্মৃতি ও অনুভূতির সংকলন
          </p>
        </div>

        {/* Featured Souvenir Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#00732A] rounded-3xl p-6 sm:p-10 text-white mb-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
          {/* Magazine Cover Preview */}
          <div className="relative w-48 sm:w-56 shrink-0 aspect-3/4 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 transform md:-rotate-2 hover:rotate-0 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
              alt="স্মারক ম্যাগাজিন প্রচ্ছদ"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-xs font-bold text-amber-300">পুনর্মিলনী স্মারক ২০২৬</span>
              <span className="text-[11px] text-slate-300">ত্রিশাল সরকারি নজরুল একাডেমি</span>
            </div>
          </div>

          {/* Description & Download Action */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>বিশেষ শতবর্ষ সংস্করণ</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white">
              স্মৃতির মিনার: শতবর্ষের স্মৃতি ও সাহিত্য সংকলন
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              এই স্মারক গ্রন্থে অন্তর্ভুক্ত রয়েছে বিদ্যালয়ের ইতিহাস, শ্রদ্ধেয় শিক্ষকদের স্মৃতিচারণ, প্রাক্তন ও বর্তমান শিক্ষার্থীদের লেখা মূল্যবান প্রবন্ধ, কবিতা, এবং দুর্লভ ঐতিহাসিক আলোকচিত্র।
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={() => alert('ম্যাগাজিনটি প্রকাশের কাজ চলছে। উৎসবের দিন ডিজিটাল পিডিএফ সংস্করণ উন্মুক্ত করা হবে।')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>পিডিএফ ডাউনলোড (ডিজিটাল কপি)</span>
              </button>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>আপনার লেখা জমা দিন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Articles Grid */}
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#00732A]" />
          <span>স্মৃতিকথা ও নির্বাচিত প্রবন্ধসমূহ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#00732A]/50 transition-all cursor-pointer flex flex-col group"
            >
              {art.coverImage && (
                <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDateBengali(art.date)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#CA0000] transition-colors leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{art.author}</span>
                    <span className="text-slate-400">({art.authorBatch})</span>
                  </div>
                  <span className="text-[#00732A] font-bold">পড়ুন →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
              {selectedArticle.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-800">লেখক: {selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.authorBatch}</span>
              <span>•</span>
              <span>{formatDateBengali(selectedArticle.date)}</span>
            </div>

            {selectedArticle.coverImage && (
              <div className="my-4 rounded-xl overflow-hidden max-h-64">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-justify">
              <p className="font-semibold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                "{selectedArticle.summary}"
              </p>
              <p>{selectedArticle.content}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
            <button
              onClick={() => {
                setShowSubmitModal(false);
                setSubmitSuccess(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
              স্মারক ম্যাগাজিনের জন্য লেখা জমা দিন
            </h3>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00732A] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">লেখাটি সফলভাবে জমা হয়েছে!</h4>
                <p className="text-xs text-slate-600">
                  সম্পাদনা পর্ষদ লেখাটি পর্যালোচনা করে স্মারক গ্রন্থে প্রকাশের বিষয়ে সিদ্ধান্ত গ্রহণ করবে।
                </p>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitSuccess(false);
                  }}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#00732A] text-white text-xs font-bold"
                >
                  ধন্যবাদ
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitSuccess(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">লেখকের নাম *</label>
                  <input
                    required
                    type="text"
                    placeholder="আপনার নাম লিখুন"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ *</label>
                    <input
                      required
                      type="text"
                      placeholder="যেমন: ব্যাচ ২০০০"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      required
                      type="text"
                      placeholder="০১৭১২-৩৪৫৬৭৮"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">লেখার শিরোনাম *</label>
                  <input
                    required
                    type="text"
                    placeholder="শিরোনাম লিখুন"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">লেখার বিবরণ / স্মৃতিচারণ *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="আপনার লেখা এখানে লিখুন..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>জমা দিন</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
