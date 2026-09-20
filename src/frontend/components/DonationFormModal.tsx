import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Building2,
  QrCode,
  Heart,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileText,
  BadgePercent,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import { GlobalConfig, Donor } from '../../shared/types';
import { apiService } from '../../shared/services/api';
import { PaymentLimitModal } from '../../shared/components/PaymentLimitModal';

interface DonationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  globalConfig: GlobalConfig;
  onDonationSuccess?: (newDonor?: Donor) => void;
}

export const DonationFormModal: React.FC<DonationFormModalProps> = ({
  isOpen,
  onClose,
  globalConfig,
  onDonationSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [limitModal, setLimitModal] = useState<{ isOpen: boolean; methodName: string; methodId: string } | null>(null);

  // QR code URLs
  const [bkashQrDataUrl, setBkashQrDataUrl] = useState<string>('');
  const [nagadQrDataUrl, setNagadQrDataUrl] = useState<string>('');
  const [rocketQrDataUrl, setRocketQrDataUrl] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    batch: '',
    amount: '',
    phone: '',
    email: '',
    paymentMethod: 'bkash',
    senderNumber: '',
    transactionId: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submittedData && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      const timer = setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [submittedData]);

  const bkashNumber = globalConfig.bkashNumber || '01712345678';
  const nagadNumber = globalConfig.nagadNumber || '01797585073';
  const rocketNumber = globalConfig.rocketNumber || '01712345678'; // 11 digits

  // Generate QR codes for bKash, Nagad, Rocket
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(`bkash://payment?recipient=${bkashNumber}&type=merchant&purpose=TrishalNazrulAcademy`, {
      width: 260,
      margin: 2,
    })
      .then(setBkashQrDataUrl)
      .catch(() => QRCode.toDataURL(bkashNumber, { width: 260, margin: 2 }).then(setBkashQrDataUrl));

    QRCode.toDataURL(`nagad://payment?recipient=${nagadNumber}&purpose=TrishalNazrulAcademy`, {
      width: 260,
      margin: 2,
    })
      .then(setNagadQrDataUrl)
      .catch(() => QRCode.toDataURL(nagadNumber, { width: 260, margin: 2 }).then(setNagadQrDataUrl));

    QRCode.toDataURL(`rocket://payment?recipient=${rocketNumber}&purpose=TrishalNazrulAcademy`, {
      width: 260,
      margin: 2,
    })
      .then(setRocketQrDataUrl)
      .catch(() => QRCode.toDataURL(rocketNumber, { width: 260, margin: 2 }).then(setRocketQrDataUrl));
  }, [isOpen, bkashNumber, nagadNumber, rocketNumber]);

  // When active tab changes, sync paymentMethod in formData
  const handleTabChange = (tab: 'bkash' | 'nagad' | 'rocket' | 'bank') => {
    setActiveTab(tab);
    setFormData((prev) => ({ ...prev, paymentMethod: tab }));

    let isOut = false;
    let name = '';
    if (tab === 'bkash' && globalConfig.bkashLimitOut) { isOut = true; name = 'বিকাশ (bKash)'; }
    if (tab === 'nagad' && globalConfig.nagadLimitOut) { isOut = true; name = 'নগদ (Nagad)'; }
    if (tab === 'rocket' && globalConfig.rocketLimitOut) { isOut = true; name = 'রকেট (Rocket)'; }

    if (isOut) {
      setLimitModal({
        isOpen: true,
        methodName: name,
        methodId: tab,
      });
    }
  };

  const getActionMeta = (action?: string, providerName: string = '') => {
    switch (action) {
      case 'payment':
        return {
          key: 'payment',
          badge: 'Make Payment (পেমেন্ট)',
          instruction: `${providerName} অ্যাপের "Make Payment" অপশন ব্যবহার করে পেমেন্ট সম্পন্ন করুন।`,
          tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'cash_out':
        return {
          key: 'cash_out',
          badge: 'Cash Out (ক্যাশ আউট)',
          instruction: `${providerName} অ্যাপ বা USSD ডায়াল করে "Cash Out" অপশন ব্যবহার করে অর্থ প্রেরণ করুন।`,
          tagBg: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'send_money':
      default:
        return {
          key: 'send_money',
          badge: 'Send Money (সেন্ড মানি)',
          instruction: `${providerName} অ্যাপ বা USSD ডায়াল করে "Send Money" অপশন ব্যবহার করে অর্থ প্রেরণ করুন।`,
          tagBg: 'bg-purple-100 text-purple-800 border-purple-300',
        };
    }
  };

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadQr = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let isCurrentLimitOut = false;
    let limitName = '';
    if (formData.paymentMethod === 'bkash' && globalConfig.bkashLimitOut) { isCurrentLimitOut = true; limitName = 'বিকাশ (bKash)'; }
    if (formData.paymentMethod === 'nagad' && globalConfig.nagadLimitOut) { isCurrentLimitOut = true; limitName = 'নগদ (Nagad)'; }
    if (formData.paymentMethod === 'rocket' && globalConfig.rocketLimitOut) { isCurrentLimitOut = true; limitName = 'রকেট (Rocket)'; }

    if (isCurrentLimitOut) {
      setLimitModal({
        isOpen: true,
        methodName: limitName,
        methodId: formData.paymentMethod,
      });
      setErrorMessage(`বর্তমানে ${limitName} অ্যাকাউন্টের লেনদেনের সীমা শেষ! অনুগ্রহ করে অন্য মাধ্যম নির্বাচন করুন।`);
      return;
    }

    const amountNum = Number(formData.amount);
    if (!formData.name.trim()) {
      setErrorMessage('দয়া করে আপনার নাম লিখুন।');
      return;
    }
    if (!amountNum || amountNum <= 0) {
      setErrorMessage('দয়া করে অনুদানের সঠিক পরিমাণ লিখুন।');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('দয়া করে যোগাযোগের মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!formData.senderNumber.trim()) {
      setErrorMessage('যে নম্বর/একাউন্ট থেকে টাকা পাঠিয়েছেন তা লিখুন।');
      return;
    }
    if (!formData.transactionId.trim()) {
      setErrorMessage('দয়া করে TrxID বা ট্রানজেকশন রেফারেন্স লিখুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.submitDonation({
        name: formData.name.trim(),
        nameEn: formData.nameEn.trim(),
        batch: formData.batch.trim() || 'সম্মানিত দাতা',
        amount: amountNum,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        paymentMethod: formData.paymentMethod,
        senderNumber: formData.senderNumber.trim(),
        transactionId: formData.transactionId.trim(),
        message: formData.message.trim(),
      });

      if (res.success) {
        setSubmittedData({
          ...formData,
          amount: amountNum,
          id: res.data?.id,
          createdAt: new Date().toISOString(),
        });
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
        if (onDonationSuccess) {
          onDonationSuccess(res.data);
        }
      } else {
        setErrorMessage(res.message || 'অনুদান সাবমিট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'সার্ভার সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setSubmittedData(null);
    setErrorMessage(null);
    setFormData({
      name: '',
      nameEn: '',
      batch: '',
      amount: '',
      phone: '',
      email: '',
      paymentMethod: 'bkash',
      senderNumber: '',
      transactionId: '',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CA0000] text-white flex items-center justify-center shadow-sm shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                <span>অনুদান প্রদান ও পেমেন্ট তথ্য</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  পুনর্মিলনী ২০২৬
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                বিকাশ, নগদ, রকেট অথবা ব্যাংক একাউন্টের মাধ্যমে সহজে অনুদান প্রেরণ করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div ref={scrollContainerRef} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* SUCCESS STATE */}
          {submittedData ? (
            <div className="py-6 px-4 max-w-lg mx-auto text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-[#00732A] rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">আন্তরিক ধন্যবাদ ও শুভেচ্ছা! 🎉</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  শ্রদ্ধেয় <strong>{submittedData.name}</strong>, আপনার অনুদানের তথ্য সফলভাবে জমা নেওয়া হয়েছে।
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold shadow-2xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>বর্তমান স্ট্যাটাস: অপেক্ষমাণ (Pending Verification)</span>
              </div>

              {/* Receipt Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">দাতার নাম:</span>
                  <span className="font-bold text-slate-900">{submittedData.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">ব্যাচ / পরিচিতি:</span>
                  <span className="font-bold text-slate-800">{submittedData.batch || 'সম্মানিত শুভানুধ্যায়ী'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">অনুদানের পরিমাণ:</span>
                  <span className="font-extrabold text-[#00732A] text-sm">৳ {Number(submittedData.amount).toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">পেমেন্ট মাধ্যম:</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {submittedData.paymentMethod === 'bkash'
                      ? 'বিকাশ (bKash)'
                      : submittedData.paymentMethod === 'nagad'
                      ? 'নগদ (Nagad)'
                      : submittedData.paymentMethod === 'rocket'
                      ? 'রকেট (Rocket)'
                      : 'ব্যাংক একাউন্ট'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">প্রেরক নম্বর:</span>
                  <span className="font-mono font-bold text-slate-800">{submittedData.senderNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">TrxID:</span>
                  <span className="font-mono font-bold text-[#CA0000]">{submittedData.transactionId}</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-left">
                <p className="text-xs text-emerald-900 leading-relaxed">
                  ✓ অ্যাডমিন কর্তৃক ট্রানজেকশন আইডি যাচাই শেষ হলে আপনার নাম অফিসিয়াল <strong>সম্মানিত দাতা তালিকায়</strong> অন্তর্ভুক্ত হবে।
                  {submittedData.email && (
                    <span> এছাড়াও <strong>{submittedData.email}</strong> ইমেইলে নিশ্চিতকরণ পত্র পাঠানো হবে।</span>
                  )}
                </p>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full py-3 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                ঠিক আছে, উইন্ডো বন্ধ করুন
              </button>
            </div>
          ) : (
            <>
              {/* PAYMENT INSTRUCTIONS SECTION */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>১. পেমেন্ট মেথড নির্বাচন ও টাকা পাঠানোর তথ্য</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    প্রথমে নিচের অ্যাকাউন্টে অনুদান পাঠিয়ে TrxID সংগ্রহ করুন
                  </span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {/* bKash Tab */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('bkash')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                      activeTab === 'bkash'
                        ? 'bg-[#e2136e] text-white border-[#e2136e] shadow-md'
                        : 'bg-white text-slate-700 hover:bg-pink-50/60 border-slate-200'
                    }`}
                  >
                    {globalConfig.bkashLimitOut && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse">
                        লিমিট শেষ
                      </span>
                    )}
                    <span className="text-sm">বিকাশ (bKash)</span>
                    <span className={`text-[10px] font-normal ${activeTab === 'bkash' ? 'text-pink-100' : 'text-slate-400'}`}>
                      {globalConfig.bkashType || 'মার্চেন্ট'}
                    </span>
                  </button>

                  {/* Nagad Tab */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('nagad')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                      activeTab === 'nagad'
                        ? 'bg-[#d9381e] text-white border-[#d9381e] shadow-md'
                        : 'bg-white text-slate-700 hover:bg-orange-50/60 border-slate-200'
                    }`}
                  >
                    {globalConfig.nagadLimitOut && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse">
                        লিমিট শেষ
                      </span>
                    )}
                    <span className="text-sm">নগদ (Nagad)</span>
                    <span className={`text-[10px] font-normal ${activeTab === 'nagad' ? 'text-orange-100' : 'text-slate-400'}`}>
                      {globalConfig.nagadType || 'পার্সোনাল'}
                    </span>
                  </button>

                  {/* Rocket Tab */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('rocket')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                      activeTab === 'rocket'
                        ? 'bg-[#8c3077] text-white border-[#8c3077] shadow-md'
                        : 'bg-white text-slate-700 hover:bg-purple-50/60 border-slate-200'
                    }`}
                  >
                    {globalConfig.rocketLimitOut && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse">
                        লিমিট শেষ
                      </span>
                    )}
                    <span className="text-sm">রকেট (Rocket)</span>
                    <span className={`text-[10px] font-normal ${activeTab === 'rocket' ? 'text-purple-100' : 'text-slate-400'}`}>
                      {globalConfig.rocketType || 'পার্সোনাল'} (১১ ডিজিট)
                    </span>
                  </button>

                  {/* Bank Tab */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('bank')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeTab === 'bank'
                        ? 'bg-[#00732A] text-white border-[#00732A] shadow-md'
                        : 'bg-white text-slate-700 hover:bg-emerald-50/60 border-slate-200'
                    }`}
                  >
                    <span className="text-sm">ব্যাংক হিসাব</span>
                    <span className={`text-[10px] font-normal ${activeTab === 'bank' ? 'text-emerald-100' : 'text-slate-400'}`}>
                      সোনালী ব্যাংক
                    </span>
                  </button>
                </div>

                {/* Active Tab Panel */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
                  {/* LIMIT OUT WARNING BANNER */}
                  {((activeTab === 'bkash' && globalConfig.bkashLimitOut) ||
                    (activeTab === 'nagad' && globalConfig.nagadLimitOut) ||
                    (activeTab === 'rocket' && globalConfig.rocketLimitOut)) && (
                    <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 mb-4 animate-in fade-in duration-200">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-amber-900">
                          ⚠️ বর্তমানে আমাদের এই অ্যাকাউন্টের লেনদেনের সীমা (Daily/Monthly Limit) পূর্ণ!
                        </h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা উপরের অন্য কোনো মাধ্যমে (বিকাশ / নগদ / রকেট / ব্যাংক) অনুদান প্রেরণ করুন।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* BKASH VIEW */}
                  {activeTab === 'bkash' && (() => {
                    const bkashActionMeta = getActionMeta(globalConfig.bkashAction || (globalConfig.bkashType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'বিকাশ');
                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-3 h-3 rounded-full bg-[#e2136e]"></span>
                            <span className="font-bold text-sm text-[#e2136e]">বিকাশ পেমেন্ট বিবরণ</span>
                            <span className="text-[10px] font-bold bg-pink-100 text-[#e2136e] px-2 py-0.5 rounded-full">
                              {globalConfig.bkashType || 'মার্চেন্ট'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bkashActionMeta.tagBg}`}>
                              {bkashActionMeta.badge}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">বিকাশ নম্বর</span>
                              <span className="text-base font-black text-slate-900 font-mono">{bkashNumber}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(bkashNumber, 'bkash')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                copiedKey === 'bkash' ? 'bg-emerald-600 text-white' : 'bg-pink-100 text-[#e2136e] hover:bg-[#e2136e] hover:text-white'
                              }`}
                            >
                              {copiedKey === 'bkash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedKey === 'bkash' ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            📌 {bkashActionMeta.instruction} রেফারেন্সে আপনার নাম বা ব্যাচ উল্লেখ করতে পারেন।
                          </p>
                        </div>

                        {/* QR Box */}
                        <div className="flex flex-col items-center bg-pink-50/50 border border-pink-200 rounded-2xl p-3 shrink-0 text-center">
                          {bkashQrDataUrl ? (
                            <img src={bkashQrDataUrl} alt="bKash QR" className="w-32 h-32 object-contain rounded-lg bg-white p-1" />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg">
                              <QrCode className="w-8 h-8 text-slate-400 animate-pulse" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDownloadQr(bkashQrDataUrl, 'bkash_qr_trishal')}
                            className="mt-2 text-[10px] font-bold text-slate-600 hover:text-[#e2136e] flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>QR ডাউনলোড</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* NAGAD VIEW */}
                  {activeTab === 'nagad' && (() => {
                    const nagadActionMeta = getActionMeta(globalConfig.nagadAction || (globalConfig.nagadType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'নগদ');
                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-3 h-3 rounded-full bg-[#d9381e]"></span>
                            <span className="font-bold text-sm text-[#d9381e]">নগদ পেমেন্ট বিবরণ</span>
                            <span className="text-[10px] font-bold bg-orange-100 text-[#d9381e] px-2 py-0.5 rounded-full">
                              {globalConfig.nagadType || 'পার্সোনাল'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${nagadActionMeta.tagBg}`}>
                              {nagadActionMeta.badge}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">নগদ নম্বর</span>
                              <span className="text-base font-black text-slate-900 font-mono">{nagadNumber}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(nagadNumber, 'nagad')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                copiedKey === 'nagad' ? 'bg-emerald-600 text-white' : 'bg-orange-100 text-[#d9381e] hover:bg-[#d9381e] hover:text-white'
                              }`}
                            >
                              {copiedKey === 'nagad' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedKey === 'nagad' ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            📌 {nagadActionMeta.instruction} সফল লেনদেনের পর প্রাপ্ত TrxID টি নিচের ফর্মে প্রদান করুন।
                          </p>
                        </div>

                        {/* QR Box */}
                        <div className="flex flex-col items-center bg-orange-50/50 border border-orange-200 rounded-2xl p-3 shrink-0 text-center">
                          {nagadQrDataUrl ? (
                            <img src={nagadQrDataUrl} alt="Nagad QR" className="w-32 h-32 object-contain rounded-lg bg-white p-1" />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg">
                              <QrCode className="w-8 h-8 text-slate-400 animate-pulse" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDownloadQr(nagadQrDataUrl, 'nagad_qr_trishal')}
                            className="mt-2 text-[10px] font-bold text-slate-600 hover:text-[#d9381e] flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>QR ডাউনলোড</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ROCKET VIEW */}
                  {activeTab === 'rocket' && (() => {
                    const rocketActionMeta = getActionMeta(globalConfig.rocketAction || (globalConfig.rocketType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'রকেট');
                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-3 h-3 rounded-full bg-[#8c3077]"></span>
                            <span className="font-bold text-sm text-[#8c3077]">রকেট পেমেন্ট বিবরণ</span>
                            <span className="text-[10px] font-bold bg-purple-100 text-[#8c3077] px-2 py-0.5 rounded-full">
                              {globalConfig.rocketType || 'পার্সোনাল'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rocketActionMeta.tagBg}`}>
                              {rocketActionMeta.badge}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">রকেট নম্বর (১১ ডিজিট)</span>
                              <span className="text-base font-black text-slate-900 font-mono">{rocketNumber}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(rocketNumber, 'rocket')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                copiedKey === 'rocket' ? 'bg-emerald-600 text-white' : 'bg-purple-100 text-[#8c3077] hover:bg-[#8c3077] hover:text-white'
                              }`}
                            >
                              {copiedKey === 'rocket' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedKey === 'rocket' ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            📌 {rocketActionMeta.instruction} সফল লেনদেনের পর TrxID টি সংগ্রহ করে নিচের ফর্মে বসান।
                          </p>
                        </div>

                        {/* QR Box */}
                        <div className="flex flex-col items-center bg-purple-50/50 border border-purple-200 rounded-2xl p-3 shrink-0 text-center">
                          {rocketQrDataUrl ? (
                            <img src={rocketQrDataUrl} alt="Rocket QR" className="w-32 h-32 object-contain rounded-lg bg-white p-1" />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg">
                              <QrCode className="w-8 h-8 text-slate-400 animate-pulse" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDownloadQr(rocketQrDataUrl, 'rocket_qr_trishal')}
                            className="mt-2 text-[10px] font-bold text-slate-600 hover:text-[#8c3077] flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>QR ডাউনলোড</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* BANK VIEW */}
                  {activeTab === 'bank' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Building2 className="w-4 h-4 text-[#00732A]" />
                        <span className="font-bold text-sm text-[#00732A]">ব্যাংক একাউন্ট তথ্য ও ফান্ড ট্রান্সফার</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] font-bold block">ব্যাংকের নাম</span>
                          <span className="font-bold text-slate-900">{globalConfig.bankName || 'সোনালী ব্যাংক লিমিটেড'}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 text-[10px] font-bold block">হিসাবের নাম (Account Name)</span>
                          <span className="font-bold text-slate-900">{globalConfig.bankAccountName || 'ত্রিশাল নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন'}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block">হিসাব নম্বর (Account No.)</span>
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {globalConfig.bankAccountNumber || '2050 1234 5678 9012'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(globalConfig.bankAccountNumber || '2050 1234 5678 9012', 'bank-acc')}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {copiedKey === 'bank-acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold block">শাখা ও রাউটিং নম্বর</span>
                            <span className="font-bold text-slate-800">
                              {globalConfig.bankBranch || 'ত্রিশাল শাখা'} ({globalConfig.bankRoutingNumber || '200271234'})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(globalConfig.bankRoutingNumber || '200271234', 'routing')}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {copiedKey === 'routing' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        ✓ অনলাইন ব্যাংকিং অ্যাপ (BEFTN / NPSB / RTGS) অথবা সরাসরি ব্যাংকে গিয়ে ডিপোজিট করে ডিপোজিট স্লিপ নম্বর নিচের TrxID ঘরে লিখুন।
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* DONATION SUBMISSION FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-[#00732A]" />
                    <span>২. আপনার অনুদানের তথ্য প্রদান করুন</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">* চিহ্নিত ঘরগুলো আবশ্যক</span>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      দাতার পুরো নাম *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="উদা: মোঃ আরিফুল ইসলাম"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A] focus:ring-1 focus:ring-[#00732A]"
                      />
                    </div>
                  </div>

                  {/* Batch or Designation */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ব্যাচ / পরিচিতি (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: ব্যাচ ১৯৯৮ / শুভাকাঙ্ক্ষী / শিক্ষক"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A] focus:ring-1 focus:ring-[#00732A]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      যোগাযোগের মোবাইল নম্বর *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A] focus:ring-1 focus:ring-[#00732A]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ইমেইল (অনুমোদন নিশ্চিতকরণ পত্র পেতে)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A] focus:ring-1 focus:ring-[#00732A]"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুদানের পরিমাণ (টাকা ৳) *
                    </label>
                    <div className="relative">
                      <span className="text-xs font-bold text-slate-400 absolute left-3 top-2">৳</span>
                      <input
                        type="number"
                        required
                        min="10"
                        placeholder="উদা: 5000"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A] focus:ring-1 focus:ring-[#00732A]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selected */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পেমেন্ট মাধ্যম *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFormData({ ...formData, paymentMethod: val });
                        setActiveTab(val);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-[#00732A]"
                    >
                      <option value="bkash">বিকাশ (bKash)</option>
                      <option value="nagad">নগদ (Nagad)</option>
                      <option value="rocket">রকেট (Rocket - ১১ ডিজিট)</option>
                      <option value="bank">ব্যাংক ট্রান্সফার (Bank Deposit)</option>
                    </select>
                  </div>

                  {/* Sender Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      যে নম্বর/একাউন্ট থেকে টাকা পাঠিয়েছেন *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="উদা: 018XXXXXXXX"
                      value={formData.senderNumber}
                      onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-[#00732A]"
                    />
                  </div>

                  {/* TrxID */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ট্রানজেকশন আইডি (TrxID) / স্লিপ নং *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="উদা: 9J4K8LMN3"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono uppercase font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A]"
                    />
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      শুভেচ্ছা বার্তা / মন্তব্য (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="পুনর্মিলনী উৎসব ও বিদ্যালয় নিয়ে আপনার কোনো শুভকামনা বা মন্তব্য থাকলে লিখুন..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00732A]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#00732A]" />
                    তথ্য পাঠানোর পর অ্যাডমিন প্যানেল থেকে দ্রুত ভেরিফাই করা হবে।
                  </span>

                  <button
                    type="submit"
                    disabled={loading || (activeTab === 'bkash' && !!globalConfig.bkashLimitOut) || (activeTab === 'nagad' && !!globalConfig.nagadLimitOut) || (activeTab === 'rocket' && !!globalConfig.rocketLimitOut)}
                    className="w-full sm:w-auto px-8 py-3 bg-[#CA0000] hover:bg-[#a80000] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>জমা নেওয়া হচ্ছে...</span>
                      </>
                    ) : (activeTab === 'bkash' && !!globalConfig.bkashLimitOut) || (activeTab === 'nagad' && !!globalConfig.nagadLimitOut) || (activeTab === 'rocket' && !!globalConfig.rocketLimitOut) ? (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>লিমিট শেষ (অন্য মাধ্যম বেছে নিন)</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-current" />
                        <span>অনুদান তথ্য জমা দিন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <PaymentLimitModal
        isOpen={!!limitModal?.isOpen}
        onClose={() => setLimitModal(null)}
        methodName={limitModal?.methodName || ''}
      />
    </div>
  );
};
