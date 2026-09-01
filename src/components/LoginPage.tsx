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
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

interface LoginPageProps {
  onSuccessNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessNavigate }) => {
  const { login, register } = useAuth();

  // Active Tab: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // --- Login State ---
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // --- Signup State ---
  const [signupStep, setSignupStep] = useState<'form' | 'verify'>('form');
  const [signupData, setSignupData] = useState({
    name: '',
    nameEn: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: '',
    phone: '',
    bloodGroup: 'O+',
    location: 'ত্রিশাল, ময়মনসিংহ',
  });
  const [otpCode, setOtpCode] = useState('');
  const [demoReceivedCode, setDemoReceivedCode] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await login({ email: loginIdentifier, password: loginPassword });
      if (res.success) {
        if (
          loginIdentifier.toLowerCase().includes('admin') ||
          loginIdentifier.toLowerCase().includes('jasmin')
        ) {
          onSuccessNavigate('admin');
        } else {
          onSuccessNavigate('alumni');
        }
      } else {
        setLoginError(res.message || 'লগইন ব্যর্থ হয়েছে। সঠিক ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।');
      }
    } catch (err: any) {
      setLoginError(err.message || 'সার্ভারে সংযোগ করা যাচ্ছে না।');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Signup Form Submit -> Request Verification OTP
  const handleSignupRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);

    if (!signupData.name || !signupData.email || !signupData.password) {
      setSignupError('সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।');
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
        setSignupError(res.message || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'সার্ভারে সংযোগ করা যাচ্ছে না।');
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setSignupError(null);
    setSignupLoading(true);
    try {
      const res = await apiService.sendVerificationCode(signupData.email);
      if (res.success) {
        setDemoReceivedCode(res.code || null);
        setResendTimer(60);
        setSignupSuccess('নতুন ভেরিফিকেশন কোড পাঠানো হয়েছে।');
      } else {
        setSignupError(res.message || 'পুনরায় কোড পাঠানো সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'কোড পাঠাতে ত্রুটি হয়েছে।');
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle Final OTP Verification & Complete Registration
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setSignupError('অনুগ্রহ করে ৬-সংখ্যার ভেরিফিকেশন কোডটি দিন।');
      return;
    }

    setSignupLoading(true);
    try {
      // 1. Verify OTP with server
      const verifyRes = await apiService.verifyOtp(signupData.email, otpCode);
      if (!verifyRes.success) {
        setSignupError(verifyRes.message || 'ভেরিফিকেশন কোড ভুল হয়েছে।');
        setSignupLoading(false);
        return;
      }

      // 2. Complete Account Creation
      const registerRes = await register({
        name: signupData.name,
        nameEn: signupData.nameEn,
        email: signupData.email,
        password: signupData.password,
        batch: signupData.batch ? `ব্যাচ ${signupData.batch}` : 'ব্যাচ ২০১০',
        phone: signupData.phone,
        bloodGroup: signupData.bloodGroup,
        location: signupData.location,
        school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
      });

      if (registerRes.success) {
        onSuccessNavigate('alumni');
      } else {
        setSignupError(registerRes.message || 'অ্যাকাউন্ট তৈরিতে ত্রুটি ঘটেছে।');
      }
    } catch (err: any) {
      setSignupError(err.message || 'প্রক্রিয়াটি সম্পন্ন করতে ত্রুটি হয়েছে।');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Top Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#00732A]/10 text-[#00732A] flex items-center justify-center mx-auto mb-3">
            {activeTab === 'login' ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {activeTab === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি (সাইন-আপ)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ত্রিশাল সরকারি নজরুল একাডেমি পুনর্মিলনী পোর্টাল
          </p>
        </div>

        {/* Tab Switcher (Login / Signup) */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#00732A] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignupError(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-[#00732A] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>সাইন-আপ (Sign Up)</span>
          </button>
        </div>

        {/* ================= TAB 1: LOGIN ================= */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ইউজারনেম বা ইমেইল (Username / Email)
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    placeholder="ইউজারনেম অথবা ইমেইল ঠিকানা দিন"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loginLoading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setSignupError(null);
                  }}
                  className="font-bold text-[#00732A] hover:underline cursor-pointer"
                >
                  নতুন অ্যাকাউন্ট খুলুন (সাইন-আপ)
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SIGN UP ================= */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            {signupError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {signupSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{signupSuccess}</span>
              </div>
            )}

            {/* Step 1: Sign up details */}
            {signupStep === 'form' && (
              <form onSubmit={handleSignupRequestOtp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    পূর্ণ নাম (Full Name) *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="text"
                      placeholder="আপনার নাম বাংলায় লিখুন"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ইমেইল ঠিকানা (Email Address) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="email"
                      placeholder="yourname@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    এই ইমেইলে একটি ৬-সংখ্যার ভেরিফিকেশন কোড পাঠানো হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পাসওয়ার্ড (Password) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="password"
                        placeholder="কমপক্ষে ৬ অক্ষর"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পাসওয়ার্ড নিশ্চিতকরণ *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="password"
                        placeholder="পুনরায় পাসওয়ার্ড দিন"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({ ...signupData, confirmPassword: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পাসের সন / ব্যাচ (Batch)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="যেমন: ২০১০"
                        value={signupData.batch}
                        onChange={(e) => setSignupData({ ...signupData, batch: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      রক্তের গ্রুপ (Blood Group)
                    </label>
                    <div className="relative">
                      <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={signupData.bloodGroup}
                        onChange={(e) =>
                          setSignupData({ ...signupData, bloodGroup: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মোবাইল নম্বর (Phone)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="০১৭১১-XXXXXX"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {signupLoading ? 'কোড পাঠানো হচ্ছে...' : 'ইমেইল ভেরিফিকেশন কোড পাঠান'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Email Verification (OTP) */}
            {signupStep === 'verify' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">ইমেইল ভেরিফিকেশন কোড</h4>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800 font-mono">{signupData.email}</strong> ঠিকানায় একটি ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে।
                  </p>
                </div>

                {/* Instant preview code box for test user convenience */}
                {demoReceivedCode && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-sans">
                    <span className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ভেরিফিকেশন কোড:
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(demoReceivedCode)}
                      className="px-2.5 py-1 rounded bg-emerald-700 text-white font-mono font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      {demoReceivedCode} (অটো-ফিল)
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 text-center">
                      ৬-সংখ্যার কোডটি লিখুন (Verification Code)
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl border-2 border-emerald-500/80 focus:ring-2 focus:ring-[#00732A] focus:outline-none bg-white font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading || otpCode.length !== 6}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#00732A] hover:bg-[#005c21] shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {signupLoading ? 'যাচাই করা হচ্ছে...' : 'কোড যাচাই ও সাইন-আপ সম্পন্ন করুন'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSignupStep('form');
                        setOtpCode('');
                      }}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>ইমেইল পরিবর্তন করুন</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || signupLoading}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1 font-bold cursor-pointer ${
                        resendTimer > 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-[#00732A] hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${signupLoading ? 'animate-spin' : ''}`} />
                      <span>
                        {resendTimer > 0
                          ? `পুনরায় কোড (${resendTimer}s)`
                          : 'পুনরায় কোড পাঠান'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="text-center pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setSignupError(null);
                  }}
                  className="font-bold text-[#00732A] hover:underline cursor-pointer"
                >
                  লগইন করুন
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
