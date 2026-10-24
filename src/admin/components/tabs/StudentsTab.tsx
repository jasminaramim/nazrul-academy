import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { 
  Search, Plus, Edit2, Trash2, Check, Eye, IdCard, Download, Loader2,
  Shirt, User, MapPin, Briefcase, Building2, Droplets, Phone, Mail, X, Save, Sparkles, GraduationCap
} from 'lucide-react';
import { StudentDetailModal } from '../../../frontend/components/StudentDetailModal';
import { BatchDropdown } from '../../../shared/components/BatchDropdown';
import * as htmlToImage from 'html-to-image';
import { StudentCardTemplate } from '../StudentCardTemplate';

const TSHIRT_OPTIONS = [
  { value: 'S', label: 'S', description: 'Small - ৩৮"' },
  { value: 'M', label: 'M', description: 'Medium - ৪০"' },
  { value: 'L', label: 'L', description: 'Large - ৪২"' },
  { value: 'XL', label: 'XL', description: 'Extra Large - ৪৪"' },
  { value: 'XXL', label: 'XXL', description: '2XL - ৪৬"' },
  { value: 'XXXL', label: 'XXXL', description: '3XL - ৪৮"' },
];
interface StudentsTabProps {
  students: any;
  globalConfig: any;
  editingStudent: any;
  setEditingStudent: any;
  studentSearch: any;
  setStudentSearch: any;
  studentBatchFilter: any;
  setStudentBatchFilter: any;
  flashMessage: any;
  loadAllData: any;
}

const enToBnNumber = (en: number | string) => {
  const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(en).split('').map(d => /\d/.test(d) ? bnDigits[Number(d)] : d).join('');
};

const generateBatchOptions = () => {
  const options = [];
  for (let year = 2026; year >= 1913; year--) {
    options.push(year);
  }
  return options;
};

export const StudentsTab: React.FC<StudentsTabProps> = ({ students, globalConfig, editingStudent, setEditingStudent, studentSearch, setStudentSearch, studentBatchFilter, setStudentBatchFilter, flashMessage, loadAllData }) => {
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [approvingStudent, setApprovingStudent] = useState<Student | null>(null);
  const [viewingCardStudent, setViewingCardStudent] = useState<Student | null>(null);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const cardRef = React.useRef<HTMLDivElement>(null);
  const viewCardRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      
            <div className="space-y-6">
              {/* Header with Search and Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="শিক্ষার্থীর নাম, জেলা বা TrxID খুঁজুন..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <select
                    value={studentBatchFilter}
                    onChange={(e) => setStudentBatchFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="all">সকল ব্যাচ</option>
                    <option value="old">পুরাতন ব্যাচ (২০১০ এর পূর্বে)</option>
                    <option value="new">নতুন ব্যাচ (২০১১ পরবর্তী)</option>
                  </select>

                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="all">সকল পেমেন্ট</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setEditingStudent({
                      id: '',
                      name: '',
                      nameEn: '',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      batch: 'ব্যাচ ২০১১',
                      batchType: 'new',
                      location: 'ত্রিশাল, ময়মনসিংহ',
                      bloodGroup: 'B+',
                      phone: '',
                      email: '',
                      school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
                      currentJob: '',
                      company: '',
                      tshirtSize: 'L'
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21] shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন শিক্ষার্থী যোগ করুন</span>
                </button>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3.5">ছবি ও নাম</th>
                        <th className="px-4 py-3.5">ব্যাচ ও টাইপ</th>
                        <th className="px-4 py-3.5">রক্তের গ্রুপ ও ঠিকানা</th>
                        <th className="px-4 py-3.5">ফি ও TrxID</th>
                        <th className="px-4 py-3.5">স্ট্যাটাস</th>
                        <th className="px-4 py-3.5 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter((s) => {
                          if (studentBatchFilter !== 'all' && s.batchType !== studentBatchFilter) return false;
                          if (paymentMethodFilter !== 'all' && s.paymentMethod?.toLowerCase() !== paymentMethodFilter.toLowerCase()) return false;
                          if (studentSearch) {
                            const q = studentSearch.toLowerCase();
                            return (
                              s.name.toLowerCase().includes(q) ||
                              (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
                              s.location.toLowerCase().includes(q) ||
                              s.batch.toLowerCase().includes(q) ||
                              (s.transactionId && s.transactionId.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        })
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 flex items-center gap-2.5">
                              <img src={s.image} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0 border" />
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">{s.name}</span>
                                {s.nameEn && <span className="text-[10px] text-slate-400 font-sans">{s.nameEn}</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-[#CA0000]">{s.batch}</span>
                              <span className="text-[10px] text-slate-400 block">
                                {s.batchType === 'old' ? 'পুরাতন ব্যাচ' : 'নতুন ব্যাচ'}
                              </span>
                              {s.tshirtSize && (
                                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Shirt className="w-2.5 h-2.5" /> সাইজ: {s.tshirtSize}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800">
                              <span className="bg-red-50 text-[#CA0000] px-2 py-0.5 rounded border border-red-200 block w-fit mb-1">
                                {s.bloodGroup}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">{s.location}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-800 font-bold block">{s.registrationFee ? `৳${s.registrationFee}` : '-'}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">{s.transactionId || '-'}</span>
                              {s.paymentMethod && (
                                <span className="text-[10px] text-[#00732A] font-medium block capitalize bg-emerald-50 px-1 py-0.5 rounded w-fit mt-0.5 border border-emerald-100">{s.paymentMethod}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {s.status === 'pending' ? (
                                <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 text-[10px] font-bold whitespace-nowrap">অপেক্ষমান</span>
                              ) : (
                                <span className="bg-emerald-50 text-[#00732A] px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold whitespace-nowrap">অনুমোদিত</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right space-x-1 flex items-center justify-end h-full mt-1.5">
                              <button
                                onClick={() => setViewingStudent(s)}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                                title="বিস্তারিত দেখুন"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {s.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setApprovingStudent(s);
                                  }}
                                  className="p-1.5 text-white bg-[#00732A] hover:bg-[#005c21] rounded"
                                  title="অনুমোদন করুন"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {s.status === 'approved' && (
                                <button
                                  onClick={() => setViewingCardStudent(s)}
                                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                                  title="আইডি কার্ড দেখুন"
                                >
                                  <IdCard className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="সম্পাদনা"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setStudentToDelete(s)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit / Add Student Modal */}
              {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
                    
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-emerald-800 via-[#00732A] to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="absolute right-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                        title="বন্ধ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                          <GraduationCap className="w-6 h-6 text-emerald-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {editingStudent.id ? 'শিক্ষার্থী তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী নিবন্ধন'}
                            </h3>
                            {editingStudent.id && (
                              <span className="text-[10px] font-mono font-semibold bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-2 py-0.5 rounded-full">
                                ID: {editingStudent.id}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-emerald-100/80 mt-0.5">
                            শিক্ষার্থীর ব্যক্তিগত তথ্য, ব্যাচ, টি-শার্ট সাইজ ও যোগাযোগের বিবরণ হালনাগাদ করুন
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-slate-50/70 flex-1">
                      
                      {/* Card 1: নাম ও ব্যাচ সংক্রান্ত তথ্য */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>মৌলিক ও ব্যাচ বিবরণ</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              পূর্ণ নাম (বাংলা) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: মো: সাজ্জাদ হোসাইন (সোহাগ)"
                              value={editingStudent.name || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              নাম (ইংরেজি - ID কার্ডের জন্য)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Md. Sazzad Hossain"
                              value={editingStudent.nameEn || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, nameEn: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-sans text-slate-800 transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              ব্যাচ <span className="text-red-500">*</span>
                            </label>
                            <BatchDropdown
                              value={editingStudent.batch}
                              onChange={(val) => {
                                const bnToEnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
                                const enVal = val.replace(/[০-৯]/g, (m) => bnToEnMap[m]);
                                const yearMatch = enVal.match(/\d{4}/);
                                let batchType = editingStudent.batchType;
                                if (yearMatch) {
                                  const year = parseInt(yearMatch[0], 10);
                                  batchType = year <= 2015 ? 'old' : 'new';
                                }
                                setEditingStudent({ ...editingStudent, batch: val, batchType });
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ টাইপ</label>
                            <select
                              value={editingStudent.batchType}
                              onChange={(e) => setEditingStudent({ ...editingStudent, batchType: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 bg-white transition-all outline-none"
                            >
                              <option value="new">নতুন ব্যাচ (২০১১ পরবর্তী)</option>
                              <option value="old">পুরাতন ব্যাচ (২০১০ এর পূর্বে)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: টি-শার্ট সাইজ ও রক্তের গ্রুপ */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <Shirt className="w-4 h-4 text-emerald-600" />
                            <span>টি-শার্ট সাইজ ও রক্তের গ্রুপ</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            নির্বাচিত সাইজ: {editingStudent.tshirtSize || 'L'}
                          </span>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-2">
                            টি-শার্ট সাইজ নির্বাচন করুন <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {TSHIRT_OPTIONS.map((item) => {
                              const isSelected = (editingStudent.tshirtSize || 'L') === item.value;
                              return (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => setEditingStudent({ ...editingStudent, tshirtSize: item.value })}
                                  className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-50/90 text-emerald-900 shadow-xs ring-2 ring-emerald-500/30 font-bold'
                                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-1">
                                    <span className="font-extrabold text-sm">{item.value}</span>
                                    {isSelected && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {item.description.includes('-') ? item.description.split('-')[1].trim() : item.description}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              রক্তের গ্রুপ
                            </label>
                            <select
                              value={editingStudent.bloodGroup}
                              onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800 bg-white transition-all outline-none"
                            >
                              <option value="A+">A+ (পজিটিভ)</option>
                              <option value="A-">A- (নেগেটিভ)</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+ (পজিটিভ)</option>
                              <option value="O-">O- (নেগেটিভ)</option>
                              <option value="AB+">AB+ (পজিটিভ)</option>
                              <option value="AB-">AB- (নেগেটিভ)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              বর্তমান ঠিকানা / শহর
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: ত্রিশাল, ময়মনসিংহ"
                              value={editingStudent.location || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, location: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: যোগাযোগ ও কর্মজীবন */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                          <span>যোগাযোগ ও কর্মজীবন</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                            <input
                              type="text"
                              placeholder="017xxxxxxxx"
                              value={editingStudent.phone || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 font-mono transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল ঠিকানা</label>
                            <input
                              type="email"
                              placeholder="example@mail.com"
                              value={editingStudent.email || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 font-sans transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">পেশা / পদবি</label>
                            <input
                              type="text"
                              placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার / ব্যবসায়ী"
                              value={editingStudent.currentJob || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, currentJob: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">প্রতিষ্ঠান / কোম্পানি</label>
                            <input
                              type="text"
                              placeholder="যেমন: ঢাকা ব্যাংক / নিজস্ব ব্যবসা"
                              value={editingStudent.company || ''}
                              onChange={(e) => setEditingStudent({ ...editingStudent, company: e.target.value })}
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#00732A] focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 4: ছবি আপলোড */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                        <ImageUploader
                          label="শিক্ষার্থীর প্রোফাইল ছবি (Drag & Drop / Cloudinary আপলোড)"
                          value={editingStudent.image}
                          onChange={(url) => setEditingStudent({ ...editingStudent, image: url })}
                          aspectRatio="square"
                          placeholder="শিক্ষার্থীর প্রোফাইল ছবি ড্রপ বা নির্বাচন করুন"
                        />
                      </div>

                    </div>

                    {/* Modal Footer */}
                    <div className="bg-white border-t border-slate-200 px-5 py-4 sm:px-6 flex items-center justify-between gap-3 shrink-0">
                      <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>সকল পরিবর্তন সাথে সাথে ডাটাবেজে সংরক্ষিত হবে</span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingStudent(null)}
                          disabled={isSavingStudent}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSavingStudent}
                          onClick={async () => {
                            if (!editingStudent.name?.trim()) {
                              flashMessage('দয়া করে শিক্ষার্থীর নাম পূরণ করুন', true);
                              return;
                            }
                            try {
                              setIsSavingStudent(true);
                              const payload = {
                                ...editingStudent,
                                tshirtSize: editingStudent.tshirtSize || 'L'
                              };
                              if (editingStudent.id) {
                                await apiService.updateStudent(editingStudent.id, payload);
                              } else {
                                await apiService.addStudent(payload);
                              }
                              flashMessage('শিক্ষার্থী তথ্য সফলভাবে সংরক্ষিত হয়েছে');
                              setEditingStudent(null);
                              loadAllData();
                            } catch (err) {
                              flashMessage('সংরক্ষণ ব্যর্থ হয়েছে: ' + (err.message || 'অজানা ত্রুটি'), true);
                            } finally {
                              setIsSavingStudent(false);
                            }
                          }}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-[#00732A] hover:from-emerald-700 hover:to-[#005c21] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isSavingStudent ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>সংরক্ষণ হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>সংরক্ষণ করুন</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          
            {/* View Student Modal */}
            <StudentDetailModal
              student={viewingStudent}
              onClose={() => setViewingStudent(null)}
              isAdminView={true}
            />

            {/* Delete Confirmation Modal */}
            {studentToDelete && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">শিক্ষার্থী মুছে ফেলুন</h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium">
                    আপনি কি সত্যিই <span className="font-bold text-slate-900">{studentToDelete.name}</span>-কে তালিকা থেকে মুছে ফেলতে চান?
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setStudentToDelete(null)}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      disabled={isDeleting}
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await apiService.deleteStudent(studentToDelete.id);
                          flashMessage('শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে');
                          loadAllData();
                          setStudentToDelete(null);
                        } catch (err: any) {
                          flashMessage('সমস্যা হয়েছে: ' + err.message, true);
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex justify-center items-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'অপেক্ষা করুন...' : 'হ্যাঁ, মুছে ফেলুন'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Dialog */}
            {approvingStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center transform transition-all scale-100 opacity-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
                    <Check className="w-8 h-8 text-[#00732A]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">অনুমোদন নিশ্চিত করুন</h3>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6 text-left border border-slate-100">
                    <p className="text-sm text-slate-600 mb-1">শিক্ষার্থীর নাম: <span className="font-bold text-slate-900">{approvingStudent.name}</span></p>
                    <p className="text-sm text-slate-600 mb-1">ব্যাচ: <span className="font-bold text-[#CA0000]">{approvingStudent.batch}</span></p>
                    <p className="text-sm text-slate-600 mb-1">ফি: <span className="font-bold text-slate-900">{approvingStudent.registrationFee ? `৳${approvingStudent.registrationFee}` : '-'}</span></p>
                    <p className="text-sm text-slate-600">TrxID: <span className="font-mono font-bold text-slate-700">{approvingStudent.transactionId || '-'}</span></p>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-6 font-medium">আপনি কি এই রেজিস্ট্রেশনটি অনুমোদন করতে চান?</p>
                  
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setApprovingStudent(null)}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      disabled={isApproving}
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={async () => {
                        setIsApproving(true);
                        try {
                          let cardImageData = undefined;
                          if (cardRef.current) {
                            cardImageData = await htmlToImage.toJpeg(cardRef.current, { quality: 0.8, pixelRatio: 2 });
                          }
                          const res = await apiService.approveRegistration(approvingStudent.id, cardImageData);
                          if (res.success) {
                            flashMessage('রেজিস্ট্রেশন সফলভাবে অনুমোদন করা হয়েছে');
                            loadAllData();
                            setApprovingStudent(null);
                          } else {
                            flashMessage(res.message || 'সমস্যা হয়েছে', true);
                            setApprovingStudent(null);
                          }
                        } catch (err: any) {
                          flashMessage('সমস্যা হয়েছে: ' + err.message, true);
                          setApprovingStudent(null);
                        } finally {
                          setIsApproving(false);
                        }
                      }}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#00732A] hover:bg-[#005c21] transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
                      disabled={isApproving}
                    >
                      {isApproving ? 'অপেক্ষা করুন...' : 'হ্যাঁ, অনুমোদন করুন'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hidden ID Card Template for html2canvas to capture */}
            {approvingStudent && globalConfig && (
              <div className="absolute top-[-9999px] left-[-9999px]">
                <StudentCardTemplate ref={cardRef} student={approvingStudent} globalConfig={globalConfig} />
              </div>
            )}

            {/* View & Download ID Card Modal */}
            {viewingCardStudent && globalConfig && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-2xl w-full flex flex-col items-center relative">
                  <button
                    onClick={() => setViewingCardStudent(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <IdCard className="w-6 h-6 text-[#00732A]" />
                    শিক্ষার্থীর আইডি কার্ড
                  </h3>
                  
                  <div className="w-[300px] h-[475px] relative overflow-hidden rounded-xl shadow-2xl border border-slate-200 bg-slate-50">
                    <div className="absolute top-0 left-0 transform scale-50 origin-top-left">
                      <StudentCardTemplate ref={viewCardRef} student={viewingCardStudent} globalConfig={globalConfig} isAdminDownload={true} />
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4 w-full px-8">
                    <button
                      onClick={async () => {
                        if (!viewCardRef.current) return;
                        setIsDownloadingCard(true);
                        try {
                          const dataUrl = await htmlToImage.toJpeg(viewCardRef.current, { quality: 0.95, pixelRatio: 3 });
                          const link = document.createElement('a');
                          link.download = `ID_Card_${viewingCardStudent.id.replace('std-', '')}.jpg`;
                          link.href = dataUrl;
                          link.click();
                          flashMessage('আইডি কার্ড ডাউনলোড শুরু হয়েছে');
                        } catch (err: any) {
                          alert('ডাউনলোড করতে সমস্যা হয়েছে: ' + err.message);
                        } finally {
                          setIsDownloadingCard(false);
                        }
                      }}
                      disabled={isDownloadingCard}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#00732A] hover:bg-[#005c21] transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isDownloadingCard ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          প্রসেস হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          কার্ড ডাউনলোড করুন (JPG)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
    </>
  );
};
