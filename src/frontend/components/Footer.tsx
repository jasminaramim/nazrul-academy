import React from 'react';
import { Phone, Mail, MapPin, Facebook, Youtube, Heart, ExternalLink } from 'lucide-react';
import { GlobalConfig } from '../../shared/types';

interface FooterProps {
  globalConfig: GlobalConfig;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ globalConfig, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      {/* Top Banner */}
      <div className="bg-[#00732A] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-white">ত্রিশাল সরকারি নজরুল একাডেমি পুনর্মিলনী উৎসব ২০২৬</h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              ঐতিহ্যের শতবর্ষ পেরিয়ে প্রাণের প্রাঙ্গণে মিলনমেলা
            </p>
          </div>
          <button
            onClick={() => onNavigate('register')}
            className="px-6 py-2.5 rounded-xl bg-[#CA0000] hover:bg-[#a80000] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            এখনই নিবন্ধন করুন
          </button>
        </div>
      </div>

      {/* Main Footer Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About School */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {globalConfig.logoUrl ? (
                <img src={globalConfig.logoUrl} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#00732A] flex items-center justify-center font-bold text-white border border-[#CA0000]">
                  না
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-white">{globalConfig.siteTitle}</h4>
                <p className="text-[11px] text-slate-400">স্থাপিত: ১৯১৩ খ্রিষ্টাব্দ</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              জাতীয় কবি কাজী নজরুল ইসলামের স্মৃতিবিজড়িত ময়মনসিংহের ত্রিশালের ঐতিহাসিক বিদ্যাপীঠ। শতবর্ষী ঐতিহ্য ও গৌরবে ভাস্বর আমাদের প্রাণের নজরুল একাডেমি।
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-l-2 border-[#00732A] pl-2">
              প্রয়োজনীয় লিংকসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  অনলাইন রেজিস্ট্রেশন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alumni')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  প্রাক্তন ছাত্র/ছাত্রীদের তালিকা
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('activities')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  অনুষ্ঠানসূচি ও কার্যক্রম
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('magazine')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  স্মৃতির পাতা ম্যাগাজিন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  ছবি ও ভিডিও গ্যালারি
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact info (User request) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-l-2 border-[#CA0000] pl-2">
              যোগাযোগের তথ্য
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#CA0000] shrink-0 mt-0.5" />
                <span>{globalConfig.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00732A] shrink-0" />
                <span>{globalConfig.contactPhone1}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00732A] shrink-0" />
                <span>{globalConfig.contactPhone2}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{globalConfig.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Social links & Wikipedia info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-l-2 border-amber-400 pl-2">
              সোশ্যাল মিডিয়া ও তথ্য
            </h4>
            <p className="text-xs text-slate-300">
              আমাদের ফেসবুক পেজ ও ইউটিউব চ্যানেলে যুক্ত থাকুন সর্বশেষ আপডেটের জন্য।
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={globalConfig.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 flex items-center justify-center text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={globalConfig.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/50 flex items-center justify-center text-white transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <a
                href="https://bn.wikipedia.org/wiki/%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%B6%E0%A6%BE%E0%A6%B2_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%A8%E0%A6%9C%E0%A6%B0%E0%A7%81%E0%A6%B2_%E0%A6%8F%E0%A6%95%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%AE%E0%A6%BF"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 hover:underline"
              >
                <span>উইকিপিডিয়াতে স্কুলের ইতিহাস পড়ুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© ২০২৬ {globalConfig.siteTitle}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="flex items-center gap-1">
              <span>ভালোবাসা ও শ্রদ্ধায় নির্মিত</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>ত্রিশাল নজরুল একাডেমি অ্যালামনাই</span>
            </p>
            <p className="font-semibold text-emerald-400">
              ডিজাইন এবং ডেভেলপমেন্টে জেসমিন+রানা
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
