import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Send,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
  UserCheck,
  HeartHandshake,
  AlertTriangle,
} from 'lucide-react';
import { EmailLog, EmailStats } from '../../../shared/types';
import { apiService } from '../../../shared/services/api';

interface EmailLogsTabProps {
  flashMessage: (msg: string, isError?: boolean) => void;
}

export const EmailLogsTab: React.FC<EmailLogsTabProps> = ({ flashMessage }) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    successRate: 100,
  });
  const [loading, setLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'donation_approval' | 'student_approval'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Log for Details Modal
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [logsData, statsData] = await Promise.all([
        apiService.getEmailLogs({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchQuery.trim() || undefined,
        }),
        apiService.getEmailStats(),
      ]);
      setLogs(logsData);
      setStats(statsData);
    } catch (err: any) {
      flashMessage('ইমেইল লগ লোড করতে সমস্যা হয়েছে: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [statusFilter, typeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResend = async (log: EmailLog) => {
    setResendingId(log.id);
    try {
      const res = await apiService.resendEmail(log.id);
      if (res.success) {
        flashMessage(`ইমেইলটি ${log.recipientEmail}-এ সফলভাবে পুনরায় পাঠানো হয়েছে!`);
        if (res.data) {
          setLogs((prev) => prev.map((l) => (l.id === log.id ? res.data! : l)));
          if (selectedLog && selectedLog.id === log.id) {
            setSelectedLog(res.data);
          }
        }
        apiService.getEmailStats().then(setStats).catch(() => {});
      } else {
        flashMessage(res.message || 'ইমেইল পুনরায় পাঠানো ব্যর্থ হয়েছে', true);
        loadLogs();
      }
    } catch (err: any) {
      flashMessage('ইমেইল পাঠানো সম্ভব হয়নি: ' + err.message, true);
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ইমেইল লগটি মুছে ফেলতে চান?')) return;
    try {
      const res = await apiService.deleteEmailLog(id);
      if (res.success) {
        flashMessage('ইমেইল লগ সফলভাবে মুছে ফেলা হয়েছে');
        setLogs((prev) => prev.filter((l) => l.id !== id));
        if (selectedLog?.id === id) setSelectedLog(null);
        apiService.getEmailStats().then(setStats).catch(() => {});
      } else {
        flashMessage(res.message || 'মুছতে ব্যর্থ হয়েছে', true);
      }
    } catch (err: any) {
      flashMessage(err.message, true);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'donation_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00732A] border border-emerald-200">
            <HeartHandshake className="w-3 h-3" />
            <span>অনুদান অনুমোদন</span>
          </span>
        );
      case 'student_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="w-3 h-3" />
            <span>নিবন্ধন অনুমোদন</span>
          </span>
        );
      case 'otp_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3" />
            <span>ওটিপি কোড</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Mail className="w-3 h-3" />
            <span>সাধারণ বিজ্ঞপ্তি</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#00732A]" />
            <span>ইমেইল ডেলিভারি লগ ও রিসেন্ড সেন্টার</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            অনুমোদনকৃত অনুদান ও নিবন্ধনের নিশ্চিতকরণ ইমেইলের রিয়েল-টাইম ডেলিভারি স্ট্যাটাস ও ব্যর্থ ইমেইল পুনরায় পাঠানোর ব্যবস্থা
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#00732A]' : ''}`} />
          <span>লগ রিফ্রেশ</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Emails */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট ইমেইল চেষ্টা</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
            <span className="text-[11px] text-slate-400">টি লগ</span>
          </div>
        </div>

        {/* Sent / Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">সফল ডেলিভারি</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-[#00732A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00732A]">{stats.sent}</span>
            <span className="text-[11px] text-emerald-600 font-bold">টি সফল</span>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white p-4 rounded-2xl border border-red-200/80 bg-red-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800">ব্যর্থ ইমেইল</span>
            <div className="p-2 rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">{stats.failed}</span>
            <span className="text-[11px] text-red-600 font-bold">পুনরায় পাঠানো প্রয়োজন</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">সাফল্যের হার</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">{stats.successRate}%</span>
            <span className="text-[11px] text-blue-600 font-bold">ডেলিভারি রেট</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="প্রাপকের ইমেইল, নাম অথবা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#00732A] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 shrink-0">স্ট্যাটাস:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#00732A] focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="all">সকল স্ট্যাটাস ({stats.total})</option>
              <option value="sent">সফল (Sent - {stats.sent})</option>
              <option value="failed">ব্যর্থ (Failed - {stats.failed})</option>
              <option value="pending">পেন্ডিং (Pending - {stats.pending})</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 shrink-0">ধরন:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-[#00732A] focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="all">সকল ধরন</option>
              <option value="donation_approval">অনুদান অনুমোদন (Donation)</option>
              <option value="student_approval">নিবন্ধন অনুমোদন (Student)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#00732A]" />
            <span className="text-xs font-bold">ইমেইল লগ লোড হচ্ছে...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Mail className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">কোনো ইমেইল লগ পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">
              অনুদান বা শিক্ষার্থী রেজিস্ট্রেশন অনুমোদন করার পর এখানে স্বয়ংক্রিয়ভাবে ডেলিভারি রেকর্ড জমা হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">তারিখ ও সময়</th>
                  <th className="py-3.5 px-4">প্রাপক (Recipient)</th>
                  <th className="py-3.5 px-4">ধরন ও বিষয়</th>
                  <th className="py-3.5 px-4">ডেলিভারি স্ট্যাটাস</th>
                  <th className="py-3.5 px-4">প্রচেষ্টা</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const isFailed = log.status === 'failed';
                  const isSent = log.status === 'sent';
                  const isResending = resendingId === log.id;

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isFailed ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {new Date(log.createdAt || log.lastAttemptAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.createdAt || log.lastAttemptAt).toLocaleTimeString('bn-BD', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{log.recipientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{log.recipientEmail}</div>
                      </td>

                      {/* Type & Subject */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div>{getTypeBadge(log.type)}</div>
                        <div className="text-xs text-slate-700 font-medium truncate mt-1" title={log.subject}>
                          {log.subject}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-[#00732A] border border-emerald-300/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>সফল (Sent)</span>
                          </span>
                        ) : isFailed ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>ব্যর্থ (Failed)</span>
                            </span>
                            {log.errorMessage && (
                              <p
                                className="text-[10px] text-red-600 font-semibold max-w-[200px] truncate mt-1"
                                title={log.errorMessage}
                              >
                                কারণ: {log.errorMessage}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>পেন্ডিং</span>
                          </span>
                        )}
                      </td>

                      {/* Attempts */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                          {log.attempts || 1} বার
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Resend Button */}
                          <button
                            type="button"
                            onClick={() => handleResend(log)}
                            disabled={isResending}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer ${
                              isFailed
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="পুনরায় ইমেইল পাঠান"
                          >
                            <Send className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                            <span>{isResending ? 'পাঠানো হচ্ছে...' : isFailed ? 'পুনরায় পাঠান' : 'রিসেন্ড'}</span>
                          </button>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                            title="ইমেইল বিবরণী ও কপি দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(log.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="লগ মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details & Email Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-[#00732A]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    ইমেইল ডেলিভারি ও কপি প্রিভিউ
                  </h3>
                  <p className="text-[11px] text-slate-500">লগ আইডি: {selectedLog.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Summary details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">প্রাপকের নাম</span>
                  <span className="font-bold text-slate-900">{selectedLog.recipientName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">প্রাপকের ইমেইল</span>
                  <span className="font-mono font-bold text-slate-900">{selectedLog.recipientEmail}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">ইমেইলের ধরন</span>
                  <span className="mt-0.5 inline-block">{getTypeBadge(selectedLog.type)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">বর্তমান স্ট্যাটাস</span>
                  <span
                    className={`font-bold inline-block mt-0.5 ${
                      selectedLog.status === 'sent'
                        ? 'text-emerald-700'
                        : selectedLog.status === 'failed'
                        ? 'text-red-600'
                        : 'text-amber-700'
                    }`}
                  >
                    {selectedLog.status === 'sent'
                      ? '✓ সফলভাবে প্রেরিত'
                      : selectedLog.status === 'failed'
                      ? '✕ প্রেরণে ব্যর্থ'
                      : 'অপেক্ষমাণ'}
                    {` (${selectedLog.attempts || 1} বার চেষ্টা)`}
                  </span>
                </div>
              </div>

              {/* Error Callout if Failed */}
              {selectedLog.status === 'failed' && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-red-900">ইমেইল ব্যর্থ হওয়ার কারণ:</span>
                    <span>{selectedLog.errorMessage || 'অজানা ত্রুটি (সার্ভার বা নেটওয়ার্ক সংযোগ সমস্যা)'}</span>
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="text-xs">
                <span className="text-slate-400 font-bold block mb-1">ইমেইল সাবজেক্ট (Subject)</span>
                <div className="p-2.5 rounded-xl bg-slate-100 font-medium text-slate-800">
                  {selectedLog.subject}
                </div>
              </div>

              {/* HTML Content Preview */}
              {selectedLog.htmlContent && (
                <div>
                  <span className="text-xs text-slate-400 font-bold block mb-1">ইমেইল বার্তা ও প্রিভিউ:</span>
                  <div
                    className="p-3 rounded-2xl border border-slate-200 bg-white max-h-72 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedLog.htmlContent }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 cursor-pointer"
              >
                বন্ধ করুন
              </button>

              <button
                type="button"
                onClick={() => handleResend(selectedLog)}
                disabled={resendingId === selectedLog.id}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${resendingId === selectedLog.id ? 'animate-spin' : ''}`} />
                <span>{resendingId === selectedLog.id ? 'পাঠানো হচ্ছে...' : 'এখনই পুনরায় পাঠান'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
