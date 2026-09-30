import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3, X, ChevronRight, Banknote, ArrowUpRight, ArrowDownRight, Sparkles, Users, Heart } from 'lucide-react';
import { FinanceSummary } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';
import { apiService } from '../../shared/services/api';

interface FinanceSectionProps {
  globalFinance?: any;
  finance: FinanceSummary;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ finance, globalFinance }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeReunion, setActiveReunion] = useState<any>(null);
  const [activeFinance, setActiveFinance] = useState<any>(finance);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const reunions = await apiService.reunions.getAll();
        const active = reunions.find((r: any) => r.isActive);
        if (active) {
          setActiveReunion(active);
          const f = await apiService.getFinance(active.id);
          setActiveFinance(f);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchActive();
  }, []);

  let regIncome = activeFinance?.breakdown?.registrationFees || 0;
  let donIncome = globalFinance?.globalTotalDonationIncome || globalFinance?.totalDonationIncome || activeFinance?.breakdown?.donations || 0;

  let donExp = 0;
  let regExp = 0;
  let othExp = 0;

  if (activeFinance?.transactions) {
    activeFinance.transactions.forEach((t: any) => {
      if (t.type === 'expense') {
        if (t.fundSource === 'donation') donExp += Number(t.amount);
        else if (t.fundSource === 'registration') regExp += Number(t.amount);
        else othExp += Number(t.amount);
      }
    });
  }

  let finalTotalIncome = regIncome + donIncome;
  let finalTotalExpense = regExp + donExp + othExp;
  let finalBalance = finalTotalIncome - finalTotalExpense;

  const expensePercent = finalTotalIncome > 0 ? Math.round((finalTotalExpense / finalTotalIncome) * 100) : 0;
  const visualBalancePercent = finalTotalIncome > 0 ? Math.max(0, Math.round((finalBalance / finalTotalIncome) * 100)) : 0;
  const displayBalancePercent = finalTotalIncome > 0 ? Math.round((finalBalance / finalTotalIncome) * 100) : 0;

  const cards = [
    {
      label: 'নিবন্ধন থেকে আয়',
      sublabel: 'নিবন্ধিত শিক্ষার্থী হতে প্রাপ্ত',
      value: regIncome,
      icon: Users,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-700',
      badge: '↑ আয়',
    },
    {
      label: 'অনুদান থেকে আয়',
      sublabel: 'এ পর্যন্ত মোট অনুদান',
      value: donIncome,
      icon: Heart,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-100',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-700',
      badge: '↑ আয়',
    },
    {
      label: 'সর্বমোট আয়',
      sublabel: 'নিবন্ধন + অনুদান',
      value: finalTotalIncome,
      icon: TrendingUp,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
      badge: '= মোট',
    },
    {
      label: 'মোট ব্যয়',
      sublabel: activeFinance?.transactions ? `ভাউচার: ${activeFinance.transactions.filter((t: any) => t.type === 'expense').length}টি` : 'ব্যবস্থাপনা ব্যয়',
      value: finalTotalExpense,
      icon: TrendingDown,
      color: 'rose',
      gradient: 'from-rose-500 to-red-500',
      bg: 'bg-rose-50',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-100',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-700',
      badge: `${expensePercent}% ব্যয়`,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <style>{`
        @keyframes fin-rise { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes bar-fill { from { width: 0; } }
        .fin-bar { animation: bar-fill 1.4s cubic-bezier(.4,0,.2,1) both; }
        .fin-card-new {
          transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s ease;
          animation: fin-rise 0.5s ease both;
        }
        .fin-card-new:hover { transform: translateY(-4px); box-shadow: 0 12px 40px -8px rgba(0,0,0,0.12); }
        .fin-card-new:nth-child(1) { animation-delay: 0.05s; }
        .fin-card-new:nth-child(2) { animation-delay: 0.1s; }
        .fin-card-new:nth-child(3) { animation-delay: 0.15s; }
        .fin-card-new:nth-child(4) { animation-delay: 0.2s; }
      `}</style>

      {/* Subtle background dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(0,115,42,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-50 to-transparent pointer-events-none opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-50 to-transparent pointer-events-none opacity-60"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Banknote className="w-3.5 h-3.5" />
            আর্থিক তথ্য
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
            পুনর্মিলনীর{' '}
            <span className="text-[#00732A]">আর্থিক চিত্র</span>
          </h2>
          {activeReunion && (
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              {activeReunion.title} ({activeReunion.year}) — আর্থিক হিসাব ও তহবিল
            </p>
          )}
          <div className="flex justify-center mt-5 gap-1.5">
            <div className="h-[3px] w-10 rounded-full bg-[#00732A]"></div>
            <div className="h-[3px] w-4 rounded-full bg-[#FBBF24]"></div>
            <div className="h-[3px] w-10 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className={`fin-card-new relative bg-white rounded-2xl p-5 sm:p-6 border ${card.borderColor} overflow-hidden`}>
                {/* Top gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradient}`}></div>

                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${card.badgeBg} ${card.badgeText}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Label */}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>

                {/* Amount */}
                <p className={`text-2xl sm:text-3xl font-black ${card.textColor} tracking-tight mb-1`}>
                  {formatTaka(card.value)}
                </p>

                {/* Sublabel */}
                <p className="text-[11px] text-slate-400 mb-4">{card.sublabel}</p>

                {/* Progress bar */}
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`fin-bar h-full rounded-full bg-gradient-to-r ${card.gradient}`} style={{ width: '100%' }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Surplus + Progress Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">

          {/* Surplus card — spans 2 cols */}
          <div className="fin-card-new lg:col-span-2 relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-xl shadow-amber-200">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10"></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/20 text-white">
                  <Sparkles className="w-3 h-3" />
                  {displayBalancePercent}% উদ্বৃত্ত
                </span>
              </div>

              <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-1">উদ্বৃত্ত তহবিল</p>
              <p className="text-4xl font-black text-white tracking-tight mb-1">{formatTaka(finalBalance)}</p>
              <p className="text-amber-100 text-xs mb-5">বিদ্যালয় উন্নয়ন তহবিলে জমা</p>

              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="fin-bar h-full rounded-full bg-white" style={{ width: `${visualBalancePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Progress bar card — spans 3 cols */}
          {finalTotalIncome > 0 && (
            <div className="fin-card-new lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00732A]" />
                  আয় ও ব্যয়ের বিশ্লেষণ
                </h3>
                <span className="text-xs text-slate-400 font-medium">মোট: {formatTaka(finalTotalIncome)}</span>
              </div>

              {/* Stacked bar */}
              <div className="flex h-8 rounded-xl overflow-hidden gap-0.5 mb-5">
                {finalTotalExpense > 0 && (
                  <div
                    className="fin-bar h-full bg-gradient-to-r from-rose-500 to-rose-400 flex items-center justify-center rounded-l-xl"
                    style={{ width: `${Math.min(100, expensePercent)}%` }}
                  >
                    <span className="text-[10px] font-black text-white px-2 truncate">ব্যয় {expensePercent}%</span>
                  </div>
                )}
                {visualBalancePercent > 0 && (
                  <div
                    className="fin-bar h-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center rounded-r-xl"
                    style={{ width: `${visualBalancePercent}%` }}
                  >
                    <span className="text-[10px] font-black text-white px-2 truncate">উদ্বৃত্ত {displayBalancePercent}%</span>
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'সর্বমোট আয়', value: finalTotalIncome, color: 'text-emerald-600', dot: 'bg-emerald-500' },
                  { label: 'মোট ব্যয়', value: finalTotalExpense, color: 'text-rose-600', dot: 'bg-rose-500' },
                  { label: 'উদ্বৃত্ত', value: finalBalance, color: 'text-amber-600', dot: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                      <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
                    </div>
                    <span className={`text-sm sm:text-base font-black ${item.color}`}>{formatTaka(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CTA Button ── */}
        <div className="text-center">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-[#005a20] hover:from-[#005a20] hover:to-[#00732A] shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>বিস্তারিত আর্থিক বিবরণী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Details Modal ── */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white">পুনর্মিলনী তহবিলের বিবরণী</h3>
                <p className="text-xs text-slate-400 mt-0.5">সর্বশেষ হালনাগাদ: {finance.lastUpdated}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  আয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {activeFinance?.breakdown?.incomeCategories?.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="font-bold text-emerald-400">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-emerald-400 border-t border-emerald-500/20 mt-2">
                    <span>সর্বমোট আয়:</span>
                    <span>{formatTaka(finalTotalIncome)}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  </div>
                  ব্যয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {activeFinance?.breakdown?.expenseCategories?.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="font-bold text-rose-400">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-rose-400 border-t border-rose-500/20 mt-2">
                    <span>সর্বমোট ব্যয়:</span>
                    <span>{formatTaka(finalTotalExpense)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {activeFinance?.transactions && activeFinance?.transactions.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  সাম্প্রতিক আর্থিক ভাউচার ও ট্রানজেকশন
                </h4>
                <div className="max-h-52 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 shadow-inner">
                  {activeFinance?.transactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs sm:text-sm font-bold text-slate-200 truncate mb-1">{tx.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">{tx.date}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            tx.type === 'income'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {tx.type === 'income' ? '↑ আয়' : '↓ ব্যয়'}
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm font-black whitespace-nowrap shrink-0 ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatTaka(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center shadow-lg shadow-amber-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
              <div className="text-xs font-semibold text-amber-100 mb-1">উদ্বৃত্ত নগদ স্থিতি</div>
              <div className="text-2xl font-black">{formatTaka(finalBalance)}</div>
              <p className="text-[11px] text-amber-100 mt-1.5">
                উদ্বৃত্ত অর্থ ত্রিশাল সরকারি নজরুল একাডেমির লাইব্রেরি ও বিজ্ঞানাগার সংস্কারে ব্যবহৃত হবে।
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
