import React, { useState } from 'react';
import { Search, Droplet, MapPin, ArrowRight, UserCheck } from 'lucide-react';
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

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/70" id="students-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#CA0000] uppercase bg-red-50 px-3 py-1 rounded-full border border-red-200">
            অ্যালামনাই ডিরেক্টরি
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            প্রাক্তন ছাত্র-ছাত্রীদের তালিকা
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            নজরুল একাডেমি পরিবারের সকল প্রাক্তন ছাত্র-ছাত্রীদের তথ্য
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Tab Filters */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#00732A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল শিক্ষার্থী
            </button>
            <button
              onClick={() => setFilterType('new')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                filterType === 'new'
                  ? 'bg-[#00732A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              নতুন ব্যাচ
            </button>
            <button
              onClick={() => setFilterType('old')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                filterType === 'old'
                  ? 'bg-[#00732A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              পুরাতন ব্যাচ
            </button>
          </div>

          {/* Search & Blood Group Select */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম, ব্যাচ বা জেলা খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00732A] shadow-2xs"
              />
            </div>

            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00732A] shadow-2xs font-medium"
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

        {/* Student Cards Grid (Exact design pattern from screenshot) */}
        {displayList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <p className="text-slate-500 font-medium">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayList.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#00732A]/50 transition-all duration-200 flex flex-col items-center text-center cursor-pointer group relative"
              >
                {/* Avatar with circle badge */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#CA0000] transition-colors leading-snug">
                  {student.name}
                </h3>
                {student.nameEn && (
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight font-sans">
                    {student.nameEn}
                  </p>
                )}

                {/* Batch */}
                <span className="text-xs font-bold text-[#CA0000] mt-1.5 bg-red-50/80 px-2.5 py-0.5 rounded-full border border-red-100">
                  {student.batch}
                </span>

                {/* Location */}
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{student.location}</span>
                </p>

                {/* Blood Group Pill */}
                <div className="mt-3 pt-2 border-t border-slate-100 w-full flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#CA0000] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    <Droplet className="w-2.5 h-2.5 fill-[#CA0000]" />
                    <span>{student.bloodGroup}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* "আরো দেখুন" Button */}
        {!showAll && filteredStudents.length > 16 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('alumni');
              }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>আরো দেখুন</span>
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
