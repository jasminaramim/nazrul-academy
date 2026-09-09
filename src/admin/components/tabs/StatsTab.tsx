import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Save, BarChart3, Plus, Edit2, Trash2 } from 'lucide-react';

interface StatsTabProps {
  statsData: any;
  setStatsData: any;
  setEditingCustomStat: any;
  flashMessage: any;
  loadAllData: any;
}

export const StatsTab: React.FC<StatsTabProps> = ({ statsData, setStatsData, setEditingCustomStat, flashMessage, loadAllData }) => {
  return (
    <>
      <div className="space-y-6">
              {/* Event Timing & Primary Metrics Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      উৎসব ও মূল পরিসংখ্যান নিয়ন্ত্রণ
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      পুনর্মিলনীর নির্ধারিত তারিখ, শুরুর সময় ও নিবন্ধিত সংখ্যা আপডেট করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await apiService.updateStats(statsData);
                        flashMessage('পরিসংখ্যান ও তারিখ সফলভাবে সংরক্ষিত হয়েছে');
                        loadAllData();
                      } catch (err: any) {
                        flashMessage(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', true);
                      }
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠানের পূর্ণাঙ্গ নাম / শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalTitle || 'পুনর্মিলনী ও বসন্ত উৎসব ২০২৬'}
                      onChange={(e) => setStatsData({ ...statsData, festivalTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠানের তারিখ (যেমন: ২০২৬-০৩-২৬)
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalDate}
                      onChange={(e) => setStatsData({ ...statsData, festivalDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠান শুরুর সময় (যেমন: সকাল ০৯:০০ টা)
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalTime}
                      onChange={(e) => setStatsData({ ...statsData, festivalTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নিবন্ধিত শিক্ষার্থী সংখ্যা (স্বয়ংক্রিয় বা কাস্টম)
                    </label>
                    <input
                      type="number"
                      value={statsData.registeredStudents}
                      onChange={(e) =>
                        setStatsData({ ...statsData, registeredStudents: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নিবন্ধিত পরিবারের সদস্য সংখ্যা
                    </label>
                    <input
                      type="number"
                      value={statsData.familyMembersCount}
                      onChange={(e) =>
                        setStatsData({ ...statsData, familyMembersCount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Stat Cards Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#00732A]" />
                      <span>কাস্টম পরিসংখ্যান কার্ডসমূহ (Custom Stats & Milestones)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ওয়েবসাইটের পরিসংখ্যান সেকশনে প্রদর্শনের জন্য নতুন কার্ড যোগ, সম্পাদনা ও নিয়ন্ত্রণ করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCustomStat({
                        id: `cstat-${Date.now()}`,
                        label: '',
                        value: '',
                        unit: '',
                        icon: 'Award',
                        note: '',
                        order: (statsData.customStats?.length || 0) + 1,
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন পরিসংখ্যান কার্ড যোগ করুন</span>
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(!statsData.customStats || statsData.customStats.length === 0) ? (
                    <div className="sm:col-span-3 py-8 text-center text-xs text-slate-400">
                      কোনো কাস্টম পরিসংখ্যান কার্ড যোগ করা হয়নি। উপরে বাটনে ক্লিক করে যোগ করুন।
                    </div>
                  ) : (
                    statsData.customStats.map((cStat, idx) => (
                      <div
                        key={cStat.id || idx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              #{toBengaliNumber(cStat.order || idx + 1)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingCustomStat(cStat)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm(`আপনি কি "${cStat.label}" কার্ডটি মুছে ফেলতে চান?`)) {
                                    const updated = (statsData.customStats || []).filter(
                                      (s) => s.id !== cStat.id
                                    );
                                    const newStats = { ...statsData, customStats: updated };
                                    setStatsData(newStats);
                                    await apiService.updateStats(newStats);
                                    flashMessage('পরিসংখ্যান কার্ড মুছে ফেলা হয়েছে');
                                  }
                                }}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-2xl font-black text-slate-900 group-hover:text-[#00732A] transition-colors">
                            {cStat.value}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">{cStat.label}</h4>
                          {cStat.unit && (
                            <p className="text-[11px] text-emerald-700 font-medium">{cStat.unit}</p>
                          )}
                          {cStat.note && (
                            <p className="text-[11px] text-slate-500 mt-1">{cStat.note}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
    </>
  );
};
