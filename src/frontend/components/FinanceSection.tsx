import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Info, X } from 'lucide-react';
import { FinanceSummary } from '../../shared/types';
import { formatTaka } from '../../shared/utils/formatters';

interface FinanceSectionProps {
  finance: FinanceSummary;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ finance }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            আর্থিক তথ্য
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            পুনর্মিলনীর আর্থিক চিত্র
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            পুনর্মিলনী আয়োজনের সর্বমোট আর্থিক হিসাব ও তহবিল
          </p>
        </div>

        {/* 3 Metric Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          {/* Total Income */}
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>মোট আয়</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatTaka(finance.totalIncome)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">নিবন্ধন ও অনুদান হতে</span>
          </div>

          {/* Total Expense */}
          <div className="flex flex-col items-center text-center p-4 border-y md:border-y-0 md:border-x border-slate-200">
            <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              <span>মোট ব্যয়</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatTaka(finance.totalExpense)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">মঞ্চ, ভোজ ও ব্যবস্থাপনা</span>
          </div>

          {/* Balance (Surplus) */}
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              <span>উদ্বৃত্ত</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              {formatTaka(finance.balance)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">বিদ্যালয় উন্নয়ন তহবিলে</span>
          </div>
        </div>

        {/* Detailed Modal Trigger */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00732A] hover:text-[#005c21] hover:underline cursor-pointer"
          >
            <Info className="w-4 h-4" />
            <span>বিস্তারিত দেখুন</span>
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-5">
              পুনর্মিলনী তহবিলের বিস্তারিত বিবরণী
            </h3>

            {/* Income and Expense categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Income Categories */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-bold text-[#00732A] mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>আয়ের খাতসমূহ</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {finance.breakdown?.incomeCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between border-b border-emerald-100/60 pb-1.5">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="font-bold text-slate-900">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-[#00732A]">
                    <span>সর্বমোট আয়:</span>
                    <span>{formatTaka(finance.totalIncome)}</span>
                  </li>
                </ul>
              </div>

              {/* Expense Categories */}
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                <h4 className="text-sm font-bold text-[#CA0000] mb-3 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>ব্যয়ের খাতসমূহ</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {finance.breakdown?.expenseCategories?.map((item, idx) => (
                    <li key={idx} className="flex justify-between border-b border-rose-100/60 pb-1.5">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="font-bold text-slate-900">{formatTaka(item.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-2 text-sm font-black text-[#CA0000]">
                    <span>সর্বমোট ব্যয়:</span>
                    <span>{formatTaka(finance.totalExpense)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Transactions Ledger Table if available */}
            {finance.transactions && finance.transactions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  সাম্প্রতিক আর্থিক ভাউচার ও ট্রানজেকশন তালিকা
                </h4>
                <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="p-2.5">তারিখ</th>
                        <th className="p-2.5">খাত / বিবরণ</th>
                        <th className="p-2.5">ধরন</th>
                        <th className="p-2.5 text-right">পরিমাণ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {finance.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500 whitespace-nowrap">{tx.date}</td>
                          <td className="p-2.5 text-slate-800 font-medium">{tx.title}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tx.type === 'income'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tx.type === 'income' ? 'আয়' : 'ব্যয়'}
                            </span>
                          </td>
                          <td
                            className={`p-2.5 text-right font-bold whitespace-nowrap ${
                              tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {formatTaka(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Surplus note */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs text-slate-600">উদ্বৃত্ত নগদ স্থিতি: </span>
              <strong className="text-base text-amber-800 font-bold ml-1">
                {formatTaka(finance.balance)}
              </strong>
              <p className="text-[11px] text-slate-500 mt-1">
                উদ্বৃত্ত অর্থ ত্রিশাল সরকারি নজরুল একাডেমির লাইব্রেরি ও বিজ্ঞানাগার সংস্কারে ব্যবহৃত হবে।
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
