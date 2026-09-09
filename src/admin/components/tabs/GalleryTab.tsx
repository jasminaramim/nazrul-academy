import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface GalleryTabProps {
  gallery: any;
  editingGallery: any;
  setEditingGallery: any;
  flashMessage: any;
  loadAllData: any;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ gallery, editingGallery, setEditingGallery, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">ছবি ও ভিডিও গ্যালারি আইটেম যোগ বা এডিট করুন</span>
                <button
                  onClick={() =>
                    setEditingGallery({
                      id: '',
                      title: 'নতুন ছবি',
                      type: 'image',
                      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
                      category: 'ক্যাম্পাস',
                      date: '২০২৬',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ছবি/ভিডিও যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
                    <div className="aspect-video w-full bg-slate-100 relative">
                      <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {g.type === 'video' ? 'ভিডিও' : 'ছবি'}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{g.title}</h4>
                      <span className="text-[10px] text-slate-400">{g.category}</span>
                    </div>
                    <div className="p-2 border-t border-slate-100 flex justify-end gap-1">
                      <button onClick={() => setEditingGallery(g)} className="p-1 text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteGalleryItem(g.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">গ্যালারি আইটেম সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">টাইটেল</label>
                      <input
                        type="text"
                        value={editingGallery.title}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">মিডিয়া টাইপ</label>
                      <select
                        value={editingGallery.type}
                        onChange={(e) => setEditingGallery({ ...editingGallery, type: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="image">ছবি (Image)</option>
                        <option value="video">ভিডিও (Video Embed/URL)</option>
                      </select>
                    </div>
                    <div>
                      {editingGallery.type === 'image' ? (
                        <ImageUploader
                          label="গ্যালারি ছবি (Drag & Drop / Cloudinary আপলোড)"
                          value={editingGallery.url}
                          onChange={(url) => setEditingGallery({ ...editingGallery, url })}
                          aspectRatio="video"
                          placeholder="গ্যালারির ছবি ড্রপ বা নির্বাচন করুন"
                        />
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">ভিডিও লিংক (Embed / YouTube URL)</label>
                          <input
                            type="url"
                            value={editingGallery.url}
                            onChange={(e) => setEditingGallery({ ...editingGallery, url: e.target.value })}
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingGallery(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingGallery.id) {
                            await apiService.updateGalleryItem(editingGallery.id, editingGallery);
                          } else {
                            await apiService.addGalleryItem(editingGallery);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingGallery(null);
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
