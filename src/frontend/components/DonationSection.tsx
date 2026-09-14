import React, { useState } from 'react';
import { HeartHandshake, QrCode, Heart } from 'lucide-react';
import { Donor } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';
import { PaymentModal } from './PaymentModal';

interface DonationSectionProps {
  donors: Donor[];
}

// Badge configs per category
const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case 'বিশেষ দাতা':   return 'bg-amber-500 text-white';
    case 'প্লাটিনাম ডোনার': return 'bg-slate-700 text-white';
    case 'গোল্ড ডোনার':  return 'bg-yellow-500 text-white';
    case 'সিলভার ডোনার': return 'bg-slate-400 text-white';
    default:              return 'bg-emerald-600 text-white';
  }
};

export const DonationSection: React.FC<DonationSectionProps> = ({ donors }) => {
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Split donors into 2 rows for the marquees
  const half = Math.ceil(donors.length / 2);
  const row1 = donors.slice(0, half);
  const row2 = donors.slice(half);

  // Triple each row for seamless looping
  const row1Items = [...row1, ...row1, ...row1];
  const row2Items = [...row2, ...row2, ...row2];

  const DonorCard = ({ donor }: { donor: Donor }) => (
    <div className="shrink-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group cursor-default">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#00732A] via-amber-400 to-[#CA0000]"></div>
      <div className="p-5 flex flex-col items-center text-center">
        {/* Category Badge */}
        {donor.category && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${getCategoryStyle(donor.category)}`}>
            {donor.category}
          </span>
        )}

        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-200 shadow-md group-hover:scale-110 transition-transform duration-300">
            <img
              src={donor.image}
              alt={donor.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#00732A] transition-colors">
          {donor.name}
        </h3>

        {/* Batch */}
        {donor.batch && (
          <span className="text-[11px] font-bold text-[#CA0000] mt-1 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
            {donor.batch}
          </span>
        )}

        {/* Amount */}
        <div className="mt-3 pt-3 border-t border-slate-100 w-full">
          <div className="text-[10px] text-slate-400 font-medium mb-0.5">অনুদান পরিমাণ</div>
          <div className="text-base font-black text-amber-600">{formatTaka(donor.amount)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-[#F9FAF8] border-b border-slate-100 overflow-hidden" id="donations-section">
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-1 {
          animation: marquee-ltr 50s linear infinite;
        }
        .marquee-row-2 {
          animation: marquee-rtl 55s linear infinite;
        }
        .marquee-row-1:hover,
        .marquee-row-2:hover {
          animation-play-state: paused;
        }
        .mask-donor {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <HeartHandshake className="w-3.5 h-3.5" />
            কৃতজ্ঞতা স্বীকার
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            সম্মানিত দাতা ও <span className="text-amber-600">শুভানুধ্যায়ী</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            যাঁদের সার্বিক সহযোগিতা ও অনুদানে আমাদের এই ঐতিহাসিক মিলনমেলা সাফল্যমণ্ডিত হচ্ছে
          </p>
          <div className="flex justify-center mt-4 gap-1">
            <div className="h-1 w-8 rounded-full bg-[#00732A]"></div>
            <div className="h-1 w-3 rounded-full bg-amber-400"></div>
            <div className="h-1 w-8 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>
      </div>

      {/* Row 1 — Right to Left */}
      {row1Items.length > 0 && (
        <div className="mask-donor overflow-hidden mb-5 px-16">
          <div className="flex w-max gap-5 marquee-row-1">
            {row1Items.map((donor, idx) => (
              <div key={`r1-${donor.id}-${idx}`}>
                <DonorCard donor={donor} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 2 — Left to Right */}
      {row2Items.length > 0 && (
        <div className="mask-donor overflow-hidden mb-12 px-16">
          <div className="flex w-max gap-5 marquee-row-2">
            {row2Items.map((donor, idx) => (
              <div key={`r2-${donor.id}-${idx}`}>
                <DonorCard donor={donor} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Callout Box */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] rounded-3xl p-7 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-200/40 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 pointer-events-none"></div>

          <div className="flex items-center gap-5 text-center sm:text-left relative">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <HeartHandshake className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold">আপনিও কি পুনর্মিলনীতে অনুদান দিতে চান?</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                আপনার যেকোনো পরিমাণ অনুদান আমাদের উৎসব ও বিদ্যালয়ের অবকাঠামো উন্নয়নে ভূমিকা রাখবে।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDonateModal(true)}
            className="relative px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
          >
            <QrCode className="w-4 h-4" />
            অনুদান পদ্ধতি ও QR স্ক্যানার
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="অনুদান পাঠানোর তথ্য ও স্ক্যানার QR কোড"
      />
    </section>
  );
};
