import React, { forwardRef } from 'react';
import { Student, GlobalConfig } from '../../shared/types';

interface StudentCardTemplateProps {
  student: Student;
  globalConfig: GlobalConfig;
  isAdminDownload?: boolean;
}

// Standard ID card ratio: 85.6mm × 54mm → aspect ratio ≈ 1.586:1 (portrait flip → ~0.63:1)
// We use 600×950 portrait format (0.63 aspect ratio) for a professional look.

export const StudentCardTemplate = forwardRef<HTMLDivElement, StudentCardTemplateProps>(
  ({ student, globalConfig, isAdminDownload }, ref) => {
    const userImage =
      student.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`;

    const bgUrl =
      globalConfig.cardBackgroundUrl ||
      'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop';

    return (
      <div
        ref={ref}
        style={{
          width: '600px',
          height: '950px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
          backgroundColor: '#0a0f1e',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dark gradient background */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #022c22, #064e3b, #0f172a)', zIndex: 0 }} />

        {/* Custom bg image */}
        <img
          src={bgUrl}
          alt="Background"
          crossOrigin="anonymous"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.35, mixBlendMode: 'overlay' }}
        />

        {/* Blur overlay */}
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 0 }} />

        {/* Glow accents */}
        <div style={{ position: 'absolute', top: -150, left: -150, width: 400, height: 400, background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: -150, right: -150, width: 400, height: 400, background: 'radial-gradient(circle, rgba(52,211,153,0.15), transparent)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

        {/* Border frames */}
        <div style={{ position: 'absolute', inset: 14, border: '2px solid rgba(255,255,255,0.08)', borderRadius: 24, zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 24, border: '1px solid rgba(251,191,36,0.25)', borderRadius: 18, zIndex: 1, pointerEvents: 'none' }} />

        {/* ────── CONTENT COLUMN ────── */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '28px 36px 28px', boxSizing: 'border-box' }}>

          {/* ── HEADER ROW ── */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Left: REG + subtitle1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, width: '28%' }}>

              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 10px', borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(254,243,199,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>
                  {globalConfig.cardSubtitle1 || 'আমরা গর্বিত'}
                </p>
              </div>
            </div>

            {/* Centre: Logo */}
            <div style={{ width: '44%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', border: '3px solid #fcd34d', padding: 4, background: 'linear-gradient(180deg,#064e3b,#022c22)', boxShadow: '0 0 24px rgba(251,191,36,0.3)' }}>
                <img src={globalConfig.cardLogoUrl || globalConfig.logoUrl} alt="Logo" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
              </div>
            </div>

            {/* Right: subtitle2 */}
            <div style={{ width: '28%', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 10px', borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(254,243,199,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3, textAlign: 'right' }}>
                  {globalConfig.cardSubtitle2 || 'আমরা নজরুলিয়ান'}
                </p>
              </div>
            </div>
          </div>

          {/* ── MAIN TITLE ── */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 42, fontWeight: 900, background: 'linear-gradient(90deg,#fde68a,#fbbf24,#fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              নজরুল একাডেমি
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.5))' }} />
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'rgba(236,253,245,0.9)', letterSpacing: '0.12em', textAlign: 'center' }}>
                {globalConfig.cardTitle || '১০০ বর্ষ পূর্তি মিলন উৎসব - ২০২৬'}
              </h2>
              <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.5))' }} />
            </div>
          </div>

          {/* ── PHOTO ── */}
          <div style={{ marginTop: 20, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: -16, background: 'rgba(251,191,36,0.25)', filter: 'blur(30px)', borderRadius: '50%' }} />
            <div style={{ width: 160, height: 160, borderRadius: '50%', background: 'linear-gradient(135deg,#fde68a,#f59e0b,#b45309)', padding: 5, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid #022c22' }}>
                <img src={userImage} alt={student.name} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* ── STUDENT DETAILS CARD ── */}
          <div style={{ marginTop: 20, width: '100%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '20px 20px 16px', boxSizing: 'border-box', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.4), transparent)' }} />

            {/* Name */}
            <h3 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.2, textAlign: 'center' }}>
              {student.name}
            </h3>

            {/* WE ARE NAZRULIAN */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(254,243,199,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>We are</p>
              <p style={{ margin: 0, fontSize: 30, fontWeight: 900, letterSpacing: '0.2em', background: 'linear-gradient(90deg,#fef3c7,#fbbf24,#fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NAZRULIAN
              </p>
            </div>

            {/* Batch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
              <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,38,38,0.4)', filter: 'blur(8px)', borderRadius: 999 }} />
                <p style={{ position: 'relative', margin: 0, fontSize: 20, fontWeight: 700, padding: '6px 20px', borderRadius: 999, border: '1px solid rgba(239,68,68,0.4)', background: 'linear-gradient(135deg,#dc2626,#991b1b)', color: '#fff', letterSpacing: '0.1em' }}>
                  {student.batch}
                </p>
              </div>
              <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
            </div>

            {/* Blood Group */}
            {student.bloodGroup && (
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'rgba(254,243,199,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Blood Group</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#f87171', marginTop: 2 }}>{student.bloodGroup}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          <div style={{ marginTop: 40, paddingTop: 18, width: '100%' }}>
            
            {/* Admin Manual Registration Number Box */}
            {isAdminDownload && (
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid #fbbf24', borderRadius: 8, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#064e3b' }}>Reg:</span>
                  <div style={{ width: 200, height: 2, background: 'rgba(0,0,0,0.3)', borderBottom: '2px dotted #064e3b', marginTop: 14 }}></div>
                </div>
              </div>
            )}

            {/* Quote */}
            <div style={{ position: 'relative', marginBottom: 14, paddingLeft: 16, paddingRight: 16 }}>
              <p style={{ margin: 0, fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: 'rgba(209,250,229,0.9)', textAlign: 'center', lineHeight: 1.5 }}>
                "{globalConfig.cardQuote || 'মানুষের চেয়ে বড় কিছু নাই, নাই কিছু মহীয়ান'}"
              </p>
            </div>

            {/* Footer text bar */}
            <div style={{ width: '100%', padding: '14px 0', borderRadius: 16, border: '1px solid rgba(251,191,36,0.25)', background: 'linear-gradient(90deg,#004225,#005c33,#004225)', position: 'relative', overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', color: '#fef3c7', textAlign: 'center' }}>
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
