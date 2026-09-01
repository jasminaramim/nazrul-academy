import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sliders,
  UserCheck,
  BarChart3,
  Users,
  DollarSign,
  Bell,
  Calendar,
  Music,
  HeartHandshake,
  Image,
  BookOpen,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  LogOut,
  RefreshCw,
  LogIn,
  Key,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ArrowLeft,
  Award,
  Gift,
  Tag,
  FileText,
  Layers,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  X,
  ChevronRight,
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GlobalConfig,
  HeroSlide,
  TeacherMessage,
  StatsData,
  CustomStatItem,
  Student,
  FinanceSummary,
  FinanceTransaction,
  Notice,
  ScheduleItem,
  CulturalItem,
  Donor,
  GalleryItem,
  MagazineArticle,
  AdminInfo,
} from '../types';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../utils/formatters';
import { BdtIcon } from './BdtIcon';
import { ImageUploader } from './ImageUploader';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome, onRefreshData }) => {
  const { logout, user, login, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin login form states when not logged in
  const [adminUsername, setAdminUsername] = useState('jasmin');
  const [adminPassword, setAdminPassword] = useState('jasmin1142005');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // States for all dynamic sections
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [teacherMessages, setTeacherMessages] = useState<TeacherMessage[]>([]);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [culturalSchedule, setCulturalSchedule] = useState<CulturalItem[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [magazineArticles, setMagazineArticles] = useState<MagazineArticle[]>([]);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [mongoStatus, setMongoStatus] = useState<{
    connected: boolean;
    storageType: string;
    database?: string;
    cluster?: string;
    mongoUri?: string;
    lastSync?: string | null;
    error?: string | null;
    collections?: Array<{ name: string; label: string; count: number }>;
  }>({
    connected: false,
    storageType: '',
    collections: [],
  });

  // MongoDB Collection Explorer States
  const [selectedMongoCollection, setSelectedMongoCollection] = useState<string>('students');
  const [collectionDocs, setCollectionDocs] = useState<any[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [syncingMongo, setSyncingMongo] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [mongoUriInput, setMongoUriInput] = useState('');

  // Modal / Editing states
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherMessage | null>(null);
  const [editingCustomStat, setEditingCustomStat] = useState<CustomStatItem | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<FinanceTransaction | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [editingCultural, setEditingCultural] = useState<CulturalItem | null>(null);
  const [editingArticle, setEditingArticle] = useState<MagazineArticle | null>(null);

  // Students filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBatchFilter, setStudentBatchFilter] = useState('all');

  const flashMessage = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        gConf,
        hSlides,
        tMsgs,
        sData,
        stdList,
        fin,
        notc,
        sch,
        cult,
        dnrs,
        gal,
        mag,
        adm,
        mStat,
      ] = await Promise.all([
        apiService.getGlobalConfig(),
        apiService.getHeroSlides(),
        apiService.getTeacherMessages(),
        apiService.getStats(),
        apiService.getStudents(),
        apiService.getFinance(),
        apiService.getNotices(),
        apiService.getSchedule(),
        apiService.getCulturalSchedule(),
        apiService.getDonations(),
        apiService.getGallery(),
        apiService.getMagazineArticles(),
        apiService.getAdminInfo(),
        apiService.getMongoStatus(),
      ]);

      setGlobalConfig(gConf);
      setHeroSlides(hSlides);
      setTeacherMessages(tMsgs);
      setStatsData(sData);
      setStudents(stdList);
      setFinance(fin);
      setNotices(notc);
      setSchedule(sch);
      setCulturalSchedule(cult);
      setDonors(dnrs);
      setGallery(gal);
      setMagazineArticles(mag);
      setAdminInfo(adm);
      setMongoStatus(mStat);
    } catch (err: any) {
      flashMessage('ডাটা লোড করতে সমস্যা হয়েছে: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAdminGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setAdminLoginLoading(true);

    try {
      const res = await login({ email: adminUsername, password: adminPassword });
      if (res.success) {
        await loadAllData();
        if (onRefreshData) onRefreshData();
      } else {
        setAdminLoginError(res.message || 'ভুল ইউজারনেম বা পাসওয়ার্ড');
      }
    } catch (err: any) {
      setAdminLoginError(err.message || 'লগইনে ত্রুটি ঘটেছে');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const copyAdminDetails = () => {
    navigator.clipboard.writeText('Username: jasmin\nPassword: jasmin1142005\nAdmin URL: /admin');
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const loadMongoCollectionDocs = async (collectionName: string) => {
    setSelectedMongoCollection(collectionName);
    setCollectionLoading(true);
    try {
      const res = await apiService.getMongoCollectionDocs(collectionName);
      setCollectionDocs(res.documents || []);
    } catch (err: any) {
      flashMessage('কালেকশন লোড করতে ব্যর্থ: ' + err.message, true);
      setCollectionDocs([]);
    } finally {
      setCollectionLoading(false);
    }
  };

  const handleSyncMongo = async () => {
    setSyncingMongo(true);
    try {
      const res = await apiService.syncMongo();
      if (res.success) {
        flashMessage(res.message);
        await loadAllData();
        if (selectedMongoCollection) {
          await loadMongoCollectionDocs(selectedMongoCollection);
        }
      } else {
        flashMessage(res.message, true);
      }
    } catch (err: any) {
      flashMessage('MongoDB সিঙ্ক করতে ত্রুটি: ' + err.message, true);
    } finally {
      setSyncingMongo(false);
    }
  };

  const handleSeedDemoData = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সকল কালেকশনে নতুন সমৃদ্ধ ডেমো ডেটা সিড ও সিঙ্ক করতে চান?')) {
      return;
    }
    setSeedingDemo(true);
    try {
      const res = await apiService.seedDemoData();
      if (res.success) {
        flashMessage(res.message);
        await loadAllData();
        if (onRefreshData) onRefreshData();
        if (selectedMongoCollection) {
          await loadMongoCollectionDocs(selectedMongoCollection);
        }
      } else {
        flashMessage(res.message, true);
      }
    } catch (err: any) {
      flashMessage('ডেমো ডেটা সিড করতে ত্রুটি: ' + err.message, true);
    } finally {
      setSeedingDemo(false);
    }
  };

  const handleSaveMongoUri = async (uri: string) => {
    try {
      const res = await apiService.updateMongoConfig(uri);
      flashMessage(res.message, !res.success);
      await loadAllData();
    } catch (err: any) {
      flashMessage('URI সংরক্ষণে ত্রুটি: ' + err.message, true);
    }
  };

  // If user is not authenticated as admin, show the Admin Gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 selection:bg-[#00732A] selection:text-white">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00732A] to-emerald-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">অ্যাডমিন প্রবেশাধিকার</h1>
            <p className="text-xs text-slate-400">
              ত্রিশাল সরকারি নজরুল একাডেমি — /admin প্যানেল
            </p>
          </div>

          {/* Credential Card */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                অ্যাডমিন লগইন তথ্য
              </span>
              <button
                type="button"
                onClick={copyAdminDetails}
                className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCreds ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCreds ? 'কপি হয়েছে' : 'কপি করুন'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Username</span>
                <span className="font-bold text-white">jasmin</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Password</span>
                <span className="font-bold text-white">jasmin1142005</span>
              </div>
            </div>
          </div>

          {adminLoginError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminGateLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                ইউজারনেম (Username)
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  placeholder="ইউজারনেম দিন"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  placeholder="পাসওয়ার্ড দিন"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#00732A] hover:bg-emerald-600 shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {adminLoginLoading ? 'প্রবেশ করা হচ্ছে...' : 'অ্যাডমিন প্যানেলে প্রবেশ করুন'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'mongodb', label: 'MongoDB ডাটাবেজ (Cloud)', icon: Database, badge: mongoStatus.connected ? 'সংযুক্ত' : 'অফলাইন' },
    { id: 'hero', label: 'হিরো স্লাইডার (Hero)', icon: Sliders, badge: heroSlides.length ? `${heroSlides.length}` : undefined },
    { id: 'teachers', label: 'প্রাক্তনদের প্রতি আহবান', icon: UserCheck, badge: teacherMessages.length ? `${teacherMessages.length}` : undefined },
    { id: 'stats', label: 'পরিসংখ্যান ও তারিখ', icon: BarChart3, badge: statsData?.customStats?.length ? `${statsData.customStats.length}` : undefined },
    { id: 'students', label: 'প্রাক্তন ছাত্র/ছাত্রী', icon: Users, badge: students.length ? `${students.length}` : undefined },
    { id: 'finance', label: 'আর্থিক হিসাব (Finance)', icon: BdtIcon, badge: finance?.transactions?.length ? `${finance.transactions.length}` : undefined },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, badge: notices.length ? `${notices.length}` : undefined },
    { id: 'schedule', label: 'কার্যক্রমের সময়সূচি', icon: Calendar, badge: schedule.length ? `${schedule.length}` : undefined },
    { id: 'cultural', label: 'সাংস্কৃতিক পর্ব', icon: Music, badge: culturalSchedule.length ? `${culturalSchedule.length}` : undefined },
    { id: 'donors', label: 'দাতা ও অনুদান', icon: HeartHandshake, badge: donors.length ? `${donors.length}` : undefined },
    { id: 'gallery', label: 'গ্যালারি ব্যবস্থাপনা', icon: Image, badge: gallery.length ? `${gallery.length}` : undefined },
    { id: 'magazine', label: 'স্মৃতির পাতা ও ম্যাগাজিন', icon: BookOpen, badge: magazineArticles.length ? `${magazineArticles.length}` : undefined },
    { id: 'settings', label: 'সাইট ও ডাটাবেজ সেটিংস', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Left Sidebar Control Bar */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        {/* Admin Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00732A] flex items-center justify-center font-bold text-white shadow-xs border border-[#CA0000]">
            না
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">অ্যাডমিন প্যানেল</h2>
            <p className="text-[11px] text-emerald-400">ত্রিশাল সরকারি নজরুল একাডেমি</p>
          </div>
        </div>

        {/* Admin User info card */}
        <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-medium truncate max-w-[140px]">
              {user?.name || adminInfo?.name || 'অ্যাডমিন'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-[#CA0000] px-1.5 py-0.5 rounded text-white uppercase">
            Admin
          </span>
        </div>

        {/* Navigation Sidebar List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00732A] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {toBengaliNumber(item.badge)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>লাইভ সাইট দেখুন</span>
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer"
            title="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-2xs">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {menuItems.find((m) => m.id === activeTab)?.label || 'ড্যাশবোর্ড'}
            </h1>
            <p className="text-xs text-slate-500">
              ওয়েবসাইটের সকল কন্টেন্ট ও তথ্য পরিবর্তন ও পরিচালনা করুন
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Database status pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#00732A]">
              <Database className="w-3.5 h-3.5" />
              <span>{mongoStatus.storageType || 'লোকাল স্টোরেজ (সক্রিয়)'}</span>
            </div>

            <button
              onClick={() => {
                loadAllData();
                flashMessage('ডাটা রিফ্রেশ করা হয়েছে');
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Global Toast Messages */}
        {successMsg && (
          <div className="m-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="m-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 space-y-6 flex-1">
          {/* ===================== TAB 1: OVERVIEW ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">নিবন্ধিত শিক্ষার্থী</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-[#00732A]">
                      {toBengaliNumber(statsData?.registeredStudents || students.length)}
                    </span>
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">পরিবারের সদস্য সংখ্যা</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-extrabold text-amber-600">
                      {toBengaliNumber(statsData?.familyMembersCount || 80)}
                    </span>
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">মোট সংগৃহীত আয়</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatTaka(finance?.totalIncome)}
                    </span>
                    <BdtIcon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">তহবিল উদ্বৃত্ত</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-extrabold text-[#CA0000]">
                      {formatTaka(finance?.balance)}
                    </span>
                    <BdtIcon className="w-5 h-5 text-[#CA0000]" />
                  </div>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4">দ্রুত কন্টেন্ট সম্পাদনা</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Sliders className="w-5 h-5 text-[#00732A] mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">হিরো ব্যানার</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(heroSlides.length)} টি স্লাইড</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notices')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Bell className="w-5 h-5 text-[#CA0000] mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">নোটিশ বোর্ড</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(notices.length)} টি নোটিশ</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Users className="w-5 h-5 text-amber-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">ছাত্র-ছাত্রী ডিরেক্টরি</span>
                    <span className="text-[11px] text-slate-400">{toBengaliNumber(students.length)} জন নিবন্ধিত</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#00732A] text-left transition-all"
                  >
                    <Settings className="w-5 h-5 text-slate-700 mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">সাইট ও ডাটাবেজ</span>
                    <span className="text-[11px] text-slate-400">কনফিগারেশন</span>
                  </button>
                </div>
              </div>

              {/* Recent registered students preview table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">সর্বশেষ নিবন্ধিত শিক্ষার্থী</h3>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="text-xs font-bold text-[#00732A] hover:underline"
                  >
                    সকল দেখুন →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">শিক্ষার্থী</th>
                        <th className="px-4 py-3">ব্যাচ</th>
                        <th className="px-4 py-3">রক্তের গ্রুপ</th>
                        <th className="px-4 py-3">অবস্থান</th>
                        <th className="px-4 py-3">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.slice(0, 5).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <img src={s.image} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-bold text-slate-900">{s.name}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#CA0000]">{s.batch}</td>
                          <td className="px-4 py-3 font-bold">{s.bloodGroup}</td>
                          <td className="px-4 py-3 text-slate-600">{s.location}</td>
                          <td className="px-4 py-3 font-mono">{s.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: HERO SLIDER ===================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">
                  হোমপেজের ৩টি ডাইনামিক স্লাইডারের ছবি ও টেক্সট পরিবর্তন করুন
                </span>
                <button
                  onClick={() =>
                    setEditingSlide({
                      id: '',
                      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
                      badgeText: 'পুনর্মিলনী উৎসব ২০২৬',
                      title: 'নতুন স্লাইড শিরোনাম',
                      subtitle: 'স্লাইড বিবরণী',
                      buttonText: 'নিবন্ধন করুন',
                      buttonLink: '/register',
                      order: heroSlides.length + 1,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্লাইড যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-900">
                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          স্লাইড {toBengaliNumber(idx + 1)}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        {slide.badgeText && (
                          <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {slide.badgeText}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{slide.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{slide.subtitle}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('আপনি কি এই স্লাইডটি ডিলিট করতে চান?')) {
                            await apiService.deleteHeroSlide(slide.id);
                            flashMessage('স্লাইড ডিলিট করা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Slide Modal */}
              {editingSlide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingSlide.id ? 'স্লাইড সম্পাদনা' : 'নতুন স্লাইড তৈরি'}
                    </h3>

                    <div>
                      <ImageUploader
                        label="স্লাইড ব্যানার ছবি (Drag & Drop / Cloudinary আপলোড)"
                        value={editingSlide.imageUrl}
                        onChange={(url) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                        aspectRatio="video"
                        placeholder="ব্যানার ছবি ড্রপ করুন অথবা নির্বাচন করুন"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাজ টেক্সট</label>
                      <input
                        type="text"
                        value={editingSlide.badgeText}
                        onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম *</label>
                      <input
                        type="text"
                        value={editingSlide.title}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">উপ-শিরোনাম / বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingSlide.subtitle}
                        onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingSlide(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingSlide.id) {
                            await apiService.updateHeroSlide(editingSlide.id, editingSlide);
                          } else {
                            await apiService.addHeroSlide(editingSlide);
                          }
                          flashMessage('স্লাইড সংরক্ষণ সম্পন্ন');
                          setEditingSlide(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 3: TEACHER CALL ===================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    প্রাক্তনদের প্রতি আহবান ও শিক্ষকমণ্ডলীর বাণী
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    শ্রদ্ধেয় শিক্ষকদের বাণী, শুভেচ্ছা ও আহবান বার্তা যুক্ত, সম্পাদন ও নিয়ন্ত্রণ করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTeacher({
                      id: '',
                      name: '',
                      designation: 'সাবেক প্রধান শিক্ষক',
                      schoolName: 'ত্রিশাল সরকারি নজরুল একাডেমি',
                      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                      heading: 'নজরুল আঙিনায় সৌহার্দ্যের সেতুবন্ধন',
                      bismillahText: 'বিসমিল্লাহির রাহমানির রাহিম',
                      greeting: 'শ্রদ্ধেয় সুধী ও স্নেহের ছাত্র-ছাত্রীগণ,',
                      description: '',
                      order: teacherMessages.length + 1,
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন বাণী / আহবান যোগ করুন</span>
                </button>
              </div>

              {/* Teacher Cards Grid */}
              <div className="space-y-5">
                {teacherMessages.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    কোনো শিক্ষকের বাণী পাওয়া যায়নি। উপরে 'নতুন বাণী / আহবান যোগ করুন' বাটনে ক্লিক করুন।
                  </div>
                ) : (
                  teacherMessages.map((tm, idx) => (
                    <div
                      key={tm.id || idx}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={tm.image}
                            alt={tm.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{tm.name}</h4>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                ক্রম #{toBengaliNumber(tm.order || idx + 1)}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#CA0000]">{tm.designation}</p>
                            <p className="text-[11px] text-slate-500">{tm.schoolName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setEditingTeacher(tm)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>সম্পাদনা</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`আপনি কি "${tm.name}"-এর বাণী মুছে ফেলতে নিশ্চিত?`)) {
                                try {
                                  await apiService.deleteTeacherMessage(tm.id);
                                  flashMessage('শিক্ষকের বাণী সফলভাবে মুছে ফেলা হয়েছে');
                                  loadAllData();
                                } catch (err: any) {
                                  flashMessage(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', true);
                                }
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-serif">
                          {tm.bismillahText || 'বিসমিল্লাহির রাহমানির রাহিম'}
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800">
                          {tm.heading}
                        </h5>
                        {tm.greeting && (
                          <p className="text-xs font-bold text-[#00732A]">{tm.greeting}</p>
                        )}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {tm.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: STATS & DATE ===================== */}
          {activeTab === 'stats' && statsData && (
            <div className="space-y-6">
              {/* Event Timing & Primary Metrics Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      উৎসব ও মূল পরিসংখ্যান নিয়ন্ত্রণ
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      পুনর্মিলনীর নির্ধারিত তারিখ, শুরুর সময় ও নিবন্ধিত সংখ্যা আপডেট করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await apiService.updateStats(statsData);
                        flashMessage('পরিসংখ্যান ও তারিখ সফলভাবে সংরক্ষিত হয়েছে');
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠানের পূর্ণাঙ্গ নাম / শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalTitle || 'পুনর্মিলনী ও বসন্ত উৎসব ২০২৬'}
                      onChange={(e) => setStatsData({ ...statsData, festivalTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠানের তারিখ (যেমন: ২০২৬-০৩-২৬)
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalDate}
                      onChange={(e) => setStatsData({ ...statsData, festivalDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অনুষ্ঠান শুরুর সময় (যেমন: সকাল ০৯:০০ টা)
                    </label>
                    <input
                      type="text"
                      value={statsData.festivalTime}
                      onChange={(e) => setStatsData({ ...statsData, festivalTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নিবন্ধিত শিক্ষার্থী সংখ্যা (স্বয়ংক্রিয় বা কাস্টম)
                    </label>
                    <input
                      type="number"
                      value={statsData.registeredStudents}
                      onChange={(e) =>
                        setStatsData({ ...statsData, registeredStudents: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নিবন্ধিত পরিবারের সদস্য সংখ্যা
                    </label>
                    <input
                      type="number"
                      value={statsData.familyMembersCount}
                      onChange={(e) =>
                        setStatsData({ ...statsData, familyMembersCount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Stat Cards Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#00732A]" />
                      <span>কাস্টম পরিসংখ্যান কার্ডসমূহ (Custom Stats & Milestones)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ওয়েবসাইটের পরিসংখ্যান সেকশনে প্রদর্শনের জন্য নতুন কার্ড যোগ, সম্পাদনা ও নিয়ন্ত্রণ করুন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCustomStat({
                        id: `cstat-${Date.now()}`,
                        label: '',
                        value: '',
                        unit: '',
                        icon: 'Award',
                        note: '',
                        order: (statsData.customStats?.length || 0) + 1,
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-[#00732A] hover:bg-[#005c21] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন পরিসংখ্যান কার্ড যোগ করুন</span>
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(!statsData.customStats || statsData.customStats.length === 0) ? (
                    <div className="sm:col-span-3 py-8 text-center text-xs text-slate-400">
                      কোনো কাস্টম পরিসংখ্যান কার্ড যোগ করা হয়নি। উপরে বাটনে ক্লিক করে যোগ করুন।
                    </div>
                  ) : (
                    statsData.customStats.map((cStat, idx) => (
                      <div
                        key={cStat.id || idx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              #{toBengaliNumber(cStat.order || idx + 1)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingCustomStat(cStat)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm(`আপনি কি "${cStat.label}" কার্ডটি মুছে ফেলতে চান?`)) {
                                    const updated = (statsData.customStats || []).filter(
                                      (s) => s.id !== cStat.id
                                    );
                                    const newStats = { ...statsData, customStats: updated };
                                    setStatsData(newStats);
                                    await apiService.updateStats(newStats);
                                    flashMessage('পরিসংখ্যান কার্ড মুছে ফেলা হয়েছে');
                                  }
                                }}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-2xl font-black text-slate-900 group-hover:text-[#00732A] transition-colors">
                            {cStat.value}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">{cStat.label}</h4>
                          {cStat.unit && (
                            <p className="text-[11px] text-emerald-700 font-medium">{cStat.unit}</p>
                          )}
                          {cStat.note && (
                            <p className="text-[11px] text-slate-500 mt-1">{cStat.note}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: STUDENTS DIRECTORY ===================== */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Header with Search and Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="শিক্ষার্থীর নাম বা জেলা খুঁজুন..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <select
                    value={studentBatchFilter}
                    onChange={(e) => setStudentBatchFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="all">সকল ব্যাচ</option>
                    <option value="old">পুরাতন ব্যাচ (২০১০ এর পূর্বে)</option>
                    <option value="new">নতুন ব্যাচ (২০১১ পরবর্তী)</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setEditingStudent({
                      id: '',
                      name: '',
                      nameEn: '',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      batch: 'ব্যাচ ২০১১',
                      batchType: 'new',
                      location: 'ত্রিশাল, ময়মনসিংহ',
                      bloodGroup: 'B+',
                      phone: '',
                      email: '',
                      school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
                      currentJob: '',
                      company: '',
                      tshirtSize: 'L',
                      familyMembersCount: 0,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21] shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন শিক্ষার্থী যোগ করুন</span>
                </button>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3.5">ছবি ও নাম</th>
                        <th className="px-4 py-3.5">ব্যাচ ও টাইপ</th>
                        <th className="px-4 py-3.5">রক্তের গ্রুপ</th>
                        <th className="px-4 py-3.5">বর্তমান ঠিকানা</th>
                        <th className="px-4 py-3.5">পেশা ও প্রতিষ্ঠান</th>
                        <th className="px-4 py-3.5 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter((s) => {
                          if (studentBatchFilter !== 'all' && s.batchType !== studentBatchFilter) return false;
                          if (studentSearch) {
                            const q = studentSearch.toLowerCase();
                            return (
                              s.name.toLowerCase().includes(q) ||
                              (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
                              s.location.toLowerCase().includes(q) ||
                              s.batch.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 flex items-center gap-2.5">
                              <img src={s.image} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0 border" />
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">{s.name}</span>
                                {s.nameEn && <span className="text-[10px] text-slate-400 font-sans">{s.nameEn}</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-[#CA0000]">{s.batch}</span>
                              <span className="text-[10px] text-slate-400 block">
                                {s.batchType === 'old' ? 'পুরাতন ব্যাচ' : 'নতুন ব্যাচ'}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800">
                              <span className="bg-red-50 text-[#CA0000] px-2 py-0.5 rounded border border-red-200">
                                {s.bloodGroup}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{s.location}</td>
                            <td className="px-4 py-3">
                              <span className="text-slate-800 block font-medium">{s.currentJob || '-'}</span>
                              <span className="text-[10px] text-slate-400">{s.company || '-'}</span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-1">
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="সম্পাদনা"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`আপনি কি "${s.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                                    await apiService.deleteStudent(s.id);
                                    flashMessage('শিক্ষার্থী ডিলিট করা হয়েছে');
                                    loadAllData();
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit / Add Student Modal */}
              {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingStudent.id ? 'শিক্ষার্থী তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী নিবন্ধন'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">বাংলা নাম *</label>
                        <input
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ইংরেজি নাম</label>
                        <input
                          type="text"
                          value={editingStudent.nameEn}
                          onChange={(e) => setEditingStudent({ ...editingStudent, nameEn: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ *</label>
                        <input
                          type="text"
                          value={editingStudent.batch}
                          onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-[#CA0000]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ টাইপ</label>
                        <select
                          value={editingStudent.batchType}
                          onChange={(e) => setEditingStudent({ ...editingStudent, batchType: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        >
                          <option value="new">নতুন ব্যাচ</option>
                          <option value="old">পুরাতন ব্যাচ</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">রক্তের গ্রুপ</label>
                        <select
                          value={editingStudent.bloodGroup}
                          onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
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
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">বর্তমান ঠিকানা</label>
                        <input
                          type="text"
                          value={editingStudent.location}
                          onChange={(e) => setEditingStudent({ ...editingStudent, location: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">পেশা</label>
                        <input
                          type="text"
                          value={editingStudent.currentJob}
                          onChange={(e) => setEditingStudent({ ...editingStudent, currentJob: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">প্রতিষ্ঠান / কোম্পানি</label>
                        <input
                          type="text"
                          value={editingStudent.company}
                          onChange={(e) => setEditingStudent({ ...editingStudent, company: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="শিক্ষার্থীর ছবি (Drag & Drop / Cloudinary আপলোড)"
                          value={editingStudent.image}
                          onChange={(url) => setEditingStudent({ ...editingStudent, image: url })}
                          aspectRatio="square"
                          placeholder="শিক্ষার্থীর প্রোফাইল ছবি ড্রপ বা নির্বাচন করুন"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingStudent.id) {
                            await apiService.updateStudent(editingStudent.id, editingStudent);
                          } else {
                            await apiService.addStudent(editingStudent);
                          }
                          flashMessage('শিক্ষার্থী তথ্য সংরক্ষিত হয়েছে');
                          setEditingStudent(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 6: FINANCIAL CONDITION ===================== */}
          {activeTab === 'finance' && finance && (
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
          )}

          {/* ===================== TAB 7: NOTICES ===================== */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">নোটিশ প্রকাশ ও হালনাগাদ করুন</span>
                <button
                  onClick={() =>
                    setEditingNotice({
                      id: '',
                      category: 'পুনর্মিলনী',
                      title: '',
                      shortDescription: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      priority: 'সাধারণ',
                      author: 'পুনর্মিলনী উদযাপন কমিটি',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন নোটিশ লিখুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#00732A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {n.category}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                          {n.priority}
                        </span>
                        <span className="text-xs text-slate-400">{formatDateBengali(n.date)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setEditingNotice(n)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
                            await apiService.deleteNotice(n.id);
                            flashMessage('নোটিশ মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Notice Modal */}
              {editingNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
                      {editingNotice.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ প্রকাশ'}
                    </h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটেগরি *</label>
                      <input
                        type="text"
                        value={editingNotice.category}
                        onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম *</label>
                      <input
                        type="text"
                        value={editingNotice.title}
                        onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">অগ্রাধিকার (Priority)</label>
                        <select
                          value={editingNotice.priority}
                          onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                        >
                          <option value="সাধারণ">সাধারণ</option>
                          <option value="উচ্চ">উচ্চ</option>
                          <option value="জরুরি">জরুরি</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">তারিখ</label>
                        <input
                          type="date"
                          value={editingNotice.date}
                          onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <ImageUploader
                        label="নোটিশের সংশ্লিষ্ট ছবি / ব্যানার (ঐচ্ছিক)"
                        value={editingNotice.image || ''}
                        onChange={(url) => setEditingNotice({ ...editingNotice, image: url })}
                        aspectRatio="video"
                        placeholder="নোটিশের ছবি বা ডকুমেন্টের ছবি ড্রপ করুন"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সংক্ষিপ্ত বিবরণ *</label>
                      <textarea
                        rows={2}
                        value={editingNotice.shortDescription}
                        onChange={(e) => setEditingNotice({ ...editingNotice, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিস্তারিত বিবরণ *</label>
                      <textarea
                        rows={5}
                        value={editingNotice.description}
                        onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setEditingNotice(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingNotice.id) {
                            await apiService.updateNotice(editingNotice.id, editingNotice);
                          } else {
                            await apiService.addNotice(editingNotice);
                          }
                          flashMessage('নোটিশ সংরক্ষণ সম্পন্ন');
                          setEditingNotice(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21]"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 8: SCHEDULE ===================== */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">মূল অনুষ্ঠানের সময়সূচি পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingSchedule({
                      id: '',
                      startTime: 'সকাল ০৯:০০',
                      endTime: 'সকাল ১০:০০',
                      category: 'পর্ব',
                      title: 'নতুন পর্ব',
                      shortDescription: '',
                      order: schedule.length + 1,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কর্মসূচি যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-[#00732A] mr-2">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{item.title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSchedule(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteScheduleItem(item.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                      কর্মসূচি সম্পাদনা
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">শুরুর সময়</label>
                        <input
                          type="text"
                          value={editingSchedule.startTime}
                          onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">শেষের সময়</label>
                        <input
                          type="text"
                          value={editingSchedule.endTime}
                          onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingSchedule.title}
                        onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingSchedule.shortDescription}
                        onChange={(e) => setEditingSchedule({ ...editingSchedule, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingSchedule(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingSchedule.id) {
                            await apiService.updateScheduleItem(editingSchedule.id, editingSchedule);
                          } else {
                            await apiService.addScheduleItem(editingSchedule);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingSchedule(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 9: CULTURAL ===================== */}
          {activeTab === 'cultural' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">সাংস্কৃতিক ও বিনোদন পর্বের শিডিউল</span>
                <button
                  onClick={() =>
                    setEditingCultural({
                      id: '',
                      category: 'নজরুল সংগীত',
                      title: 'নতুন পর্ব',
                      description: '',
                      time: 'সন্ধ্যা ০৬:০০',
                      performers: '',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#CA0000] text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন সাংস্কৃতিক পর্ব যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {culturalSchedule.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#CA0000] bg-red-50 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{c.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                    {c.performers && (
                      <p className="text-xs text-slate-700 font-semibold mt-2">পরিবেশক: {c.performers}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setEditingCultural(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteCulturalItem(c.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingCultural && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                      সাংস্কৃতিক পর্ব সম্পাদনা
                    </h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটেগরি</label>
                      <input
                        type="text"
                        value={editingCultural.category}
                        onChange={(e) => setEditingCultural({ ...editingCultural, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingCultural.title}
                        onChange={(e) => setEditingCultural({ ...editingCultural, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সময়</label>
                      <input
                        type="text"
                        value={editingCultural.time}
                        onChange={(e) => setEditingCultural({ ...editingCultural, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">পরিবেশক / শিল্পী</label>
                      <input
                        type="text"
                        value={editingCultural.performers}
                        onChange={(e) => setEditingCultural({ ...editingCultural, performers: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বিবরণ</label>
                      <textarea
                        rows={3}
                        value={editingCultural.description}
                        onChange={(e) => setEditingCultural({ ...editingCultural, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingCultural(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={async () => {
                          if (editingCultural.id) {
                            await apiService.updateCulturalItem(editingCultural.id, editingCultural);
                          } else {
                            await apiService.addCulturalItem(editingCultural);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingCultural(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#CA0000] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 10: DONORS ===================== */}
          {activeTab === 'donors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">সম্মানিত দাতা ও শুভানুধ্যায়ী তালিকা পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingDonor({
                      id: '',
                      name: '',
                      batch: 'ব্যাচ ১৯৯৫',
                      amount: 50000,
                      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      category: 'বিশেষ দাতা',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন দাতা যুক্ত করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {donors.map((d) => (
                  <div key={d.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                    <img src={d.image} alt={d.name} className="w-16 h-16 rounded-full object-cover mb-2 border" />
                    <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                    <span className="text-[11px] text-[#00732A] font-bold">{d.batch}</span>
                    <span className="text-sm font-black text-amber-600 mt-2">{formatTaka(d.amount)}</span>

                    <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100 w-full justify-center">
                      <button onClick={() => setEditingDonor(d)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteDonor(d.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingDonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">দাতা তথ্য সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">দাতার নাম *</label>
                      <input
                        type="text"
                        value={editingDonor.name}
                        onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাচ</label>
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
                        value={editingDonor.amount}
                        onChange={(e) => setEditingDonor({ ...editingDonor, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-amber-600"
                      />
                    </div>
                    <div>
                      <ImageUploader
                        label="দাতার ছবি (Drag & Drop / Cloudinary আপলোড)"
                        value={editingDonor.image}
                        onChange={(url) => setEditingDonor({ ...editingDonor, image: url })}
                        aspectRatio="square"
                        placeholder="দাতার ছবি ড্রপ বা নির্বাচন করুন"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingDonor(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingDonor.id) {
                            await apiService.updateDonor(editingDonor.id, editingDonor);
                          } else {
                            await apiService.addDonor(editingDonor);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingDonor(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 11: GALLERY ===================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">ছবি ও ভিডিও গ্যালারি আইটেম যোগ বা এডিট করুন</span>
                <button
                  onClick={() =>
                    setEditingGallery({
                      id: '',
                      title: 'নতুন ছবি',
                      type: 'image',
                      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
                      category: 'ক্যাম্পাস',
                      date: '২০২৬',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ছবি/ভিডিও যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
                    <div className="aspect-video w-full bg-slate-100 relative">
                      <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {g.type === 'video' ? 'ভিডিও' : 'ছবি'}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{g.title}</h4>
                      <span className="text-[10px] text-slate-400">{g.category}</span>
                    </div>
                    <div className="p-2 border-t border-slate-100 flex justify-end gap-1">
                      <button onClick={() => setEditingGallery(g)} className="p-1 text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteGalleryItem(g.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">গ্যালারি আইটেম সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">টাইটেল</label>
                      <input
                        type="text"
                        value={editingGallery.title}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">মিডিয়া টাইপ</label>
                      <select
                        value={editingGallery.type}
                        onChange={(e) => setEditingGallery({ ...editingGallery, type: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      >
                        <option value="image">ছবি (Image)</option>
                        <option value="video">ভিডিও (Video Embed/URL)</option>
                      </select>
                    </div>
                    <div>
                      {editingGallery.type === 'image' ? (
                        <ImageUploader
                          label="গ্যালারি ছবি (Drag & Drop / Cloudinary আপলোড)"
                          value={editingGallery.url}
                          onChange={(url) => setEditingGallery({ ...editingGallery, url })}
                          aspectRatio="video"
                          placeholder="গ্যালারির ছবি ড্রপ বা নির্বাচন করুন"
                        />
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">ভিডিও লিংক (Embed / YouTube URL)</label>
                          <input
                            type="url"
                            value={editingGallery.url}
                            onChange={(e) => setEditingGallery({ ...editingGallery, url: e.target.value })}
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingGallery(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingGallery.id) {
                            await apiService.updateGalleryItem(editingGallery.id, editingGallery);
                          } else {
                            await apiService.addGalleryItem(editingGallery);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingGallery(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 12: MAGAZINE ===================== */}
          {activeTab === 'magazine' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500">স্মৃতির পাতা ম্যাগাজিনের স্মৃতিকথা ও প্রবন্ধ পরিচালনা</span>
                <button
                  onClick={() =>
                    setEditingArticle({
                      id: '',
                      title: 'নতুন স্মৃতিকথা',
                      author: '',
                      authorBatch: 'ব্যাচ ২০০০',
                      date: '২০২৬',
                      summary: '',
                      content: '',
                      category: 'স্মৃতিচারণ',
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white rounded-xl text-xs font-bold hover:bg-[#005c21]"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রবন্ধ যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {magazineArticles.map((art) => (
                  <div key={art.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#00732A] mr-2 bg-emerald-50 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{art.title}</span>
                      <p className="text-xs text-slate-500 mt-1">লেখক: {art.author} ({art.authorBatch})</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingArticle(art)} className="p-1.5 text-blue-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('মুছে ফেলতে চান?')) {
                            await apiService.deleteMagazineArticle(art.id);
                            flashMessage('মুছে ফেলা হয়েছে');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">প্রবন্ধ সম্পাদনা</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">শিরোনাম</label>
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">লেখক</label>
                        <input
                          type="text"
                          value={editingArticle.author}
                          onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">লেখকের ব্যাচ</label>
                        <input
                          type="text"
                          value={editingArticle.authorBatch}
                          onChange={(e) => setEditingArticle({ ...editingArticle, authorBatch: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">সংক্ষিপ্ত সারমর্ম</label>
                      <textarea
                        rows={2}
                        value={editingArticle.summary}
                        onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">মূল লেখা</label>
                      <textarea
                        rows={6}
                        value={editingArticle.content}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingArticle(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">বাতিল</button>
                      <button
                        onClick={async () => {
                          if (editingArticle.id) {
                            await apiService.updateMagazineArticle(editingArticle.id, editingArticle);
                          } else {
                            await apiService.addMagazineArticle(editingArticle);
                          }
                          flashMessage('সংরক্ষিত হয়েছে');
                          setEditingArticle(null);
                          loadAllData();
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#00732A] rounded-xl"
                      >
                        সংরক্ষণ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB: MONGODB CLOUD DATABASE ===================== */}
          {activeTab === 'mongodb' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header & Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00732A] flex items-center justify-center border border-emerald-200 shadow-xs">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          MongoDB Atlas ক্লাউড ডাটাবেজ
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            mongoStatus.connected
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {mongoStatus.connected ? '● সংযুক্ত (Connected)' : '○ লোকাল ব্যাকআপ সক্রিয়'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ক্লাউড ক্লাস্টার: {mongoStatus.cluster || 'cluster0.ssmpl.mongodb.net'} | ডাটাবেজ:{' '}
                        <span className="font-mono font-bold text-slate-700">
                          {mongoStatus.database || 'trishal_nazrul_academy'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={syncingMongo}
                      onClick={handleSyncMongo}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingMongo ? 'animate-spin' : ''}`} />
                      <span>{syncingMongo ? 'সিঙ্ক হচ্ছে...' : 'MongoDB সিঙ্ক করুন'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={seedingDemo}
                      onClick={handleSeedDemoData}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#00732A] text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{seedingDemo ? 'সিড হচ্ছে...' : 'ডেমো ডেটা সিড করুন'}</span>
                    </button>
                  </div>
                </div>

                {/* Grid of System Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      স্টোরেজ মোড
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {mongoStatus.storageType}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      সক্রিয় কালেকশন
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {mongoStatus.collections?.length || 14} টি পৃথক কালেকশন
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      সর্বশেষ সিঙ্ক
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {mongoStatus.lastSync ? formatDateBengali(mongoStatus.lastSync) : 'এইমাত্র'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      নিরাপত্তা এনক্রিপশন
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      TLS/SSL & SCRAM-SHA
                    </span>
                  </div>
                </div>

                {/* MongoDB Connection URI Config Form */}
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">MongoDB Atlas Connection String</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Cluster0 (Trishal)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="mongodb+srv://Trishal:password@cluster0.ssmpl.mongodb.net/trishal_nazrul_academy"
                      value={mongoUriInput || mongoStatus.mongoUri || ''}
                      onChange={(e) => setMongoUriInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveMongoUri(mongoUriInput || mongoStatus.mongoUri || '')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      সংরক্ষণ ও সংযোগ পরীক্ষা
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Collection Explorer */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#00732A]" />
                      <span>MongoDB কালেকশন এক্সপ্লোরার (Live Collection Viewer)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      নিচের যেকোনো কালেকশনে ক্লিক করে সরাসরি ডাটাবেজে সংরক্ষিত ডকুমেন্টগুলো দেখুন
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => loadMongoCollectionDocs(selectedMongoCollection)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg self-start cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${collectionLoading ? 'animate-spin' : ''}`} />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>

                {/* Collection Buttons List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {(mongoStatus.collections && mongoStatus.collections.length > 0
                    ? mongoStatus.collections
                    : [
                        { name: 'students', label: 'শিক্ষার্থী', count: students.length },
                        { name: 'users', label: 'ইউজার ও অ্যাডমিন', count: 1 },
                        { name: 'teachers', label: 'শিক্ষকবৃন্দ', count: teacherMessages.length },
                        { name: 'hero_slides', label: 'হিরো স্লাইড', count: heroSlides.length },
                        { name: 'notices', label: 'নোটিশ বোর্ড', count: notices.length },
                        { name: 'schedule', label: 'সময়সূচি', count: schedule.length },
                        { name: 'cultural_schedule', label: 'সাংস্কৃতিক পর্ব', count: culturalSchedule.length },
                        { name: 'donations', label: 'দাতা ও অনুদান', count: donors.length },
                        { name: 'gallery', label: 'ছবি ও ভিডিও', count: gallery.length },
                        { name: 'magazine', label: 'স্মৃতির পাতা', count: magazineArticles.length },
                        { name: 'finance', label: 'আর্থিক হিসাব', count: 1 },
                        { name: 'global_config', label: 'সাইট কনফিগ', count: 1 },
                        { name: 'admin_info', label: 'অ্যাডমিন তথ্য', count: 1 },
                        { name: 'stats', label: 'পরিসংখ্যান', count: 1 },
                      ]
                  ).map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => loadMongoCollectionDocs(col.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMongoCollection === col.name
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 truncate">
                          {col.name}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            selectedMongoCollection === col.name
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {toBengaliNumber(col.count)}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate">{col.label}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Collection Document Viewer */}
                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white font-mono">
                        collection: <span className="text-emerald-400">{selectedMongoCollection}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({toBengaliNumber(collectionDocs.length)} টি ডকুমেন্ট সংরক্ষিত)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(collectionDocs, null, 2));
                        flashMessage('JSON কপি করা হয়েছে');
                      }}
                      className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>JSON কপি করুন</span>
                    </button>
                  </div>

                  {collectionLoading ? (
                    <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>MongoDB থেকে ডকুমেন্ট লোড করা হচ্ছে...</span>
                    </div>
                  ) : collectionDocs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400">
                      কোনো ডকুমেন্ট পাওয়া যায়নি। উপরে 'MongoDB সিঙ্ক করুন' বা 'ডেমো ডেটা সিড করুন' বাটনে ক্লিক করুন।
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-2 pr-1 font-mono text-xs text-slate-300">
                      {collectionDocs.map((doc, idx) => (
                        <div
                          key={doc.id || doc._id || idx}
                          className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1 border-b border-slate-800/80 pb-1">
                            <span>
                              #{idx + 1} • {doc.name || doc.title || doc.siteTitle || doc.festivalTitle || doc.id || doc._id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              _id: {doc._id || doc.id}
                            </span>
                          </div>
                          <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 13: SETTINGS & MONGODB ===================== */}
          {activeTab === 'settings' && globalConfig && (
            <div className="space-y-6 max-w-3xl">
              {/* Site Identity Config */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  সাইটের নাম ও যোগাযোগের তথ্য
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">সাইট টাইটেল</label>
                    <input
                      type="text"
                      value={globalConfig.siteTitle}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, siteTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="লোগো URL (Drag & Drop / Cloudinary আপলোড)"
                      value={globalConfig.logoUrl || ''}
                      onChange={(url) => setGlobalConfig({ ...globalConfig, logoUrl: url })}
                      aspectRatio="video"
                      placeholder="সাইটের লোগো ড্রপ বা নির্বাচন করুন"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">যোগাযোগ ফোন ১</label>
                    <input
                      type="text"
                      value={globalConfig.contactPhone1}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactPhone1: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">যোগাযোগ ফোন ২</label>
                    <input
                      type="text"
                      value={globalConfig.contactPhone2}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactPhone2: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল</label>
                    <input
                      type="email"
                      value={globalConfig.contactEmail}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ফেসবুক পেজ লিংক</label>
                    <input
                      type="url"
                      value={globalConfig.facebookUrl}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      value={globalConfig.address}
                      onChange={(e) => setGlobalConfig({ ...globalConfig, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      await apiService.updateGlobalConfig(globalConfig);
                      flashMessage('সাইট সেটিংস সংরক্ষিত হয়েছে');
                      loadAllData();
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#00732A] text-white rounded-xl text-xs font-bold"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* MongoDB Backend Connection Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00732A]" />
                  <span>Node.js ও MongoDB ডাটাবেজ স্টোরেজ কনফিগারেশন</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  বর্তমান ডাটাবেজ আর্কিটেকচারে ক্লাউড পারসিস্টেন্স এবং লোকাল ফাইল ব্যাকড স্টোরেজ উভয়ই স্বয়ংক্রিয়ভাবে সক্রিয় রয়েছে। আপনার রিমোট MongoDB ক্লাস্টার সংযুক্ত করতে নিচের সংযোগ স্ট্রিং প্রদান করুন।
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">বর্তমান স্টোরেজ স্ট্যাটাস:</span>
                    <span className="font-bold text-[#00732A] bg-emerald-100 px-2 py-0.5 rounded">
                      {mongoStatus.storageType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">JWT অথেন্টিকেশন নিরাপত্তা:</span>
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">সক্রিয় (HS256)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    MongoDB সংযোগ স্ট্রিং (MONGODB_URI)
                  </label>
                  <input
                    type="text"
                    placeholder="mongodb+srv://username:password@cluster0.mongodb.net/trishal_alumni"
                    defaultValue={mongoStatus.mongoUri || ''}
                    onBlur={async (e) => {
                      if (e.target.value) {
                        const res = await apiService.updateMongoConfig(e.target.value);
                        flashMessage(res.message);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    স্ট্রিং পূরণ করা না থাকলে বিল্ট-ইন নিরবচ্ছিন্ন লোকাল স্টোরেজ ইঞ্জিন ব্যবহৃত হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== MODAL: TEACHER MESSAGE ===================== */}
          {editingTeacher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#00732A]" />
                    <span>
                      {editingTeacher.id
                        ? 'শিক্ষকের বার্তা / আহবান সম্পাদনা'
                        : 'নতুন শিক্ষকের বার্তা / আহবান যোগ করুন'}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      শিক্ষকের নাম *
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.name}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, name: e.target.value })
                      }
                      placeholder="যেমন: জনাব মোহসীন উদ্দিন আহমেদ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পদবি (Designation) *
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.designation}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, designation: e.target.value })
                      }
                      placeholder="যেমন: সাবেক প্রধান শিক্ষক / সিনিয়র শিক্ষক"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-[#CA0000] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      বিদ্যালয় / প্রতিষ্ঠান *
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.schoolName}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, schoolName: e.target.value })
                      }
                      placeholder="ত্রিশাল সরকারি নজরুল একাডেমি"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      প্রদর্শন ক্রম (Order)
                    </label>
                    <input
                      type="number"
                      value={editingTeacher.order || 1}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, order: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="শিক্ষকের ছবি (Drag & Drop / Cloudinary আপলোড)"
                      value={editingTeacher.image}
                      onChange={(url) => setEditingTeacher({ ...editingTeacher, image: url })}
                      aspectRatio="square"
                      placeholder="শ্রদ্ধেয় শিক্ষকের ছবি ড্রপ বা নির্বাচন করুন"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      বিসমিল্লাহ / শুরুর শিরোনাম
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.bismillahText || ''}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, bismillahText: e.target.value })
                      }
                      placeholder="বিসমিল্লাহির রাহমানির রাহিম"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      আহবানের মূল শিরোনাম (Heading) *
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.heading}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, heading: e.target.value })
                      }
                      placeholder="যেমন: নজরুল আঙিনায় সৌহার্দ্যের সেতুবন্ধন"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      সম্ভাষণ বাক্য (Greeting)
                    </label>
                    <input
                      type="text"
                      value={editingTeacher.greeting || ''}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, greeting: e.target.value })
                      }
                      placeholder="শ্রদ্ধেয় সুধী ও স্নেহের ছাত্র-ছাত্রীগণ,"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-[#00732A] font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পূর্ণাঙ্গ বাণী / আহবান বার্তা (Description) *
                    </label>
                    <textarea
                      rows={6}
                      value={editingTeacher.description}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, description: e.target.value })
                      }
                      placeholder="শ্রদ্ধেয় শিক্ষকের বিস্তারিত বাণী লিখুন..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingTeacher.name.trim() || !editingTeacher.heading.trim()) {
                        flashMessage('অনুগ্রহ করে নাম এবং শিরোনাম পূরণ করুন', true);
                        return;
                      }
                      try {
                        if (editingTeacher.id) {
                          await apiService.updateTeacherMessage(editingTeacher.id, editingTeacher);
                        } else {
                          await apiService.addTeacherMessage(editingTeacher);
                        }
                        flashMessage('শিক্ষকের বাণী সংরক্ষিত হয়েছে');
                        setEditingTeacher(null);
                        loadAllData();
                      } catch (err: any) {
                        flashMessage(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] cursor-pointer shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== MODAL: CUSTOM STAT ITEM ===================== */}
          {editingCustomStat && statsData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#00732A]" />
                    <span>পরিসংখ্যান কার্ড তৈরি বা সম্পাদনা</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCustomStat(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      কার্ডের শিরোনাম / লেবেল *
                    </label>
                    <input
                      type="text"
                      value={editingCustomStat.label}
                      onChange={(e) =>
                        setEditingCustomStat({ ...editingCustomStat, label: e.target.value })
                      }
                      placeholder="যেমন: মোট ব্যাচ সংখ্যা / অংশগ্রাহক ব্যাচ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      পরিসংখ্যান মান (Value / Number) *
                    </label>
                    <input
                      type="text"
                      value={editingCustomStat.value}
                      onChange={(e) =>
                        setEditingCustomStat({ ...editingCustomStat, value: e.target.value })
                      }
                      placeholder="যেমন: ৫০+ / ৯৫% / ১২০"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      একক / বিবরণ (Unit)
                    </label>
                    <input
                      type="text"
                      value={editingCustomStat.unit || ''}
                      onChange={(e) =>
                        setEditingCustomStat({ ...editingCustomStat, unit: e.target.value })
                      }
                      placeholder="যেমন: টি ব্যাচ / জন / কিমি"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      সংক্ষিপ্ত নোট / সাবটাইটেল
                    </label>
                    <input
                      type="text"
                      value={editingCustomStat.note || ''}
                      onChange={(e) =>
                        setEditingCustomStat({ ...editingCustomStat, note: e.target.value })
                      }
                      placeholder="যেমন: ১৯৭৪ হতে ২০২৫ ব্যাচ পর্যন্ত"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      প্রদর্শন ক্রম (Order)
                    </label>
                    <input
                      type="number"
                      value={editingCustomStat.order || 1}
                      onChange={(e) =>
                        setEditingCustomStat({ ...editingCustomStat, order: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCustomStat(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingCustomStat.label.trim() || !editingCustomStat.value.trim()) {
                        flashMessage('অনুগ্রহ করে লেবেল ও মান পূরণ করুন', true);
                        return;
                      }
                      try {
                        const currentList = statsData.customStats || [];
                        const existingIdx = currentList.findIndex((s) => s.id === editingCustomStat.id);
                        let updatedList: CustomStatItem[];
                        if (existingIdx >= 0) {
                          updatedList = [...currentList];
                          updatedList[existingIdx] = editingCustomStat;
                        } else {
                          updatedList = [...currentList, editingCustomStat];
                        }
                        const newStats = { ...statsData, customStats: updatedList };
                        setStatsData(newStats);
                        await apiService.updateStats(newStats);
                        flashMessage('পরিসংখ্যান কার্ড সংরক্ষিত হয়েছে');
                        setEditingCustomStat(null);
                        loadAllData();
                      } catch (err: any) {
                        flashMessage(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] cursor-pointer shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== MODAL: FINANCE TRANSACTION ===================== */}
          {editingTransaction && finance && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#00732A]" />
                    <span>
                      {editingTransaction.id.startsWith('tx-') &&
                      !(finance.transactions || []).some((t) => t.id === editingTransaction.id)
                        ? 'নতুন আর্থিক লেনদেন / ভাউচার যুক্ত করুন'
                        : 'আর্থিক লেনদেন ভাউচার সম্পাদনা'}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingTransaction(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      খাত / লেনদেনের বিবরণ *
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.title}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, title: e.target.value })
                      }
                      placeholder="যেমন: ২০০০ ব্যাচের নিবন্ধন ফি জমা / মঞ্চ সজ্জা ব্যয়"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      লেনদেনের ধরন *
                    </label>
                    <select
                      value={editingTransaction.type}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          type: e.target.value as 'income' | 'expense',
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                    >
                      <option value="income">আয় / জমা (Income)</option>
                      <option value="expense">ব্যয় / খরচ (Expense)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      টাকার পরিমাণ (টাকা) *
                    </label>
                    <input
                      type="number"
                      value={editingTransaction.amount || ''}
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          amount: Number(e.target.value),
                        })
                      }
                      placeholder="যেমন: 50000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-black text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ক্যাটাগরি / উপখাত
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.category || ''}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, category: e.target.value })
                      }
                      placeholder="যেমন: নিবন্ধন ফি / বিজ্ঞাপন / আপ্যায়ন"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      তারিখ (Date)
                    </label>
                    <input
                      type="date"
                      value={editingTransaction.date || ''}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, date: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ভাউচার / রসিদ নং (Voucher No)
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.voucherNo || ''}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, voucherNo: e.target.value })
                      }
                      placeholder="VCH-1001"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      মন্তব্য / ট্র্যাকিং নোট
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.note || ''}
                      onChange={(e) =>
                        setEditingTransaction({ ...editingTransaction, note: e.target.value })
                      }
                      placeholder="যেমন: ব্যাংক একাউন্টে জমা হয়েছে / ক্যাশ ভাউচার"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTransaction(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingTransaction.title.trim() || !editingTransaction.amount) {
                        flashMessage('অনুগ্রহ করে বিবরণ এবং টাকার পরিমাণ পূরণ করুন', true);
                        return;
                      }
                      try {
                        const currentList = finance.transactions || [];
                        const existingIdx = currentList.findIndex((t) => t.id === editingTransaction.id);
                        let updatedTxs: FinanceTransaction[];
                        if (existingIdx >= 0) {
                          updatedTxs = [...currentList];
                          updatedTxs[existingIdx] = editingTransaction;
                        } else {
                          updatedTxs = [editingTransaction, ...currentList];
                        }
                        const newFinance = { ...finance, transactions: updatedTxs };
                        setFinance(newFinance);
                        await apiService.updateFinance(newFinance);
                        flashMessage('আর্থিক লেনদেন ভাউচার সংরক্ষিত হয়েছে');
                        setEditingTransaction(null);
                        loadAllData();
                      } catch (err: any) {
                        flashMessage(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', true);
                      }
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00732A] hover:bg-[#005c21] cursor-pointer shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
