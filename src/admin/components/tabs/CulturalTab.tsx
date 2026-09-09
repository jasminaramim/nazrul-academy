import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface CulturalTabProps {
  culturalSchedule: any;
  editingCultural: any;
  setEditingCultural: any;
  flashMessage: any;
  loadAllData: any;
}

export const CulturalTab: React.FC<CulturalTabProps> = ({ culturalSchedule, editingCultural, setEditingCultural, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">সাংস্কৃতিক ও বিনোদন পর্বের শিডিউল</span>
                <button
                  onClick={() =>
                    setEditingCultural({
                      id: '',
                      category: 'নজরুল সংগীত',
                      title: 'নতুন পর্ব',
                      description: '',
                      time: 'সন্ধ্যা ০৬:০০',
                      performers: '',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#CA0000] text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন সাংস্কৃতিক পর্ব যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {culturalSchedule.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#CA0000] bg-red-50 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{c.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                    {c.performers && (
                      <p className="text-xs text-slate-700 font-semibold mt-2">পরিবেশক: {c.performers}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setEditingCultural(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteCulturalItem(c.id);
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

              {editingCultural && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                      সাংস্কৃতিক পর্ব সম্পাদনা
                    </h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটেগরি</label>
                      <input
                        type="text"
                        value={editingCultural.category}
                        onChange={(e) => setEditingCultural({ ...editingCultural, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingCultural.title}
                        onChange={(e) => setEditingCultural({ ...editingCultural, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সময়</label>
                      <input
                        type="text"
                        value={editingCultural.time}
                        onChange={(e) => setEditingCultural({ ...editingCultural, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">পরিবেশক / শিল্পী</label>
                      <input
                        type="text"
                        value={editingCultural.performers}
                        onChange={(e) => setEditingCultural({ ...editingCultural, performers: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingCultural.description}
                        onChange={(e) => setEditingCultural({ ...editingCultural, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingCultural(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingCultural.id) {
                            await apiService.updateCulturalItem(editingCultural.id, editingCultural);
                          } else {
                            await apiService.addCulturalItem(editingCultural);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingCultural(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#CA0000] rounded-xl"
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
