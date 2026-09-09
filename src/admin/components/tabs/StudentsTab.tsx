import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

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

export const StudentsTab: React.FC<StudentsTabProps> = ({ students, editingStudent, setEditingStudent, studentSearch, setStudentSearch, studentBatchFilter, setStudentBatchFilter, flashMessage, loadAllData }) => {
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
                      tshirtSize: 'L',
                      familyMembersCount: 0,
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
                        <th className="px-4 py-3.5">রক্তের গ্রুপ</th>
                        <th className="px-4 py-3.5">বর্তমান ঠিকানা</th>
                        <th className="px-4 py-3.5">পেশা ও প্রতিষ্ঠান</th>
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
                              <span className="bg-red-50 text-[#CA0000] px-2 py-0.5 rounded border border-red-200">
                                {s.bloodGroup}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{s.location}</td>
                            <td className="px-4 py-3">
                              <span className="text-slate-800 block font-medium">{s.currentJob || '-'}</span>
                              <span className="text-[10px] text-slate-400">{s.company || '-'}</span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-1">
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
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">বাংলা নাম *</label>
                        <input
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ইংরেজি নাম</label>
                        <input
                          type="text"
                          value={editingStudent.nameEn}
                          onChange={(e) => setEditingStudent({ ...editingStudent, nameEn: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ *</label>
                        <input
                          type="text"
                          value={editingStudent.batch}
                          onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-[#CA0000]"
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
          
    </>
  );
};
