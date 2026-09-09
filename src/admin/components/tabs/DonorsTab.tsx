import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface DonorsTabProps {
  donors: any;
  editingDonor: any;
  setEditingDonor: any;
  flashMessage: any;
  loadAllData: any;
}

export const DonorsTab: React.FC<DonorsTabProps> = ({ donors, editingDonor, setEditingDonor, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">সম্মানিত দাতা ও শুভানুধ্যায়ী তালিকা পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingDonor({
                      id: '',
                      name: '',
                      batch: 'ব্যাচ ১৯৯৫',
                      amount: 50000,
                      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      category: 'বিশেষ দাতা',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন দাতা যুক্ত করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {donors.map((d) => (
                  <div key={d.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                    <img src={d.image} alt={d.name} className="w-16 h-16 rounded-full object-cover mb-2 border" />
                    <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                    <span className="text-[11px] text-[#00732A] font-bold">{d.batch}</span>
                    <span className="text-sm font-black text-amber-600 mt-2">{formatTaka(d.amount)}</span>

                    <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100 w-full justify-center">
                      <button onClick={() => setEditingDonor(d)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteDonor(d.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">দাতা তথ্য সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">দাতার নাম *</label>
                      <input
                        type="text"
                        value={editingDonor.name}
                        onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ</label>
                      <input
                        type="text"
                        value={editingDonor.batch}
                        onChange={(e) => setEditingDonor({ ...editingDonor, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">অনুদান পরিমাণ (টাকা) *</label>
                      <input
                        type="number"
                        value={editingDonor.amount}
                        onChange={(e) => setEditingDonor({ ...editingDonor, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-amber-600"
                      />
                    </div>
                    <div>
                      <ImageUploader
                        label="দাতার ছবি (Drag & Drop / Cloudinary আপলোড)"
                        value={editingDonor.image}
                        onChange={(url) => setEditingDonor({ ...editingDonor, image: url })}
                        aspectRatio="square"
                        placeholder="দাতার ছবি ড্রপ বা নির্বাচন করুন"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingDonor(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingDonor.id) {
                            await apiService.updateDonor(editingDonor.id, editingDonor);
                          } else {
                            await apiService.addDonor(editingDonor);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingDonor(null);
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
