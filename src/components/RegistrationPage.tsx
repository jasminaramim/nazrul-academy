import React, { useState } from 'react';
import { UserPlus, CheckCircle2, Droplet, MapPin, Briefcase, Phone, Mail, Shirt, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageUploader } from './ImageUploader';

interface RegistrationPageProps {
  onSuccessNavigate: (page: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onSuccessNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'B+',
    batch: '২০১০',
    location: 'ত্রিশাল, ময়মনসিংহ',
    school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
    currentJob: '',
    company: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    familyMembersCount: 0,
    tshirtSize: 'L',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        setSuccess(true);
        setRegisteredData({ ...formData });
      } else {
        setError(res.message || 'নিবন্ধন সম্পন্ন করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(err.message || 'সার্ভার সমস্যা দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (success && registeredData) {
    return (
      <div className="py-16 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white max-w-xl w-full rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00732A] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#00732A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              নিবন্ধন সফল হয়েছে
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              অভিনন্দন, {registeredData.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              আপনার পুনর্মিলনী নিবন্ধন সম্পন্ন হয়েছে এবং আপনার প্রোফাইল অ্যালামনাই ডিরেক্টরিতে যুক্ত করা হয়েছে।
            </p>
          </div>

          {/* Identity Slip */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">ব্যাচ:</span>
              <span className="font-bold text-slate-900">{registeredData.batch}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">রক্তের গ্রুপ:</span>
              <span className="font-bold text-[#CA0000]">{registeredData.bloodGroup}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">টি-শার্ট সাইজ:</span>
              <span className="font-bold text-[#00732A]">{registeredData.tshirtSize}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">পরিবারের সদস্য:</span>
              <span className="font-bold text-slate-900">{registeredData.familyMembersCount} জন</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">ইমেইল:</span>
              <span className="font-mono text-slate-800">{registeredData.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => onSuccessNavigate('alumni')}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>অ্যালামনাই তালিকা দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSuccessNavigate('home')}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              হোমে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            অনলাইন ফর্ম
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            প্রাক্তন শিক্ষার্থী পুনর্মিলনী নিবন্ধন
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            ত্রিশাল সরকারি নজরুল একাডেমির সকল প্রাক্তন ছাত্র-ছাত্রীদের এই ফর্মের মাধ্যমে নিবন্ধন সম্পন্ন করার জন্য অনুরোধ করা হচ্ছে।
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8"
        >
          {/* Group 1: Account & Basic Info */}
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-[#00732A]" />
              <span>মৌলিক ও অ্যাকাউন্টের তথ্য</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  বাংলায় পূর্ণ নাম *
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: মো. কামরুল হাসান"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ইংরেজিতে নাম (Name in English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Md. Kamrul Hasan"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ইমেইল ঠিকানা (লগইনের জন্য) *
                </label>
                <input
                  required
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পাসওয়ার্ড নির্ধারণ করুন *
                </label>
                <input
                  required
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="০১৭১২-৩৪৫৬৭৮"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  রক্তের গ্রুপ *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold text-[#CA0000]"
                >
                  <option value="A+">A+ (পজিটিভ)</option>
                  <option value="A-">A- (নেগেটিভ)</option>
                  <option value="B+">B+ (পজিটিভ)</option>
                  <option value="B-">B- (নেগেটিভ)</option>
                  <option value="O+">O+ (পজিটিভ)</option>
                  <option value="O-">O- (নেগেটিভ)</option>
                  <option value="AB+">AB+ (পজিটিভ)</option>
                  <option value="AB-">AB- (নেগেটিভ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: School & Batch Details */}
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
              <Shirt className="w-4 h-4 text-[#CA0000]" />
              <span>ব্যাচ ও উৎসবের পরিমাপ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  এসএসসি পাশের ব্যাচ (সাল) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: ব্যাচ ২০১১ বা ১৯৯৫"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  টি-শার্ট সাইজ (উপহার) *
                </label>
                <select
                  value={formData.tshirtSize}
                  onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold text-[#00732A]"
                >
                  <option value="S">S (Small - ৩৮)</option>
                  <option value="M">M (Medium - ৪০)</option>
                  <option value="L">L (Large - ৪২)</option>
                  <option value="XL">XL (Extra Large - ৪৪)</option>
                  <option value="XXL">XXL (Double Extra Large - ৪৬)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পরিবারের সদস্য সংখ্যা (যদি সাথে আনেন)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.familyMembersCount}
                  onChange={(e) => setFormData({ ...formData, familyMembersCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Location & Profession */}
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>বর্তমান পেশা ও অবস্থান</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  বর্তমান ঠিকানা / অবস্থান *
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: ত্রিশাল, ময়মনসিংহ বা ঢাকা"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  বর্তমান পেশা / পদবি
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সফটওয়্যার প্রকৌশলী / শিক্ষক / চিকিৎসক"
                  value={formData.currentJob}
                  onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কর্মস্থল বা প্রতিষ্ঠানের নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা মেডিকেল / ডাচ বাংলা ব্যাংক / স্বনামধন্য প্রতিষ্ঠান"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 4: Profile Image Selection */}
          <div className="space-y-3">
            <ImageUploader
              label="প্রোফাইল ছবি (Drag & Drop / Cloudinary আপলোড)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              aspectRatio="square"
              placeholder="আপনার প্রোফাইল ছবি ড্রপ করুন অথবা ফাইল সিলেক্ট করুন"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <span className="text-[11px] text-slate-500 shrink-0">অথবা নমুনা ছবি:</span>
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: url })}
                  className={`w-8 h-8 rounded-lg overflow-hidden border cursor-pointer shrink-0 transition-transform ${
                    formData.image === url ? 'ring-2 ring-[#00732A] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <span>প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>নিবন্ধন সম্পন্ন করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
