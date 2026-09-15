import {
  GlobalConfig,
  HeroSlide,
  TeacherMessage,
  StatsData,
  Student,
  FinanceSummary,
  Notice,
  ScheduleItem,
  CulturalItem,
  Donor,
  GalleryItem,
  MagazineArticle,
  AdminInfo,
  PaymentConfig,
} from '../types';

export const initialGlobalConfig: GlobalConfig = {
  siteTitle: 'ত্রিশাল সরকারি নজরুল একাডেমি',
  siteSubtitle: 'প্রাক্তন ছাত্র-ছাত্রী অ্যালামনাই অ্যাসোসিয়েশন ও পুনর্মিলনী উৎসব ২০২৬',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/bn/thumb/8/87/%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%B6%E0%A6%BE%E0%A6%B2_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%A8%E0%A6%9C%E0%A6%B0%E0%A7%81%E0%A6%B2_%E0%A6%8F%E0%A6%95%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%AE%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png/250px-%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%B6%E0%A6%BE%E0%A6%B2_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%A8%E0%A6%9C%E0%A6%B0%E0%A7%81%E0%A6%B2_%E0%A6%8F%E0%A6%95%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%AE%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png',
  schoolName: 'ত্রিশাল সরকারি নজরুল একাডেমি',
  schoolEstablished: '১৯১৩ খ্রি.',
  contactPhone1: '+880 1797-585073',
  contactPhone2: '+880 1708-859491',
  contactEmail: 'info@trishalnazrulacademy.edu.bd',
  address: 'নজরুল রোড, ত্রিশাল, ময়মনসিংহ - ২২২০, বাংলাদেশ',
  facebookUrl: 'https://facebook.com/trishalnazrulacademy',
  youtubeUrl: 'https://youtube.com',
  registrationOpen: true,
};

export const initialHeroSlides: HeroSlide[] = [];
export const initialTeacherMessages: TeacherMessage[] = [];
export const initialStatsData: StatsData = {
  registeredStudents: 0,
  festivalDate: '২০২৬-০৩-২৬',
  festivalTime: 'সকাল ০৯:০০ টা',
  festivalTitle: 'পুনর্মিলনী ও বসন্ত উৎসব ২০২৬',
  customStats: [],
};
export const initialStudents: Student[] = [];
export const initialFinanceSummary: FinanceSummary = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  lastUpdated: '২০২৬-০৮-৩১',
  breakdown: { incomeCategories: [], expenseCategories: [] },
  transactions: [],
};
export const initialNotices: Notice[] = [];
export const initialSchedule: ScheduleItem[] = [];
export const initialCulturalSchedule: CulturalItem[] = [];
export const initialDonors: Donor[] = [];
export const initialGallery: GalleryItem[] = [];
export const initialMagazineArticles: MagazineArticle[] = [];

export const initialAdminInfo: AdminInfo = {
  id: 'admin-1',
  name: 'Jasmin (প্রধান প্রশাসক)',
  role: 'super_admin',
  email: 'jasmin@gmail.com',
  phone: '01613475871',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmin',
  lastLogin: '2026-08-30T10:30:00Z',
};

export const initialPaymentConfig: PaymentConfig = {
  options: [
    {
      id: 'pay-bkash',
      type: 'mobile_banking',
      title: 'বিকাশ',
      accountType: 'পার্সোনাল',
      accountNumber: '01712-345678',
      instructions: 'বিকাশ অ্যাপ দিয়ে QR স্ক্যান করুন অথবা Send Money করুন।',
      isActive: true,
      order: 1,
    },
    {
      id: 'pay-nagad',
      type: 'mobile_banking',
      title: 'নগদ',
      accountType: 'পার্সোনাল',
      accountNumber: '01712-345678',
      instructions: 'Nagad অ্যাপ দিয়ে QR স্ক্যান করুন অথবা Send Money করুন।',
      isActive: true,
      order: 2,
    },
    {
      id: 'pay-bank',
      type: 'bank',
      title: 'সোনালী ব্যাংক লিমিটেড',
      accountType: 'চলতি / সঞ্চয়ী হিসাব',
      accountNumber: '2050 1234 5678 9012',
      accountName: 'ত্রিশাল নজরুল একাডেমি অ্যালামনাই',
      bankName: 'সোনালী ব্যাংক লিমিটেড',
      branchName: 'ত্রিশাল শাখা, ময়মনসিংহ',
      routingNumber: '200271234',
      instructions: 'সরাসরি ব্যাংক ডিপোজিট অথবা অনলাইন ফান্ড ট্রান্সফার (NPSB / BEFTN / RTGS)।',
      isActive: true,
      order: 3,
    },
  ],
};
