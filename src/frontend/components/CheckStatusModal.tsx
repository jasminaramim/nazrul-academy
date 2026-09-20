import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { apiService } from '../../shared/services/api';

interface CheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ status: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await apiService.checkStudentStatus(phone, password);
    if (res.success && res.status) {
      setResult({ status: res.status, name: res.name || '' });
    } else {
      setError(res.message || 'স্ট্যাটাস চেক করতে সমস্যা হয়েছে।');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setPhone('');
    setPassword('');
    setError(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#00732A]" />
            অ্যাপ্লিকেশন স্ট্যাটাস চেক
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 mb-4">
                রেজিস্ট্রেশনের সময় প্রদানকৃত আপনার মোবাইল নম্বর এবং পাসওয়ার্ড ব্যবহার করে স্ট্যাটাস চেক করুন।
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: ০১৭১২-৩৪৫৬৭৮"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none transition-shadow"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone || !password}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#00732A] hover:bg-[#005c21] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors mt-2 cursor-pointer"
              >
                {loading ? 'চেক করা হচ্ছে...' : 'স্ট্যাটাস দেখুন'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              {result.status === 'approved' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8 text-[#00732A]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">স্বাগতম, {result.name}!</h3>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00732A] font-bold text-sm">
                    আপনার রেজিস্ট্রেশন অনুমোদিত (Approved)
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    আপনার প্রোফাইল অ্যালামনাই ডিরেক্টরিতে সংযুক্ত করা হয়েছে। আপনি এখন আপনার ফোন নম্বর ও পাসওয়ার্ড ব্যবহার করে সিস্টেমে লগইন করতে পারবেন।
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{result.name}</h3>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-sm">
                    আপনার রেজিস্ট্রেশন অপেক্ষমান (Pending)
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    আপনার প্রদানকৃত পেমেন্ট তথ্য যাচাই করা হচ্ছে। যাচাই সম্পন্ন হওয়ার পর আপনার রেজিস্ট্রেশন অনুমোদন করা হবে এবং আপনাকে ইমেইল/মেসেজের মাধ্যমে জানিয়ে দেওয়া হবে।
                  </p>
                </>
              )}

              <button
                onClick={() => setResult(null)}
                className="w-full mt-6 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                অন্য নম্বর চেক করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
