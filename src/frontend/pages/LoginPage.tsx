import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Key,
  UserCheck,
  Mail,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Phone,
  Calendar,
  Droplet,
  RefreshCw,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { apiService } from '../../shared/services/api';

interface LoginPageProps {
  onSuccessNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessNavigate }) => {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupStep, setSignupStep] = useState<'form' | 'verify'>('form');
  const [signupData, setSignupData] = useState({
    name: '', nameEn: '', email: '', password: '', confirmPassword: '',
    batch: '', phone: '', bloodGroup: 'O+', location: 'ত্রিশাল, ময়মনসিংহ',
  });
  const [otpCode, setOtpCode] = useState('');
  const [demoReceivedCode, setDemoReceivedCode] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => { setResendTimer((prev) => prev - 1); }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await login({ email: loginIdentifier, password: loginPassword });
      if (res.success) {
        onSuccessNavigate('alumni');
      } else {
        setLoginError(res.message || 'লগইন ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setLoginError(err.message || 'সার্ভারে সংযোগ করা যাচ্ছে না।');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    if (!signupData.name || !signupData.email || !signupData.password) {
      setSignupError('সকল প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }
    if (signupData.password.length < 6) {
      setSignupError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('পাসওয়ার্ড মিলছে না।');
      return;
    }
    setSignupLoading(true);
    try {
      const res = await apiService.sendVerificationCode(signupData.email);
      if (res.success) {
        setDemoReceivedCode(res.code || null);
        setSignupStep('verify');
        setResendTimer(60);
        setSignupSuccess(res.message);
      } else {
        setSignupError(res.message || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'সার্ভারে সংযোগ করা যাচ্ছে না।');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setSignupError(null);
    setSignupLoading(true);
    try {
      const res = await apiService.sendVerificationCode(signupData.email);
      if (res.success) {
        setDemoReceivedCode(res.code || null);
        setResendTimer(60);
        setSignupSuccess('নতুন ভেরিফিকেশন কোড পাঠানো হয়েছে।');
      } else {
        setSignupError(res.message || 'পুনরায় কোড পাঠানো সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'কোড পাঠাতে ত্রুটি হয়েছে।');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!otpCode || otpCode.trim().length !== 6) {
      setSignupError('অনুগ্রহ করে ৬-সংখ্যার ভেরিফিকেশন কোডটি দিন।');
      return;
    }
    setSignupLoading(true);
    try {
      const verifyRes = await apiService.verifyOtp(signupData.email, otpCode);
      if (!verifyRes.success) {
        setSignupError(verifyRes.message || 'ভেরিফিকেশন কোড ভুল হয়েছে।');
        setSignupLoading(false);
        return;
      }
      const registerRes = await register({
        name: signupData.name, nameEn: signupData.nameEn, email: signupData.email,
        password: signupData.password,
        batch: signupData.batch ? `ব্যাচ ${signupData.batch}` : 'ব্যাচ ২০১০',
        phone: signupData.phone, bloodGroup: signupData.bloodGroup,
        location: signupData.location, school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
      });
      if (registerRes.success) {
        onSuccessNavigate('alumni');
      } else {
        setSignupError(registerRes.message || 'অ্যাকাউন্ট তৈরিতে ত্রুটি ঘটেছে।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'প্রক্রিয়াটি সম্পন্ন করতে ত্রুটি হয়েছে।');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div
      className="py-12 min-h-[80vh] flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-md z-0"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-700/15 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-400/30 via-transparent to-emerald-600/20 rounded-[2rem] blur-sm pointer-events-none"></div>
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.5)] space-y-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-[2rem]"></div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00732A] to-emerald-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/40">
              {activeTab === 'login' ? <LogIn className="w-10 h-10" /> : <UserPlus className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি'}
            </h2>
            <p className="text-sm text-slate-300 mt-2">ত্রিশাল সরকারি নজরুল একাডেমি পুনর্মিলনী পোর্টাল</p>
          </div>

          <div className="grid grid-cols-2 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <button type="button" onClick={() => { setActiveTab('login'); setLoginError(null); }}
              className={`py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'login' ? 'bg-[#00732A] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <LogIn className="w-5 h-5" /><span>লগইন (Login)</span>
            </button>
            <button type="button" onClick={() => { setActiveTab('signup'); setSignupError(null); }}
              className={`py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'signup' ? 'bg-[#00732A] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <UserPlus className="w-5 h-5" /><span>সাইন-আপ (Sign Up)</span>
            </button>
          </div>

          {activeTab === 'login' && (
            <div className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0" /><span>{loginError}</span>
                </div>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-200 block mb-2">ইউজারনেম বা ইমেইল</label>
                  <div className="relative">
                    <UserCheck className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input required type="text" placeholder="ইউজারনেম অথবা ইমেইল ঠিকানা দিন"
                      value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 text-base rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-200 block mb-2">পাসওয়ার্ড (Password)</label>
                  <div className="relative">
                    <Key className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input required type="password" placeholder="পাসওয়ার্ড লিখুন"
                      value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 text-base rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={loginLoading}
                  className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#00732A] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-xl shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                  {loginLoading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}<ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400">অ্যাকাউন্ট নেই?{' '}
                  <button type="button" onClick={() => { setActiveTab('signup'); setSignupError(null); }} className="font-bold text-emerald-400 hover:underline cursor-pointer">
                    নতুন অ্যাকাউন্ট খুলুন
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-4">
              {signupError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0" /><span>{signupError}</span>
                </div>
              )}
              {signupSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /><span>{signupSuccess}</span>
                </div>
              )}

              {signupStep === 'form' && (
                <form onSubmit={handleSignupRequestOtp} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">পূর্ণ নাম *</label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input required type="text" placeholder="আপনার নাম বাংলায় লিখুন" value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">ইমেইল ঠিকানা *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input required type="email" placeholder="yourname@example.com" value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">এই ইমেইলে একটি ৬-সংখ্যার ভেরিফিকেশন কোড পাঠানো হবে।</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">পাসওয়ার্ড *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input required type="password" placeholder="কমপক্ষে ৬ অক্ষর" value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">পাসওয়ার্ড নিশ্চিত *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input required type="password" placeholder="পুনরায় পাসওয়ার্ড দিন" value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">পাসের সন / ব্যাচ</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="যেমন: ২০১০" value={signupData.batch}
                          onChange={(e) => setSignupData({ ...signupData, batch: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">রক্তের গ্রুপ</label>
                      <div className="relative">
                        <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select value={signupData.bloodGroup} onChange={(e) => setSignupData({ ...signupData, bloodGroup: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-800 border border-white/10 text-white focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all">
                          {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">মোবাইল নম্বর</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="tel" placeholder="০১৭১১-XXXXXX" value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={signupLoading}
                    className="w-full mt-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-xl shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                    {signupLoading ? 'কোড পাঠানো হচ্ছে...' : 'ইমেইল ভেরিফিকেশন কোড পাঠান'}<ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {signupStep === 'verify' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">ইমেইল ভেরিফিকেশন কোড</h4>
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-200 font-mono">{signupData.email}</strong> ঠিকানায় একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে।
                    </p>
                  </div>
                  {demoReceivedCode && (
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                      <span className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />ভেরিফিকেশন কোড:
                      </span>
                      <button type="button" onClick={() => setOtpCode(demoReceivedCode)}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono font-bold hover:bg-emerald-500 transition-colors cursor-pointer">
                        {demoReceivedCode} (অটো-ফিল)
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 text-center">৬-সংখ্যার কোডটি লিখুন</label>
                      <input required type="text" maxLength={6} placeholder="123456" value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-white/5 border-2 border-emerald-500/40 focus:ring-2 focus:ring-emerald-400/60 focus:outline-none text-white font-bold transition-all" />
                    </div>
                    <button type="submit" disabled={signupLoading || otpCode.length !== 6}
                      className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00732A] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-xl shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                      {signupLoading ? 'যাচাই করা হচ্ছে...' : 'কোড যাচাই ও সাইন-আপ সম্পন্ন করুন'}<CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button type="button" onClick={() => { setSignupStep('form'); setOtpCode(''); }}
                        className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /><span>ইমেইল পরিবর্তন করুন</span>
                      </button>
                      <button type="button" disabled={resendTimer > 0 || signupLoading} onClick={handleResendOtp}
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${resendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-emerald-400 hover:underline'}`}>
                        <RefreshCw className={`w-3.5 h-3.5 ${signupLoading ? 'animate-spin' : ''}`} />
                        <span>{resendTimer > 0 ? `পুনরায় কোড (${resendTimer}s)` : 'পুনরায় কোড পাঠান'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400">ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                  <button type="button" onClick={() => { setActiveTab('login'); setSignupError(null); }} className="font-bold text-emerald-400 hover:underline cursor-pointer">
                    লগইন করুন
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};