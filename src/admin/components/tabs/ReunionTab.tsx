import React, { useState, useEffect } from 'react';
import { Reunion } from '../../../shared/types';
import { apiService } from '../../../shared/services/api';
import Swal from 'sweetalert2';

export const ReunionTab: React.FC = () => {
  const [reunions, setReunions] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Reunion>>({
    title: '',
    year: new Date().getFullYear(),
    isActive: false,
  });

  useEffect(() => {
    loadReunions();
  }, []);

  const loadReunions = async () => {
    try {
      setLoading(true);
      const res = await apiService.reunions.getAll();
      setReunions(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string, isActive: boolean) => {
    if (isActive) {
      Swal.fire({
        icon: 'error',
        title: 'দুঃখিত!',
        text: 'বর্তমান ইভেন্ট ডিলেট করা যাবে না।',
        confirmButtonColor: '#059669',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "এই ইভেন্টটি ডিলেট করলে আর ফিরে পাওয়া যাবে না!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'হ্যাঁ, ডিলেট করুন',
      cancelButtonText: 'বাতিল'
    });

    if (result.isConfirmed) {
      try {
        await apiService.reunions.delete(id);
        Swal.fire('ডিলেট সম্পন্ন!', 'ইভেন্টটি ডিলেট করা হয়েছে।', 'success');
        loadReunions();
      } catch (err) {
        Swal.fire('ত্রুটি!', 'ইভেন্ট ডিলেট করতে সমস্যা হয়েছে।', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData, id: formData.id || `reunion-${formData.year}-${Date.now()}` };
      if (formData.id) {
        await apiService.reunions.update(formData.id, dataToSave);
      } else {
        await apiService.reunions.create(dataToSave);
      }
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: 'পুনর্মিলনী সফলভাবে সেভ করা হয়েছে।',
        confirmButtonColor: '#059669',
      });
      loadReunions();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'দুঃখিত!',
        text: 'পুনর্মিলনী সেভ করতে সমস্যা হয়েছে।',
        confirmButtonColor: '#059669',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">পুনর্মিলনী ইভেন্টসমূহ</h2>
          <p className="text-slate-500 mt-1">সবগুলো পুনর্মিলনী ইভেন্ট পরিচালনা করুন এবং বর্তমান ইভেন্ট সেট করুন</p>
        </div>
        <button
          onClick={() => { setFormData({ title: '', year: new Date().getFullYear(), isActive: false }); setShowModal(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2 shadow-sm"
        >
          <span>নতুন পুনর্মিলনী যোগ করুন</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">লোড হচ্ছে...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-4 font-semibold">শিরোনাম</th>
                <th className="p-4 font-semibold">বছর</th>
                <th className="p-4 font-semibold">বর্তমান অবস্থা</th>
                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {reunions.map((reunion: any) => (
                <tr key={reunion.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{reunion.title}</td>
                  <td className="p-4 text-slate-600">{reunion.year}</td>
                  <td className="p-4">
                    {reunion.isActive ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                        বর্তমান ইভেন্ট
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
                        সাবেক ইভেন্ট
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setFormData(reunion); setShowModal(true); }}
                      className="text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors mr-2"
                    >
                      এডিট করুন
                    </button>
                    <button
                      onClick={() => handleDelete(reunion.id, !!reunion.isActive)}
                      className="text-red-600 hover:text-red-800 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ডিলেট
                    </button>
                  </td>
                </tr>
              ))}
              {reunions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">কোনো ইভেন্ট পাওয়া যায়নি</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {formData._id ? 'পুনর্মিলনী আপডেট করুন' : 'নতুন পুনর্মিলনী তৈরি করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ইভেন্টের শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  placeholder="যেমন: শতবর্ষ পূর্তি পুনর্মিলনী ২০২৬"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">বছর</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex-1">
                  বর্তমান ইভেন্ট হিসেবে সেট করুন
                  <span className="block text-xs text-slate-500 font-normal mt-0.5">
                    (এটি সিলেক্ট করলে অন্য সকল ইভেন্ট সাবেক হয়ে যাবে এবং নতুন রেজিস্ট্রেশন এই ইভেন্টে যুক্ত হবে)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium shadow-sm"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
