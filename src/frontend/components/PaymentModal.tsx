import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Maximize2,
  Phone,
  Building2,
  QrCode,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import QRCode from 'qrcode';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultTab?: 'all' | 'bkash' | 'nagad' | 'bank';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title = 'অনুদান / ফি পাঠানোর তথ্য ও QR কোড',
  defaultTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bkash' | 'nagad' | 'bank'>(defaultTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bkashQrDataUrl, setBkashQrDataUrl] = useState<string>('');
  const [nagadQrDataUrl, setNagadQrDataUrl] = useState<string>('');
  const [zoomedQr, setZoomedQr] = useState<{ title: string; image: string; type: 'bkash' | 'nagad'; num: string } | null>(null);

  const bkashNumber = '01712345678';
  const bkashDisplay = '০১৭১২-৩৪৫৬৭৮';
  const nagadNumber = '01797585073';
  const nagadDisplay = '০১৭৯৭-৫৮৫০৭৩';

  // Generate QR codes
  useEffect(() => {
    // Generate bKash QR Code (supports bKash merchant/send money standard format)
    QRCode.toDataURL(
      `bkash://payment?recipient=${bkashNumber}&type=merchant&purpose=TrishalNazrulAcademyReunion`,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      }
    )
      .then((url) => setBkashQrDataUrl(url))
      .catch(() => {
        // Fallback simple payload
        QRCode.toDataURL(`01712345678`, { width: 320, margin: 2 }).then(setBkashQrDataUrl);
      });

    // Generate Nagad QR Code
    QRCode.toDataURL(
      `nagad://payment?recipient=${nagadNumber}&purpose=TrishalNazrulAcademyReunion`,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      }
    )
      .then((url) => setNagadQrDataUrl(url))
      .catch(() => {
        QRCode.toDataURL(`01797585073`, { width: 320, margin: 2 }).then(setNagadQrDataUrl);
      });
  }, []);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#00732A] flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                বিকাশ, নগদ স্ক্যানার QR কোড অথবা ব্যাংক একাউন্টে পেমেন্ট করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200/80 cursor-pointer shadow-2xs"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            সবগুলো মাধ্যম
          </button>

          <button
            onClick={() => setActiveTab('bkash')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bkash'
                ? 'bg-[#e2136e] text-white shadow-xs'
                : 'text-[#e2136e] hover:bg-pink-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>বিকাশ (bKash QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('nagad')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nagad'
                ? 'bg-[#d9381e] text-white shadow-xs'
                : 'text-[#d9381e] hover:bg-orange-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>নগদ (Nagad QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-[#00732A] text-white shadow-xs'
                : 'text-[#00732A] hover:bg-emerald-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>ব্যাংক একাউন্ট</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Both QR Codes side by side */}
          {(activeTab === 'all' || activeTab === 'bkash' || activeTab === 'nagad') && (
            <div className={`grid gap-5 ${activeTab === 'all' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
              {/* bKash QR Card */}
              {(activeTab === 'all' || activeTab === 'bkash') && (
                <div className="bg-gradient-to-b from-[#e2136e]/10 via-pink-50/40 to-white rounded-2xl border-2 border-[#e2136e]/40 p-4 sm:p-5 flex flex-col items-center text-center shadow-xs relative overflow-hidden group">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-pink-200/80 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#e2136e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        বি
                      </div>
                      <span className="font-extrabold text-[#e2136e] text-sm tracking-wide">
                        বিকাশ স্ক্যানার QR
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#e2136e] text-white px-2 py-0.5 rounded-full">
                      মার্চেন্ট
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative bg-white p-3 rounded-2xl border border-pink-200 shadow-sm my-1 cursor-pointer" onClick={() => setZoomedQr({ title: 'বিকাশ (bKash) পেমেন্ট QR কোড', image: bkashQrDataUrl, type: 'bkash', num: bkashDisplay })}>
                    {bkashQrDataUrl ? (
                      <img
                        src={bkashQrDataUrl}
                        alt="bKash QR Code"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-lg">
                        <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      <span>বড় করে দেখুন</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    bKash অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                  </p>

                  {/* Number & Copy */}
                  <div className="mt-3 w-full bg-white rounded-xl border border-pink-200 p-2.5 flex items-center justify-between shadow-2xs">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold">মার্চেন্ট নম্বর</span>
                      <span className="text-sm font-black text-slate-800 font-mono tracking-wider">{bkashDisplay}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(bkashNumber, 'bkash')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        copiedKey === 'bkash'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-pink-100 hover:bg-[#e2136e] text-[#e2136e] hover:text-white'
                      }`}
                    >
                      {copiedKey === 'bkash' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-2.5 w-full flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownloadQr(bkashQrDataUrl, 'bkash_qr_trishal_reunion')}
                      className="text-[11px] font-bold text-slate-600 hover:text-[#e2136e] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>QR ডাউনলোড</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Nagad QR Card */}
              {(activeTab === 'all' || activeTab === 'nagad') && (
                <div className="bg-gradient-to-b from-[#d9381e]/10 via-orange-50/40 to-white rounded-2xl border-2 border-[#d9381e]/40 p-4 sm:p-5 flex flex-col items-center text-center shadow-xs relative overflow-hidden group">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-orange-200/80 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#d9381e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        ন
                      </div>
                      <span className="font-extrabold text-[#d9381e] text-sm tracking-wide">
                        নগদ স্ক্যানার QR
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#d9381e] text-white px-2 py-0.5 rounded-full">
                      পার্সোনাল
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative bg-white p-3 rounded-2xl border border-orange-200 shadow-sm my-1 cursor-pointer" onClick={() => setZoomedQr({ title: 'নগদ (Nagad) পেমেন্ট QR কোড', image: nagadQrDataUrl, type: 'nagad', num: nagadDisplay })}>
                    {nagadQrDataUrl ? (
                      <img
                        src={nagadQrDataUrl}
                        alt="Nagad QR Code"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-lg">
                        <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      <span>বড় করে দেখুন</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Nagad অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                  </p>

                  {/* Number & Copy */}
                  <div className="mt-3 w-full bg-white rounded-xl border border-orange-200 p-2.5 flex items-center justify-between shadow-2xs">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold">পার্সোনাল নম্বর</span>
                      <span className="text-sm font-black text-slate-800 font-mono tracking-wider">{nagadDisplay}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(nagadNumber, 'nagad')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        copiedKey === 'nagad'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-100 hover:bg-[#d9381e] text-[#d9381e] hover:text-white'
                      }`}
                    >
                      {copiedKey === 'nagad' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-2.5 w-full flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownloadQr(nagadQrDataUrl, 'nagad_qr_trishal_reunion')}
                      className="text-[11px] font-bold text-slate-600 hover:text-[#d9381e] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>QR ডাউনলোড</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reference Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">রেফারেন্স নির্দেশিকা:</strong> বিকাশ অথবা নগদ দিয়ে পেমেন্ট করার সময় রেফারেন্সে আপনার <strong>[নাম ও ব্যাচ]</strong> উল্লেখ করুন।
            </div>
          </div>

          {/* 2. Bank Details Card */}
          {(activeTab === 'all' || activeTab === 'bank') && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                <span className="text-xs font-bold text-[#00732A] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>ব্যাংক একাউন্ট বিবরণ (সরাসরি ডিপোজিট / অনলাইন ট্রান্সফার)</span>
                </span>
                <span className="text-[10px] font-bold bg-[#00732A] text-white px-2 py-0.5 rounded-full">
                  সোনালী ব্যাংক
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px] font-bold">হিসাবের নাম (Account Title)</span>
                  <span className="font-bold text-slate-800 text-sm">ত্রিশাল নজরুল একাডেমি অ্যালামনাই</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">হিসাব নম্বর (A/C No)</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">2050 1234 5678 9012</span>
                  </div>
                  <button
                    onClick={() => handleCopy('2050123456789012', 'bank')}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#00732A] cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey === 'bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] font-bold">শাখা ও ব্যাংক</span>
                  <span className="font-semibold text-slate-800">সোনালী ব্যাংক লিমিটেড, ত্রিশাল শাখা, ময়মনসিংহ</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Helpline Callout */}
          <div className="p-3.5 bg-slate-100 rounded-2xl text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 text-[#CA0000] flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">পেমেন্ট সংক্রান্ত যেকোনো তথ্যে যোগাযোগ:</p>
                <p className="text-[11px] text-slate-500">টাকা পাঠানোর পর ট্রানজেকশন নিশ্চিত করতে কল করুন</p>
              </div>
            </div>

            <a
              href="tel:01712345678"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#00732A] hover:bg-[#005c21] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>০১৭১২-৩৪৫৬৭৮</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>নিরাপদ ও অনুমোদিত পেমেন্ট চ্যানেল</span>
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors cursor-pointer"
          >
            ঠিক আছে
          </button>
        </div>
      </div>

      {/* Zoom Modal for QR code */}
      {zoomedQr && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setZoomedQr(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedQr(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-base font-bold text-slate-900">{zoomedQr.title}</h4>

            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
              <img src={zoomedQr.image} alt={zoomedQr.title} className="w-64 h-64 mx-auto object-contain" />
            </div>

            <p className="text-sm font-mono font-black text-slate-800">{zoomedQr.num}</p>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => handleDownloadQr(zoomedQr.image, `${zoomedQr.type}_qr_code`)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00732A] text-white hover:bg-[#005c21] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>QR ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
