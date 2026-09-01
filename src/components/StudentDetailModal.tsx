import React from 'react';
import { X, Droplet, MapPin, Briefcase, Building, GraduationCap, Phone, Mail, Users, Shirt } from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative transform transition-all">
        {/* Header decoration banner */}
        <div className="h-28 bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar */}
          <div className="-mt-14 mb-4 flex justify-between items-end">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100 ring-2 ring-[#00732A]/20">
              <img
                src={student.image}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-50 text-[#CA0000] border border-red-200 rounded-full text-xs font-bold flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 fill-[#CA0000]" />
                <span>রক্তের গ্রুপ: {student.bloodGroup}</span>
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-[#00732A] border border-emerald-200 rounded-full text-xs font-bold">
                {student.batch}
              </span>
            </div>
          </div>

          {/* Name & Title */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {student.name}
            </h3>
            {student.nameEn && (
              <p className="text-xs text-slate-500 font-medium font-sans">
                {student.nameEn}
              </p>
            )}
          </div>

          {/* Details list */}
          <div className="mt-5 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <GraduationCap className="w-4 h-4 text-[#00732A] shrink-0" />
              <span><strong>প্রতিষ্ঠান:</strong> {student.school || 'ত্রিশাল সরকারি নজরুল একাডেমি'}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="w-4 h-4 text-[#CA0000] shrink-0" />
              <span><strong>বর্তমান ঠিকানা/অবস্থান:</strong> {student.location}</span>
            </div>

            {student.currentJob && (
              <div className="flex items-center gap-3 text-slate-700">
                <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>পেশা:</strong> {student.currentJob}</span>
              </div>
            )}

            {student.company && (
              <div className="flex items-center gap-3 text-slate-700">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>প্রতিষ্ঠান/সংস্থা:</strong> {student.company}</span>
              </div>
            )}

            {student.phone && (
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span><strong>ফোন:</strong> {student.phone}</span>
              </div>
            )}

            {student.email && (
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span><strong>ইমেইল:</strong> {student.email}</span>
              </div>
            )}

            {(student.familyMembersCount !== undefined && student.familyMembersCount > 0) && (
              <div className="flex items-center gap-3 text-slate-700">
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong>পরিবারের সদস্য:</strong> {student.familyMembersCount} জন</span>
              </div>
            )}

            {student.tshirtSize && (
              <div className="flex items-center gap-3 text-slate-700">
                <Shirt className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>টি-শার্ট সাইজ:</strong> {student.tshirtSize}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
