import React, { useState } from 'react';
import { HeartHandshake, Award, Wallet, ArrowRight, QrCode } from 'lucide-react';
import { Donor } from '../types';
import { formatTaka } from '../utils/formatters';
import { PaymentModal } from './PaymentModal';

interface DonationSectionProps {
  donors: Donor[];
}

export const DonationSection: React.FC<DonationSectionProps> = ({ donors }) => {
  const [showDonateModal, setShowDonateModal] = useState(false);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/70" id="donations-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            কৃতজ্ঞতা স্বীকার
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            সম্মানিত দাতা ও শুভানুধ্যায়ী
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            যাঁদের সার্বিক সহযোগিতা ও অনুদানে আমাদের এই ঐতিহাসিক মিলনমেলা সাফল্যমণ্ডিত হচ্ছে
          </p>
        </div>

        {/* Donors Grid (Exact requirements: image, name, batch, amount) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col items-center text-center relative group"
            >
              {/* Badge for category if any */}
              {donor.category && (
                <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {donor.category}
                </span>
              )}

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-100 shadow-xs mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={donor.image}
                  alt={donor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {donor.name}
              </h3>

              {/* Batch */}
              <span className="text-xs font-bold text-[#00732A] mt-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {donor.batch}
              </span>

              {/* Donation Amount */}
              <div className="mt-3 pt-3 border-t border-slate-100 w-full flex flex-col items-center">
                <span className="text-[11px] text-slate-400 font-medium">অনুদান পরিমাণ</span>
                <span className="text-base font-black text-amber-600">
                  {formatTaka(donor.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Box to Donate */}
        <div className="mt-10 bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <HeartHandshake className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">আপনিও কি পুনর্মিলনীতে অনুদান দিতে চান?</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                আপনার যেকোনো পরিমাণ অনুদান আমাদের উৎসব ও বিদ্যালয়ের অবকাঠামো উন্নয়নে ভূমিকা রাখবে।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDonateModal(true)}
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>অনুদান পদ্ধতি ও QR স্ক্যানার</span>
          </button>
        </div>
      </div>

      {/* Donation Instructions & QR Modal */}
      <PaymentModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="অনুদান পাঠানোর তথ্য ও স্ক্যানার QR কোড"
      />
    </section>
  );
};
