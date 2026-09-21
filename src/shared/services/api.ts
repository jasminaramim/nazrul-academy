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
  User,
  UpcomingEvent,
  EmailLog,
  EmailStats,
} from '../types';
import {
  initialGlobalConfig,
  initialHeroSlides,
  initialTeacherMessages,
  initialStatsData,
  initialStudents,
  initialFinanceSummary,
  initialNotices,
  initialSchedule,
  initialCulturalSchedule,
  initialDonors,
  initialGallery,
  initialMagazineArticles,
  initialAdminInfo,
  initialUpcomingEvents,
} from '../data/initialData';

const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';


function getAuthHeaders() {
  const token = localStorage.getItem('trishal_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response, fallback: T): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `অনুরোধ ব্যর্থ হয়েছে (${res.status})`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const apiService = {
  // Generic fetch wrapper used by some admin components
  async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${import.meta.env.VITE_API_URL || ''}${endpoint}`;
    
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'নেটওয়ার্ক সমস্যা' };
    }
  },

  // Global
  async getGlobalConfig(): Promise<GlobalConfig> {
    try {
      const res = await fetch(`${BASE_URL}/global`);
      return await handleResponse<GlobalConfig>(res, initialGlobalConfig);
    } catch {
      return initialGlobalConfig;
    }
  },
  async updateGlobalConfig(data: Partial<GlobalConfig>): Promise<GlobalConfig> {
    const res = await fetch(`${BASE_URL}/global`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse<GlobalConfig>(res, initialGlobalConfig);
  },

  // Hero Slides
  async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const res = await fetch(`${BASE_URL}/hero`);
      return await handleResponse<HeroSlide[]>(res, initialHeroSlides);
    } catch {
      return initialHeroSlides;
    }
  },
  async addHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
    const res = await fetch(`${BASE_URL}/hero`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(slide),
    });
    return await handleResponse<HeroSlide>(res, {} as any);
  },
  async updateHeroSlide(id: string, slide: Partial<HeroSlide>): Promise<HeroSlide> {
    const res = await fetch(`${BASE_URL}/hero/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(slide),
    });
    return await handleResponse<HeroSlide>(res, {} as any);
  },
  async deleteHeroSlide(id: string): Promise<void> {
    await fetch(`${BASE_URL}/hero/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Teacher Messages
  async getTeacherMessages(): Promise<TeacherMessage[]> {
    try {
      const res = await fetch(`${BASE_URL}/teachers`);
      return await handleResponse<TeacherMessage[]>(res, initialTeacherMessages);
    } catch {
      return initialTeacherMessages;
    }
  },
  async addTeacherMessage(msg: Omit<TeacherMessage, 'id'>): Promise<TeacherMessage> {
    const res = await fetch(`${BASE_URL}/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(msg),
    });
    return await handleResponse<TeacherMessage>(res, {} as any);
  },
  async updateTeacherMessage(id: string, msg: Partial<TeacherMessage>): Promise<TeacherMessage> {
    const res = await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(msg),
    });
    return await handleResponse<TeacherMessage>(res, {} as any);
  },
  async deleteTeacherMessage(id: string): Promise<void> {
    await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Stats
  async getStats(): Promise<StatsData> {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      return await handleResponse<StatsData>(res, initialStatsData);
    } catch {
      return initialStatsData;
    }
  },
  async updateStats(data: Partial<StatsData>): Promise<StatsData> {
    const res = await fetch(`${BASE_URL}/stats`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse<StatsData>(res, initialStatsData);
  },

  // Check Availability
  async checkAvailability(data: { email?: string; phone?: string; transactionId?: string }): Promise<{ success: boolean; errors?: Record<string, string> }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Students
  async getStudents(params?: { batchType?: string; batch?: string; bloodGroup?: string; search?: string }): Promise<Student[]> {
    try {
      const query = new URLSearchParams();
      if (params?.batchType) query.append('batchType', params.batchType);
      if (params?.batch) query.append('batch', params.batch);
      if (params?.bloodGroup) query.append('bloodGroup', params.bloodGroup);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${BASE_URL}/students?${query.toString()}`);
      return await handleResponse<Student[]>(res, initialStudents);
    } catch {
      return initialStudents;
    }
  },
  async addStudent(student: Partial<Student>): Promise<Student> {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(student),
    });
    return await handleResponse<Student>(res, {} as any);
  },
  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(student),
    });
    return await handleResponse<Student>(res, {} as any);
  },
  async deleteStudent(id: string): Promise<void> {
    await fetch(`${BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
  async approveRegistration(id: string, cardImageData?: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/registrations/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cardImageData }),
    });
    return await res.json();
  },

  // Financial Condition
  async getFinance(): Promise<FinanceSummary> {
    try {
      const res = await fetch(`${BASE_URL}/finance`);
      return await handleResponse<FinanceSummary>(res, initialFinanceSummary);
    } catch {
      return initialFinanceSummary;
    }
  },
  async updateFinance(data: Partial<FinanceSummary>): Promise<FinanceSummary> {
    const res = await fetch(`${BASE_URL}/finance`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse<FinanceSummary>(res, initialFinanceSummary);
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    try {
      const res = await fetch(`${BASE_URL}/notices`);
      return await handleResponse<Notice[]>(res, initialNotices);
    } catch {
      return initialNotices;
    }
  },
  async addNotice(notice: Omit<Notice, 'id'>): Promise<Notice> {
    const res = await fetch(`${BASE_URL}/notices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notice),
    });
    return await handleResponse<Notice>(res, {} as any);
  },
  async updateNotice(id: string, notice: Partial<Notice>): Promise<Notice> {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(notice),
    });
    return await handleResponse<Notice>(res, {} as any);
  },
  async deleteNotice(id: string): Promise<void> {
    await fetch(`${BASE_URL}/notices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Schedule
  async getSchedule(): Promise<ScheduleItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/schedule`);
      return await handleResponse<ScheduleItem[]>(res, initialSchedule);
    } catch {
      return initialSchedule;
    }
  },
  async addScheduleItem(item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    const res = await fetch(`${BASE_URL}/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<ScheduleItem>(res, {} as any);
  },
  async updateScheduleItem(id: string, item: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const res = await fetch(`${BASE_URL}/schedule/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<ScheduleItem>(res, {} as any);
  },
  async deleteScheduleItem(id: string): Promise<void> {
    await fetch(`${BASE_URL}/schedule/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Cultural Schedule
  async getCulturalSchedule(): Promise<CulturalItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/cultural`);
      return await handleResponse<CulturalItem[]>(res, initialCulturalSchedule);
    } catch {
      return initialCulturalSchedule;
    }
  },
  async addCulturalItem(item: Omit<CulturalItem, 'id'>): Promise<CulturalItem> {
    const res = await fetch(`${BASE_URL}/cultural`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<CulturalItem>(res, {} as any);
  },
  async updateCulturalItem(id: string, item: Partial<CulturalItem>): Promise<CulturalItem> {
    const res = await fetch(`${BASE_URL}/cultural/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<CulturalItem>(res, {} as any);
  },
  async deleteCulturalItem(id: string): Promise<void> {
    await fetch(`${BASE_URL}/cultural/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Donations
  async getDonations(showAll: boolean = false): Promise<Donor[]> {
    try {
      const url = showAll ? `${BASE_URL}/donations?all=true` : `${BASE_URL}/donations`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return await handleResponse<Donor[]>(res, initialDonors);
    } catch {
      return initialDonors;
    }
  },
  async submitDonation(donationData: {
    name: string;
    nameEn?: string;
    batch?: string;
    amount: number;
    phone: string;
    email?: string;
    image?: string;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; data?: Donor }> {
    const res = await fetch(`${BASE_URL}/donations/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    });
    return await res.json();
  },
  async approveDonor(id: string): Promise<{ success: boolean; message: string; data?: Donor; emailStatus?: any }> {
    const res = await fetch(`${BASE_URL}/donations/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },
  async addDonor(donor: Omit<Donor, 'id'>): Promise<Donor> {
    const res = await fetch(`${BASE_URL}/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donor),
    });
    return await handleResponse<Donor>(res, {} as any);
  },
  async updateDonor(id: string, donor: Partial<Donor>): Promise<Donor> {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(donor),
    });
    return await handleResponse<Donor>(res, {} as any);
  },
  async deleteDonor(id: string): Promise<void> {
    await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/gallery`);
      return await handleResponse<GalleryItem[]>(res, initialGallery);
    } catch {
      return initialGallery;
    }
  },
  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const res = await fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<GalleryItem>(res, {} as any);
  },
  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await handleResponse<GalleryItem>(res, {} as any);
  },
  async deleteGalleryItem(id: string): Promise<void> {
    await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Magazine
  async getMagazineArticles(all: boolean = false): Promise<MagazineArticle[]> {
    try {
      const url = all ? `${BASE_URL}/magazine?all=true` : `${BASE_URL}/magazine`;
      const res = await fetch(url);
      return await handleResponse<MagazineArticle[]>(res, initialMagazineArticles);
    } catch {
      return initialMagazineArticles;
    }
  },
  async submitMagazineArticle(data: Partial<MagazineArticle>): Promise<any> {
    const res = await fetch(`${BASE_URL}/magazine/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res, null);
  },
  async addMagazineArticle(article: Omit<MagazineArticle, 'id'>): Promise<MagazineArticle> {
    const res = await fetch(`${BASE_URL}/magazine`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(article),
    });
    return await handleResponse<MagazineArticle>(res, {} as any);
  },
  async updateMagazineArticle(id: string, article: Partial<MagazineArticle>): Promise<MagazineArticle> {
    const res = await fetch(`${BASE_URL}/magazine/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(article),
    });
    return await handleResponse<MagazineArticle>(res, {} as any);
  },
  async deleteMagazineArticle(id: string): Promise<void> {
    await fetch(`${BASE_URL}/magazine/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
  
  // File Upload
  async uploadImage(base64Str: string): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ image: base64Str }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  uploadMediaWithProgress(
    base64Str: string,
    onProgress: (percent: number) => void
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/upload`, true);
      
      const headers = getAuthHeaders();
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Increase timeout for large video uploads (e.g., 5 minutes)
      xhr.timeout = 300000;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve({ success: false, message: 'Invalid response from server' });
          }
        } else {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ success: false, message: response.message || `Upload failed with status ${xhr.status}` });
          } catch (e) {
            resolve({ success: false, message: `Upload failed with status ${xhr.status}` });
          }
        }
      };

      xhr.onerror = () => {
        resolve({ success: false, message: 'Network error occurred during upload' });
      };

      xhr.ontimeout = () => {
        resolve({ success: false, message: 'Upload timed out. Please try a smaller file or faster connection.' });
      };

      xhr.send(JSON.stringify({ image: base64Str }));
    });
  },

  // Auth & Verification
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string; code?: string }> {
    const res = await fetch(`${BASE_URL}/auth/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },
  async verifyOtp(email: string, code: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return await res.json();
  },
  async checkStudentStatus(phone: string, password: string): Promise<{ success: boolean; status?: string; name?: string; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/check-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: 'সার্ভার সংযোগে ত্রুটি' };
    }
  },

  // Admin Info
  async getAdminInfo(): Promise<AdminInfo> {
    try {
      const res = await fetch(`${BASE_URL}/admin/info`);
      return await handleResponse<AdminInfo>(res, initialAdminInfo);
    } catch {
      return initialAdminInfo;
    }
  },
  async updateAdminInfo(info: Partial<AdminInfo>): Promise<AdminInfo> {
    const res = await fetch(`${BASE_URL}/admin/info`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(info),
    });
    return await handleResponse<AdminInfo>(res, initialAdminInfo);
  },

  // System / Mongo
  async getMongoStatus(): Promise<{
    success: boolean;
    connected: boolean;
    database?: string;
    cluster?: string;
    mongoUri?: string;
    storageType: string;
    lastSync?: string | null;
    error?: string | null;
    collections?: Array<{ name: string; label: string; count: number }>;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/system/mongo-config`);
      return await res.json();
    } catch {
      return {
        success: false,
        connected: false,
        storageType: 'লোকাল স্টোরেজ (সক্রিয়)',
        collections: [],
      };
    }
  },
  async updateMongoConfig(mongoUri: string): Promise<{ success: boolean; message: string; status?: any }> {
    const res = await fetch(`${BASE_URL}/system/mongo-config`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mongoUri }),
    });
    return await res.json();
  },
  async syncMongo(): Promise<{ success: boolean; message: string; status?: any }> {
    const res = await fetch(`${BASE_URL}/system/mongo-sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },
  async seedDemoData(): Promise<{ success: boolean; message: string; status?: any }> {
    const res = await fetch(`${BASE_URL}/system/seed-demo-data`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },
  async getMongoCollectionDocs(
    collectionName: string
  ): Promise<{ success: boolean; collection: string; count: number; documents: any[] }> {
    const res = await fetch(`${BASE_URL}/system/mongo-collections/${collectionName}`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // Upcoming Events / Activity Posters
  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    try {
      const res = await fetch(`${BASE_URL}/upcoming-events`);
      return await handleResponse<UpcomingEvent[]>(res, []);
    } catch {
      return [];
    }
  },
  async addUpcomingEvent(event: Omit<UpcomingEvent, 'id'>): Promise<UpcomingEvent> {
    const res = await fetch(`${BASE_URL}/upcoming-events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(event),
    });
    return await handleResponse<UpcomingEvent>(res, {} as any);
  },
  async updateUpcomingEvent(id: string, event: Partial<UpcomingEvent>): Promise<UpcomingEvent> {
    const res = await fetch(`${BASE_URL}/upcoming-events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(event),
    });
    return await handleResponse<UpcomingEvent>(res, {} as any);
  },
  async deleteUpcomingEvent(id: string): Promise<void> {
    await fetch(`${BASE_URL}/upcoming-events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Email Logs & Resend
  async getEmailLogs(params?: { status?: string; type?: string; search?: string }): Promise<EmailLog[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.type && params.type !== 'all') query.set('type', params.type);
      if (params?.search) query.set('search', params.search);

      const qs = query.toString();
      const res = await fetch(`${BASE_URL}/emails/logs${qs ? '?' + qs : ''}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse<EmailLog[]>(res, []);
    } catch {
      return [];
    }
  },
  async getEmailStats(): Promise<EmailStats> {
    try {
      const res = await fetch(`${BASE_URL}/emails/stats`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse<EmailStats>(res, { total: 0, sent: 0, failed: 0, pending: 0, successRate: 100 });
    } catch {
      return { total: 0, sent: 0, failed: 0, pending: 0, successRate: 100 };
    }
  },
  async resendEmail(id: string): Promise<{ success: boolean; message: string; data?: EmailLog }> {
    const res = await fetch(`${BASE_URL}/emails/logs/${id}/resend`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },
  async deleteEmailLog(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/emails/logs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },
};
