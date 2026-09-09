import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface MagazineTabProps {
  magazineArticles: any;
  editingArticle: any;
  setEditingArticle: any;
  flashMessage: any;
  loadAllData: any;
}

export const MagazineTab: React.FC<MagazineTabProps> = ({ magazineArticles, editingArticle, setEditingArticle, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">স্মৃতির পাতা ম্যাগাজিনের স্মৃতিকথা ও প্রবন্ধ পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingArticle({
                      id: '',
                      title: 'নতুন স্মৃতিকথা',
                      author: '',
                      authorBatch: 'ব্যাচ ২০০০',
                      date: '২০২৬',
                      summary: '',
                      content: '',
                      category: 'স্মৃতিচারণ',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রবন্ধ যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {magazineArticles.map((art) => (
                  <div key={art.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#00732A] mr-2 bg-emerald-50 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{art.title}</span>
                      <p className="text-xs text-slate-500 mt-1">লেখক: {art.author} ({art.authorBatch})</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingArticle(art)} className="p-1.5 text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteMagazineArticle(art.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">প্রবন্ধ সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">লেখক</label>
                        <input
                          type="text"
                          value={editingArticle.author}
                          onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">লেখকের ব্যাচ</label>
                        <input
                          type="text"
                          value={editingArticle.authorBatch}
                          onChange={(e) => setEditingArticle({ ...editingArticle, authorBatch: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সংক্ষিপ্ত সারমর্ম</label>
                      <textarea
                        rows={2}
                        value={editingArticle.summary}
                        onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">মূল লেখা</label>
                      <textarea
                        rows={6}
                        value={editingArticle.content}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingArticle(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingArticle.id) {
                            await apiService.updateMagazineArticle(editingArticle.id, editingArticle);
                          } else {
                            await apiService.addMagazineArticle(editingArticle);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingArticle(null);
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
