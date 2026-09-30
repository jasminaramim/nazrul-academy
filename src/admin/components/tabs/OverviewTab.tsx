import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
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
  globalFinance: any;
  notices: any;
  setActiveTab: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ heroSlides, statsData, students, finance, globalFinance, notices, setActiveTab, reunions }) => {
  const [selectedReunionId, setSelectedReunionId] = React.useState<string>('');
  const [activeFinance, setActiveFinance] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchFinance = async () => {
      if (selectedReunionId) {
        try {
          const data = await apiService.getFinance(selectedReunionId);
          setActiveFinance(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setActiveFinance(null); // Show global if none selected
      }
    };
    fetchFinance();
  }, [selectedReunionId]);


  React.useEffect(() => {
    if (!selectedReunionId && reunions?.length > 0) {
      const active = reunions.find((r: any) => r.isActive);
      if (active) setSelectedReunionId(active.id);
    }
  }, [reunions]);

  const filteredStudents = selectedReunionId
    ? students.filter((s: any) => s.reunionId === selectedReunionId)
    : students;

  const registrationIncome = filteredStudents.reduce((sum: number, s: any) => sum + (Number(s.registrationFee) || 0), 0);

  return (
    <>
      
            <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">ইভেন্ট নির্বাচন করুন</h2>
          <p className="text-xs text-slate-500 mt-0.5">নিবন্ধিত শিক্ষার্থী এবং নিবন্ধন থেকে আয় ফিল্টার করুন</p>
        </div>
        <select
          value={selectedReunionId}
          onChange={(e) => setSelectedReunionId(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#00732A] focus:ring-2 focus:ring-[#00732A]/20 transition-all min-w-[250px]"
        >
          <option value="">সকল ইভেন্ট (Global)</option>
          {reunions?.map((r: any) => (
            <option key={r.id} value={r.id}>{r.title} ({r.year})</option>
          ))}
        </select>
      </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                  <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">নিবন্ধিত শিক্ষার্থী</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-[#00732A]">
                      {toBengaliNumber(filteredStudents.length)}
                    </span>
                    <Users className="w-8 h-8 text-emerald-600 opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                </div>



                {(() => {
                  let grandDonationFund = 0;
                  let totalDonationSoFar = 0;
                  let grandTotalIncome = 0;
                  let grandOtherIncome = 0;
                  let grandTotalExpense = 0;
                  let grandBalance = 0;
                  let regIncome = 0;

                  if (selectedReunionId && activeFinance) {
                    regIncome = activeFinance.breakdown?.registrationFees || 0;
                    grandDonationFund = activeFinance.globalDonationFund || 0;
                    totalDonationSoFar = activeFinance.globalTotalDonationIncome || 0;
                    
                    let manOthInc = 0;
                    let donExp = 0;
                    let regExp = 0;
                    let othExp = 0;
                    
                    if (activeFinance.transactions) {
                      activeFinance.transactions.forEach((t: any) => {
                        if (t.type === 'income') {
                          if (t.fundSource !== 'donation') manOthInc += Number(t.amount);
                        } else if (t.type === 'expense') {
                          if (t.fundSource === 'donation') donExp += Number(t.amount);
                          else if (t.fundSource === 'registration') regExp += Number(t.amount);
                          else othExp += Number(t.amount);
                        }
                      });
                    }

                    grandOtherIncome = manOthInc;
                    // To avoid negative balance when spending from donation, we consider donation spending for this event as income for this event.
                    grandTotalIncome = regIncome + manOthInc;
                    grandTotalExpense = regExp + donExp + othExp;
                    // Balance excludes donation expenses because they are covered by the central donation fund
                    grandBalance = grandTotalIncome - (regExp + othExp);
                  } else {
                    regIncome = globalFinance?.totalRegistrationIncome || 0;
                    grandDonationFund = globalFinance?.globalDonationFund || 0; 
                    totalDonationSoFar = globalFinance?.globalTotalDonationIncome || 0;
                    grandTotalIncome = globalFinance?.grandTotalIncome || 0;
                    grandOtherIncome = globalFinance?.totalManualIncome || 0;
                    grandTotalExpense = globalFinance?.grandTotalExpense || 0;
                    grandBalance = grandTotalIncome - grandTotalExpense;
                  }

                  return (
                    <>
                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">নিবন্ধন থেকে আয়</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-blue-600">
                            {formatTaka(regIncome)}
                          </span>
                          <BdtIcon className="w-8 h-8 text-blue-600 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">মোট অনুদান (এ যাবৎ)</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-[#00732A]">
                            {formatTaka(totalDonationSoFar)}
                          </span>
                          <BdtIcon className="w-8 h-8 text-emerald-600 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="absolute bottom-3 right-7 text-[10px] text-emerald-600/70">খরচ সহ মোট প্রাপ্তি</span>
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">বর্তমান অনুদান তহবিল</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-[#00732A]">
                            {formatTaka(grandDonationFund)}
                          </span>
                          <BdtIcon className="w-8 h-8 text-emerald-600 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        {selectedReunionId && <span className="absolute bottom-3 right-7 text-[10px] text-emerald-600/70">ব্যয় বাদ দিয়ে</span>}
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">অন্যান্য আয়</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-[#00732A]">
                            {formatTaka(grandOtherIncome)}
                          </span>
                          <BdtIcon className="w-8 h-8 text-emerald-600 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">সর্বমোট আয়</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-blue-600">
                            {formatTaka(grandTotalIncome)}
                          </span>
                          <BdtIcon className="w-8 h-8 text-blue-600 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">মোট ব্যয়</span>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-amber-600">
                              {formatTaka(grandTotalExpense)}
                            </span>
                            <BdtIcon className="w-8 h-8 text-amber-600 opacity-80 group-hover:scale-110 transition-transform" />
                          </div>
                          {selectedReunionId && activeFinance?.transactions && (
                            <div className="text-[10px] text-slate-400 font-medium">
                              নিবন্ধন থেকে: {formatTaka(activeFinance.transactions.filter((t: any) => t.type === 'expense' && t.fundSource === 'registration').reduce((sum: number, t: any) => sum + Number(t.amount), 0))} | 
                              অনুদান থেকে: {formatTaka(activeFinance.transactions.filter((t: any) => t.type === 'expense' && t.fundSource === 'donation').reduce((sum: number, t: any) => sum + Number(t.amount), 0))} | 
                              অন্যান্য: {formatTaka(activeFinance.transactions.filter((t: any) => t.type === 'expense' && (!t.fundSource || t.fundSource === 'other')).reduce((sum: number, t: any) => sum + Number(t.amount), 0))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 min-h-[150px] flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[13px] text-slate-500 font-bold mb-1 relative z-10">প্রকৃত তহবিল উদ্বৃত্ত</span>
                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-2xl font-extrabold text-[#CA0000]">
                            {formatTaka(grandBalance)}
                          </span>
                          <BdtIcon className="w-5 h-5 text-[#CA0000]" />
                        </div>
                      </div>
                    </>
                  );
                })()}
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
