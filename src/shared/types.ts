export interface User {
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  role: 'admin' | 'alumni' | 'student';
  phone?: string;
  bloodGroup?: string;
  batch?: string;
  location?: string;
  school?: string;
  currentJob?: string;
  company?: string;
  image?: string;
  familyMembersCount?: number;
  tshirtSize?: string;
  status?: 'approved' | 'pending' | 'rejected';
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badgeText?: string;
  order: number;
}

export interface TeacherMessage {
  id: string;
  name: string;
  designation: string;
  schoolName: string;
  image: string;
  heading: string;
  bismillahText?: string;
  greeting?: string;
  description: string;
  order: number;
}

export interface CustomStatItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  icon?: string;
  note?: string;
  order?: number;
}

export interface StatsData {
  registeredStudents: number;
  familyMembersCount: number;
  festivalDate: string; // e.g. "২০২৬-০৩-২৬"
  festivalTime: string; // e.g. "সকাল ০৯:০০ টা"
  festivalTitle?: string;
  customStats?: CustomStatItem[];
}

export interface Student {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  batch: string; // e.g. "ব্যাচ ২০১১" or "২০১১"
  batchType: 'new' | 'old';
  location: string;
  bloodGroup: string;
  phone?: string;
  email?: string;
  school: string;
  currentJob?: string;
  company?: string;
  tshirtSize?: string;
  familyMembersCount?: number;
  bio?: string;
  status: 'approved' | 'pending';
}

export interface FinanceTransaction {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  voucherNo?: string;
  note?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  manualTotalIncome?: number;
  manualTotalExpense?: number;
  totalDonations?: number;
  incomeSource?: 'donations' | 'manual';
  lastUpdated?: string;
  breakdown?: {
    incomeCategories: { category: string; amount: number }[];
    expenseCategories: { category: string; amount: number }[];
  };
  transactions?: FinanceTransaction[];
}

export interface Notice {
  id: string;
  category: string;
  title: string;
  image?: string;
  shortDescription: string;
  description: string;
  date: string;
  priority: 'উচ্চ' | 'সাধারণ' | 'জরুরি';
  author?: string;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  category: string;
  title: string;
  shortDescription: string;
  isCultural?: boolean;
  order: number;
}

export interface CulturalItem {
  id: string;
  timeSlot: string;
  category: string;
  title: string;
  performers?: string;
  description: string;
}

export interface Donor {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  batch: string;
  amount: number;
  category?: string;
  quote?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: string;
  url: string;
  thumbnailUrl?: string;
  date?: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  authorBatch?: string;
  category: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  date: string;
  pdfUrl?: string;
}

export interface GlobalConfig {
  siteTitle: string;
  siteSubtitle: string;
  logoUrl: string;
  schoolName: string;
  schoolEstablished: string;
  contactPhone1: string;
  contactPhone2: string;
  contactEmail: string;
  address: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  registrationOpen: boolean;
}

export interface AdminInfo {
  name: string;
  photo: string;
  designation: string;
  location: string;
  phoneNumber: string;
  bloodGroup: string;
  email: string;
}

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank' | 'other';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  accountType: string; // e.g. 'মার্চেন্ট', 'পার্সোনাল', 'এজেন্ট', 'সেভিংস / কারেন্ট'
  accountNumber: string; // e.g. '০১৭১২-৩৪৫৬৭৮'
  accountName?: string; // e.g. 'ত্রিশাল নজরুল একাডেমি অ্যালামনাই'
  bankName?: string; // e.g. 'সোনালী ব্যাংক লিমিটেড'
  branchName?: string; // e.g. 'ত্রিশাল শাখা, ময়মনসিংহ'
  routingNumber?: string;
  qrCodeUrl?: string; // Custom uploaded QR image URL
  instructions?: string; // e.g. 'রেফারেন্সে আপনার নাম ও ব্যাচ লিখুন।'
  isActive: boolean;
  order: number;
}

export interface PaymentConfig {
  modalTitle: string;
  modalSubtitle: string;
  helplinePhone: string;
  helplineText: string;
  referenceInstruction: string;
  methods: PaymentMethod[];
}

