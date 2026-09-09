import React, { useState } from 'react';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Users, UserCheck, Sliders, Bell, Settings } from 'lucide-react';

interface OverviewTabProps {
  heroSlides: any;
  statsData: any;
  students: any;
  finance: any;
  notices: any;
  setActiveTab: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ heroSlides, statsData, students, finance, notices, setActiveTab }) => {
  return (
    <>
      
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">নিবন্ধিত শিক্ষার্থী</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-[#00732A]">
                      {toBengaliNumber(statsData?.registeredStudents || students.length)}
                    </span>
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">পরিবারের সদস্য সংখ্যা</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-amber-600">
                      {toBengaliNumber(statsData?.familyMembersCount || 80)}
                    </span>
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">মোট সংগৃহীত আয়</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatTaka(finance?.totalIncome)}
                    </span>
                    <BdtIcon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">তহবিল উদ্বৃত্ত</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-extrabold text-[#CA0000]">
                      {formatTaka(finance?.balance)}
                    </span>
                    <BdtIcon className="w-5 h-5 text-[#CA0000]" />
                  </div>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4">দ্রুত কন্টেন্ট সম্পাদনা</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Sliders className="w-5 h-5 text-[#00732A] mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">হিরো ব্যানার</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(heroSlides.length)} টি স্লাইড</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notices')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Bell className="w-5 h-5 text-[#CA0000] mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">নোটিশ বোর্ড</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(notices.length)} টি নোটিশ</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Users className="w-5 h-5 text-amber-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">ছাত্র-ছাত্রী ডিরেক্টরি</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(students.length)} জন নিবন্ধিত</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Settings className="w-5 h-5 text-slate-700 mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">সাইট ও ডাটাবেজ</span>
                    <span className="text-[11px] text-slate-400">কনফিগারেশন</span>
                  </button>
                </div>
              </div>

              {/* Recent registered students preview table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">সর্বশেষ নিবন্ধিত শিক্ষার্থী</h3>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="text-xs font-bold text-[#00732A] hover:underline"
                  >
                    সকল দেখুন →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">শিক্ষার্থী</th>
                        <th className="px-4 py-3">ব্যাচ</th>
                        <th className="px-4 py-3">রক্তের গ্রুপ</th>
                        <th className="px-4 py-3">অবস্থান</th>
                        <th className="px-4 py-3">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.slice(0, 5).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <img src={s.image} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-bold text-slate-900">{s.name}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#CA0000]">{s.batch}</td>
                          <td className="px-4 py-3 font-bold">{s.bloodGroup}</td>
                          <td className="px-4 py-3 text-slate-600">{s.location}</td>
                          <td className="px-4 py-3 font-mono">{s.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          
    </>
  );
};
