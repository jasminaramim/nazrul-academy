import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, BookOpen, ChevronDown, Heart, UserPlus, Search } from 'lucide-react';
import { GlobalConfig } from '../../shared/types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  globalConfig: GlobalConfig;
  onOpenDonationModal?: () => void;
  onOpenStatusModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, globalConfig, onOpenDonationModal, onOpenStatusModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'register', label: 'নিবন্ধন' },
    { id: 'alumni', label: 'প্রাক্তন ছাত্র/ছাত্রী' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'activities', label: 'কার্যক্রম' },
    { id: 'magazine', label: 'স্মৃতির পাতা' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDonationClick = () => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('donations-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById('donations-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/60 backdrop-blur-2xl shadow-lg border-white/30' : 'bg-white/95 backdrop-blur-sm shadow-sm border-slate-200/60'}`}>
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] text-white py-1.5 px-4">
        {/* Desktop View */}
        <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between text-[11px] font-medium">
          <span className="flex items-center gap-2 shrink-0">
            <span className="w-1 h-1 rounded-full bg-amber-300 animate-pulse"></span>
            ঐতিহ্যের শতবর্ষ: ১৯১৩ সালে স্থাপিত জাতীয় কবির পদধন্য বিদ্যাপীঠ
          </span>
          <span className="flex-1 min-w-0 text-right font-semibold tracking-wide truncate px-4">
            ত্রিশাল সরকারি নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন
          </span>
          <span className="flex items-center gap-1.5 font-mono shrink-0">
            <span className="text-amber-300">📞</span>
            {globalConfig.contactPhone1}
          </span>
        </div>

        {/* Mobile View (Marquee) */}
        <div className="sm:hidden text-[11px] font-medium flex items-center overflow-hidden">
          {/* @ts-ignore */}
          <marquee scrollamount="4" className="w-full flex items-center">
            <div className="flex items-center gap-6">
              <span>ঐতিহ্যের শতবর্ষ: ১৯১৩ সালে স্থাপিত জাতীয় কবির পদধন্য বিদ্যাপীঠ</span>
              <span className="font-semibold text-amber-200">ত্রিশাল সরকারি নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন</span>
              <span className="font-mono">📞 {globalConfig.contactPhone1}</span>
            </div>
          {/* @ts-ignore */}
          </marquee>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">

          {/* Logo & School Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer min-w-0 shrink flex-1 md:flex-none"
          >
            <div className="relative shrink-0">
              {globalConfig.logoUrl ? (
                <img
                  src={globalConfig.logoUrl}
                  alt="ত্রিশাল সরকারি নজরুল একাডেমি"
                  className="w-10 h-10 sm:w-12 sm:h-14 object-contain transition-transform group-hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00732A] text-white flex items-center justify-center font-bold text-lg border-2 border-[#CA0000]">
                  না
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-[#00732A] transition-colors duration-200 truncate sm:whitespace-normal">
                {globalConfig.siteTitle}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 leading-tight truncate sm:whitespace-normal">
                {globalConfig.siteSubtitle}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#00732A]'
                      : 'text-slate-700 hover:text-[#00732A]'
                  }`}
                >
                  {item.label}
                  {/* Active underline */}
                  <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[#00732A] transition-all duration-300 ${isActive ? 'w-[calc(100%-2rem)]' : 'w-0'}`}></span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons — desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ml-2">
            {/* স্ট্যাটাস চেক CTA */}
            <button
              onClick={onOpenStatusModal}
              title="অ্যাপ্লিকেশন স্ট্যাটাস চেক করুন"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">স্ট্যাটাস চেক</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bottom colored border accent */}
      <div className="h-0.5 bg-gradient-to-r from-[#00732A] via-amber-400 to-[#CA0000]"></div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 pt-4 pb-6 space-y-1.5 shadow-xl">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-[#00732A] font-bold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#00732A]"></span>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenStatusModal) onOpenStatusModal();
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-500" />
              অ্যাপ্লিকেশন স্ট্যাটাস চেক
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
