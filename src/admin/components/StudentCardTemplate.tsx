import React, { forwardRef } from 'react';
import { Student, GlobalConfig } from '../../shared/types';

interface StudentCardTemplateProps {
  student: Student;
  globalConfig: GlobalConfig;
}

export const StudentCardTemplate = forwardRef<HTMLDivElement, StudentCardTemplateProps>(
  ({ student, globalConfig }, ref) => {
    // Default image if not provided
    const userImage =
      student.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`;

    const bgUrl =
      globalConfig.cardBackgroundUrl ||
      'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop';

    return (
      <div
        ref={ref}
        className="relative w-[600px] h-[850px] overflow-hidden text-center flex flex-col items-center justify-between font-sans"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Semi-transparent overlay to ensure text readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}></div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center w-full h-full p-8 justify-between">
          
          {/* Header Section */}
          <div className="w-full flex justify-between items-start pt-4">
            <div className="text-left w-1/3">
              <p className="text-sm font-bold leading-tight" style={{ color: '#1e293b' }}>
                {globalConfig.cardSubtitle1 || 'সুফি মতের ইতিহাস ও ঐতিহ্য'}
              </p>
            </div>
            
            {/* Logo area */}
            <div className="w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full border-4 p-2 flex items-center justify-center shadow-lg -mt-6" style={{ backgroundColor: '#ffffff', borderColor: '#047857' }}>
                 {/* Assuming the school logo or generic icon */}
                 <img src={globalConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="text-right w-1/3">
              <p className="text-sm font-bold leading-tight" style={{ color: '#1e293b' }}>
                {globalConfig.cardSubtitle2 || 'আমরা নজরুলিয়ান, আমরা গর্বিত'}
              </p>
            </div>
          </div>

          {/* Main Title Area */}
          <div className="mt-8 mb-4">
            <h1 className="text-4xl font-black drop-shadow-md mb-2" style={{ color: '#b45309' }}>
              নজরুল একাডেমি
            </h1>
            <h2 className="text-lg font-bold tracking-wide uppercase" style={{ color: '#1e293b' }}>
              {globalConfig.cardTitle || '১০০ বর্ষ পূর্তি মিলন উৎসব - ২০২৬'}
            </h2>
          </div>

          {/* Photo Section */}
          <div className="relative mt-4 mb-6">
            <div className="w-56 h-56 rounded-full border-8 p-1 shadow-2xl relative overflow-hidden flex items-center justify-center mx-auto" style={{ backgroundColor: '#ffffff', borderColor: '#fbbf24' }}>
              <img
                src={userImage}
                alt={student.name}
                className="w-full h-full object-cover rounded-full"
                crossOrigin="anonymous"
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-[-10px] border-[2px] rounded-full border-dashed animate-spin-slow opacity-60" style={{ borderColor: '#fcd34d' }}></div>
          </div>

          {/* User Details */}
          <div className="mt-4 mb-6">
            <h3 className="text-4xl font-extrabold drop-shadow-sm font-serif" style={{ color: '#0f172a' }}>
              {student.name}
            </h3>
            
            <div className="flex flex-col items-center mt-2">
              <p className="text-sm font-semibold mb-1" style={{ color: '#475569' }}>We are</p>
              <p className="text-3xl font-black tracking-widest uppercase" style={{ color: '#d97706' }}>
                NAZRULIAN
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-[2px] w-12" style={{ backgroundColor: '#fbbf24' }}></span>
                <p className="text-xl font-bold px-4 py-1 rounded-full border" style={{ color: '#CA0000', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#fecaca' }}>
                  {student.batch}
                </p>
                <span className="h-[2px] w-12" style={{ backgroundColor: '#fbbf24' }}></span>
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="w-full mt-auto pb-4">
             <p className="text-lg font-bold italic mb-4 text-center px-12" style={{ color: '#1e293b' }}>
               "{globalConfig.cardQuote || 'মানুষের চেয়ে বড় কিছু নাই, নাই কিছু মহীয়ান'}"
             </p>
             <div className="w-full py-3 rounded-xl shadow-lg border-2" style={{ backgroundColor: '#065f46', borderColor: '#059669', color: '#ffffff' }}>
               <p className="text-lg font-bold tracking-wide">
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
