import React from 'react';
import { HeartHandshake, QrCode, Heart } from 'lucide-react';
import { Donor } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';
interface DonationSectionProps {
  donors: Donor[];
  onOpenDonationModal?: () => void;
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

export const DonationSection: React.FC<DonationSectionProps> = ({ donors, onOpenDonationModal }) => {
  // Only show approved donors on website
  const approvedDonors = donors.filter((d) => d.status === 'approved');

  // Use marquee if enough donors for desktop (>=6), always use on mobile (handled via CSS)
  const useMarquee = approvedDonors.length >= 6;

  // Always split into 2 rows for mobile marquee
  const half = Math.ceil(approvedDonors.length / 2);
  const row1 = approvedDonors.length > 0 ? approvedDonors.slice(0, Math.max(half, 1)) : [];
  const row2 = approvedDonors.length > 1 ? approvedDonors.slice(Math.max(half, 1)) : approvedDonors;

  // Duplicate rows for seamless infinite scroll
  const minRepeat = (arr: Donor[]) => {
    if (arr.length === 0) return [];
    // repeat enough times to fill screen comfortably
    const times = Math.max(4, Math.ceil(12 / arr.length));
    return Array.from({ length: times }, () => arr).flat();
  };
  const row1Items = minRepeat(row1);
  const row2Items = minRepeat(row2);

  const DonorCard = ({ donor, small = false }: { donor: Donor; small?: boolean }) => (
    <div className={`shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group cursor-default ${small ? 'w-36 sm:w-44' : 'w-52'}`}>
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#00732A] via-amber-400 to-[#CA0000]"></div>
      <div className={`flex flex-col items-center text-center ${small ? 'p-3' : 'p-5'}`}>
        {/* Category Badge */}
        {donor.category && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${small ? 'mb-2' : 'mb-3'} ${getCategoryStyle(donor.category)}`}>
            {donor.category}
          </span>
        )}

        {/* Avatar */}
        <div className="relative mb-2">
          <div className={`rounded-full overflow-hidden border-2 border-amber-200 shadow-md group-hover:scale-110 transition-transform duration-300 ${small ? 'w-12 h-12' : 'w-16 h-16'}`}>
            <img
              src={donor.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(donor.name)}`}
              alt={donor.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
            <Heart className="w-2 h-2 text-white fill-white" />
          </div>
        </div>

        {/* Name */}
        <h3 className={`font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#00732A] transition-colors ${small ? 'text-xs' : 'text-sm'}`}>
          {donor.name}
        </h3>

        {/* Batch */}
        {donor.batch && (
          <span className="text-[10px] font-bold text-[#CA0000] mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            {donor.batch}
          </span>
        )}

        {/* Amount */}
        <div className={`border-t border-slate-100 w-full ${small ? 'mt-2 pt-2' : 'mt-3 pt-3'}`}>
          {!small && <div className="text-[10px] text-slate-400 font-medium mb-0.5">অনুদান পরিমাণ</div>}
          <div className={`font-black text-amber-600 ${small ? 'text-xs' : 'text-base'}`}>{formatTaka(donor.amount)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-[#F9FAF8] border-b border-slate-100 overflow-hidden" id="donations-section">
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-1 {
          animation: marquee-ltr 50s linear infinite;
        }
        .marquee-row-2 {
          animation: marquee-rtl 55s linear infinite;
        }
        /* Mobile-specific: faster + smaller cards */
        @media (max-width: 767px) {
          .marquee-row-1 { animation-duration: 28s; }
          .marquee-row-2 { animation-duration: 32s; }
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

      {/* When no approved donors yet */}
      {approvedDonors.length === 0 && (
        <div className="text-center py-6 mb-8 text-slate-400 text-xs sm:text-sm">
          <p>অনলাইনে জমাকৃত অনুদানসমূহ বর্তমানে যাচাইকরণ ও অনুমোদন প্রক্রিয়ায় রয়েছে।</p>
        </div>
      )}

      {/* CASE 1: Static Centered Cards — desktop only (donors 1-5) */}
      {!useMarquee && approvedDonors.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {/* Desktop: flex wrap centered */}
          <div className="hidden sm:flex flex-wrap justify-center items-center gap-5 sm:gap-6">
            {approvedDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
          {/* Mobile: always 2-row marquee even for small lists */}
          <div className="sm:hidden">
            <div className="mask-donor overflow-hidden mb-4">
              <div className="flex w-max gap-3 marquee-row-1">
                {row1Items.map((donor, idx) => (
                  <div key={`m-r1-${donor.id}-${idx}`}>
                    <DonorCard donor={donor} small />
                  </div>
                ))}
              </div>
            </div>
            <div className="mask-donor overflow-hidden mb-8">
              <div className="flex w-max gap-3 marquee-row-2">
                {row2Items.map((donor, idx) => (
                  <div key={`m-r2-${donor.id}-${idx}`}>
                    <DonorCard donor={donor} small />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: Continuous Marquee Rows — desktop (donors >= 6) */}
      {useMarquee && row1Items.length > 0 && (
        <>
          {/* Desktop: normal-size cards */}
          <div className="hidden sm:block mask-donor overflow-hidden mb-5 px-16">
            <div className="flex w-max gap-5 marquee-row-1">
              {row1Items.map((donor, idx) => (
                <div key={`r1-${donor.id}-${idx}`}>
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile: small cards */}
          <div className="sm:hidden mask-donor overflow-hidden mb-4 px-4">
            <div className="flex w-max gap-3 marquee-row-1">
              {row1Items.map((donor, idx) => (
                <div key={`r1m-${donor.id}-${idx}`}>
                  <DonorCard donor={donor} small />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {useMarquee && row2Items.length > 0 && (
        <>
          {/* Desktop */}
          <div className="hidden sm:block mask-donor overflow-hidden mb-12 px-16">
            <div className="flex w-max gap-5 marquee-row-2">
              {row2Items.map((donor, idx) => (
                <div key={`r2-${donor.id}-${idx}`}>
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile */}
          <div className="sm:hidden mask-donor overflow-hidden mb-8 px-4">
            <div className="flex w-max gap-3 marquee-row-2">
              {row2Items.map((donor, idx) => (
                <div key={`r2m-${donor.id}-${idx}`}>
                  <DonorCard donor={donor} small />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Callout Box */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          onClick={() => {
            if (onOpenDonationModal) {
              onOpenDonationModal();
            }
          }}
          className="bg-gradient-to-r from-[#00732A] via-[#005c21] to-[#CA0000] rounded-3xl p-7 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-200/40 relative overflow-hidden cursor-pointer group hover:shadow-2xl transition-all"
        >
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
            className="relative px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-900 bg-amber-400 group-hover:bg-amber-300 shadow-lg transition-all shrink-0 flex items-center gap-2 group-hover:-translate-y-1"
          >
            <HeartHandshake className="w-4 h-4" />
            অনলাইনে অনুদান দিন
          </button>
        </div>
      </div>
    </section>
  );
};
