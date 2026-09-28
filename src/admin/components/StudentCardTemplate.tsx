import React, { forwardRef } from 'react';
import { Student, GlobalConfig } from '../../shared/types';

interface StudentCardTemplateProps {
  student: Student;
  globalConfig: GlobalConfig;
}

export const StudentCardTemplate = forwardRef<HTMLDivElement, StudentCardTemplateProps>(
  ({ student, globalConfig }, ref) => {
    const userImage =
      student.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`;

    const bgUrl =
      globalConfig.cardBackgroundUrl ||
      'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop';

    return (
      <div
        ref={ref}
        className="relative w-[600px] h-[850px] overflow-hidden text-center flex flex-col items-center justify-between font-sans bg-[#0a0f1e]"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Premium Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#0f172a] z-0"></div>

        {/* User's custom background with blend mode & blur */}
        <img 
          src={bgUrl} 
          alt="Background" 
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-overlay"
        />
        
        {/* Subtle blur overlay for glassmorphism effect */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 z-0"></div>

        {/* Decorative Golden accents */}
        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-gradient-to-br from-amber-300/20 to-transparent rounded-full blur-[80px] z-0"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-[80px] z-0"></div>
        
        {/* Premium Border Frame */}
        <div className="absolute inset-[15px] border-[2px] border-white/10 rounded-3xl z-10 pointer-events-none"></div>
        <div className="absolute inset-[25px] border border-amber-500/30 rounded-[1.25rem] z-10 pointer-events-none"></div>

        {/* Content Wrapper */}
        <div className="relative z-20 flex flex-col items-center w-full h-full px-10 py-8 justify-between">
          
          {/* Header Section */}
          <div className="w-full flex justify-between items-center pt-2">
            <div className="text-left w-[30%]">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl inline-block shadow-lg">
                <p className="text-[12px] font-bold text-amber-100/90 uppercase tracking-widest leading-tight">
                  {globalConfig.cardSubtitle1 || 'সুফি মতের ইতিহাস ও ঐতিহ্য'}
                </p>
              </div>
            </div>
            
            {/* Logo area with premium glow */}
            <div className="w-[40%] flex justify-center relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full scale-150"></div>
              <div className="w-28 h-28 rounded-full border-[3px] p-1 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative z-10 bg-gradient-to-b from-[#064e3b] to-[#022c22]" style={{ borderColor: '#fcd34d' }}>
                 <img src={globalConfig.cardLogoUrl || globalConfig.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" crossOrigin="anonymous" />
              </div>
            </div>

            <div className="text-right w-[30%] flex justify-end">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl inline-block shadow-lg">
                <p className="text-[12px] font-bold text-amber-100/90 uppercase tracking-widest leading-tight">
                  {globalConfig.cardSubtitle2 || 'আমরা নজরুলিয়ান, আমরা গর্বিত'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Title Area */}
          <div className="mt-6 mb-2 flex flex-col items-center relative">
            <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full"></div>
            <h1 className="text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-3 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-tight">
              নজরুল একাডেমি
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-400/50"></div>
              <h2 className="text-[20px] font-bold tracking-[0.2em] text-emerald-50 drop-shadow-md">
                {globalConfig.cardTitle || '১০০ বর্ষ পূর্তি মিলন উৎসব - ২০২৬'}
              </h2>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-400/50"></div>
            </div>
          </div>

          {/* Photo Section with Premium Frame */}
          <div className="relative mt-4 mb-4 group">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-amber-400/30 blur-[40px] rounded-full scale-110"></div>
            
            {/* Decorative concentric rings */}
            <div className="absolute inset-[-20px] rounded-full border border-amber-500/20 border-dashed animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-[-10px] rounded-full border-[2px] border-emerald-500/30"></div>
            
            <div className="w-56 h-56 rounded-full p-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex items-center justify-center mx-auto z-10 bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700">
              <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#022c22] cursor-pointer">
                <img
                  src={userImage}
                  alt={student.name}
                  className="w-full h-full object-cover rounded-full hover:scale-125 transition-transform duration-500 ease-out"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="mt-4 mb-4 w-full">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl py-6 px-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
              
              <h3 className="text-[42px] leading-tight font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif text-white tracking-wide">
                {student.name}
              </h3>
              
              <div className="flex flex-col items-center mt-5 space-y-1">
                <p className="text-sm font-semibold text-amber-200/80 tracking-widest uppercase">We are</p>
                <p className="text-4xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  NAZRULIAN
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-400"></span>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-red-600/50 blur-md rounded-full"></div>
                    <p className="relative text-2xl font-bold px-6 py-1.5 rounded-full border border-red-500/50 bg-gradient-to-br from-red-600 to-[#CA0000] text-white shadow-[0_0_20px_rgba(202,0,0,0.4)] tracking-wider">
                      {student.batch}
                    </p>
                  </div>
                  <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-400"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="w-full mt-auto relative z-20">
             <div className="relative">
               <span className="absolute -left-2 -top-4 text-4xl text-amber-500/30 font-serif">"</span>
               <p className="text-[17px] font-medium italic mb-3 text-center px-12 text-emerald-50/90 leading-relaxed drop-shadow-md">
                 {globalConfig.cardQuote || 'মানুষের চেয়ে বড় কিছু নাই, নাই কিছু মহীয়ান'}
               </p>
               <span className="absolute -right-2 -bottom-2 text-4xl text-amber-500/30 font-serif rotate-180">"</span>
             </div>
             
             <div className="w-full py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-amber-500/30 bg-gradient-to-r from-[#004225] via-[#005c33] to-[#004225] relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <p className="text-[22px] font-bold tracking-widest text-amber-50 drop-shadow-lg relative z-10">
                 {globalConfig.cardFooterText || 'আমি থাকছি আপনি থাকছেন তো'}
               </p>
             </div>
          </div>
        </div>
      </div>
    );
  
  }
);

StudentCardTemplate.displayName = 'StudentCardTemplate';
