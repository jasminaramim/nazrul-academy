import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Search, Plus, Edit2, Trash2, Check, Eye } from 'lucide-react';
import { StudentDetailModal } from '../../../frontend/components/StudentDetailModal';
import { BatchDropdown } from '../../../shared/components/BatchDropdown';
interface StudentsTabProps {
  students: any;
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

export const StudentsTab: React.FC<StudentsTabProps> = ({ students, editingStudent, setEditingStudent, studentSearch, setStudentSearch, studentBatchFilter, setStudentBatchFilter, flashMessage, loadAllData }) => {
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [approvingStudent, setApprovingStudent] = useState<Student | null>(null);
  const [isApproving, setIsApproving] = useState(false);

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
                      placeholder="শিক্ষার্থীর নাম বা জেলা খুঁজুন..."
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
                          if (studentSearch) {
                            const q = studentSearch.toLowerCase();
                            return (
                              s.name.toLowerCase().includes(q) ||
                              (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
                              s.location.toLowerCase().includes(q) ||
                              s.batch.toLowerCase().includes(q)
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
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800">
                              <span className="bg-red-50 text-[#CA0000] px-2 py-0.5 rounded border border-red-200 block w-fit mb-1">
                                {s.bloodGroup}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">{s.location}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-800 font-bold block">{s.registrationFee ? `৳${s.registrationFee}` : '-'}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{s.transactionId || '-'}</span>
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
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="সম্পাদনা"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`আপনি কি "${s.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                                    await apiService.deleteStudent(s.id);
                                    flashMessage('শিক্ষার্থী ডিলিট করা হয়েছে');
                                    loadAllData();
                                  }
                                }}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingStudent.id ? 'শিক্ষার্থী তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী নিবন্ধন'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">পূর্ণ নাম (বাংলা বা ইংরেজি) *</label>
                        <input
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ *</label>
                        <BatchDropdown
                          value={editingStudent.batch}
                          onChange={(val) => {
                            const bnToEnMap: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
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
                          onChange={(e) => setEditingStudent({ ...editingStudent, batchType: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        >
                          <option value="new">নতুন ব্যাচ</option>
                          <option value="old">পুরাতন ব্যাচ</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">রক্তের গ্রুপ</label>
                        <select
                          value={editingStudent.bloodGroup}
                          onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">বর্তমান ঠিকানা</label>
                        <input
                          type="text"
                          value={editingStudent.location}
                          onChange={(e) => setEditingStudent({ ...editingStudent, location: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">পেশা</label>
                        <input
                          type="text"
                          value={editingStudent.currentJob}
                          onChange={(e) => setEditingStudent({ ...editingStudent, currentJob: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">প্রতিষ্ঠান / কোম্পানি</label>
                        <input
                          type="text"
                          value={editingStudent.company}
                          onChange={(e) => setEditingStudent({ ...editingStudent, company: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="শিক্ষার্থীর ছবি (Drag & Drop / Cloudinary আপলোড)"
                          value={editingStudent.image}
                          onChange={(url) => setEditingStudent({ ...editingStudent, image: url })}
                          aspectRatio="square"
                          placeholder="শিক্ষার্থীর প্রোফাইল ছবি ড্রপ বা নির্বাচন করুন"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingStudent.id) {
                            await apiService.updateStudent(editingStudent.id, editingStudent);
                          } else {
                            await apiService.addStudent(editingStudent);
                          }
                          flashMessage('শিক্ষার্থী তথ্য সংরক্ষিত হয়েছে');
                          setEditingStudent(null);
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
          
            {/* View Student Modal */}
            <StudentDetailModal
              student={viewingStudent}
              onClose={() => setViewingStudent(null)}
            />

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
                          const res = await apiService.approveRegistration(approvingStudent.id);
                          if (res.success) {
                            flashMessage('রেজিস্ট্রেশন সফলভাবে অনুমোদন করা হয়েছে');
                            loadAllData();
                            setApprovingStudent(null);
                          } else {
                            alert(res.message || 'সমস্যা হয়েছে');
                          }
                        } catch (err: any) {
                          alert('সমস্যা হয়েছে: ' + err.message);
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
    </>
  );
};
