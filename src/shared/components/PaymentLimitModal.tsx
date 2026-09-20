import React from 'react';
import { AlertTriangle, ArrowRight, X, ShieldAlert } from 'lucide-react';

interface PaymentLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodName: string;
  onSelectAlternative?: () => void;
  hasAlternative?: boolean;
}

export const PaymentLimitModal: React.FC<PaymentLimitModalProps> = ({
  isOpen,
  onClose,
  methodName,
  onSelectAlternative,
  hasAlternative = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 border border-red-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-red-100 text-[#CA0000] flex items-center justify-center mx-auto shadow-inner border-4 border-red-50 animate-bounce">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-red-50 text-[#CA0000] border border-red-200">
              <AlertTriangle className="w-3 h-3 text-[#CA0000]" />
              লেনদেনের সীমা শেষ
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              ⚠️ {methodName} লিমিট শেষ!
            </h3>
          </div>
        </div>

        {/* Warning Body */}
        <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
          <p className="font-semibold text-amber-950">
            বর্তমানে আমাদের <strong>{methodName}</strong> অ্যাকাউন্টের আজকের লেনদেনের সর্বোচ্চ সীমা (Limit) পূর্ণ হয়ে গেছে।
          </p>
          <p className="text-slate-600 text-xs">
            এই অ্যাকাউন্টে সাময়িকভাবে নতুন কোনো পেমেন্ট বা অনুদান গ্রহণ করা সম্ভব হচ্ছে না। আপনার টাকা নিরাপদ রাখতে অনুগ্রহ করে ড্রপডাউন থেকে অন্য কোনো সক্রিয় মাধ্যম (যেমন: নগদ, রকেট অথবা ব্যাংক ট্রান্সফার) নির্বাচন করুন।
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {hasAlternative && onSelectAlternative ? (
            <button
              type="button"
              onClick={() => {
                onSelectAlternative();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-emerald-700 hover:from-emerald-700 hover:to-[#00732A] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>অন্য সক্রিয় মাধ্যম নির্বাচন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            বুঝেছি, ড্রপডাউন থেকে পরিবর্তন করছি
          </button>
        </div>
      </div>
    </div>
  );
};
