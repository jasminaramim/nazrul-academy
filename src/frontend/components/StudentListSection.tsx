import React, { useState } from 'react';
import { Search, Droplet, MapPin, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Student } from '../../shared/types';
import { StudentDetailModal } from './StudentDetailModal';

interface StudentListSectionProps {
  students: Student[];
  onNavigate?: (page: string) => void;
  showAll?: boolean;
}

export const StudentListSection: React.FC<StudentListSectionProps> = ({
  students,
  onNavigate,
  showAll = false,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'new' | 'old'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const uniqueYears = Array.from(new Set(students.map(s => s.batch))).sort((a, b) => {
    const numA = parseInt(String(a).replace(/\D/g, '')) || 0;
    const numB = parseInt(String(b).replace(/\D/g, '')) || 0;
    return numB - numA;
  });

  const filteredStudents = students.filter((s) => {
    if (s.status === 'pending') return false;
    if (filterType !== 'all' && s.batchType !== filterType) return false;
    if (selectedBloodGroup !== 'all' && s.bloodGroup !== selectedBloodGroup) return false;
    if (selectedYear !== 'all' && s.batch !== selectedYear) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q));
      const matchBatch = s.batch.toLowerCase().includes(q);
      const matchLoc = s.location.toLowerCase().includes(q);
      return matchName || matchBatch || matchLoc;
    }
    return true;
  });

  const displayList = showAll ? filteredStudents : filteredStudents.slice(0, 16);

  const tabs = [
    { key: 'all' as const, label: 'সকল শিক্ষার্থী' },
    { key: 'new' as const, label: 'নতুন ব্যাচ' },
    { key: 'old' as const, label: 'পুরাতন ব্যাচ' },
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white border-b border-slate-100" id="students-section">
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .s-card {
          animation: floatUp 0.5s ease both;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease;
        }
        .s-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .avatar-ring {
          background: conic-gradient(from 0deg, #00732A 0%, #FBBF24 33%, #CA0000 66%, #00732A 100%);
          padding: 3px;
          border-radius: 9999px;
          display: inline-block;
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .s-card:hover .avatar-ring {
          animation: ring-spin 3s linear infinite;
        }
        .card-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: inherit;
          pointer-events: none;
        }
        .s-card:hover .card-glow { opacity: 1; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-[#CA0000] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CA0000] animate-pulse"></span>
            অ্যালামনাই ডিরেক্টরি
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            প্রাক্তন ছাত্র-ছাত্রীদের <span className="text-[#00732A]">তালিকা</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            নজরুল একাডেমি পরিবারের সকল প্রাক্তন ছাত্র-ছাত্রীদের তথ্য
          </p>
          <div className="flex justify-center mt-4 gap-1">
            <div className="h-1 w-8 rounded-full bg-[#00732A]"></div>
            <div className="h-1 w-3 rounded-full bg-[#FBBF24]"></div>
            <div className="h-1 w-8 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>

        {/* ── Filter Controls & Search ── */}
        <div className="mb-8 space-y-3">
          
          {/* Row 1: Tabs */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm p-1.5 rounded-2xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`relative px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200 ${
                  filterType === tab.key
                    ? 'bg-[#00732A] text-white shadow-lg shadow-emerald-200/60'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {filterType === tab.key && (
                  <span className="absolute inset-0 rounded-xl bg-[#00732A] opacity-10 blur-sm -z-10"></span>
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Row 2: Search + Selects */}
          <div className="flex items-center gap-2 w-full">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-[#00732A]' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder={isSearchFocused ? 'নাম, ব্যাচ বা জেলা...' : 'অনুসন্ধান...'}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00732A]/25 focus:border-[#00732A] shadow-sm transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                >
                  <span className="text-[10px] text-slate-600 font-black leading-none">✕</span>
                </button>
              )}
            </div>

            {/* Blood Group Select */}
            <div className={`relative flex-shrink-0 transition-all duration-300 ${isSearchFocused ? 'max-w-0 opacity-0 overflow-hidden md:max-w-[140px] md:opacity-100 md:overflow-visible' : 'max-w-[110px] sm:max-w-[140px] opacity-100'}`}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[#CA0000] text-xs font-black">🩸</span>
              </div>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className={`w-full pl-8 pr-2 py-2.5 text-xs rounded-xl border shadow-sm font-bold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#CA0000]/20 focus:border-[#CA0000] ${
                  selectedBloodGroup !== 'all'
                    ? 'border-[#CA0000]/50 bg-red-50 text-[#CA0000]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <option value="all">রক্ত</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Year/Batch Select */}
            <div className={`relative flex-shrink-0 transition-all duration-300 ${isSearchFocused ? 'max-w-0 opacity-0 overflow-hidden md:max-w-[140px] md:opacity-100 md:overflow-visible' : 'max-w-[110px] sm:max-w-[140px] opacity-100'}`}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[#00732A] text-xs">🎓</span>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full pl-8 pr-2 py-2.5 text-xs rounded-xl border shadow-sm font-bold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#00732A]/20 focus:border-[#00732A] truncate ${
                  selectedYear !== 'all'
                    ? 'border-[#00732A]/50 bg-emerald-50 text-[#00732A]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <option value="all">ব্যাচ</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Result count + active filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00732A] animate-pulse"></span>
              <span>{filteredStudents.length} জন শিক্ষার্থী</span>
            </div>
            {selectedBloodGroup !== 'all' && (
              <button
                onClick={() => setSelectedBloodGroup('all')}
                className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-[#CA0000] text-xs font-bold px-3 py-1 rounded-full hover:bg-red-100 cursor-pointer transition-all"
              >
                🩸 {selectedBloodGroup} <span className="opacity-60">✕</span>
              </button>
            )}
            {selectedYear !== 'all' && (
              <button
                onClick={() => setSelectedYear('all')}
                className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-3 py-1 rounded-full hover:bg-emerald-100 cursor-pointer transition-all"
              >
                🎓 {selectedYear} <span className="opacity-60">✕</span>
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-slate-200 cursor-pointer transition-all"
              >
                🔍 "{searchQuery.slice(0, 10)}{searchQuery.length > 10 ? '…' : ''}" <span className="opacity-60">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold text-base">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
            <p className="text-slate-400 text-xs mt-1">অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayList.map((student, idx) => {
              const palettes = [
                { hex: '#00732A', ribbon: 'from-emerald-500 to-green-600',   badge: 'bg-emerald-50 text-[#00732A] border-emerald-200',  glow: 'rgba(0,115,42,0.12)',   name: 'hover:text-[#00732A]' },
                { hex: '#CA0000', ribbon: 'from-red-500 to-rose-600',        badge: 'bg-red-50 text-[#CA0000] border-red-200',          glow: 'rgba(202,0,0,0.10)',   name: 'hover:text-[#CA0000]' },
                { hex: '#b45309', ribbon: 'from-amber-500 to-yellow-500',    badge: 'bg-amber-50 text-amber-700 border-amber-200',      glow: 'rgba(180,83,9,0.10)',  name: 'hover:text-amber-700' },
                { hex: '#0369a1', ribbon: 'from-sky-500 to-blue-600',        badge: 'bg-sky-50 text-sky-700 border-sky-200',            glow: 'rgba(3,105,161,0.10)', name: 'hover:text-sky-700' },
                { hex: '#7c3aed', ribbon: 'from-violet-500 to-purple-600',   badge: 'bg-violet-50 text-violet-700 border-violet-200',   glow: 'rgba(124,58,237,0.10)',name: 'hover:text-violet-700' },
                { hex: '#0d9488', ribbon: 'from-teal-500 to-cyan-600',       badge: 'bg-teal-50 text-teal-700 border-teal-200',         glow: 'rgba(13,148,136,0.10)',name: 'hover:text-teal-700' },
              ];
              const p = palettes[idx % palettes.length];
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{ animationDelay: `${(idx % 8) * 55}ms` }}
                  className="s-card bg-white rounded-2xl border border-slate-100 shadow-md cursor-pointer group relative overflow-hidden flex flex-col items-center text-center"
                >
                  {/* Glow overlay */}
                  <div
                    className="card-glow"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${p.glow} 0%, transparent 70%)` }}
                  ></div>

                  {/* Top gradient ribbon */}
                  <div className={`w-full h-1.5 bg-gradient-to-r ${p.ribbon} shrink-0`}></div>

                  <div className="px-3 sm:px-4 pt-4 pb-4 flex flex-col items-center w-full flex-1">

                    {/* Avatar */}
                    <div className="avatar-ring mb-3">
                      <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden bg-white p-[2px]">
                        <img
                          src={student.image}
                          alt={student.name}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className={`text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 transition-colors ${p.name}`}>
                      {student.name}
                    </h3>
                    {student.nameEn && (
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 tracking-tight truncate w-full">
                        {student.nameEn}
                      </p>
                    )}

                    {/* Batch pill */}
                    <span
                      className={`inline-block text-[10px] sm:text-[11px] font-black mt-2 px-3 py-0.5 rounded-full border ${p.badge}`}
                    >
                      {student.batch}
                    </span>

                    {/* Location */}
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-2 flex items-center justify-center gap-1 w-full truncate">
                      <MapPin className="w-3 h-3 shrink-0" style={{ color: p.hex }} />
                      <span className="truncate">{student.location}</span>
                    </p>

                    {/* Divider + Blood Group */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#CA0000] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                        <Droplet className="w-2.5 h-2.5 fill-[#CA0000]" />
                        {student.bloodGroup}
                      </span>
                      {/* View prompt */}
                      <span
                        className="text-[9px] sm:text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: p.hex }}
                      >
                        বিস্তারিত →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* "আরো দেখুন" Button */}
        {!showAll && filteredStudents.length > 16 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => { if (onNavigate) onNavigate('alumni'); }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-[#005a20] hover:from-[#005a20] hover:to-[#00732A] shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>সকল শিক্ষার্থী দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </section>
  );
};
