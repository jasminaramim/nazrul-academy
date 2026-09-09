import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2 } from 'lucide-react';

interface HeroTabProps {
  heroSlides: any;
  editingSlide: any;
  setEditingSlide: any;
  flashMessage: any;
  loadAllData: any;
}

export const HeroTab: React.FC<HeroTabProps> = ({ heroSlides, editingSlide, setEditingSlide, flashMessage, loadAllData }) => {
  return (
    <>
      
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">
                  হোমপেজের ৩টি ডাইনামিক স্লাইডারের ছবি ও টেক্সট পরিবর্তন করুন
                </span>
                <button
                  onClick={() =>
                    setEditingSlide({
                      id: '',
                      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
                      badgeText: 'পুনর্মিলনী উৎসব ২০২৬',
                      title: 'নতুন স্লাইড শিরোনাম',
                      subtitle: 'স্লাইড বিবরণী',
                      buttonText: 'নিবন্ধন করুন',
                      buttonLink: '/register',
                      order: heroSlides.length + 1,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্লাইড যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-900">
                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          স্লাইড {toBengaliNumber(idx + 1)}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        {slide.badgeText && (
                          <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {slide.badgeText}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{slide.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{slide.subtitle}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('আপনি কি এই স্লাইডটি ডিলিট করতে চান?')) {
                            await apiService.deleteHeroSlide(slide.id);
                            flashMessage('স্লাইড ডিলিট করা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Slide Modal */}
              {editingSlide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingSlide.id ? 'স্লাইড সম্পাদনা' : 'নতুন স্লাইড তৈরি'}
                    </h3>

                    <div>
                      <ImageUploader
                        label="স্লাইড ব্যানার ছবি (Drag & Drop / Cloudinary আপলোড)"
                        value={editingSlide.imageUrl}
                        onChange={(url) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                        aspectRatio="video"
                        placeholder="ব্যানার ছবি ড্রপ করুন অথবা নির্বাচন করুন"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাজ টেক্সট</label>
                      <input
                        type="text"
                        value={editingSlide.badgeText}
                        onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম *</label>
                      <input
                        type="text"
                        value={editingSlide.title}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">উপ-শিরোনাম / বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingSlide.subtitle}
                        onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingSlide(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingSlide.id) {
                            await apiService.updateHeroSlide(editingSlide.id, editingSlide);
                          } else {
                            await apiService.addHeroSlide(editingSlide);
                          }
                          flashMessage('স্লাইড সংরক্ষণ সম্পন্ন');
                          setEditingSlide(null);
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
