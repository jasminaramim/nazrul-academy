import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ScheduleTabProps {
  schedule: any;
  editingSchedule: any;
  setEditingSchedule: any;
  flashMessage: any;
  loadAllData: any;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ schedule, editingSchedule, setEditingSchedule, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">মূল অনুষ্ঠানের সময়সূচি পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingSchedule({
                      id: '',
                      startTime: 'সকাল ০৯:০০',
                      endTime: 'সকাল ১০:০০',
                      category: 'পর্ব',
                      title: 'নতুন পর্ব',
                      shortDescription: '',
                      order: schedule.length + 1,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কর্মসূচি যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-[#00732A] mr-2">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSchedule(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteScheduleItem(item.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                      কর্মসূচি সম্পাদনা
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">শুরুর সময়</label>
                        <input
                          type="text"
                          value={editingSchedule.startTime}
                          onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">শেষের সময়</label>
                        <input
                          type="text"
                          value={editingSchedule.endTime}
                          onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingSchedule.title}
                        onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingSchedule.shortDescription}
                        onChange={(e) => setEditingSchedule({ ...editingSchedule, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingSchedule(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingSchedule.id) {
                            await apiService.updateScheduleItem(editingSchedule.id, editingSchedule);
                          } else {
                            await apiService.addScheduleItem(editingSchedule);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingSchedule(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
    </>
  );
};
