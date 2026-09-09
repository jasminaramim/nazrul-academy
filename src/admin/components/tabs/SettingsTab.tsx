import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Save, Database } from 'lucide-react';

interface SettingsTabProps {
  globalConfig: any;
  setGlobalConfig: any;
  mongoStatus: any;
  flashMessage: any;
  loadAllData: any;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ globalConfig, setGlobalConfig, mongoStatus, flashMessage, loadAllData }) => {
  return (
    <>
      <div className="space-y-6 max-w-3xl">
              {/* Site Identity Config */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  সাইটের নাম ও যোগাযোগের তথ্য
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">সাইট টাইটেল</label>
                    <input
                      type="text"
                      value={globalConfig.siteTitle}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, siteTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="লোগো URL (Drag & Drop / Cloudinary আপলোড)"
                      value={globalConfig.logoUrl || ''}
                      onChange={(url) => setGlobalConfig({ ...globalConfig, logoUrl: url })}
                      aspectRatio="video"
                      placeholder="সাইটের লোগো ড্রপ বা নির্বাচন করুন"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">যোগাযোগ ফোন ১</label>
                    <input
                      type="text"
                      value={globalConfig.contactPhone1}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactPhone1: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">যোগাযোগ ফোন ২</label>
                    <input
                      type="text"
                      value={globalConfig.contactPhone2}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactPhone2: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল</label>
                    <input
                      type="email"
                      value={globalConfig.contactEmail}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ফেসবুক পেজ লিংক</label>
                    <input
                      type="url"
                      value={globalConfig.facebookUrl}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      value={globalConfig.address}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      await apiService.updateGlobalConfig(globalConfig);
                      flashMessage('সাইট সেটিংস সংরক্ষিত হয়েছে');
                      loadAllData();
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#00732A] text-white rounded-xl text-xs font-bold"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* MongoDB Backend Connection Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00732A]" />
                  <span>Node.js ও MongoDB ডাটাবেজ স্টোরেজ কনফিগারেশন</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  বর্তমান ডাটাবেজ আর্কিটেকচারে ক্লাউড পারসিস্টেন্স এবং লোকাল ফাইল ব্যাকড স্টোরেজ উভয়ই স্বয়ংক্রিয়ভাবে সক্রিয় রয়েছে। আপনার রিমোট MongoDB ক্লাস্টার সংযুক্ত করতে নিচের সংযোগ স্ট্রিং প্রদান করুন।
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">বর্তমান স্টোরেজ স্ট্যাটাস:</span>
                    <span className="font-bold text-[#00732A] bg-emerald-100 px-2 py-0.5 rounded">
                      {mongoStatus.storageType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">JWT অথেন্টিকেশন নিরাপত্তা:</span>
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">সক্রিয় (HS256)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    MongoDB সংযোগ স্ট্রিং (MONGODB_URI)
                  </label>
                  <input
                    type="text"
                    placeholder="mongodb+srv://username:password@cluster0.mongodb.net/trishal_alumni"
                    defaultValue={mongoStatus.mongoUri || ''}
                    onBlur={async (e) => {
                      if (e.target.value) {
                        const res = await apiService.updateMongoConfig(e.target.value);
                        flashMessage(res.message);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    স্ট্রিং পূরণ করা না থাকলে বিল্ট-ইন নিরবচ্ছিন্ন লোকাল স্টোরেজ ইঞ্জিন ব্যবহৃত হবে।
                  </p>
                </div>
              </div>
            </div>
    </>
  );
};
