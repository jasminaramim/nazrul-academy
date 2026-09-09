import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, ShieldCheck, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { GlobalConfig } from '../../shared/types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  globalConfig: GlobalConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, globalConfig }) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'register', label: 'নিবন্ধন' },
    { id: 'alumni', label: 'প্রাক্তন ছাত্র/ছাত্রী' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'activities', label: 'কার্যক্রম' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] text-white text-xs py-1 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="hidden sm:inline">ঐতিহ্যের শতবর্ষ: ১৯১৩ সালে স্থাপিত জাতীয় কবির পদধন্য বিদ্যাপীঠ</span>
          <span className="mx-auto sm:mx-0">ত্রিশাল সরকারি নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন</span>
          <span className="hidden sm:inline font-mono">হেল্পলাইন: {globalConfig.contactPhone1}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative w-12 h-14 shrink-0 flex items-center justify-center">
              {globalConfig.logoUrl ? (
                <img
                  src={globalConfig.logoUrl}
                  alt="ত্রিশাল সরকারি নজরুল একাডেমি"
                  className="w-12 h-14 object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#00732A] text-white flex items-center justify-center font-bold text-lg border-2 border-[#CA0000] shadow-sm">
                  না
                </div>
              )}
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#CA0000] transition-colors">
                {globalConfig.siteTitle}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {globalConfig.siteSubtitle}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#00732A]/10 text-[#00732A] font-bold shadow-xs'
                      : 'text-slate-700 hover:text-[#CA0000] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Special Smritir Pata CTA */}
            <button
              onClick={() => handleNavClick('magazine')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>স্মৃতির পাতা</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-2xs transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>অ্যাডমিন ড্যাশবোর্ড</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <button
                    onClick={logout}
                    title="লগআউট"
                    className="p-2 text-slate-500 hover:text-[#CA0000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#CA0000] hover:bg-[#a80000] shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('login')}
              className="px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#CA0000]"
            >
              {user ? 'প্রোফাইল' : 'লগইন'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#00732A] text-white font-bold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => handleNavClick('magazine')}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-slate-800 bg-amber-50 text-amber-900"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>স্মৃতির পাতা ম্যাগাজিন</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-[#00732A]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>অ্যাডমিন প্যানেল</span>
              </button>
            )}

            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
