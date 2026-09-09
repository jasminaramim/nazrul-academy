import { OverviewTab } from '../components/tabs/OverviewTab';
import { HeroTab } from '../components/tabs/HeroTab';
import { TeachersTab } from '../components/tabs/TeachersTab';
import { StatsTab } from '../components/tabs/StatsTab';
import { StudentsTab } from '../components/tabs/StudentsTab';
import { FinanceTab } from '../components/tabs/FinanceTab';
import { NoticesTab } from '../components/tabs/NoticesTab';
import { ScheduleTab } from '../components/tabs/ScheduleTab';
import { CulturalTab } from '../components/tabs/CulturalTab';
import { DonorsTab } from '../components/tabs/DonorsTab';
import { GalleryTab } from '../components/tabs/GalleryTab';
import { MagazineTab } from '../components/tabs/MagazineTab';
import { MongodbTab } from '../components/tabs/MongodbTab';
import { SettingsTab } from '../components/tabs/SettingsTab';
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
import { apiService } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
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
} from '../../shared/types';
import { toBengaliNumber, formatTaka, formatDateBengali } from '../../shared/utils/formatters';
import { BdtIcon } from '../../shared/components/BdtIcon';
import { ImageUploader } from '../../shared/components/ImageUploader';

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
          {activeTab === 'overview' && <OverviewTab heroSlides={heroSlides} statsData={statsData} students={students} finance={finance} notices={notices} setActiveTab={setActiveTab} />}

{/* ===================== TAB 2: HERO SLIDER ===================== */}
          {activeTab === 'hero' && <HeroTab heroSlides={heroSlides} editingSlide={editingSlide} setEditingSlide={setEditingSlide} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 3: TEACHER CALL ===================== */}
          {activeTab === 'teachers' && <TeachersTab teacherMessages={teacherMessages} setEditingTeacher={setEditingTeacher} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 4: STATS & DATE ===================== */}
          {activeTab === 'stats' && <StatsTab statsData={statsData} setStatsData={setStatsData} setEditingCustomStat={setEditingCustomStat} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 5: STUDENTS DIRECTORY ===================== */}
          {activeTab === 'students' && <StudentsTab students={students} editingStudent={editingStudent} setEditingStudent={setEditingStudent} studentSearch={studentSearch} setStudentSearch={setStudentSearch} studentBatchFilter={studentBatchFilter} setStudentBatchFilter={setStudentBatchFilter} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 6: FINANCIAL CONDITION ===================== */}
          {activeTab === 'finance' && <FinanceTab finance={finance} setFinance={setFinance} setEditingTransaction={setEditingTransaction} transactionFilter={transactionFilter} setTransactionFilter={setTransactionFilter} transactionSearch={transactionSearch} setTransactionSearch={setTransactionSearch} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 7: NOTICES ===================== */}
          {activeTab === 'notices' && <NoticesTab notices={notices} editingNotice={editingNotice} setEditingNotice={setEditingNotice} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 8: SCHEDULE ===================== */}
          {activeTab === 'schedule' && <ScheduleTab schedule={schedule} editingSchedule={editingSchedule} setEditingSchedule={setEditingSchedule} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 9: CULTURAL ===================== */}
          {activeTab === 'cultural' && <CulturalTab culturalSchedule={culturalSchedule} editingCultural={editingCultural} setEditingCultural={setEditingCultural} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 10: DONORS ===================== */}
          {activeTab === 'donors' && <DonorsTab donors={donors} editingDonor={editingDonor} setEditingDonor={setEditingDonor} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 11: GALLERY ===================== */}
          {activeTab === 'gallery' && <GalleryTab gallery={gallery} editingGallery={editingGallery} setEditingGallery={setEditingGallery} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB 12: MAGAZINE ===================== */}
          {activeTab === 'magazine' && <MagazineTab magazineArticles={magazineArticles} editingArticle={editingArticle} setEditingArticle={setEditingArticle} flashMessage={flashMessage} loadAllData={loadAllData} />}

{/* ===================== TAB MONGODB CLOUD DATABASE ===================== */}
          {activeTab === 'mongodb' && <MongodbTab heroSlides={heroSlides} teacherMessages={teacherMessages} students={students} finance={finance} notices={notices} schedule={schedule} culturalSchedule={culturalSchedule} donors={donors} gallery={gallery} magazineArticles={magazineArticles} mongoStatus={mongoStatus} selectedMongoCollection={selectedMongoCollection} collectionDocs={collectionDocs} collectionLoading={collectionLoading} syncingMongo={syncingMongo} seedingDemo={seedingDemo} mongoUriInput={mongoUriInput} setMongoUriInput={setMongoUriInput} flashMessage={flashMessage} handleSyncMongo={handleSyncMongo} handleSeedDemoData={handleSeedDemoData} handleSaveMongoUri={handleSaveMongoUri} loadMongoCollectionDocs={loadMongoCollectionDocs} />}

{/* ===================== TAB 13: SETTINGS & MONGODB ===================== */}
          {activeTab === 'settings' && <SettingsTab globalConfig={globalConfig} setGlobalConfig={setGlobalConfig} mongoStatus={mongoStatus} flashMessage={flashMessage} loadAllData={loadAllData} />}

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
