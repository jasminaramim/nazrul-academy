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
  image?: string;
  batch?: string;
  amount: number;
  category?: string;
  quote?: string;
  phone?: string;
  email?: string;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'bank' | string;
  senderNumber?: string;
  transactionId?: string;
  message?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
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
  cardBackgroundUrl?: string;
  cardTitle?: string;
  cardSubtitle1?: string;
  cardSubtitle2?: string;
  cardQuote?: string;
  cardFooterText?: string;
  registrationOpen: boolean;
  feeOldBatch?: number;
  feeNewBatch?: number;
  maxRegistrations?: number;
  // Payment accounts configuration
  bkashNumber?: string;
  bkashType?: string;
  bkashAction?: string; // 'send_money' | 'cash_out' | 'payment'
  bkashLimitOut?: boolean;
  nagadNumber?: string;
  nagadType?: string;
  nagadAction?: string; // 'send_money' | 'cash_out' | 'payment'
  nagadLimitOut?: boolean;
  rocketNumber?: string;
  rocketType?: string;
  rocketAction?: string; // 'send_money' | 'cash_out' | 'payment'
  rocketLimitOut?: boolean;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  bankRoutingNumber?: string;
}

export interface AdminInfo {
  id?: string;
  name: string;
  role?: string;
  photo?: string;
  image?: string;
  designation?: string;
  location?: string;
  phone?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  email: string;
  lastLogin?: string;
}

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank' | 'other' | string;

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
  modalTitle?: string;
  modalSubtitle?: string;
  helplinePhone?: string;
  helplineText?: string;
  referenceInstruction?: string;
  methods?: PaymentMethod[];
  options?: any[];
}

export interface UpcomingEvent {
  id: string;
  title: string;              // কি ইভেন্ট / অনুষ্ঠানের নাম
  eventDate: string;          // YYYY-MM-DD
  eventTime?: string;         // সময় (e.g. সকাল ১০:০০ টা)
  dateTime?: string;          // ISO String or Date
  location: string;           // স্থান
  details: string;            // বিস্তারিত বিবরণ
  image?: string;             // পোস্টার বা ব্যানার ছবি
  chiefGuest?: string;        // প্রধান অতিথি (ঐচ্ছিক)
  specialAttraction?: string; // বিশেষ আকর্ষণ (ঐচ্ছিক)
  isActive?: boolean;         // সক্রিয় / নিষ্ক্রিয়
  showPopup?: boolean;        // ওয়েবসাইটে বড় পোস্টার হিসেবে পপআপ হবে কিনা
  createdAt?: string;
  updatedAt?: string;
}

export type EmailLogType = 'donation_approval' | 'student_approval' | 'otp_verification' | 'other';
export type EmailLogStatus = 'sent' | 'failed' | 'pending';

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  type: EmailLogType;
  subject: string;
  relatedId?: string;
  status: EmailLogStatus;
  attempts: number;
  lastAttemptAt: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  htmlContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  successRate: number;
}
