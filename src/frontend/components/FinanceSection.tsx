import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3, X, ChevronRight, Banknote } from 'lucide-react';
import { FinanceSummary } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';

interface FinanceSectionProps {
  finance: FinanceSummary;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ finance }) => {
  const [showDetails, setShowDetails] = useState(false);

  const totalIncome = finance.totalIncome || 0;
  const totalExpense = finance.totalExpense || 0;
  const balance = finance.balance || 0;

  const incomePercent = totalIncome > 0 ? 100 : 0;
  const expensePercent = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  const balancePercent = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#00732A] text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <Banknote className="w-3.5 h-3.5" />
            আর্থিক তথ্য
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            পুনর্মিলনীর <span className="text-[#00732A]">আর্থিক চিত্র</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            পুনর্মিলনী আয়োজনের সর্বমোট আর্থিক হিসাব ও তহবিল
          </p>
          <div className="flex justify-center mt-4 gap-1">
            <div className="h-1 w-8 rounded-full bg-[#00732A]"></div>
            <div className="h-1 w-3 rounded-full bg-[#FBBF24]"></div>
            <div className="h-1 w-8 rounded-full bg-[#CA0000]"></div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">

          {/* Income Card */}
          <div className="relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#00732A] to-emerald-400"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#00732A]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  {incomePercent}%
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">মোট আয়</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#00732A] tracking-tight mb-1">
                {formatTaka(totalIncome)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4">নিবন্ধন ও অনুদান হতে</div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00732A] to-emerald-400" style={{ width: `${incomePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#CA0000] to-rose-400"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#CA0000]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                  {expensePercent}%
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">মোট ব্যয়</div>
              <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#CA0000] tracking-tight mb-1">
                {formatTaka(totalExpense)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4">মঞ্চ, ভোজ ও ব্যবস্থাপনা</div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#CA0000] to-rose-400" style={{ width: `${expensePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Surplus Card - Full width on mobile, 1 col on desktop */}
          <div className="col-span-2 md:col-span-1 relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-100 bg-white/20 px-2.5 py-1 rounded-full">
                  {balancePercent}% উদ্বৃত্ত
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-100 uppercase tracking-wider mb-1.5 sm:mb-2">উদ্বৃত্ত</div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {formatTaka(balance)}
              </div>
              <div className="text-[10px] sm:text-xs text-amber-100 mb-3 sm:mb-4">বিদ্যালয় উন্নয়ন তহবিলে</div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-white" style={{ width: `${balancePercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Expense Visual Bar */}
        {totalIncome > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00732A]" />
                আয় ও ব্যয়ের অনুপাত
              </h3>
              <span className="text-xs text-slate-500">মোট: {formatTaka(totalIncome)}</span>
            </div>
            <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#00732A] to-emerald-400 flex items-center justify-center transition-all duration-700"
                style={{ width: `${expensePercent}%` }}
              >
                <span className="text-[10px] font-bold text-white px-1 truncate">ব্যয় {expensePercent}%</span>
              </div>
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center transition-all duration-700"
                style={{ width: `${balancePercent}%` }}
              >
                <span className="text-[10px] font-bold text-white px-1 truncate">উদ্বৃত্ত {balancePercent}%</span>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00732A]"></div>
                <span className="text-xs text-slate-500">মোট ব্যয়</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-xs text-slate-500">উদ্বৃত্ত স্থিতি</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Button */}
        <div className="text-center">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-[#005a20] hover:from-[#005a20] hover:to-[#00732A] shadow-md shadow-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>বিস্তারিত আর্থিক বিবরণী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">পুনর্মিলনী তহবিলের বিবরণী</h3>
                <p className="text-xs text-slate-500 mt-0.5">সর্বশেষ হালনাগাদ: {finance.lastUpdated}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Income and Expense categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Income Categories */}
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="text-sm font-bold text-[#00732A] mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00732A] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  আয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {finance.breakdown?.incomeCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white/70 px-3 py-2 rounded-xl">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="font-bold text-[#00732A]">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-[#00732A] border-t border-emerald-200 mt-2">
                    <span>সর্বমোট আয়:</span>
                    <span>{formatTaka(totalIncome)}</span>
                  </li>
                </ul>
              </div>

              {/* Expense Categories */}
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                <h4 className="text-sm font-bold text-[#CA0000] mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#CA0000] flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-white" />
                  </div>
                  ব্যয়ের খাতসমূহ
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {finance.breakdown?.expenseCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white/70 px-3 py-2 rounded-xl">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="font-bold text-[#CA0000]">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-[#CA0000] border-t border-red-200 mt-2">
                    <span>সর্বমোট ব্যয়:</span>
                    <span>{formatTaka(totalExpense)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Transactions List (Mobile Friendly) */}
            {finance.transactions && finance.transactions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  সাম্প্রতিক আর্থিক ভাউচার ও ট্রানজেকশন
                </h4>
                <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 divide-y divide-slate-200 shadow-inner">
                  {finance.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-white transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate mb-1">
                          {tx.title}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                            {tx.date}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                            tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.type === 'income' ? '↑ আয়' : '↓ ব্যয়'}
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm sm:text-base font-black whitespace-nowrap shrink-0 ${
                        tx.type === 'income' ? 'text-[#00732A]' : 'text-[#CA0000]'
                      }`}>
                        {formatTaka(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Surplus Banner */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center shadow-md">
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
