import React, { useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { formatTaka } from '../../../shared/utils/formatters';
import { Donor } from '../../../shared/types';
import { ImageUploader } from '../../../shared/components/ImageUploader';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  CreditCard,
  Filter,
  CheckCircle2,
  ChevronDown,
  Copy,
  Check,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DonorsTabProps {
  donors: Donor[];
  editingDonor: any;
  setEditingDonor: any;
  flashMessage: any;
  loadAllData: any;
}

export const DonorsTab: React.FC<DonorsTabProps> = ({
  donors,
  editingDonor,
  setEditingDonor,
  flashMessage,
  loadAllData,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) => (prev[id] ? {} : { [id]: true }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pendingDonors = donors.filter((d) => d.status === 'pending');
  const approvedDonors = donors.filter((d) => d.status === 'approved' || !d.status);

  const filteredDonors =
    statusFilter === 'pending'
      ? pendingDonors
      : statusFilter === 'approved'
      ? approvedDonors
      : donors;

  const handleApprove = async (donor: Donor) => {
    setApprovingId(donor.id);
    try {
      const res = await apiService.approveDonor(donor.id);
      if (res.success) {
        flashMessage(res.message || 'অনুদান সফলভাবে অনুমোদিত হয়েছে');
        loadAllData();
      } else {
        flashMessage(res.message || 'অনুমোদন করতে ব্যর্থ হয়েছে', true);
      }
    } catch (err: any) {
      flashMessage(err.message || 'সার্ভার সমস্যা দেখা দিয়েছে', true);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900">সম্মানিত দাতা ও অনলাইন অনুদান তালিকা</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            অনলাইনে আসা অনুদানসমূহ যাচাই করে অনুমোদন করুন অথবা সরাসরি নতুন দাতা যোগ করুন
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল ({donors.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>অপেক্ষমাণ ({pendingDonors.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                statusFilter === 'approved'
                  ? 'bg-[#00732A] text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>অনুমোদিত ({approvedDonors.length})</span>
            </button>
          </div>

          <button
            onClick={() =>
              setEditingDonor({
                id: '',
                name: '',
                batch: 'ব্যাচ ১৯৯৫',
                amount: 50000,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                category: 'বিশেষ দাতা',
                status: 'approved',
              })
            }
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন দাতা যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Donors List */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          <p className="text-sm font-medium">কোনো অনুদান বা দাতার রেকর্ড পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {filteredDonors.map((d) => {
            const isPending = d.status === 'pending';
            const isExpanded = !!expandedCardIds[d.id];
            const hasDetailedInfo = !!(d.transactionId || d.senderNumber || d.phone || d.email || d.message);

            const methodColor =
              d.paymentMethod?.toLowerCase() === 'bkash'
                ? 'bg-pink-50 text-pink-700 border-pink-200'
                : d.paymentMethod?.toLowerCase() === 'nagad'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : d.paymentMethod?.toLowerCase() === 'rocket'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : d.paymentMethod?.toLowerCase() === 'bank'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div
                key={d.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col overflow-hidden break-inside-avoid mb-4 ${
                  isPending
                    ? 'border-amber-300 shadow-xs ring-1 ring-amber-200/70 bg-gradient-to-b from-amber-50/20 via-white to-white'
                    : 'border-slate-200 shadow-2xs hover:shadow-md'
                }`}
              >
                <div className="p-5">
                  {/* Top: Status & Amount */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5 gap-2">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border shadow-2xs ${
                        isPending
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>অপেক্ষমাণ (Pending)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>অনুমোদিত (Approved)</span>
                        </>
                      )}
                    </span>

                    <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl font-mono tracking-tight border border-slate-200 shadow-2xs">
                      {formatTaka(d.amount)}
                    </span>
                  </div>

                  {/* Donor Profile */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        d.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          d.name || 'Donor'
                        )}`
                      }
                      alt={d.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-slate-900 leading-snug truncate">
                        {d.name}
                      </h4>
                      {d.nameEn && d.nameEn !== d.name && (
                        <p className="text-[11px] text-slate-400 font-medium truncate leading-tight">
                          {d.nameEn}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[11px] font-bold text-[#00732A] bg-emerald-50 border border-emerald-200/80 px-2 py-0.2 rounded-md">
                          {d.batch || 'শুভানুধ্যায়ী'}
                        </span>
                        {d.category && (
                          <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">
                            • {d.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Quick Indicators */}
                  {(d.paymentMethod || d.transactionId) && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 flex-wrap">
                      {d.paymentMethod && (
                        <span className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] uppercase ${methodColor}`}>
                          {d.paymentMethod}
                        </span>
                      )}
                      {d.transactionId && (
                        <span className="font-mono text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px] border border-slate-200/60">
                          Trx: {d.transactionId}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dropdown Expand / Collapse Button */}
                  {hasDetailedInfo ? (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(d.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                          isExpanded
                            ? 'bg-slate-100 text-slate-900 border-slate-300'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200/80'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className={`w-3.5 h-3.5 ${isExpanded ? 'text-[#00732A]' : 'text-slate-400'}`} />
                          <span>{isExpanded ? 'তথ্য গুটিয়ে নিন' : 'ব্যবহারকারীর তথ্য দেখুন'}</span>
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <span>{isExpanded ? 'লুকান' : 'ড্রপডাউন'}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#00732A]' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expandable Details Content */}
                      {isExpanded && (
                        <div className="mt-2.5 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                          {d.paymentMethod && (
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                              <span className="text-slate-500 font-medium">পেমেন্ট মাধ্যম:</span>
                              <span className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] uppercase ${methodColor}`}>
                                {d.paymentMethod}
                              </span>
                            </div>
                          )}

                          {d.transactionId && (
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                              <span className="text-slate-500 font-medium">TrxID:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {d.transactionId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(d.transactionId || '', 'trx-' + d.id)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors cursor-pointer"
                                  title="TrxID কপি করুন"
                                >
                                  {copiedKey === 'trx-' + d.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {d.senderNumber && (
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                              <span className="text-slate-500 font-medium">প্রেরক নম্বর:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-slate-900">
                                  {d.senderNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(d.senderNumber || '', 'snd-' + d.id)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors cursor-pointer"
                                  title="নম্বর কপি করুন"
                                >
                                  {copiedKey === 'snd-' + d.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {d.phone && (
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                              <span className="text-slate-500 font-medium">যোগাযোগ:</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`tel:${d.phone}`}
                                  className="font-mono font-bold text-blue-600 hover:underline"
                                >
                                  {d.phone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(d.phone || '', 'ph-' + d.id)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors cursor-pointer"
                                  title="মোবাইল কপি করুন"
                                >
                                  {copiedKey === 'ph-' + d.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {d.email && (
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                              <span className="text-slate-500 font-medium">ইমেইল:</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`mailto:${d.email}`}
                                  className="text-slate-800 hover:text-blue-600 hover:underline truncate max-w-[140px] font-medium"
                                  title={d.email}
                                >
                                  {d.email}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(d.email || '', 'em-' + d.id)}
                                  className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors cursor-pointer"
                                  title="ইমেইল কপি করুন"
                                >
                                  {copiedKey === 'em-' + d.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {d.message && (
                            <div className="pt-1">
                              <span className="text-slate-400 text-[10px] font-bold block mb-1">
                                দাতার বার্তা / শুভকামনা:
                              </span>
                              <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 italic text-[11px] leading-relaxed">
                                "{d.message}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isPending ? (
                    <button
                      onClick={() => handleApprove(d)}
                      disabled={approvingId === d.id}
                      className="flex-1 py-2 px-3 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs hover:shadow-sm disabled:opacity-50"
                    >
                      {approvingId === d.id ? (
                        <span>অনুমোদন হচ্ছে...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>অনুমোদন করুন (Approve)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      লাইভ প্রদর্শিত
                    </span>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingDonor(d)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('আপনি কি এই অনুদানের তথ্য মুছে ফেলতে চান?')) {
                          await apiService.deleteDonor(d.id);
                          flashMessage('মুছে ফেলা হয়েছে');
                          loadAllData();
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDITING DONOR MODAL */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              দাতা তথ্য সম্পাদনা / নতুন সংযোজন
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">দাতার নাম *</label>
              <input
                type="text"
                required
                value={editingDonor.name}
                onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ / পরিচিতি</label>
              <input
                type="text"
                value={editingDonor.batch}
                onChange={(e) => setEditingDonor({ ...editingDonor, batch: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">অনুদান পরিমাণ (টাকা) *</label>
              <input
                type="number"
                required
                value={editingDonor.amount}
                onChange={(e) =>
                  setEditingDonor({ ...editingDonor, amount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
              <input
                type="text"
                value={editingDonor.category || ''}
                onChange={(e) => setEditingDonor({ ...editingDonor, category: e.target.value })}
                placeholder="উদা: বিশেষ দাতা / প্লাটিনাম ডোনার"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">অনুমোদন স্ট্যাটাস</label>
              <select
                value={editingDonor.status || 'approved'}
                onChange={(e) => setEditingDonor({ ...editingDonor, status: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              >
                <option value="approved">অনুমোদিত (Approved - লাইভ দেখাবে)</option>
                <option value="pending">অপেক্ষমাণ (Pending Verification)</option>
              </select>
            </div>

            <div>
              <ImageUploader
                label="দাতার ছবি (ঐচ্ছিক)"
                value={editingDonor.image || ''}
                onChange={(url) => setEditingDonor({ ...editingDonor, image: url })}
                aspectRatio="square"
                placeholder="দাতার ছবি ড্রপ বা নির্বাচন করুন"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingDonor(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingDonor.name || !editingDonor.amount) {
                    alert('দয়া করে নাম এবং টাকার পরিমাণ পূরণ করুন।');
                    return;
                  }
                  if (editingDonor.id) {
                    await apiService.updateDonor(editingDonor.id, editingDonor);
                  } else {
                    await apiService.addDonor(editingDonor);
                  }
                  flashMessage('সংরক্ষিত হয়েছে');
                  setEditingDonor(null);
                  loadAllData();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] rounded-xl cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
