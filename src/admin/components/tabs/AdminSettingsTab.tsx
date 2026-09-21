import React, { useState, useEffect } from 'react';
import { apiService } from '../../../shared/services/api';
import { Save, AlertCircle, ShieldCheck, Mail, Lock, UserPlus, UserMinus, Crown } from 'lucide-react';
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
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'admins'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Admins State
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminData, setNewAdminData] = useState({ name: '', username: '', email: '', password: '' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

  const handleTransferSuperAdmin = async (targetId: string) => {
    if (!window.confirm('সতর্কতা: আপনি কি নিশ্চিত যে আপনি সুপার-অ্যাডমিন রোল এই অ্যাকাউন্টে ট্রান্সফার করবেন? আপনি সাধারণ অ্যাডমিন হয়ে যাবেন!')) return;
    try {
      const token = localStorage.getItem('trishal_auth_token');
      const res = await apiService.fetchWithAuth(`/api/transfer`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId })
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
      </div>

      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          title="মেক সুপার অ্যাডমিন"
                          onClick={() => handleTransferSuperAdmin(admin.id)}
                          className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button
                          title="ডিলিট"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <UserMinus className="w-4 h-4" />
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
    </div>
  );
};
