import React, { useState } from 'react';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Database, RefreshCw, Plus, Key, Copy } from 'lucide-react';

interface MongodbTabProps {
  heroSlides: any;
  teacherMessages: any;
  students: any;
  finance: any;
  notices: any;
  schedule: any;
  culturalSchedule: any;
  donors: any;
  gallery: any;
  magazineArticles: any;
  mongoStatus: any;
  selectedMongoCollection: any;
  collectionDocs: any;
  collectionLoading: any;
  syncingMongo: any;
  seedingDemo: any;
  mongoUriInput: any;
  setMongoUriInput: any;
  flashMessage: any;
  handleSyncMongo: any;
  handleSeedDemoData: any;
  handleSaveMongoUri: any;
  loadMongoCollectionDocs: any;
}

export const MongodbTab: React.FC<MongodbTabProps> = ({ heroSlides, teacherMessages, students, finance, notices, schedule, culturalSchedule, donors, gallery, magazineArticles, mongoStatus, selectedMongoCollection, collectionDocs, collectionLoading, syncingMongo, seedingDemo, mongoUriInput, setMongoUriInput, flashMessage, handleSyncMongo, handleSeedDemoData, handleSaveMongoUri, loadMongoCollectionDocs }) => {
  return (
    <>
      
            <div className="space-y-6 max-w-5xl">
              {/* Header & Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00732A] flex items-center justify-center border border-emerald-200 shadow-xs">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          MongoDB Atlas ক্লাউড ডাটাবেজ
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            mongoStatus.connected
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {mongoStatus.connected ? '● সংযুক্ত (Connected)' : '○ লোকাল ব্যাকআপ সক্রিয়'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ক্লাউড ক্লাস্টার: {mongoStatus.cluster || 'cluster0.ssmpl.mongodb.net'} | ডাটাবেজ:{' '}
                        <span className="font-mono font-bold text-slate-700">
                          {mongoStatus.database || 'trishal_nazrul_academy'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={syncingMongo}
                      onClick={handleSyncMongo}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingMongo ? 'animate-spin' : ''}`} />
                      <span>{syncingMongo ? 'সিঙ্ক হচ্ছে...' : 'MongoDB সিঙ্ক করুন'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={seedingDemo}
                      onClick={handleSeedDemoData}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{seedingDemo ? 'সিড হচ্ছে...' : 'ডেমো ডেটা সিড করুন'}</span>
                    </button>
                  </div>
                </div>

                {/* Grid of System Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      স্টোরেজ মোড
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {mongoStatus.storageType}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      সক্রিয় কালেকশন
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {mongoStatus.collections?.length || 14} টি পৃথক কালেকশন
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      সর্বশেষ সিঙ্ক
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {mongoStatus.lastSync ? formatDateBengali(mongoStatus.lastSync) : 'এইমাত্র'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      নিরাপত্তা এনক্রিপশন
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      TLS/SSL & SCRAM-SHA
                    </span>
                  </div>
                </div>

                {/* MongoDB Connection URI Config Form */}
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">MongoDB Atlas Connection String</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Cluster0 (Trishal)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="mongodb+srv://Trishal:password@cluster0.ssmpl.mongodb.net/trishal_nazrul_academy"
                      value={mongoUriInput || mongoStatus.mongoUri || ''}
                      onChange={(e) => setMongoUriInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveMongoUri(mongoUriInput || mongoStatus.mongoUri || '')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      সংরক্ষণ ও সংযোগ পরীক্ষা
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Collection Explorer */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#00732A]" />
                      <span>MongoDB কালেকশন এক্সপ্লোরার (Live Collection Viewer)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      নিচের যেকোনো কালেকশনে ক্লিক করে সরাসরি ডাটাবেজে সংরক্ষিত ডকুমেন্টগুলো দেখুন
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => loadMongoCollectionDocs(selectedMongoCollection)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg self-start cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${collectionLoading ? 'animate-spin' : ''}`} />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>

                {/* Collection Buttons List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {(mongoStatus.collections && mongoStatus.collections.length > 0
                    ? mongoStatus.collections
                    : [
                        { name: 'students', label: 'শিক্ষার্থী', count: students.length },
                        { name: 'users', label: 'ইউজার ও অ্যাডমিন', count: 1 },
                        { name: 'teachers', label: 'শিক্ষকবৃন্দ', count: teacherMessages.length },
                        { name: 'hero_slides', label: 'হিরো স্লাইড', count: heroSlides.length },
                        { name: 'notices', label: 'নোটিশ বোর্ড', count: notices.length },
                        { name: 'schedule', label: 'সময়সূচি', count: schedule.length },
                        { name: 'cultural_schedule', label: 'সাংস্কৃতিক পর্ব', count: culturalSchedule.length },
                        { name: 'donations', label: 'দাতা ও অনুদান', count: donors.length },
                        { name: 'gallery', label: 'ছবি ও ভিডিও', count: gallery.length },
                        { name: 'magazine', label: 'স্মৃতির পাতা', count: magazineArticles.length },
                        { name: 'finance', label: 'আর্থিক হিসাব', count: 1 },
                        { name: 'global_config', label: 'সাইট কনফিগ', count: 1 },
                        { name: 'admin_info', label: 'অ্যাডমিন তথ্য', count: 1 },
                        { name: 'stats', label: 'পরিসংখ্যান', count: 1 },
                      ]
                  ).map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => loadMongoCollectionDocs(col.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMongoCollection === col.name
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 truncate">
                          {col.name}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            selectedMongoCollection === col.name
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {toBengaliNumber(col.count)}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate">{col.label}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Collection Document Viewer */}
                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white font-mono">
                        collection: <span className="text-emerald-400">{selectedMongoCollection}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({toBengaliNumber(collectionDocs.length)} টি ডকুমেন্ট সংরক্ষিত)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(collectionDocs, null, 2));
                        flashMessage('JSON কপি করা হয়েছে');
                      }}
                      className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>JSON কপি করুন</span>
                    </button>
                  </div>

                  {collectionLoading ? (
                    <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>MongoDB থেকে ডকুমেন্ট লোড করা হচ্ছে...</span>
                    </div>
                  ) : collectionDocs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400">
                      কোনো ডকুমেন্ট পাওয়া যায়নি। উপরে 'MongoDB সিঙ্ক করুন' বা 'ডেমো ডেটা সিড করুন' বাটনে ক্লিক করুন।
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-2 pr-1 font-mono text-xs text-slate-300">
                      {collectionDocs.map((doc, idx) => (
                        <div
                          key={doc.id || doc._id || idx}
                          className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1 border-b border-slate-800/80 pb-1">
                            <span>
                              #{idx + 1} • {doc.name || doc.title || doc.siteTitle || doc.festivalTitle || doc.id || doc._id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              _id: {doc._id || doc.id}
                            </span>
                          </div>
                          <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          
    </>
  );
};
