import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, UserPlus, Bell, LogIn, Calendar, MapPin } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroSliderProps {
  slides: HeroSlide[];
  onNavigate: (page: string) => void;
  festivalDate?: string;
  festivalTime?: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  onNavigate,
  festivalDate = '২৬ মার্চ ২০২৬',
  festivalTime = 'সকাল ০৯:০০ টা',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const current = slides[currentIndex] || slides[0];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 shadow-lg">
      {/* Slider Container */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 transform animate-pulse duration-1000"
            />
            {/* Dark & Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-[#00732A]/20 mix-blend-multiply" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Badge */}
          {current.badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00732A] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md mb-4 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span>{current.badgeText}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {current.title}
          </h2>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-200 font-medium max-w-3xl drop-shadow-sm">
            {current.subtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer border border-emerald-400/30"
            >
              <UserPlus className="w-5 h-5" />
              <span>নিবন্ধন করুন</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('notices-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('home');
              }}
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span>নোটিশ</span>
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-[#CA0000] hover:bg-[#a80000] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-red-400/30"
            >
              <LogIn className="w-5 h-5" />
              <span>লগইন করুন</span>
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-105 transition-all border border-white/20 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 hover:scale-105 transition-all border border-white/20 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-[#CA0000]' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
