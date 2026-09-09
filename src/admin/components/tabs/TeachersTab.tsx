import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface TeachersTabProps {
  teacherMessages: any;
  setEditingTeacher: any;
  flashMessage: any;
  loadAllData: any;
}

export const TeachersTab: React.FC<TeachersTabProps> = ({ teacherMessages, setEditingTeacher, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    প্রাক্তনদের প্রতি আহবান ও শিক্ষকমণ্ডলীর বাণী
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    শ্রদ্ধেয় শিক্ষকদের বাণী, শুভেচ্ছা ও আহবান বার্তা যুক্ত, সম্পাদন ও নিয়ন্ত্রণ করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTeacher({
                      id: '',
                      name: '',
                      designation: 'সাবেক প্রধান শিক্ষক',
                      schoolName: 'ত্রিশাল সরকারি নজরুল একাডেমি',
                      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                      heading: 'নজরুল আঙিনায় সৌহার্দ্যের সেতুবন্ধন',
                      bismillahText: 'বিসমিল্লাহির রাহমানির রাহিম',
                      greeting: 'শ্রদ্ধেয় সুধী ও স্নেহের ছাত্র-ছাত্রীগণ,',
                      description: '',
                      order: teacherMessages.length + 1,
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন বাণী / আহবান যোগ করুন</span>
                </button>
              </div>

              {/* Teacher Cards Grid */}
              <div className="space-y-5">
                {teacherMessages.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    কোনো শিক্ষকের বাণী পাওয়া যায়নি। উপরে 'নতুন বাণী / আহবান যোগ করুন' বাটনে ক্লিক করুন।
                  </div>
                ) : (
                  teacherMessages.map((tm, idx) => (
                    <div
                      key={tm.id || idx}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={tm.image}
                            alt={tm.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{tm.name}</h4>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                ক্রম #{toBengaliNumber(tm.order || idx + 1)}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#CA0000]">{tm.designation}</p>
                            <p className="text-[11px] text-slate-500">{tm.schoolName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setEditingTeacher(tm)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>সম্পাদনা</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`আপনি কি "${tm.name}"-এর বাণী মুছে ফেলতে নিশ্চিত?`)) {
                                try {
                                  await apiService.deleteTeacherMessage(tm.id);
                                  flashMessage('শিক্ষকের বাণী সফলভাবে মুছে ফেলা হয়েছে');
                                  loadAllData();
                                } catch (err: any) {
                                  flashMessage(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', true);
                                }
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-serif">
                          {tm.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800">
                          {tm.heading}
                        </h5>
                        {tm.greeting && (
                          <p className="text-xs font-bold text-[#00732A]">{tm.greeting}</p>
                        )}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {tm.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          
    </>
  );
};
