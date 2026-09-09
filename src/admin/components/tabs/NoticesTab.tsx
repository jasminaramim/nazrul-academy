import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface NoticesTabProps {
  notices: any;
  editingNotice: any;
  setEditingNotice: any;
  flashMessage: any;
  loadAllData: any;
}

export const NoticesTab: React.FC<NoticesTabProps> = ({ notices, editingNotice, setEditingNotice, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">নোটিশ প্রকাশ ও হালনাগাদ করুন</span>
                <button
                  onClick={() =>
                    setEditingNotice({
                      id: '',
                      category: 'পুনর্মিলনী',
                      title: '',
                      shortDescription: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      priority: 'সাধারণ',
                      author: 'পুনর্মিলনী উদযাপন কমিটি',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন নোটিশ লিখুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {n.category}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                          {n.priority}
                        </span>
                        <span className="text-xs text-slate-400">{formatDateBengali(n.date)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setEditingNotice(n)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
                            await apiService.deleteNotice(n.id);
                            flashMessage('নোটিশ মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Notice Modal */}
              {editingNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingNotice.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ প্রকাশ'}
                    </h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটেগরি *</label>
                      <input
                        type="text"
                        value={editingNotice.category}
                        onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম *</label>
                      <input
                        type="text"
                        value={editingNotice.title}
                        onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">অগ্রাধিকার (Priority)</label>
                        <select
                          value={editingNotice.priority}
                          onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        >
                          <option value="সাধারণ">সাধারণ</option>
                          <option value="উচ্চ">উচ্চ</option>
                          <option value="জরুরি">জরুরি</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">তারিখ</label>
                        <input
                          type="date"
                          value={editingNotice.date}
                          onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <ImageUploader
                        label="নোটিশের সংশ্লিষ্ট ছবি / ব্যানার (ঐচ্ছিক)"
                        value={editingNotice.image || ''}
                        onChange={(url) => setEditingNotice({ ...editingNotice, image: url })}
                        aspectRatio="video"
                        placeholder="নোটিশের ছবি বা ডকুমেন্টের ছবি ড্রপ করুন"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ *</label>
                      <textarea
                        rows={2}
                        value={editingNotice.shortDescription}
                        onChange={(e) => setEditingNotice({ ...editingNotice, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিস্তারিত বিবরণ *</label>
                      <textarea
                        rows={5}
                        value={editingNotice.description}
                        onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setEditingNotice(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingNotice.id) {
                            await apiService.updateNotice(editingNotice.id, editingNotice);
                          } else {
                            await apiService.addNotice(editingNotice);
                          }
                          flashMessage('নোটিশ সংরক্ষণ সম্পন্ন');
                          setEditingNotice(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
    </>
  );
};
