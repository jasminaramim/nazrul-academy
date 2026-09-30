import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Save, Receipt, Plus, Search, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceTabProps {
  reunions: any[];
  finance: any;
  setFinance: any;
  setEditingTransaction: any;
  transactionFilter: any;
  setTransactionFilter: any;
  transactionSearch: any;
  setTransactionSearch: any;
  flashMessage: any;
  loadAllData: any;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ reunions, finance, setFinance, setEditingTransaction, transactionFilter, setTransactionFilter, transactionSearch, setTransactionSearch, flashMessage, loadAllData }) => {
  const [selectedReunionId, setSelectedReunionId] = useState<string>('');
  
  React.useEffect(() => {
    if (!selectedReunionId && reunions?.length) {
      const active = reunions.find(r => r.isActive);
      if (active) setSelectedReunionId(active.id);
      else setSelectedReunionId(reunions[0].id);
    }
  }, [reunions]);

  const handleReunionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    setSelectedReunionId(rId);
    try {
      const data = await apiService.getFinance(rId);
      setFinance(data);
    } catch (err) {}
  };

  return (
    <>
      <div className="space-y-6">
              {/* Financial Metrics Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      পুনর্মিলনীর সামগ্রিক আর্থিক চিত্র ও তহবিল স্থিতি
                    </h3>
                    <div className="mt-2">
                      <select value={selectedReunionId} onChange={handleReunionChange} className="border rounded px-2 py-1 text-sm bg-slate-50 border-slate-300">
                        <option value="">সকল/ডিফল্ট</option>
                        {reunions?.map(r => <option key={r.id} value={r.id}>{r.title} ({r.year})</option>)}
                      </select>
                    </div>
                    <h3 className="hidden">
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      মোট আয়, মোট ব্যয় এবং উদ্বৃত্ত তহবিল পরিমাণ নিয়ন্ত্রণ করুন
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const txs = finance.transactions || [];
                        const calcIncome = txs
                          .filter((t) => t.type === 'income')
                          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                        const calcExpense = txs
                          .filter((t) => t.type === 'expense')
                          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                        setFinance({
                          ...finance,
                          totalIncome: calcIncome > 0 ? calcIncome : finance.totalIncome,
                          totalExpense: calcExpense > 0 ? calcExpense : finance.totalExpense,
                          balance:
                            calcIncome > 0 || calcExpense > 0
                              ? calcIncome - calcExpense
                              : finance.totalIncome - finance.totalExpense,
                        });
                        flashMessage('ভাউচার তালিকা থেকে মোট হিসাব সমন্বয় করা হয়েছে');
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-300"
                    >
                      স্বয়ংক্রিয় হিসাব সিঙ্ক
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const updatedFinance = {
                            ...finance,
                            balance: finance.totalIncome - finance.totalExpense,
                          };
                          await apiService.updateFinance(updatedFinance);
                          flashMessage('আর্থিক হিসাব সফলভাবে সংরক্ষিত হয়েছে');
                          loadAllData();
                        } catch (err: any) {
                          flashMessage(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', true);
                        }
                      }}
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>সংরক্ষণ করুন</span>
                    </button>
                  </div>
                </div>

                {(() => {
                  const regIncome = finance?.breakdown?.registrationFees || 0;
                  
                  let donExp = 0;
                  let regExpense = 0;
                  let otherExpense = 0;
                  
                  if (finance?.transactions) {
                    finance.transactions.forEach((t: any) => {
                      if (t.type === 'expense') {
                        if (t.fundSource === 'donation') donExp += Number(t.amount);
                        else if (t.fundSource === 'registration') regExpense += Number(t.amount);
                        else otherExpense += Number(t.amount);
                      }
                    });
                  }
                  
                  const totalDonationSoFar = finance?.globalTotalDonationIncome || finance?.totalDonationIncome || finance?.breakdown?.donations || 0;
                  
                  const grandTotalIncome = regIncome + totalDonationSoFar;
                  const grandTotalExpense = regExpense + donExp + otherExpense;
                  const grandBalance = grandTotalIncome - grandTotalExpense;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      
                      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                        <label className="text-xs font-bold text-blue-900 block mb-1">
                          নিবন্ধন থেকে আয়
                        </label>
                        <input
                          type="text"
                          value={formatTaka(regIncome)}
                          readOnly
                          className="w-full px-3 py-2 text-sm rounded-xl border border-blue-300 font-black text-blue-800 bg-blue-50 cursor-not-allowed"
                        />
                      </div>
                      
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 relative overflow-hidden">
                        <label className="text-xs font-bold text-indigo-900 block mb-1">
                          মোট অনুদান (এ যাবৎ)
                        </label>
                        <input
                          type="text"
                          value={formatTaka(totalDonationSoFar)}
                          readOnly
                          className="w-full px-3 py-2 text-sm rounded-xl border border-indigo-300 font-black text-indigo-800 bg-indigo-50 cursor-not-allowed"
                        />
                        <span className="absolute bottom-1 right-3 text-[9px] text-indigo-400">খরচ সহ মোট প্রাপ্তি</span>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 relative overflow-hidden">
                        <label className="text-xs font-bold text-emerald-900 block mb-1">
                          সর্বমোট আয় (টাকা)
                        </label>
                        <input
                          type="text"
                          value={formatTaka(grandTotalIncome)}
                          readOnly
                          className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-300 font-black text-emerald-800 bg-emerald-50 cursor-not-allowed"
                        />
                        <span className="absolute bottom-1 right-3 text-[9px] text-emerald-500/70">নিবন্ধন + অনুদান</span>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                        <label className="text-xs font-bold text-rose-900 block mb-1">
                          সর্বমোট ব্যয় (টাকা)
                        </label>
                        <input
                          type="text"
                          value={formatTaka(grandTotalExpense)}
                          readOnly
                          className="w-full px-3 py-2 text-sm rounded-xl border border-rose-300 font-black text-rose-800 bg-rose-50 cursor-not-allowed"
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-yellow-50/60 border border-yellow-200 flex flex-col justify-between">
                        <span className="text-xs font-bold text-yellow-900 block mb-1">
                          প্রকৃত তহবিল উদ্বৃত্ত (Balance)
                        </span>
                        <div className="px-3 py-2 bg-white rounded-xl border border-yellow-300 text-base font-black text-yellow-700">
                          {formatTaka(grandBalance)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Transactions Ledger Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#00732A]" />
                      <span>আর্থিক রসিদ ও ভাউচার লেনদেন তালিকা (Finance Transactions & Vouchers)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      সকল জমা ও খরচের ভাউচার যুক্ত করুন, এডিট বা ডিলিট করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTransaction({
                        id: `tx-${Date.now()}`,
                        title: '',
                        type: 'income',
                        amount: 0,
                        category: 'নিবন্ধন ফি',
                        date: new Date().toISOString().split('T')[0],
                        voucherNo: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
                        note: '',
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন লেনদেন / ভাউচার যুক্ত করুন</span>
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                      placeholder="ভাউচার নং বা বিবরণে সার্চ করুন..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTransactionFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        transactionFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      সকল ({(finance.transactions || []).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionFilter('income')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        transactionFilter === 'income'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      আয় ({(finance.transactions || []).filter((t) => t.type === 'income').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionFilter('expense')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        transactionFilter === 'expense'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      ব্যয় ({(finance.transactions || []).filter((t) => t.type === 'expense').length})
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">ভাউচার নং</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3">খাত ও বিবরণ</th>
                        <th className="p-3">ক্যাটাগরি</th>
                        <th className="p-3">ধরন</th>
                        <th className="p-3 text-right">পরিমাণ</th>
                        <th className="p-3 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(!finance.transactions || finance.transactions.length === 0) ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            কোনো লেনদেন পাওয়া যায়নি। উপরে 'নতুন লেনদেন যুক্ত করুন' বাটনে ক্লিক করুন।
                          </td>
                        </tr>
                      ) : (
                        finance.transactions
                          .filter((t) => {
                            if (transactionFilter !== 'all' && t.type !== transactionFilter) {
                              return false;
                            }
                            if (transactionSearch.trim()) {
                              const q = transactionSearch.toLowerCase();
                              return (
                                (t.title && t.title.toLowerCase().includes(q)) ||
                                (t.voucherNo && t.voucherNo.toLowerCase().includes(q)) ||
                                (t.category && t.category.toLowerCase().includes(q))
                              );
                            }
                            return true;
                          })
                          .map((tx, idx) => (
                            <tr key={tx.id || idx} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-slate-600">
                                {tx.voucherNo || `VCH-${idx + 1}`}
                              </td>
                              <td className="p-3 text-slate-500 whitespace-nowrap">{tx.date}</td>
                              <td className="p-3">
                                <span className="font-bold text-slate-800 block">{tx.title}</span>
                                {tx.note && <span className="text-[11px] text-slate-400">{tx.note}</span>}
                              </td>
                              <td className="p-3 text-slate-600">
                                {tx.category}
                                <span className="block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 w-fit text-slate-500">
                                  {tx.fundSource === 'registration' ? 'নিবন্ধন তহবিল' : tx.fundSource === 'donation' ? 'অনুদান তহবিল' : 'অন্যান্য তহবিল'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    tx.type === 'income'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {tx.type === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}
                                </span>
                              </td>
                              <td
                                className={`p-3 text-right font-black whitespace-nowrap text-sm ${
                                  tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              >
                                {formatTaka(tx.amount)}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingTransaction(tx)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (confirm(`আপনি কি "${tx.title}" ভাউচারটি মুছে ফেলতে চান?`)) {
                                        const updatedTxs = (finance.transactions || []).filter(
                                          (t) => t.id !== tx.id
                                        );
                                        
                                        let incomeDiff = tx.type === 'income' ? -Number(tx.amount || 0) : 0;
                                        let expenseDiff = tx.type === 'expense' ? -Number(tx.amount || 0) : 0;
                                        
                                        const newTotalIncome = (Number(finance.totalIncome) || 0) + incomeDiff;
                                        const newTotalExpense = (Number(finance.totalExpense) || 0) + expenseDiff;

                                        const updatedFinance = { 
                                          ...finance, 
                                          transactions: updatedTxs,
                                          totalIncome: newTotalIncome,
                                          totalExpense: newTotalExpense,
                                          balance: newTotalIncome - newTotalExpense
                                        };
                                        setFinance(updatedFinance);
                                        await apiService.updateFinance(updatedFinance);
                                        flashMessage('লেনদেন মুছে ফেলা হয়েছে');
                                      }
                                    }}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
      </div>
    </>
  );
};
