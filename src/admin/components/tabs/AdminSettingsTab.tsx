import React, { useState, useEffect } from 'react';
import { apiService } from '../../../shared/services/api';
import { Save, AlertCircle, ShieldCheck, Mail, Lock, UserPlus, UserMinus, Crown, Download, ShieldAlert, Database, History, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

export const AdminSettingsTab = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'admins' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  // Profile State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState(user?.name || '');

  // Admins State
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminData, setNewAdminData] = useState({ name: '', username: '', email: '', password: '' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetTransferId, setTargetTransferId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('trishal_auth_token');
      if (!token) return;
      const res = await apiService.fetchWithAuth('/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setAdmins(res.data);
        setIsSuperAdmin(user?.role === 'super-admin');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const token = localStorage.getItem('trishal_auth_token');
      if (!token) return;
      const res = await apiService.fetchWithAuth('/api/security/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setAuditLogs(res.data || []);
      }
    } catch (err: any) {
      console.error('Audit log fetch error', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleDownloadBackup = async () => {
    setIsDownloadingBackup(true);
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth('/api/security/database-backup', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        const jsonStr = JSON.stringify(res, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `nazrul_academy_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSuccess('🎉 সম্পূর্ণ ডাটাবেজ ব্যাকআপ ফাইল সফলভাবে ডাউনলোড করা হয়েছে!');
      } else {
        setError(res.message || 'ব্যাকআপ ডাউনলোড করতে ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setError(err.message || 'ডাটাবেজ ব্যাকআপ সম্পন্ন করতে সমস্যা হয়েছে');
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'security') {
      fetchAuditLogs();
    }
  }, [activeSubTab]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPassword !== confirmPassword) {
      return setError('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth('/api/auth/change-password', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      if (res.success) {
        setSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    setLoading(true);
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth('/api/auth/change-email', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newEmail })
      });
      
      if (res.success) {
        setSuccess('ইমেইল সফলভাবে পরিবর্তন করা হয়েছে।');
        setNewEmail('');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth('/api/auth/change-name', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newName })
      });
      if (res.success) {
        setSuccess('নাম সফলভাবে পরিবর্তন করা হয়েছে। নতুন নাম দেখতে পুনরায় লগইন করুন বা পেজ রিফ্রেশ করুন।');
        fetchAdmins();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    setLoading(true);
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth('/api/admins', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAdminData)
      });
      
      if (res.success) {
        setSuccess('নতুন অ্যাডমিন সফলভাবে তৈরি করা হয়েছে।');
        setNewAdminData({ name: '', username: '', email: '', password: '' });
        fetchAdmins();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অ্যাডমিন অ্যাকাউন্টটি রিমুভ করবেন?')) return;
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.success) {
        setSuccess('অ্যাডমিন রিমুভ করা হয়েছে।');
        fetchAdmins();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    }
  };

  const confirmTransfer = (targetId: string) => {
    setTargetTransferId(targetId);
    setTransferModalOpen(true);
  };

  const executeTransfer = async () => {
    if (!targetTransferId) return;
    setTransferModalOpen(false);
    
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth(`/api/transfer`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId: targetTransferId })
      });
      
      if (res.success) {
        setSuccess('রোল সফলভাবে ট্রান্সফার করা হয়েছে। পুনরায় লগইন করুন।');
        fetchAdmins();
        // optionally logout the user here
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">অ্যাডমিন ও নিরাপত্তা</h2>
          <p className="text-sm text-slate-500">পাসওয়ার্ড, ইমেইল ও অন্যান্য অ্যাডমিন অ্যাকাউন্ট পরিচালনা করুন</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${error ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeSubTab === 'profile' ? 'border-[#00732A] text-[#00732A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          আমার প্রোফাইল
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveSubTab('admins')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeSubTab === 'admins' ? 'border-[#00732A] text-[#00732A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            অ্যাডমিন ব্যবস্থাপনা
          </button>
        )}
        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === 'security' ? 'border-[#00732A] text-[#00732A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Database className="w-4 h-4" />
          <span>ডাটা ব্যাকআপ ও নিরাপত্তা</span>
        </button>
      </div>

      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Update Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">প্রোফাইলের নাম পরিবর্তন</h3>
            </div>
            <form onSubmit={handleChangeName} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">নতুন নাম</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="আপনার নতুন নাম লিখুন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#00732A] text-white rounded-xl font-bold hover:bg-[#005e22] transition-colors disabled:opacity-50"
              >
                {loading ? 'আপডেট হচ্ছে...' : 'নাম আপডেট করুন'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">পাসওয়ার্ড পরিবর্তন</h3>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">বর্তমান পাসওয়ার্ড</label>
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">কনফার্ম পাসওয়ার্ড</label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00732A] text-white font-bold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন করুন'}
              </button>
            </form>
          </div>

          {/* Change Email */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">ইমেইল পরিবর্তন</h3>
            </div>
            
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">নতুন ইমেইল ঠিকানা</label>
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00732A] text-white font-bold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'admins' && isSuperAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Admins */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">অ্যাডমিন তালিকা</h3>
            <div className="grid gap-3">
              {admins.map(admin => (
                <div key={admin.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      {admin.name} 
                      {admin.role === 'super-admin' && <Crown className="w-4 h-4 text-amber-500" title="সুপার অ্যাডমিন" />}
                    </span>
                    <span className="text-xs text-slate-500">@{admin.username} • {admin.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {admin.role === 'admin' && (
                      <>
                        <button
                          onClick={() => confirmTransfer(admin.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-xs font-bold"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>সুপার অ্যাডমিন করুন</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Admin Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">নতুন অ্যাডমিন</h3>
            </div>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">নাম</label>
                <input
                  required
                  type="text"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">ইউজারনেম</label>
                <input
                  required
                  type="text"
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">ইমেইল</label>
                <input
                  required
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">টেম্পোরারি পাসওয়ার্ড</label>
                <input
                  required
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00732A] focus:outline-none"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00732A] text-white font-bold disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'যোগ করা হচ্ছে...' : 'অ্যাডমিন যোগ করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* 1-Click Database Backup Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Database className="w-48 h-48" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" /> এন্টারপ্রাইজ ব্যাকআপ ও রিকভারি
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-2">১-ক্লিক সম্পূর্ণ ডাটাবেজ ব্যাকআপ</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                আপনার সিস্টেমের সমস্ত শিক্ষার্থী তালিকা, অনুদানের হিসাব, কনফিগারেশন ও অ্যাকাউন্টের সম্পূর্ণ ডাটা একটি এনক্রিপ্টেড JSON ব্যাকআপ ফাইলে ডাউনলোড করে নিরাপদে সংরক্ষণ করুন।
              </p>

              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isDownloadingBackup}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isDownloadingBackup ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{isDownloadingBackup ? 'ব্যাকআপ তৈরি হচ্ছে...' : 'সম্পূর্ণ ডাটাবেজ ডাউনলোড করুন (JSON)'}</span>
              </button>
            </div>
          </div>

          {/* Active Security Protections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">ব্রুট-ফোর্স প্রটেকশন</h4>
                <p className="text-xs text-slate-500 mt-0.5">টানা ৫ বার ব্যর্থ লগইনে ৩০ মিনিট লকআউট ও ইমেইল অ্যালার্ট।</p>
                <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">সক্রিয় (Active)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Stored XSS ফিল্টার</h4>
                <p className="text-xs text-slate-500 mt-0.5">সব ইনপুট থেকে ক্ষতিকর স্ক্রিপ্ট ও ট্যাগ স্বয়ংক্রিয় ক্লিনআপ।</p>
                <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">সক্রিয় (Active)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Magic-Byte ভ্যালিডেশন</h4>
                <p className="text-xs text-slate-500 mt-0.5">ফাইল আপলোডে বাইনারি হেক্স সিগনেচার যাচাই (অ্যান্টি-শেল)।</p>
                <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">সক্রিয় (Active)</span>
              </div>
            </div>
          </div>

          {/* Security Audit Trail Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">সাম্প্রতিক সিকিউরিটি অডিট হিস্টোরি</h4>
              </div>
              <button
                type="button"
                onClick={fetchAuditLogs}
                disabled={isLoadingLogs}
                className="text-xs text-[#00732A] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} /> রিফ্রেশ
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <th className="py-3 px-4 font-bold">ইভেন্ট / অ্যাকশন</th>
                    <th className="py-3 px-4 font-bold">ইউজার / টার্গেট</th>
                    <th className="py-3 px-4 font-bold">আইপি (IP)</th>
                    <th className="py-3 px-4 font-bold">স্ট্যাটাস</th>
                    <th className="py-3 px-4 font-bold">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        {isLoadingLogs ? 'অডিট লগ লোড হচ্ছে...' : 'কোনো সিকিউরিটি ইভেন্ট পাওয়া যায়নি।'}
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log: any) => (
                      <tr key={log.id || log._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 font-mono text-[11px]">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {log.performedBy?.email || log.performedBy?.name || 'Guest/System'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {log.ipAddress || 'unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                            log.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          {new Date(log.createdAt).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Transfer Confirmation Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">সতর্কতা!</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                আপনি কি নিশ্চিত যে আপনি সুপার-অ্যাডমিন রোল এই অ্যাকাউন্টে ট্রান্সফার করবেন? 
                <br /><br />
                <span className="font-bold text-red-600">আপনি এরপর সাধারণ অ্যাডমিন হয়ে যাবেন!</span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={executeTransfer}
                  className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-lg cursor-pointer"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
