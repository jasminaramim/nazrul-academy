import React, { useState, useEffect } from 'react';

interface WebsitePreloaderProps {
  isLoading: boolean;
  logoUrl?: string;
  siteTitle?: string;
  siteSubtitle?: string;
}

const enToBnNumber = (num: number): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((d) => bnDigits[parseInt(d, 10)] || d)
    .join('');
};

export const WebsitePreloader: React.FC<WebsitePreloaderProps> = ({
  isLoading,
  logoUrl = 'https://upload.wikimedia.org/wikipedia/bn/thumb/8/87/%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%B6%E0%A6%BE%E0%A6%B2_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%A8%E0%A6%9C%E0%A6%B0%E0%A7%81%E0%A6%B2_%E0%A6%8F%E0%A6%95%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%AE%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png/250px-%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%B6%E0%A6%BE%E0%A6%B2_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%A8%E0%A6%9C%E0%A6%B0%E0%A7%81%E0%A6%B2_%E0%A6%8F%E0%A6%95%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%AE%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png',
  siteTitle = 'নজরুল একাডেমি অ্যালামনাই',
  siteSubtitle = 'প্রাক্তন ছাত্র-ছাত্রী অ্যালামনাই অ্যাসোসিয়েশন ও পুনর্মিলনী উৎসব ২০২৬',
}) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('সিস্টেম ও কনফিগারেশন প্রস্তুত হচ্ছে...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smoothly progress forward
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If still fetching data, cap at 90%
        if (isLoading) {
          if (prev < 40) {
            setStatusText('শতবর্ষের স্মৃতি ও পুনর্মিলনীর তথ্য লোড হচ্ছে...');
            return prev + 6;
          }
          if (prev < 75) {
            setStatusText('অ্যালামনাই ডেটাবেজের সাথে সংযোগ স্থাপন হচ্ছে...');
            return prev + 4;
          }
          if (prev < 90) {
            setStatusText('শিক্ষার্থী ও গ্যালারি তথ্য প্রস্তুত হচ্ছে...');
            return prev + 1;
          }
          return 90;
        }

        // When data finished loading, quickly jump to 100%
        if (prev < 100) {
          setStatusText('সম্পূর্ণ প্রস্তুত! নজরুল আঙিনায় স্বাগতম...');
          return Math.min(100, prev + 12);
        }
        return 100;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isLoading]);

  // When progress hits 100% and data loading is false, trigger graceful fade out
  useEffect(() => {
    if (!isLoading && progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 350);

      const unmountTimer = setTimeout(() => {
        setIsDone(true);
      }, 1050);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading, progress]);

  // Ensure preloader never hangs indefinitely (safety max 6 seconds)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setStatusText('স্বাগতম!');
      setIsFadingOut(true);
      setTimeout(() => setIsDone(true), 700);
    }, 6000);

    return () => clearTimeout(safetyTimer);
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white select-none transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 38%, rgba(0, 115, 42, 0.28) 0%, transparent 55%),
          radial-gradient(circle at 85% 85%, rgba(202, 0, 0, 0.16) 0%, transparent 45%),
          radial-gradient(circle at 15% 85%, rgba(217, 119, 6, 0.14) 0%, transparent 45%)
        `,
      }}
    >
      {/* Decorative Floating Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Logo with Animated Glowing Ring */}
        <div className="relative mb-6">
          {/* Outer Rotating Conic Glow */}
          <div
            className="absolute -inset-3 rounded-full animate-spin opacity-85 blur-xs"
            style={{
              background: 'conic-gradient(from 0deg, #00732A, #F59E0B, #CA0000, #00732A)',
              animationDuration: '3.5s',
            }}
          />

          {/* Inner Glowing Badge Container */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/20 p-3.5 flex items-center justify-center shadow-[0_15px_40px_rgba(0,115,42,0.4)]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_5px_15px_rgba(255,255,255,0.25)] animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            ) : (
              <div className="text-3xl font-black text-emerald-400">১০০</div>
            )}
          </div>

          {/* Centenary 100 Years Pill */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-lg border border-white/30 whitespace-nowrap">
            ১০০ বছর পূর্তি (১৯১৩ - ২০২৬)
          </div>
        </div>

        {/* Institution Title & Subtitle */}
        <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-2 leading-tight drop-shadow-md">
          {siteTitle}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1 max-w-sm leading-relaxed">
          {siteSubtitle}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          শতবর্ষের স্মৃতিবিজড়িত নজরুল আঙিনায় স্বাগতম
        </p>

        {/* Modern Progress Bar */}
        <div className="w-full mt-7 max-w-xs space-y-2">
          {/* Progress Bar Container */}
          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner backdrop-blur-sm relative">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00732A 0%, #10B981 50%, #F59E0B 100%)',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.7)',
              }}
            >
              {/* Shimmer light reflection effect */}
              <div
                className="absolute inset-0 w-full h-full opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                  animation: 'shimmer 1.4s infinite',
                }}
              />
            </div>
          </div>

          {/* Progress Percent and Status */}
          <div className="flex items-center justify-between text-[11px] font-medium pt-1">
            <span className="text-slate-300 flex items-center gap-1.5 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="text-emerald-400 font-extrabold font-mono text-xs shrink-0 pl-2">
              {enToBnNumber(progress)}%
            </span>
          </div>
        </div>

        {/* Micro Loader Wave Dots */}
        <div className="flex items-center gap-1.5 mt-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Footer Tagline */}
        <div className="mt-8 pt-4 border-t border-white/10 w-full text-center">
          <p className="text-[10px] text-slate-500 font-medium tracking-wider">
            ত্রিশাল সরকারি নজরুল একাডেমি &bull; ১৯১৩ হতে গৌরবের শতবর্ষ
          </p>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
