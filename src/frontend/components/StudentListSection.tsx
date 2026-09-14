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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    if (filterType !== 'all' && s.batchType !== filterType) return false;
    if (selectedBloodGroup !== 'all' && s.bloodGroup !== selectedBloodGroup) return false;
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
    <section className="py-20 bg-white border-b border-slate-100" id="students-section">
      <style>{`
        .student-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(0,115,42,0.04) 0%, rgba(202,0,0,0.04) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .student-card:hover::before { opacity: 1; }
        .avatar-ring {
          background: conic-gradient(from 0deg, #00732A 0%, #FBBF24 33%, #CA0000 66%, #00732A 100%);
          padding: 2px;
          border-radius: 9999px;
        }
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

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Tab Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  filterType === tab.key
                    ? 'bg-[#00732A] text-white shadow-md shadow-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Blood Group Select */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম, ব্যাচ বা জেলা খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00732A]/30 focus:border-[#00732A] shadow-sm transition-all"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00732A]/30 focus:border-[#00732A] shadow-sm font-medium appearance-none cursor-pointer transition-all"
              >
                <option value="all">সকল রক্তের গ্রুপ</option>
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
          </div>
        </div>

        {/* Count Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-slate-500 font-medium">
            মোট <span className="font-bold text-[#00732A]">{filteredStudents.length}</span> জন শিক্ষার্থী পাওয়া গেছে
          </span>
        </div>

        {/* Student Cards Grid */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold text-lg">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm mt-1">অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayList.map((student, idx) => {
              // Alternate accent colors for visual variety
              const accents = [
                { border: 'hover:border-emerald-400', badge: 'bg-emerald-50 text-[#00732A] border-emerald-200', glow: 'hover:shadow-emerald-100' },
                { border: 'hover:border-red-400', badge: 'bg-red-50 text-[#CA0000] border-red-200', glow: 'hover:shadow-red-100' },
                { border: 'hover:border-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200', glow: 'hover:shadow-amber-100' },
                { border: 'hover:border-sky-400', badge: 'bg-sky-50 text-sky-700 border-sky-200', glow: 'hover:shadow-sky-100' },
              ];
              const accent = accents[idx % accents.length];
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`student-card bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl ${accent.glow} ${accent.border} transition-all duration-300 flex flex-col items-center text-center cursor-pointer group relative overflow-hidden`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-all duration-300 ${idx % 4 === 0 ? 'bg-[#00732A]' : idx % 4 === 1 ? 'bg-[#CA0000]' : idx % 4 === 2 ? 'bg-amber-400' : 'bg-sky-400'}`}></div>

                  {/* Avatar */}
                  <div className="relative mb-4 mt-2">
                    <div className="avatar-ring">
                      <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-white p-[2px]">
                        <img
                          src={student.image}
                          alt={student.name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#00732A] transition-colors leading-snug">
                    {student.name}
                  </h3>
                  {student.nameEn && (
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 tracking-tight">
                      {student.nameEn}
                    </p>
                  )}

                  {/* Batch */}
                  <span className={`text-[11px] font-bold mt-2 px-3 py-0.5 rounded-full border ${accent.badge}`}>
                    {student.batch}
                  </span>

                  {/* Location */}
                  <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{student.location}</span>
                  </p>

                  {/* Divider + Blood Group */}
                  <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#CA0000] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                      <Droplet className="w-2.5 h-2.5 fill-[#CA0000]" />
                      {student.bloodGroup}
                    </span>
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
