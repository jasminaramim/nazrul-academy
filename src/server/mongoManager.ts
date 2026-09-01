import { MongoClient, Db } from 'mongodb';

export interface MongoCollectionInfo {
  name: string;
  label: string;
  count: number;
}

export interface MongoSystemStatus {
  connected: boolean;
  database: string;
  cluster: string;
  mongoUriConfigured: boolean;
  storageType: string;
  lastSync: string | null;
  error: string | null;
  collections: MongoCollectionInfo[];
}

export function cleanMongoUri(inputUri: string): string {
  if (!inputUri) return '';
  let uri = inputUri.trim();

  // Match mongodb+srv://... or mongodb://...
  const match = uri.match(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@(.+)/);
  if (match) {
    const protocol = match[1] ? 'mongodb+srv' : 'mongodb';
    let user = match[2].trim();
    let pass = match[3].trim();
    let rest = match[4].trim();

    // Strip wrapping < > if user typed <Trishal> or <Password>
    if (user.startsWith('<') && user.endsWith('>')) {
      user = user.slice(1, -1);
    }
    if (pass.startsWith('<') && pass.endsWith('>')) {
      pass = pass.slice(1, -1);
    }

    // Safely encode special characters in password (like /, ?, #, !)
    try {
      if (decodeURIComponent(pass) === pass) {
        pass = encodeURIComponent(pass);
      }
    } catch {
      pass = encodeURIComponent(pass);
    }

    let hostPart = rest;
    let queryPart = '';
    if (rest.includes('?')) {
      const qSplit = rest.split('?');
      hostPart = qSplit[0];
      queryPart = '?' + qSplit[1];
    }

    if (!hostPart.includes('/')) {
      hostPart = `${hostPart}/trishal_nazrul_academy`;
    } else if (hostPart.endsWith('/')) {
      hostPart = `${hostPart}trishal_nazrul_academy`;
    }

    return `${protocol}://${user}:${pass}@${hostPart}${queryPart}`;
  }

  return uri;
}

// User-provided credentials formatted for Atlas
export const DEFAULT_MONGODB_URI = process.env.MONGODB_URI || '';

class MongoManager {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connected: boolean = false;
  private currentUri: string = '';
  private lastSyncTime: string | null = null;
  private lastError: string | null = null;
  private dbName: string = 'trishal_nazrul_academy';
  private clusterHost: string = 'cluster0.ssmpl.mongodb.net';

  public isConnected(): boolean {
    return this.connected;
  }

  public getDb(): Db | null {
    return this.db;
  }

  public async connect(rawUri: string = DEFAULT_MONGODB_URI): Promise<{ success: boolean; message: string }> {
    const sanitizedUri = cleanMongoUri(rawUri);
    if (!sanitizedUri) {
      this.connected = false;
      this.lastError = 'MongoDB URI প্রদান করা হয়নি';
      return { success: false, message: 'MongoDB URI প্রদান করা হয়নি' };
    }

    this.currentUri = sanitizedUri;

    try {
      if (this.client) {
        try {
          await this.client.close();
        } catch {
          // ignore close error
        }
      }

      this.client = new MongoClient(sanitizedUri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });

      await this.client.connect();

      // Extract dbName from URI
      const uriMatch = sanitizedUri.match(/\/([^/?]+)(\?|$)/);
      if (uriMatch && uriMatch[1]) {
        this.dbName = uriMatch[1];
      } else {
        this.dbName = 'trishal_nazrul_academy';
      }

      // Extract host from URI
      const hostMatch = sanitizedUri.match(/@([^/?]+)/);
      if (hostMatch && hostMatch[1]) {
        this.clusterHost = hostMatch[1];
      }

      this.db = this.client.db(this.dbName);

      // Ping to verify connection
      await this.db.command({ ping: 1 });

      this.connected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toISOString();

      console.log(`[MongoDB] সফলভাবে সংযুক্ত: ${this.dbName} on ${this.clusterHost}`);
      return { success: true, message: `MongoDB সফলভাবে সংযুক্ত হয়েছে (${this.dbName})` };
    } catch (err: any) {
      this.connected = false;
      this.lastError = err.message || 'MongoDB সংযোগ ব্যর্থ হয়েছে';
      console.error('[MongoDB] Connection error:', err.message);
      return { success: false, message: `MongoDB সংযোগে ত্রুটি: ${err.message}` };
    }
  }

  public async syncAllToMongo(store: any): Promise<{ success: boolean; syncedCollections: number }> {
    if (!this.connected || !this.db) {
      return { success: false, syncedCollections: 0 };
    }

    try {
      const collectionsMap: Record<string, any[]> = {
        users: store.users || [],
        students: store.students || [],
        teachers: store.teacherMessages || [],
        hero_slides: store.heroSlides || [],
        notices: store.notices || [],
        schedule: store.schedule || [],
        cultural_schedule: store.culturalSchedule || [],
        donations: store.donors || [],
        gallery: store.gallery || [],
        magazine: store.magazineArticles || [],
      };

      for (const [colName, items] of Object.entries(collectionsMap)) {
        if (Array.isArray(items) && items.length > 0) {
          const col = this.db.collection(colName);
          for (const item of items) {
            const query = { id: item.id };
            const docWithId = { ...item, _id: item.id, updatedAt: new Date().toISOString() };
            await col.updateOne(query, { $set: docWithId }, { upsert: true });
          }
        }
      }

      // Sync singular config documents
      if (store.financeSummary) {
        await this.db.collection('finance').updateOne(
          { _id: 'finance_summary' as any },
          { $set: { ...store.financeSummary, _id: 'finance_summary', updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      if (store.globalConfig) {
        await this.db.collection('global_config').updateOne(
          { _id: 'site_config' as any },
          { $set: { ...store.globalConfig, _id: 'site_config', updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      if (store.adminInfo) {
        await this.db.collection('admin_info').updateOne(
          { _id: 'admin_profile' as any },
          { $set: { ...store.adminInfo, _id: 'admin_profile', updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      if (store.statsData) {
        await this.db.collection('stats').updateOne(
          { _id: 'event_stats' as any },
          { $set: { ...store.statsData, _id: 'event_stats', updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      this.lastSyncTime = new Date().toISOString();
      return { success: true, syncedCollections: Object.keys(collectionsMap).length + 4 };
    } catch (err: any) {
      console.error('[MongoDB] Sync error:', err);
      this.lastError = err.message;
      return { success: false, syncedCollections: 0 };
    }
  }

  public async loadAllFromMongo(): Promise<any | null> {
    if (!this.connected || !this.db) return null;

    try {
      const users = await this.db.collection('users').find({}).toArray();
      const students = await this.db.collection('students').find({}).toArray();
      const teacherMessages = await this.db.collection('teachers').find({}).toArray();
      const heroSlides = await this.db.collection('hero_slides').find({}).toArray();
      const notices = await this.db.collection('notices').find({}).toArray();
      const schedule = await this.db.collection('schedule').find({}).toArray();
      const culturalSchedule = await this.db.collection('cultural_schedule').find({}).toArray();
      const donors = await this.db.collection('donations').find({}).toArray();
      const gallery = await this.db.collection('gallery').find({}).toArray();
      const magazineArticles = await this.db.collection('magazine').find({}).toArray();

      const financeDoc = await this.db.collection('finance').findOne({ _id: 'finance_summary' as any });
      const globalConfigDoc = await this.db.collection('global_config').findOne({ _id: 'site_config' as any });
      const adminInfoDoc = await this.db.collection('admin_info').findOne({ _id: 'admin_profile' as any });
      const statsDoc = await this.db.collection('stats').findOne({ _id: 'event_stats' as any });

      const loaded: any = {};
      if (users.length > 0) loaded.users = users;
      if (students.length > 0) loaded.students = students;
      if (teacherMessages.length > 0) loaded.teacherMessages = teacherMessages;
      if (heroSlides.length > 0) loaded.heroSlides = heroSlides;
      if (notices.length > 0) loaded.notices = notices;
      if (schedule.length > 0) loaded.schedule = schedule;
      if (culturalSchedule.length > 0) loaded.culturalSchedule = culturalSchedule;
      if (donors.length > 0) loaded.donors = donors;
      if (gallery.length > 0) loaded.gallery = gallery;
      if (magazineArticles.length > 0) loaded.magazineArticles = magazineArticles;

      if (financeDoc) loaded.financeSummary = financeDoc;
      if (globalConfigDoc) loaded.globalConfig = globalConfigDoc;
      if (adminInfoDoc) loaded.adminInfo = adminInfoDoc;
      if (statsDoc) loaded.statsData = statsDoc;

      return loaded;
    } catch (err: any) {
      console.error('[MongoDB] Load error:', err);
      return null;
    }
  }

  public async getStatus(): Promise<MongoSystemStatus> {
    const colDefinitions = [
      { name: 'users', label: 'ব্যবহারকারী ও অ্যাডমিন (Users & Admin)' },
      { name: 'students', label: 'নিবন্ধিত প্রাক্তন শিক্ষার্থী (Alumni Directory)' },
      { name: 'teachers', label: 'শ্রদ্ধেয় শিক্ষকবৃন্দ (Teachers List)' },
      { name: 'hero_slides', label: 'হিরো ব্যানার স্লাইড (Hero Slides)' },
      { name: 'notices', label: 'সর্বশেষ নোটিশ ও ঘোষণা (Notices)' },
      { name: 'schedule', label: 'অনুষ্ঠান সময়সূচি (Event Timeline)' },
      { name: 'cultural_schedule', label: 'সাংস্কৃতিক পরিবেশনা (Cultural Events)' },
      { name: 'donations', label: 'সম্মানিত দাতা ও অনুদান (Donors)' },
      { name: 'gallery', label: 'ছবি ও ভিডিও অ্যালবাম (Gallery)' },
      { name: 'magazine', label: 'স্মৃতির পাতা প্রবন্ধ ও কবিতা (Magazine)' },
      { name: 'finance', label: 'আর্থিক হিসাব বিবরণী (Financial Summary)' },
      { name: 'global_config', label: 'ওয়েবসাইট ও ইভেন্ট কনফিগ (Site Config)' },
      { name: 'admin_info', label: 'অ্যাডমিন প্রোফাইল তথ্য (Admin Profile)' },
      { name: 'stats', label: 'রেজিস্ট্রেশন ও ইভেন্ট পরিসংখ্যান (Stats)' },
    ];

    const collectionsInfo: MongoCollectionInfo[] = [];

    if (this.connected && this.db) {
      for (const col of colDefinitions) {
        try {
          const count = await this.db.collection(col.name).countDocuments();
          collectionsInfo.push({
            name: col.name,
            label: col.label,
            count,
          });
        } catch {
          collectionsInfo.push({
            name: col.name,
            label: col.label,
            count: 0,
          });
        }
      }
    } else {
      for (const col of colDefinitions) {
        collectionsInfo.push({
          name: col.name,
          label: col.label,
          count: 0,
        });
      }
    }

    return {
      connected: this.connected,
      database: this.dbName,
      cluster: this.clusterHost,
      mongoUriConfigured: Boolean(this.currentUri),
      storageType: this.connected ? `MongoDB Cloud (${this.dbName})` : 'লোকাল ফাইল ব্যাকআপ (Local Storage Fallback)',
      lastSync: this.lastSyncTime,
      error: this.lastError,
      collections: collectionsInfo,
    };
  }

  public async getCollectionDocuments(collectionName: string, limit: number = 50): Promise<any[]> {
    if (!this.connected || !this.db) return [];
    try {
      return await this.db.collection(collectionName).find({}).limit(limit).toArray();
    } catch (err: any) {
      console.error(`[MongoDB] Error reading collection ${collectionName}:`, err);
      return [];
    }
  }

  public async upsertItem(collectionName: string, item: any): Promise<void> {
    if (!this.connected || !this.db || !item) return;
    try {
      const col = this.db.collection(collectionName);
      const query = item.id ? { id: item.id } : { _id: item._id };
      await col.updateOne(
        query,
        { $set: { ...item, _id: item.id || item._id, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err) {
      console.error(`[MongoDB] Upsert error in ${collectionName}:`, err);
    }
  }

  public async deleteItem(collectionName: string, id: string): Promise<void> {
    if (!this.connected || !this.db || !id) return;
    try {
      const col = this.db.collection(collectionName);
      await col.deleteOne({ $or: [{ id }, { _id: id as any }] });
    } catch (err) {
      console.error(`[MongoDB] Delete error in ${collectionName}:`, err);
    }
  }
}

export const mongoManager = new MongoManager();
