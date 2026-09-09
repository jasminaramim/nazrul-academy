import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';
import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';
import { BdtIcon } from '../../../shared/components/BdtIcon';
import { ImageUploader } from '../../../shared/components/ImageUploader';

import { Save, Receipt, Plus, Search, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceTabProps {
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

export const FinanceTab: React.FC<FinanceTabProps> = ({ finance, setFinance, setEditingTransaction, transactionFilter, setTransactionFilter, transactionSearch, setTransactionSearch, flashMessage, loadAllData }) => {
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <label className="text-xs font-bold text-emerald-900 block mb-1">
                      মোট আয় (টাকা)
                    </label>
                    <input
                      type="number"
                      value={finance.totalIncome}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFinance({
                          ...finance,
                          totalIncome: val,
                          balance: val - finance.totalExpense,
                        });
                      }}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-300 font-black text-emerald-800 bg-white"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                    <label className="text-xs font-bold text-rose-900 block mb-1">
                      মোট ব্যয় (টাকা)
                    </label>
                    <input
                      type="number"
                      value={finance.totalExpense}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFinance({
                          ...finance,
                          totalExpense: val,
                          balance: finance.totalIncome - val,
                        });
                      }}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-300 font-black text-rose-800 bg-white"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
                    <span className="text-xs font-bold text-amber-900 block mb-1">
                      তহবিল উদ্বৃত্ত (Balance)
                    </span>
                    <div className="px-3 py-2 bg-white rounded-xl border border-amber-300 text-base font-black text-amber-700">
                      {formatTaka(finance.totalIncome - finance.totalExpense)}
                    </div>
                  </div>
                </div>
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
                              <td className="p-3 text-slate-600">{tx.category}</td>
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
                                        const updatedFinance = { ...finance, transactions: updatedTxs };
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

              {/* Breakdown Category Editors */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      আয় ও ব্যয়ের খাত বিবরণী (Category Breakdown)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ব্যবহারকারী যখন 'বিস্তারিত দেখুন' ক্লিক করবে তখন প্রদর্শিত খাতসমূহ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await apiService.updateFinance(finance);
                      flashMessage('খাত বিবরণী সংরক্ষিত হয়েছে');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>খাত বিবরণী সংরক্ষণ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Income details */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#00732A] flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>আয়ের খাতসমূহ</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = finance.breakdown?.incomeCategories || [];
                          const updated = [...current, { category: 'নতুন আয়ের খাত', amount: 0 }];
                          setFinance({
                            ...finance,
                            breakdown: { ...finance.breakdown, incomeCategories: updated },
                          });
                        }}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                      >
                        + নতুন খাত যোগ
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {finance.breakdown?.incomeCategories?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => {
                              const updated = [...(finance.breakdown?.incomeCategories || [])];
                              updated[idx].category = e.target.value;
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, incomeCategories: updated },
                              });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const updated = [...(finance.breakdown?.incomeCategories || [])];
                              updated[idx].amount = Number(e.target.value);
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, incomeCategories: updated },
                              });
                            }}
                            className="w-24 sm:w-28 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-bold bg-white text-emerald-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (finance.breakdown?.incomeCategories || []).filter(
                                (_, i) => i !== idx
                              );
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, incomeCategories: updated },
                              });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense details */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#CA0000] flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>ব্যয়ের খাতসমূহ</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = finance.breakdown?.expenseCategories || [];
                          const updated = [...current, { category: 'নতুন ব্যয়ের খাত', amount: 0 }];
                          setFinance({
                            ...finance,
                            breakdown: { ...finance.breakdown, expenseCategories: updated },
                          });
                        }}
                        className="text-[11px] font-bold text-rose-800 hover:text-rose-950 bg-rose-100 px-2 py-0.5 rounded cursor-pointer"
                      >
                        + নতুন খাত যোগ
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {finance.breakdown?.expenseCategories?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => {
                              const updated = [...(finance.breakdown?.expenseCategories || [])];
                              updated[idx].category = e.target.value;
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, expenseCategories: updated },
                              });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const updated = [...(finance.breakdown?.expenseCategories || [])];
                              updated[idx].amount = Number(e.target.value);
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, expenseCategories: updated },
                              });
                            }}
                            className="w-24 sm:w-28 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-bold bg-white text-rose-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (finance.breakdown?.expenseCategories || []).filter(
                                (_, i) => i !== idx
                              );
                              setFinance({
                                ...finance,
                                breakdown: { ...finance.breakdown, expenseCategories: updated },
                              });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};
