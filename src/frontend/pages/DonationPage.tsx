import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Heart,
  CreditCard,
  Copy,
  Check,
  Building2,
  AlertTriangle,
  Sparkles,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Camera,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import QRCode from 'qrcode';
import { apiService } from '../../shared/services/api';
import { GlobalConfig } from '../../shared/types';
import { PaymentLimitModal } from '../../shared/components/PaymentLimitModal';
import { ImageUploader } from '../../shared/components/ImageUploader';

interface DonationPageProps {
  onSuccessNavigate: (page: string) => void;
}

export const DonationPage: React.FC<DonationPageProps> = ({ onSuccessNavigate }) => {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [limitModal, setLimitModal] = useState<{ isOpen: boolean; methodName: string; methodId: string } | null>(null);

  // QR code URLs for mobile banking
  const [bkashQrDataUrl, setBkashQrDataUrl] = useState<string>('');
  const [nagadQrDataUrl, setNagadQrDataUrl] = useState<string>('');
  const [rocketQrDataUrl, setRocketQrDataUrl] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    batch: '',
    amount: '১০০০',
    phone: '',
    email: '',
    image: '',
    paymentMethod: 'bkash',
    senderNumber: '',
    transactionId: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const successCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submittedData) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const timer = setTimeout(() => {
        if (successCardRef.current) {
          successCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [submittedData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    apiService.getGlobalConfig().then((res) => {
      if (res) setConfig(res);
    });
  }, []);

  const bkashNum = config?.bkashNumber || '';
  const nagadNum = config?.nagadNumber || '';
  const rocketNum = config?.rocketNumber || '';

  // Generate QR codes
  useEffect(() => {
    if (bkashNum) {
      QRCode.toDataURL(`bkash://payment?recipient=${bkashNum}&type=merchant&purpose=TrishalNazrulAcademy`, {
        width: 240,
        margin: 2,
      })
        .then(setBkashQrDataUrl)
        .catch(() => QRCode.toDataURL(bkashNum, { width: 240, margin: 2 }).then(setBkashQrDataUrl));
    }

    if (nagadNum) {
      QRCode.toDataURL(`nagad://payment?recipient=${nagadNum}&purpose=TrishalNazrulAcademy`, {
        width: 240,
        margin: 2,
      })
        .then(setNagadQrDataUrl)
        .catch(() => QRCode.toDataURL(nagadNum, { width: 240, margin: 2 }).then(setNagadQrDataUrl));
    }

    if (rocketNum) {
      QRCode.toDataURL(`rocket://payment?recipient=${rocketNum}&purpose=TrishalNazrulAcademy`, {
        width: 240,
        margin: 2,
      })
        .then(setRocketQrDataUrl)
        .catch(() => QRCode.toDataURL(rocketNum, { width: 240, margin: 2 }).then(setRocketQrDataUrl));
    }
  }, [bkashNum, nagadNum, rocketNum]);

  // Convert Bengali numbers to English
  const bnToEnNumber = (bnStr: string | number): string => {
    if (!bnStr) return '';
    const bnToEnMap: { [key: string]: string } = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    };
    return String(bnStr).replace(/[০-৯]/g, (match) => bnToEnMap[match]);
  };

  // Helper for dynamic transaction action (Make Payment / Send Money / Cash Out)
  const getActionMeta = (action?: string, providerName: string = '') => {
    switch (action) {
      case 'payment':
        return {
          key: 'payment',
          badge: 'Make Payment (পেমেন্ট)',
          shortBadge: 'পেমেন্ট',
          instruction: `${providerName} অ্যাপের "Make Payment" অপশন ব্যবহার করে পেমেন্ট সম্পন্ন করুন।`,
          tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'cash_out':
        return {
          key: 'cash_out',
          badge: 'Cash Out (ক্যাশ আউট)',
          shortBadge: 'ক্যাশ আউট',
          instruction: `${providerName} অ্যাপ বা USSD ডায়াল করে "Cash Out" অপশনে অর্থ প্রেরণ করুন।`,
          tagBg: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'send_money':
      default:
        return {
          key: 'send_money',
          badge: 'Send Money (সেন্ড মানি)',
          shortBadge: 'সেন্ড মানি',
          instruction: `${providerName} অ্যাপ বা USSD ডায়াল করে "Send Money" অপশনে অর্থ প্রেরণ করুন।`,
          tagBg: 'bg-purple-100 text-purple-800 border-purple-300',
        };
    }
  };

  // Only include payment methods configured in backend
  const availableMethods = useMemo(() => {
    const list: any[] = [];
    if (config?.bkashNumber && config.bkashNumber.trim() !== '') {
      const actionMeta = getActionMeta(config.bkashAction || (config.bkashType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'বিকাশ');
      list.push({
        id: 'bkash',
        label: 'বিকাশ (bKash)',
        number: config.bkashNumber,
        type: config.bkashType || 'মার্চেন্ট',
        action: config.bkashAction || 'payment',
        actionMeta,
        isLimitOut: !!config.bkashLimitOut,
        color: '#e2136e',
        qrUrl: bkashQrDataUrl,
        instructions: `বিকাশ অ্যাকাউন্টে ${actionMeta.instruction} এবং প্রাপ্ত TrxID সংগ্রহ করুন।`,
      });
    }
    if (config?.nagadNumber && config.nagadNumber.trim() !== '') {
      const actionMeta = getActionMeta(config.nagadAction || (config.nagadType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'নগদ');
      list.push({
        id: 'nagad',
        label: 'নগদ (Nagad)',
        number: config.nagadNumber,
        type: config.nagadType || 'পার্সোনাল',
        action: config.nagadAction || 'send_money',
        actionMeta,
        isLimitOut: !!config.nagadLimitOut,
        color: '#d9381e',
        qrUrl: nagadQrDataUrl,
        instructions: `নগদ অ্যাকাউন্টে ${actionMeta.instruction} এবং প্রাপ্ত TrxID সংগ্রহ করুন।`,
      });
    }
    if (config?.rocketNumber && config.rocketNumber.trim() !== '') {
      const actionMeta = getActionMeta(config.rocketAction || (config.rocketType === 'মার্চেন্ট' ? 'payment' : 'send_money'), 'রকেট');
      list.push({
        id: 'rocket',
        label: 'রকেট (Rocket)',
        number: config.rocketNumber,
        type: config.rocketType || 'পার্সোনাল',
        action: config.rocketAction || 'send_money',
        actionMeta,
        isLimitOut: !!config.rocketLimitOut,
        color: '#8c3077',
        qrUrl: rocketQrDataUrl,
        instructions: `রকেট অ্যাকাউন্টে ${actionMeta.instruction} (১১ ডিজিট অ্যাকাউন্ট) এবং প্রাপ্ত TrxID সংগ্রহ করুন।`,
      });
    }
    if (config?.bankAccountNumber && config.bankAccountNumber.trim() !== '') {
      list.push({
        id: 'bank',
        label: 'ব্যাংক হিসাব (Bank Deposit / Transfer)',
        bankName: config.bankName || 'সোনালী ব্যাংক লিমিটেড',
        accountName: config.bankAccountName || 'ত্রিশাল নজরুল একাডেমি অ্যালামনাই অ্যাসোসিয়েশন',
        accountNumber: config.bankAccountNumber,
        branch: config.bankBranch || 'ত্রিশাল শাখা, ময়মনসিংহ',
        routingNumber: config.bankRoutingNumber || '200271234',
        color: '#00732A',
        instructions: 'অনলাইন ব্যাংক ট্রান্সফার (BEFTN / NPSB / RTGS) অথবা সরাসরি ব্যাংকে ডিপোজিট করে ডিপোজিট স্লিপ নম্বর TrxID ঘরে লিখুন।',
      });
    }
    return list;
  }, [config, bkashQrDataUrl, nagadQrDataUrl, rocketQrDataUrl]);

  // Sync initial paymentMethod when methods become available (prioritize active methods)
  useEffect(() => {
    if (availableMethods.length > 0) {
      const activeMethod = availableMethods.find((m) => !m.isLimitOut) || availableMethods[0];
      const exists = availableMethods.some((m) => m.id === formData.paymentMethod);
      const isCurrentLimitOut = availableMethods.find((m) => m.id === formData.paymentMethod)?.isLimitOut;
      if (!exists || isCurrentLimitOut) {
        setFormData((prev) => ({ ...prev, paymentMethod: activeMethod.id }));
      }
    }
  }, [availableMethods]);

  const handleMethodChange = async (selectedId: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: selectedId }));
    const selectedM = availableMethods.find((m) => m.id === selectedId);

    // Immediate check
    if (selectedM?.isLimitOut) {
      setLimitModal({
        isOpen: true,
        methodName: selectedM.label,
        methodId: selectedId,
      });
    }

    // Live background check with server
    try {
      const latest = await apiService.getGlobalConfig();
      if (latest) {
        setConfig(latest);
        let isOut = false;
        if (selectedId === 'bkash') isOut = !!latest.bkashLimitOut;
        else if (selectedId === 'nagad') isOut = !!latest.nagadLimitOut;
        else if (selectedId === 'rocket') isOut = !!latest.rocketLimitOut;

        if (isOut) {
          setLimitModal({
            isOpen: true,
            methodName: selectedM?.label || selectedId,
            methodId: selectedId,
          });
        }
      }
    } catch (err) {
      // ignore
    }
  };

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

  const presetAmounts = ['৫০০', '১০০০', '২০০০', '৫০০০', '১০০০০'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const currentMethodObj = availableMethods.find((m) => m.id === formData.paymentMethod);

    // 1. Local limit out check
    if (currentMethodObj?.isLimitOut) {
      setLimitModal({
        isOpen: true,
        methodName: currentMethodObj.label,
        methodId: currentMethodObj.id,
      });
      setErrorMessage(`বর্তমানে ${currentMethodObj.label} অ্যাকাউন্টের লেনদেনের সীমা শেষ! অনুগ্রহ করে অন্য মাধ্যম নির্বাচন করুন।`);
      return;
    }

    // 2. Background live check with server before submitting
    try {
      const latest = await apiService.getGlobalConfig();
      if (latest) {
        setConfig(latest);
        let isOut = false;
        if (formData.paymentMethod === 'bkash') isOut = !!latest.bkashLimitOut;
        else if (formData.paymentMethod === 'nagad') isOut = !!latest.nagadLimitOut;
        else if (formData.paymentMethod === 'rocket') isOut = !!latest.rocketLimitOut;

        if (isOut) {
          setLimitModal({
            isOpen: true,
            methodName: currentMethodObj?.label || formData.paymentMethod,
            methodId: formData.paymentMethod,
          });
          setErrorMessage(`বর্তমানে ${currentMethodObj?.label || formData.paymentMethod} অ্যাকাউন্টের লেনদেনের সীমা শেষ! অনুগ্রহ করে অন্য মাধ্যম নির্বাচন করুন।`);
          return;
        }
      }
    } catch (err) {}

    const amountNum = Number(bnToEnNumber(formData.amount));
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
        batch: formData.batch.trim() || 'সম্মানিত শুভানুধ্যায়ী',
        amount: amountNum,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        image: formData.image.trim() || undefined,
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
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } else {
        if ((res as any).isLimitOut) {
          setLimitModal({
            isOpen: true,
            methodName: currentMethodObj?.label || formData.paymentMethod,
            methodId: formData.paymentMethod,
          });
        }
        setErrorMessage(res.message || 'অনুদান সাবমিট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'সার্ভার সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (submittedData) {
    return (
      <div className="py-16 bg-slate-50 min-h-[85vh] flex items-center justify-center px-4">
        <div ref={successCardRef} className="bg-white max-w-xl w-full rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00732A] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold mb-3 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>স্ট্যাটাস: অপেক্ষমাণ (Pending Verification)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              আন্তরিক ধন্যবাদ ও কৃতজ্ঞতা! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              শ্রদ্ধেয় <strong>{submittedData.name}</strong>, আপনার অনুদানের তথ্যটি সফলভাবে জমা হয়েছে। অ্যাডমিন কর্তৃক পেমেন্ট যাচাইকরণের পর এটি ওয়েবসাইটে তালিকাভুক্ত হবে এবং আপনার ইমেইলে নিশ্চিতকরণ পাঠানো হবে।
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs sm:text-sm">
            {submittedData.image && (
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
                <img
                  src={submittedData.image}
                  alt={submittedData.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs bg-white"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">দাতার প্রোফাইল ছবি</span>
                  <span className="text-xs font-bold text-[#00732A]">অনুমোদনের পর সম্মানিত দাতা তালিকায় প্রদর্শিত হবে</span>
                </div>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">অনুদানের পরিমাণ:</span>
              <span className="font-extrabold text-[#00732A] text-base">৳{submittedData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">দাতার ব্যাচ / পরিচয়:</span>
              <span className="font-bold text-slate-900">{submittedData.batch}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-slate-900 uppercase">{submittedData.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">প্রেরকের নম্বর/একাউন্ট:</span>
              <span className="font-mono font-bold text-slate-800">{submittedData.senderNumber}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-500">TrxID / রেফারেন্স:</span>
              <span className="font-mono font-black text-slate-900">{submittedData.transactionId}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => onSuccessNavigate('home')}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>হোমপেজে ফিরে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedData(null);
                setFormData({
                  name: '',
                  nameEn: '',
                  batch: '',
                  amount: '১০০০',
                  phone: '',
                  email: '',
                  image: '',
                  paymentMethod: availableMethods[0]?.id || 'bkash',
                  senderNumber: '',
                  transactionId: '',
                  message: '',
                });
              }}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all"
            >
              আরেকটি অনুদান প্রদান করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentMethod = availableMethods.find((m) => m.id === formData.paymentMethod) || availableMethods[0];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => onSuccessNavigate('home')}
            className="text-xs font-bold text-slate-500 hover:text-[#00732A] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            হোমে ফিরে যান
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-[#00732A]">অনলাইন অনুদান</span>
        </div>

        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#CA0000] uppercase bg-red-50 px-3.5 py-1 rounded-full border border-red-200 mb-3 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#CA0000]" />
            <span>অ্যালামনাই উন্নয়ন ও সহায়তা তহবিল</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            অনুদান প্রদান ও পেমেন্ট পদ্ধতি
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
            জাতীয় কবি কাজী নজরুল ইসলামের পদধন্য বিদ্যাপীঠের শতবর্ষ উদযাপন ও ভবিষ্যৎ কল্যাণমূলক কার্যক্রমে আপনার যেকোনো আন্তরিক অবদান সাদরে গৃহীত হবে।
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              নিরাপদ পেমেন্ট ভেরিফিকেশন
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              স্বচ্ছ হিসাব ও ইমেইল স্বীকৃতি
            </span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top banner visual */}
          <div className="bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] p-6 text-white text-center">
            <h2 className="text-base sm:text-lg font-bold">অনুদান বিবরণী ফরম</h2>
            <p className="text-xs text-white/85 mt-0.5">
              অনুগ্রহ করে নিচের তথ্যসমূহ সঠিক ও নির্ভুলভাবে পূরণ করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs sm:text-sm animate-in fade-in duration-200">
                <AlertTriangle className="w-5 h-5 text-[#CA0000] shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Donation Amount */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-[#CA0000]" />
                <span>১. অনুদানের পরিমাণ নির্ধারণ করুন</span>
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  অনুদানের পরিমাণ (টাকা / BDT) *
                </label>

                {/* Preset Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetAmounts.map((preset) => {
                    const isSelected = formData.amount === preset;
                    return (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormData({ ...formData, amount: preset })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00732A] text-white border-[#00732A] shadow-sm scale-105'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        ৳{preset}
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                  <input
                    type="text"
                    required
                    placeholder="অন্য পরিমাণ লিখুন (যেমন: ৫০০০)"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 text-sm font-bold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Donor Info */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#00732A]" />
                <span>২. দাতার ব্যক্তিগত বিবরণ</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    আপনার পূর্ণ নাম (বাংলায়) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোহাম্মদ রফিকুল ইসলাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    নাম (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Rafiqul Islam"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ব্যাচ বা পরিচয়
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ব্যাচ ২০১০ / শুভাকাঙ্ক্ষী / শিক্ষক"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    যোগাযোগের মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ইমেইল ঠিকানা (ঐচ্ছিক - দিলে অ্যাডমিন অ্যাপ্রুভালের পর কনফার্মেশন পাবেন)
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বার্তা বা শুভকামনা (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="বিদ্যালয়ের শতবর্ষ উদযাপন ও ভবিষ্যৎ নিয়ে আপনার কোনো শুভেচ্ছা বার্তা থাকলে লিখতে পারেন..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none resize-none"
                  />
                </div>

                {/* Donor Photo Upload */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    দাতার ছবি / প্রোফাইল ফটো (ঐচ্ছিক)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    ছবি আপলোড করলে আপনার অনুদান অনুমোদিত হওয়ার পর আমাদের পাবলিক দাতা সম্মাননা তালিকায় আপনার ছবিটি প্রদর্শিত হবে।
                  </p>

                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <div className="max-w-md mx-auto space-y-4">
                      <ImageUploader
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        label="ডিভাইস থেকে ছবি আপলোড করুন"
                        placeholder="ছবি সিলেক্ট করুন বা ড্রপ করুন"
                        aspectRatio="avatar"
                      />

                      <div className="pt-2 border-t border-slate-200/70 text-center">
                        <span className="text-[11px] font-bold text-slate-500 block mb-2">
                          অথবা একটি ডিফল্ট অবতার বেছে নিন:
                        </span>
                        <div className="flex items-center justify-center gap-2.5 flex-wrap">
                          {[
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
                          ].map((av, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: av })}
                              className={`w-9 h-9 rounded-full border-2 overflow-hidden p-0.5 transition-all cursor-pointer ${
                                formData.image === av
                                  ? 'border-[#00732A] ring-2 ring-[#00732A]/40 scale-110 shadow-sm bg-white'
                                  : 'border-slate-300 hover:border-slate-400 opacity-75 hover:opacity-100 bg-white'
                              }`}
                            >
                              <img src={av} alt="Avatar" className="w-full h-full rounded-full" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method Selection */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#00732A]" />
                <span>৩. পেমেন্ট মাধ্যম ও অ্যাকাউন্ট নির্বাচন</span>
              </h3>

              {availableMethods.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    বর্তমানে কোনো অনলাইন পেমেন্ট অ্যাকাউন্ট সক্রিয় নেই। সহায়তার জন্য যোগাযোগ করুন:{' '}
                    <span className="font-bold">{config?.contactPhone1 || 'হেল্পলাইন'}</span>
                  </div>
                </div>
              )}

              {availableMethods.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পেমেন্ট মাধ্যম নির্বাচন করুন *
                    </label>
                    <select
                      value={formData.paymentMethod || currentMethod?.id}
                      onChange={(e) => handleMethodChange(e.target.value)}
                      className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold text-slate-800 bg-white shadow-2xs"
                    >
                      {availableMethods.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label} {m.type ? `(${m.type})` : ''} {m.actionMeta ? `— [${m.actionMeta.shortBadge}]` : ''} {m.isLimitOut ? '— ⚠️ [সীমা শেষ - গ্রহণযোগ্য নয়]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Method Card */}
                  {currentMethod && (
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        currentMethod.id === 'bkash'
                          ? 'bg-pink-50/60 border-pink-200'
                          : currentMethod.id === 'nagad'
                          ? 'bg-orange-50/60 border-orange-200'
                          : currentMethod.id === 'rocket'
                          ? 'bg-purple-50/60 border-purple-200'
                          : 'bg-emerald-50/60 border-emerald-200'
                      }`}
                    >
                      {/* Limit Out Warning */}
                      {currentMethod.isLimitOut && (
                        <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900 mb-4 animate-in fade-in duration-200">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-black">⚠️ বর্তমানে আমাদের {currentMethod.label} অ্যাকাউন্টের লেনদেনের সীমা (Limit) পূর্ণ!</span>
                            <p className="mt-0.5 text-amber-800">
                              অনুগ্রহ করে ড্রপডাউন থেকে অন্য কোনো মাধ্যম নির্বাচন করুন অথবা কিছুক্ষণ পর পুনরায় চেষ্টা করুন।
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Mobile Banking Info */}
                      {currentMethod.id !== 'bank' ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: currentMethod.color }}
                              />
                              <span className="font-extrabold text-sm text-slate-800">
                                {currentMethod.label}
                              </span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: currentMethod.color }}
                              >
                                {currentMethod.type}
                              </span>
                            </div>

                            {currentMethod.actionMeta && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-slate-500">লেনদেনের ধরণ:</span>
                                <span
                                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${currentMethod.actionMeta.tagBg}`}
                                >
                                  {currentMethod.actionMeta.badge}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            {/* Number & Copy */}
                            <div className="md:col-span-2 space-y-3">
                              <div className="bg-white rounded-xl border border-slate-200/80 p-3 flex items-center justify-between shadow-2xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold block">
                                    {currentMethod.label} অ্যাকাউন্ট নম্বর
                                  </span>
                                  <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-wider">
                                    {currentMethod.number}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(currentMethod.number, currentMethod.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                >
                                  {copiedKey === currentMethod.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">কপি হয়েছে</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>কপি করুন</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed">
                                📌 {currentMethod.instructions}
                              </p>
                            </div>

                            {/* QR Code Scanner (Desktop/Mobile) */}
                            {currentMethod.qrUrl && (
                              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs flex flex-col items-center">
                                <img
                                  src={currentMethod.qrUrl}
                                  alt={`${currentMethod.label} QR`}
                                  className="w-28 h-28 object-contain rounded-lg border border-slate-100"
                                />
                                <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                                  অ্যাপ দিয়ে স্ক্যান করুন
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadQr(currentMethod.qrUrl, `${currentMethod.id}-qr`)}
                                  className="mt-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  QR ডাউনলোড
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Bank Deposit Details */
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/80">
                            <Building2 className="w-4 h-4 text-[#00732A]" />
                            <span className="font-extrabold text-sm text-[#00732A]">
                              ব্যাংক একাউন্ট বিবরণী (Bank Transfer)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                              <span className="text-slate-400 text-[10px] font-bold block">ব্যাংকের নাম</span>
                              <span className="font-bold text-slate-900">{currentMethod.bankName}</span>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                              <span className="text-slate-400 text-[10px] font-bold block">হিসাবের নাম (Account Name)</span>
                              <span className="font-bold text-slate-900">{currentMethod.accountName}</span>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                              <div>
                                <span className="text-slate-400 text-[10px] font-bold block">হিসাব নম্বর (Account No.)</span>
                                <span className="font-mono font-bold text-slate-900 text-sm">
                                  {currentMethod.accountNumber}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(currentMethod.accountNumber, 'donate-bank-acc')}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                              >
                                {copiedKey === 'donate-bank-acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                              <div>
                                <span className="text-slate-400 text-[10px] font-bold block">শাখা ও রাউটিং নম্বর</span>
                                <span className="font-bold text-slate-800">
                                  {currentMethod.branch} ({currentMethod.routingNumber})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(currentMethod.routingNumber, 'donate-bank-route')}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                              >
                                {copiedKey === 'donate-bank-route' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            📌 {currentMethod.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 4: Payment Verification */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#00732A]" />
                <span>৪. পেমেন্ট যাচাইকরণ তথ্য (Proof of Payment)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রেরকের অ্যাকাউন্ট / মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                    value={formData.senderNumber}
                    onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    যেমন: বিকাশ/নগদ নম্বর অথবা ব্যাংকের একাউন্ট নম্বর
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ট্রানজেকশন আইডি (TrxID) / স্লিপ নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 8N7A6D5E অথবা স্লিপ নং"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    পেমেন্ট সম্পন্ন হওয়ার পর প্রাপ্ত ট্রানজেকশন আইডি
                  </span>
                </div>
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
              <Sparkles className="w-4 h-4 text-[#00732A] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-black">স্বচ্ছতা ও নিশ্চয়তা:</span> আপনি অনুদান সাবমিট করার পর আমাদের আর্থিক কমিটি তা ব্যাংক/অ্যাকাউন্ট স্টেটমেন্টের সাথে যাচাই করবে। অনুমোদিত হলে স্বয়ংক্রিয়ভাবে ওয়েবসাইটের দাতা তালিকায় আপনার নাম যুক্ত হবে এবং আপনার ইমেইলে কনফার্মেশন পাঠানো হবে।
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {currentMethod?.isLimitOut && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#CA0000] shrink-0" />
                  <span>বর্তমানে <strong>{currentMethod.label}</strong> অ্যাকাউন্টের লেনদেনের সীমা শেষ। অনুগ্রহ করে অন্য সক্রিয় মাধ্যম নির্বাচন করে অনুদান জমা দিন।</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || availableMethods.length === 0 || currentMethod?.isLimitOut}
                className={`w-full py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  loading || availableMethods.length === 0 || currentMethod?.isLimitOut
                    ? 'bg-slate-400 cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-[#CA0000] to-rose-700 hover:from-rose-700 hover:to-[#CA0000] hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>অনুদান তথ্য যাচাই ও জমা হচ্ছে...</span>
                  </>
                ) : currentMethod?.isLimitOut ? (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    <span>{currentMethod.label} অ্যাকাউন্টের লিমিট শেষ (অন্য মাধ্যম বেছে নিন)</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-current" />
                    <span>অনুদান জমা দিন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Real-time Payment Limit Alert Dialog */}
      <PaymentLimitModal
        isOpen={!!limitModal?.isOpen}
        onClose={() => setLimitModal(null)}
        methodName={limitModal?.methodName || ''}
        hasAlternative={availableMethods.some((m) => !m.isLimitOut && m.id !== limitModal?.methodId)}
        onSelectAlternative={() => {
          const alt = availableMethods.find((m) => !m.isLimitOut && m.id !== limitModal?.methodId);
          if (alt) {
            handleMethodChange(alt.id);
          }
        }}
      />
    </div>
  );
};
