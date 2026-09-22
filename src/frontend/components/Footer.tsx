import React from 'react';
import { Phone, Mail, MapPin, Facebook, Youtube, Heart, UserPlus, HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { GlobalConfig } from '../../shared/types';
import jronixLogo from '../../assets/image.png';

interface FooterProps {
  globalConfig: GlobalConfig;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ globalConfig, onNavigate }) => {
  return (
    <footer className="bg-[#052317] text-white">
      {/* Top Banner Section */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-[#FBBF24] text-[#052317] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          সময় দ্রুত ফুরিয়ে আসছে!
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          আপনি কি {globalConfig.eventName}-এ আপনার আসন নিশ্চিত করেছেন?
        </h2>
        
        <p className="text-emerald-100 text-sm md:text-base mb-10 max-w-2xl mx-auto">
          অনলাইন রেজিস্ট্রেশনের মাধ্যমে আপনার আইডি কার্ড, কিট ব্যাগ, খাবার টোকেন ও স্মারক সংকলন সংগ্রহ নিশ্চিত করুন।
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#FBBF24] hover:bg-yellow-500 text-[#052317] font-bold transition-all w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-5 h-5" />
            এখনই নিবন্ধন করুন
          </button>
          

        </div>
      </div>

      {/* Red Divider Line */}
      <div className="h-0.5 bg-gradient-to-r from-red-600 via-red-600 to-transparent"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FBBF24] flex items-center justify-center text-[#052317]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" opacity="0" />
                  <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" opacity="0"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8s-3.582-8-8-8s-8 3.582-8 8Z" opacity="0"/>
                  <path d="M11 6C11 6 7 11 7 15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15C17 11 13 6 13 6" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">নজরুল একাডেমি পুনর্মিলনী</h3>
            </div>
            
            <p className="text-sm text-emerald-100/70 leading-relaxed text-justify">
              জাতীয় কবি কাজী নজরুল ইসলামের অমূল্য স্মৃতিধন্য শতবর্ষী বিদ্যাপীঠ ত্রিশাল সরকারি নজরুল একাডেমির সর্বস্তরের প্রাক্তন শিক্ষার্থীদের মহামিলন মেলা ২০২৬।
            </p>
            
            <div className="flex items-center gap-3">
              <a href={globalConfig.facebookUrl || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#0a3826] flex items-center justify-center text-emerald-100 hover:bg-[#0f4d35] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={globalConfig.youtubeUrl || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#0a3826] flex items-center justify-center text-emerald-100 hover:bg-[#0f4d35] transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#0a3826] flex items-center justify-center text-emerald-100 hover:bg-[#0f4d35] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[#FBBF24]">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-sm text-emerald-100/80 hover:text-white transition-colors group">
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  শুভেচ্ছা বাণী
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('alumni')} className="flex items-center gap-2 text-sm text-emerald-100/80 hover:text-white transition-colors group">
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  প্রাক্তন শিক্ষার্থী তালিকা
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('activities')} className="flex items-center gap-2 text-sm text-emerald-100/80 hover:text-white transition-colors group">
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  উৎসবের কর্মসূচি
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-sm text-emerald-100/80 hover:text-white transition-colors group">
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  সর্বশেষ নোটিশ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('magazine')} className="flex items-center gap-2 text-sm text-emerald-100/80 hover:text-white transition-colors group">
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                  শতবর্ষ স্মারক সংকলন
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[#FBBF24]">যোগাযোগের ঠিকানা</h4>
            <div className="space-y-4 text-sm text-emerald-100/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>ত্রিশাল সরকারি নজরুল একাডেমি প্রাঙ্গণ, ত্রিশাল,<br/>ময়মনসিংহ-২২২০, বাংলাদেশ</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>{globalConfig.contactPhone1 || '+৮৮০ ১৭০০-০০০০০০'}</span>
                  <span>{globalConfig.contactPhone2 || '+৮৮০ ১৮০০-০০০০০০'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <span>{globalConfig.contactEmail || 'info@nazrulacademy-reunion.org'}</span>
              </div>
            </div>
          </div>


          
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 text-xs text-emerald-100/60">
            
            {/* Left side: Copyright & Organizer */}
            <div className="flex flex-col items-center md:items-start gap-2.5 text-center md:text-left">
              <p className="leading-relaxed">© ২০২৬ নজরুল একাডেমি অ্যালামনাই পূর্ণ মিলন উদযাপন কমিটি।<br className="hidden sm:block md:hidden" /> সর্বস্বত্ব সংরক্ষিত।</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-1.5 gap-y-1">
                <span>উদ্যোগে ও বাস্তবায়নে:</span>
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
                <span className="font-medium text-emerald-100/80">নজরুল একাডেমি অ্যালামনাই পূর্ণ মিলন উদযাপন কমিটি</span>
              </div>
            </div>

            {/* Right side: Credits Section */}
            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t border-emerald-900/30 md:border-t-0">
              
              {/* Developer */}
              <div className="flex flex-col items-center md:items-end gap-1.5">
                <div className="flex flex-col md:flex-row items-center gap-1.5 text-xs">
                  <span className="text-emerald-100/80 mb-1 md:mb-0">Developed by:</span>
                  <div className="flex flex-wrap justify-center items-center gap-1.5">
                    <span className="text-white font-bold tracking-wide">Tarek Newas</span>
                    <span className="text-emerald-100/40 text-[10px]">&amp;</span>
                    <a 
                      href="https://ranasheikh64.github.io/jronix-software-solutions/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-white hover:text-[#FBBF24] transition-all font-bold tracking-wide group"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-700/50 group-hover:border-[#FBBF24]/50 group-hover:scale-110 transition-all shadow-sm shrink-0 bg-[#052317]">
                        <img 
                          src={jronixLogo} 
                          alt="Jronix" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="border-b border-transparent group-hover:border-[#FBBF24]/50 pb-0.5">Jronix-Software Solutions</span>
                    </a>
                  </div>
                </div>
                <span className="text-[10px] text-[#FBBF24]/80 italic mt-1 md:mt-0.5 tracking-wider font-medium">If you need any website, feel free to contact us!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

