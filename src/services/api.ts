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
} from '../data/initialData';

const BASE_URL = '/api';

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
  async getDonations(): Promise<Donor[]> {
    try {
      const res = await fetch(`${BASE_URL}/donations`);
      return await handleResponse<Donor[]>(res, initialDonors);
    } catch {
      return initialDonors;
    }
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
  async getMagazineArticles(): Promise<MagazineArticle[]> {
    try {
      const res = await fetch(`${BASE_URL}/magazine`);
      return await handleResponse<MagazineArticle[]>(res, initialMagazineArticles);
    } catch {
      return initialMagazineArticles;
    }
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
};
