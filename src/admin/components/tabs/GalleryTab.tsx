import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Plus, Edit2, Trash2, Eye, X, Video } from 'lucide-react';

interface GalleryTabProps {
  gallery: any;
  editingGallery: any;
  setEditingGallery: any;
  flashMessage: any;
  loadAllData: any;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ gallery, editingGallery, setEditingGallery, flashMessage, loadAllData }) => {
  const [viewingGallery, setViewingGallery] = useState<any>(null);

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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((g) => {
                  const getVideoThumbnail = (url: string) => {
                    if (!url) return '';
                    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80'; // generic youtube placeholder
                    if (url.includes('res.cloudinary.com') && url.match(/\.(mp4|webm|mov)$/i)) {
                      return url.replace(/\.(mp4|webm|mov)$/i, '.jpg');
                    }
                    return url;
                  };

                  const thumbUrl = g.type === 'video' ? getVideoThumbnail(g.url) : g.url;

                  return (
                    <div key={g.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                      <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
                        <img 
                          src={thumbUrl} 
                          alt={g.title} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Video';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        
                        <span className={`absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm backdrop-blur-md ${
                          g.type === 'video' 
                            ? 'bg-red-500/90 text-white border border-red-400/50' 
                            : 'bg-emerald-500/90 text-white border border-emerald-400/50'
                        }`}>
                          {g.type === 'video' ? 'ভিডিও' : 'ছবি'}
                        </span>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between bg-white relative z-10">
                        <div>
                          <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mb-2 inline-block">
                            {g.category || 'ক্যাম্পাস'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#00732A] transition-colors">
                            {g.title}
                          </h4>
                        </div>
                        
                        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end gap-2">
                          <button 
                            onClick={() => setViewingGallery(g)} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingGallery(g)} 
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('সত্যিই মুছে ফেলতে চান?')) {
                                await apiService.deleteGalleryItem(g.id);
                                flashMessage('মুছে ফেলা হয়েছে');
                                loadAllData();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                      <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                      <select
                        value={editingGallery.category || 'ক্যাম্পাস'}
                        onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                        <option value="স্মৃতিচারণ">পুরনো স্মৃতি (স্মৃতিচারণ)</option>
                        <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                    <div>
                      <ImageUploader
                        label="গ্যালারি ফাইল (Drag & Drop / Cloudinary আপলোড - Max 50MB)"
                        value={editingGallery.url}
                        onChange={(url) => {
                          const isVideo = url.match(/\.(mp4|webm|mov)$/i) || url.includes('video/upload') || url.includes('youtube') || url.includes('youtu.be');
                          setEditingGallery({ 
                            ...editingGallery, 
                            url, 
                            type: isVideo ? 'video' : 'image' 
                          });
                        }}
                        aspectRatio="video"
                        acceptsVideo={true}
                        placeholder="ছবি বা ভিডিও ফাইল ড্রপ বা নির্বাচন করুন"
                      />
                      <div className="text-center text-xs font-bold text-slate-400 mt-4 mb-2">অথবা</div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ভিডিও লিংক (Embed / YouTube URL)</label>
                        <input
                          type="url"
                          value={editingGallery.url}
                          onChange={(e) => {
                            const url = e.target.value;
                            const isVideo = url.match(/\.(mp4|webm|mov)$/i) || url.includes('video/upload') || url.includes('youtube') || url.includes('youtu.be');
                            setEditingGallery({ 
                              ...editingGallery, 
                              url,
                              type: isVideo ? 'video' : 'image'
                            });
                          }}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                        />
                      </div>
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

              {viewingGallery && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                  <button
                    onClick={() => setViewingGallery(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-4 text-white">
                    <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
                      {viewingGallery.type === 'video' ? (
                        viewingGallery.url.includes('youtube') || viewingGallery.url.includes('embed') ? (
                          <iframe
                            src={viewingGallery.url}
                            title={viewingGallery.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video 
                            src={viewingGallery.url} 
                            controls 
                            autoPlay 
                            className="w-full h-full object-contain bg-black"
                          />
                        )
                      ) : (
                        <img
                          src={viewingGallery.url}
                          alt={viewingGallery.title}
                          className="max-h-[70vh] w-auto object-contain mx-auto"
                        />
                      )}
                    </div>

                    <div className="mt-4 px-2">
                      <h3 className="text-lg font-bold text-white">{viewingGallery.title}</h3>
                      <span className="text-xs text-amber-400 mt-1 block">ক্যাটাগরি: {viewingGallery.category || 'ক্যাম্পাস'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
    </>
  );
};
