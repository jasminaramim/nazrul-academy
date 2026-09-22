import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3, X, ChevronRight, Banknote, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { FinanceSummary } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';

interface FinanceSectionProps {
  finance: FinanceSummary;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ finance }) => {
  const [showDetails, setShowDetails] = useState(false);

  const totalIncome  = finance.totalIncome  || 0;
  const totalExpense = finance.totalExpense || 0;
  const balance      = finance.balance      || 0;

  const incomePercent  = totalIncome > 0 ? 100 : 0;
  const expensePercent = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  const balancePercent = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#F0FAF4] to-white border-b border-slate-100 relative overflow-hidden">
      <style>{`
        .fin-grid {
          background-image:
            linear-gradient(rgba(0,115,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,115,42,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes bar-fill {
          from { width: 0; }
        }
        .fin-bar { animation: bar-fill 1.2s cubic-bezier(.4,0,.2,1) both; }
        .fin-card {
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease;
        }
        .fin-card:hover { transform: translateY(-6px); }
      `}</style>

      {/* Background decorations */}
      <div className="fin-grid absolute inset-0 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── Section Header ── */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <Banknote className="w-3.5 h-3.5" />
            আর্থিক তথ্য
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            পুনর্মিলনীর <span className="text-[#00732A]">আর্থিক চিত্র</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            পুনর্মিলনী আয়োজনের সর্বমোট আর্থিক হিসাব ও তহবিল
          </p>
          <div className="flex justify-center mt-5 gap-1.5">
            <div className="h-[3px] w-10 rounded-full bg-[#00732A]"></div>
            <div className="h-[3px] w-4 rounded-full bg-[#FBBF24]"></div>
            <div className="h-[3px] w-10 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>

        {/* ── Main 3 Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-6">

          {/* Income Card */}
          <div className="fin-card relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#00732A]" />
                </div>
                <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 text-[#00732A]" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#00732A]">{incomePercent}%</span>
                </div>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">মোট আয়</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#00732A] tracking-tight mb-1">
                {formatTaka(totalIncome)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mb-4">নিবন্ধন ও অনুদান হতে</div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="fin-bar h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${incomePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="fin-card relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-400 rounded-t-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#CA0000]" />
                </div>
                <div className="flex items-center gap-1 bg-red-100 border border-red-200 px-2 py-1 rounded-full">
                  <ArrowDownRight className="w-3 h-3 text-[#CA0000]" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#CA0000]">{expensePercent}%</span>
                </div>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">মোট ব্যয়</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#CA0000] tracking-tight mb-1">
                {formatTaka(totalExpense)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mb-4">মঞ্চ, ভোজ ও ব্যবস্থাপনা</div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="fin-bar h-full rounded-full bg-gradient-to-r from-[#CA0000] to-rose-400" style={{ width: `${expensePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Surplus Card */}
          <div className="fin-card col-span-2 md:col-span-1 relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden group bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl shadow-amber-900/30">
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-700/20 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-100" />
                  <span className="text-[10px] sm:text-xs font-bold text-white">{balancePercent}% উদ্বৃত্ত</span>
                </div>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-100 uppercase tracking-widest mb-1">উদ্বৃত্ত</div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {formatTaka(balance)}
              </div>
              <div className="text-[10px] sm:text-xs text-amber-100 mb-4">বিদ্যালয় উন্নয়ন তহবিলে</div>
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="fin-bar h-full rounded-full bg-white" style={{ width: `${balancePercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Income vs Expense Visual Bar ── */}
        {totalIncome > 0 && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00732A]" />
                আয় ও ব্যয়ের অনুপাত
              </h3>
              <span className="text-xs text-slate-400 font-medium">মোট: {formatTaka(totalIncome)}</span>
            </div>
            {/* Segmented bar */}
            <div className="flex h-7 rounded-full overflow-hidden gap-0.5">
              <div
                className="fin-bar h-full bg-gradient-to-r from-rose-500 to-rose-400 flex items-center justify-center"
                style={{ width: `${expensePercent}%` }}
              >
                <span className="text-[10px] font-black text-white px-1 truncate">ব্যয় {expensePercent}%</span>
              </div>
              <div
                className="fin-bar h-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center"
                style={{ width: `${balancePercent}%` }}
              >
                <span className="text-[10px] font-black text-white px-1 truncate">উদ্বৃত্ত {balancePercent}%</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-5 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-xs text-slate-500">মোট ব্যয়</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-500">উদ্বৃত্ত স্থিতি</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-500">মোট আয়</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Details Button ── */}
          <div className="text-center">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-[#005a20] hover:from-[#005a20] hover:to-[#00732A] shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
            {/* Modal Header */}
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

            {/* Income and Expense categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Income */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  আয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {finance.breakdown?.incomeCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="font-bold text-emerald-400">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-emerald-400 border-t border-emerald-500/20 mt-2">
                    <span>সর্বমোট আয়:</span>
                    <span>{formatTaka(totalIncome)}</span>
                  </li>
                </ul>
              </div>

              {/* Expense */}
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  </div>
                  ব্যয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {finance.breakdown?.expenseCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="font-bold text-rose-400">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-rose-400 border-t border-rose-500/20 mt-2">
                    <span>সর্বমোট ব্যয়:</span>
                    <span>{formatTaka(totalExpense)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Transactions */}
            {finance.transactions && finance.transactions.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  সাম্প্রতিক আর্থিক ভাউচার ও ট্রানজেকশন
                </h4>
                <div className="max-h-52 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 shadow-inner">
                  {finance.transactions.map((tx) => (
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

            {/* Surplus Banner */}
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center shadow-lg shadow-amber-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
              <div className="text-xs font-semibold text-amber-100 mb-1">উদ্বৃত্ত নগদ স্থিতি</div>
              <div className="text-2xl font-black">{formatTaka(balance)}</div>
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
