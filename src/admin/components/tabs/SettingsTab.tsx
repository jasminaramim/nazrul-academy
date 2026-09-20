import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';
import { StudentCardTemplate } from '../StudentCardTemplate';

import { Save, Database, CreditCard, Loader2 } from 'lucide-react';

interface SettingsTabProps {
  globalConfig: any;
  setGlobalConfig: any;
  mongoStatus: any;
  flashMessage: any;
  loadAllData: any;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ globalConfig, setGlobalConfig, mongoStatus, flashMessage, loadAllData }) => {
  const [isSavingCard, setIsSavingCard] = useState(false);

  const mockStudentPreview: Student = {
    id: 'preview',
    name: 'মো. আব্দুর রহমান',
    nameEn: 'Md. Abdur Rahman',
    batch: 'ব্যাচ ২০০৫',
    batchType: 'old',
    bloodGroup: 'O+',
    location: 'ঢাকা',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: '01712345678',
    email: 'test@example.com',
    school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
    currentJob: 'সফটওয়্যার ইঞ্জিনিয়ার',
    company: 'টেক কোম্পানি লিমিটেড',
    tshirtSize: 'L',
    registrationFee: 1500,
    transactionId: 'TXN12345678',
    paymentMethod: 'bkash',
    status: 'approved',
    createdAt: new Date().toISOString()
  };

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

              {/* Registration & Fee Config */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  রেজিস্ট্রেশন ফি ও কোটা সেটিংস
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ফি (২০১৫ পর্যন্ত)</label>
                    <input
                      type="number"
                      value={globalConfig.feeOldBatch || 1500}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, feeOldBatch: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ফি (২০১৬ - ২০২৬)</label>
                    <input
                      type="number"
                      value={globalConfig.feeNewBatch || 1000}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, feeNewBatch: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">সর্বোচ্চ কোটা (Limit)</label>
                    <input
                      type="number"
                      value={globalConfig.maxRegistrations || 8000}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, maxRegistrations: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      await apiService.updateGlobalConfig(globalConfig);
                      flashMessage('রেজিস্ট্রেশন ফি সেটিংস সংরক্ষিত হয়েছে');
                      loadAllData();
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#00732A] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* Payment & Donation Accounts Config */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#CA0000]" />
                      <span>অনুদান ও পেমেন্ট নম্বর ব্যবস্থাপনা (bKash, Nagad, Rocket, Bank)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      অনলাইন অনুদান ও ফি সংগ্রহের জন্য নম্বর ও লিমিট স্ট্যাটাস (isLimitOut) পরিচালনা করুন
                    </p>
                  </div>
                </div>

                {/* bKash Config */}
                <div className="p-4 bg-pink-50/40 rounded-xl border border-pink-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#e2136e] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e2136e]"></span>
                      বিকাশ (bKash) অ্যাকাউন্ট
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                      <input
                        type="checkbox"
                        checked={!!globalConfig.bkashLimitOut}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bkashLimitOut: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span className="text-xs font-bold text-red-700">লিমিট শেষ (isLimitOut)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">বিকাশ নম্বর</label>
                      <input
                        type="text"
                        value={globalConfig.bkashNumber || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bkashNumber: e.target.value })}
                        placeholder="01712345678"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">অ্যাকাউন্ট টাইপ</label>
                      <select
                        value={globalConfig.bkashType || 'মার্চেন্ট'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bkashType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="মার্চেন্ট">মার্চেন্ট (Merchant)</option>
                        <option value="পার্সোনাল">পার্সোনাল (Personal)</option>
                        <option value="এজেন্ট">এজেন্ট (Agent)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">লেনদেনের ধরণ (Action)</label>
                      <select
                        value={globalConfig.bkashAction || 'payment'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bkashAction: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-300 bg-white font-bold text-[#e2136e]"
                      >
                        <option value="payment">Make Payment (পেমেন্ট)</option>
                        <option value="send_money">Send Money (সেন্ড মানি)</option>
                        <option value="cash_out">Cash Out (ক্যাশ আউট)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Nagad Config */}
                <div className="p-4 bg-orange-50/40 rounded-xl border border-orange-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#d9381e] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d9381e]"></span>
                      নগদ (Nagad) অ্যাকাউন্ট
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-orange-200">
                      <input
                        type="checkbox"
                        checked={!!globalConfig.nagadLimitOut}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, nagadLimitOut: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span className="text-xs font-bold text-red-700">লিমিট শেষ (isLimitOut)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">নগদ নম্বর</label>
                      <input
                        type="text"
                        value={globalConfig.nagadNumber || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, nagadNumber: e.target.value })}
                        placeholder="01797585073"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">অ্যাকাউন্ট টাইপ</label>
                      <select
                        value={globalConfig.nagadType || 'পার্সোনাল'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, nagadType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="পার্সোনাল">পার্সোনাল (Personal)</option>
                        <option value="মার্চেন্ট">মার্চেন্ট (Merchant)</option>
                        <option value="এজেন্ট">এজেন্ট (Agent)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">লেনদেনের ধরণ (Action)</label>
                      <select
                        value={globalConfig.nagadAction || 'send_money'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, nagadAction: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-orange-300 bg-white font-bold text-[#d9381e]"
                      >
                        <option value="send_money">Send Money (সেন্ড মানি)</option>
                        <option value="cash_out">Cash Out (ক্যাশ আউট)</option>
                        <option value="payment">Make Payment (পেমেন্ট)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rocket Config */}
                <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#8c3077] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8c3077]"></span>
                      রকেট (Rocket) অ্যাকাউন্ট (১১ ডিজিট)
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                      <input
                        type="checkbox"
                        checked={!!globalConfig.rocketLimitOut}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, rocketLimitOut: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span className="text-xs font-bold text-red-700">লিমিট শেষ (isLimitOut)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">রকেট নম্বর (১১ ডিজিট)</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={globalConfig.rocketNumber || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, rocketNumber: e.target.value })}
                        placeholder="01712345678"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">অ্যাকাউন্ট টাইপ</label>
                      <select
                        value={globalConfig.rocketType || 'পার্সোনাল'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, rocketType: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="পার্সোনাল">পার্সোনাল (Personal)</option>
                        <option value="মার্চেন্ট">মার্চেন্ট (Merchant)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">লেনদেনের ধরণ (Action)</label>
                      <select
                        value={globalConfig.rocketAction || 'send_money'}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, rocketAction: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-purple-300 bg-white font-bold text-[#8c3077]"
                      >
                        <option value="send_money">Send Money (সেন্ড মানি)</option>
                        <option value="cash_out">Cash Out (ক্যাশ আউট)</option>
                        <option value="payment">Make Payment (পেমেন্ট)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bank Account Config */}
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00732A]"></span>
                    <span className="text-xs font-black text-[#00732A]">ব্যাংক অ্যাকাউন্ট বিবরণী</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">ব্যাংকের নাম</label>
                      <input
                        type="text"
                        value={globalConfig.bankName || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bankName: e.target.value })}
                        placeholder="সোনালী ব্যাংক লিমিটেড"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">হিসাবের নাম (Account Name)</label>
                      <input
                        type="text"
                        value={globalConfig.bankAccountName || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bankAccountName: e.target.value })}
                        placeholder="ত্রিশাল নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">হিসাব নম্বর (Account Number)</label>
                      <input
                        type="text"
                        value={globalConfig.bankAccountNumber || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, bankAccountNumber: e.target.value })}
                        placeholder="2050 1234 5678 9012"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">শাখা ও রাউটিং নম্বর</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={globalConfig.bankBranch || ''}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, bankBranch: e.target.value })}
                          placeholder="ত্রিশাল শাখা"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          value={globalConfig.bankRoutingNumber || ''}
                          onChange={(e) => setGlobalConfig({ ...globalConfig, bankRoutingNumber: e.target.value })}
                          placeholder="200271234"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      await apiService.updateGlobalConfig(globalConfig);
                      flashMessage('পেমেন্ট ও অনুদান নম্বর সেটিংস সংরক্ষিত হয়েছে');
                      loadAllData();
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>পেমেন্ট সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* ID Card Config */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  আইডি কার্ড / উৎসব পোস্টার সেটিংস
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  শিক্ষার্থীদের রেজিস্ট্রেশন অনুমোদনের পর এই কনফিগারেশন ব্যবহার করে ডাইনামিক আইডি কার্ড তৈরি করা হবে এবং ইমেইলে পাঠানো হবে।
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <ImageUploader
                        label="কার্ডের ব্যাকগ্রাউন্ড ছবি (URL)"
                        value={globalConfig.cardBackgroundUrl || ''}
                        onChange={(url) => setGlobalConfig({ ...globalConfig, cardBackgroundUrl: url })}
                        aspectRatio="video"
                        placeholder="ব্যাকগ্রাউন্ড ছবি আপলোড করুন"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">প্রধান শিরোনাম (Title)</label>
                      <input
                        type="text"
                        value={globalConfig.cardTitle || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, cardTitle: e.target.value })}
                        placeholder="১০০ বর্ষ পূর্তি মিলন উৎসব - ২০২৬"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">উপ-শিরোনাম ১ (বাম)</label>
                      <input
                        type="text"
                        value={globalConfig.cardSubtitle1 || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, cardSubtitle1: e.target.value })}
                        placeholder="সুফি মতের ইতিহাস ও ঐতিহ্য"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">উপ-শিরোনাম ২ (ডান)</label>
                      <input
                        type="text"
                        value={globalConfig.cardSubtitle2 || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, cardSubtitle2: e.target.value })}
                        placeholder="আমরা নজরুলিয়ান, আমরা গর্বিত"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ফুটারে উদ্ধৃতি (Quote)</label>
                      <input
                        type="text"
                        value={globalConfig.cardQuote || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, cardQuote: e.target.value })}
                        placeholder="মানুষের চেয়ে বড় কিছু নাই..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">নিচের লেখা (Footer Text)</label>
                      <input
                        type="text"
                        value={globalConfig.cardFooterText || ''}
                        onChange={(e) => setGlobalConfig({ ...globalConfig, cardFooterText: e.target.value })}
                        placeholder="আমি থাকছি আপনি থাকছেন তো"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 block mb-2">কার্ড প্রিভিউ (লাইভ)</label>
                    <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-4">
                      <div className="w-[300px] h-[425px] relative overflow-hidden rounded-xl shadow-lg border border-slate-200">
                        <div className="absolute top-0 left-0 transform scale-50 origin-top-left">
                          <StudentCardTemplate student={mockStudentPreview} globalConfig={globalConfig} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      setIsSavingCard(true);
                      try {
                        await apiService.updateGlobalConfig(globalConfig);
                        flashMessage('আইডি কার্ড সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
                        loadAllData();
                      } finally {
                        setIsSavingCard(false);
                      }
                    }}
                    disabled={isSavingCard}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isSavingCard ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>কার্ড সেটিংস সংরক্ষণ করুন</span>
                      </>
                    )}
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
