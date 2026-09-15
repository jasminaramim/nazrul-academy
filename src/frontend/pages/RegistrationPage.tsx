import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Droplet, MapPin, Briefcase, Phone, Mail, Shirt, Users, AlertCircle, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ImageUploader } from '../../shared/components/ImageUploader';
import { apiService } from '../../shared/services/api';
import { BatchDropdown } from '../../shared/components/BatchDropdown';

interface RegistrationPageProps {
  onSuccessNavigate: (page: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onSuccessNavigate }) => {
  const { register } = useAuth();
  
  const [config, setConfig] = useState<any>(null);
  
  useEffect(() => {
    apiService.getGlobalConfig().then(res => setConfig(res));
  }, []);

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
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    tshirtSize: 'L',
    registrationFee: 1500,
    transactionId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(async () => {
      const data: any = {};
      if (formData.email && formData.email.includes('@')) data.email = formData.email;
      if (formData.phone && formData.phone.length >= 11) data.phone = formData.phone;
      if (formData.transactionId && formData.transactionId.length >= 6) data.transactionId = formData.transactionId;
      
      if (Object.keys(data).length > 0) {
        const res = await apiService.checkAvailability(data);
        if (res.success && res.errors) {
          setValidationErrors(res.errors);
        } else {
          setValidationErrors({});
        }
      } else {
        setValidationErrors({});
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email, formData.phone, formData.transactionId]);

  const sampleAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter',
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

  const bnToEnNumber = (bnStr: string) => {
    const bnToEnMap: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return bnStr.replace(/[০-৯]/g, (match) => bnToEnMap[match]);
  };

  const handleBatchChange = (val: string) => {
    const enVal = bnToEnNumber(val);
    const yearMatch = enVal.match(/\d{4}/);
    let fee = formData.registrationFee;
    
    if (yearMatch && config) {
      const year = parseInt(yearMatch[0], 10);
      if (year <= 2015) {
        fee = config.feeOldBatch || 1500;
      } else {
        fee = config.feeNewBatch || 1000;
      }
    } else if (!yearMatch) {
      fee = config?.feeOldBatch || 1500;
    }
    
    setFormData({ ...formData, batch: val, registrationFee: fee });
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
              নিবন্ধন সাবমিট হয়েছে
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              ধন্যবাদ, {registeredData.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              আপনার নিবন্ধনটি সফলভাবে সাবমিট হয়েছে। আমরা আপনার পেমেন্ট ভেরিফাই করে আপনাকে ম্যাসেজের মাধ্যমে জানাবো। ভেরিফিকেশনের পর আপনার প্রোফাইলটি অ্যালামনাই ডিরেক্টরিতে যুক্ত করা হবে।
            </p>
          </div>

          {/* Identity Slip */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">ব্যাচ:</span>
              <span className="font-bold text-slate-900">{registeredData.batch}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">পরিশোধিত ফি:</span>
              <span className="font-bold text-[#00732A]">৳{registeredData.registrationFee}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">TrxID:</span>
              <span className="font-mono text-slate-800">{registeredData.transactionId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">রক্তের গ্রুপ:</span>
              <span className="font-bold text-[#CA0000]">{registeredData.bloodGroup}</span>
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
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পূর্ণ নাম (বাংলা বা ইংরেজি) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: মো. কামরুল হাসান / Md. Kamrul Hasan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {validationErrors.email ? (
                  <p className="text-[10px] sm:text-xs text-red-600 mt-1.5 ml-1 font-bold">
                    * {validationErrors.email}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 ml-1">
                    * অনুগ্রহ করে আপনার সঠিক ও সচল ইমেইল দিন, যাতে আমরা আপনার সাথে যোগাযোগ করতে পারি।
                  </p>
                )}
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
                {validationErrors.phone ? (
                  <p className="text-[10px] sm:text-xs text-red-600 mt-1.5 ml-1 font-bold">
                    * {validationErrors.phone}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 ml-1">
                    * অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন, যাতে ভেরিফিকেশন মেসেজ ও অন্যান্য তথ্য পাঠাতে পারি।
                  </p>
                )}
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
                <BatchDropdown
                  value={formData.batch}
                  onChange={handleBatchChange}
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

          {/* Group 4: Payment Details */}
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>পেমেন্ট তথ্য (বিকাশ/নগদ/রকেট)</span>
            </h3>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-4 text-xs sm:text-sm text-purple-900 leading-relaxed">
              অনুগ্রহ করে নিচে উল্লেখিত ফি নির্দিষ্ট নম্বরে Send Money করে Transaction ID প্রদান করুন।
              <div className="font-bold mt-2">
                বিকাশ/নগদ/রকেট: <span className="font-mono bg-purple-200 px-2 py-0.5 rounded">{config?.bkashNumber || '০১৭XX-XXXXXX'}</span> (Personal)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  রেজিস্ট্রেশন ফি (টাকা) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                  <input
                    type="number"
                    readOnly
                    value={formData.registrationFee}
                    className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">ব্যাচ অনুযায়ী স্বয়ংক্রিয়ভাবে নির্ধারিত</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: 9A7B3X8Z"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-mono uppercase"
                />
                {validationErrors.transactionId && (
                  <p className="text-[10px] sm:text-xs text-red-600 mt-1.5 ml-1 font-bold">
                    * {validationErrors.transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Group 5: Profile Image Selection */}
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
              disabled={loading || Object.keys(validationErrors).length > 0}
              className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
