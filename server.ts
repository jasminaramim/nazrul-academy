import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
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
} from './src/data/initialData';
import { mongoManager, DEFAULT_MONGODB_URI } from './src/server/mongoManager';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'trishal-nazrul-academy-secret-key-2026';
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial in-memory & file-backed store
interface DBStore {
  users: any[];
  globalConfig: any;
  heroSlides: any[];
  teacherMessages: any[];
  statsData: any;
  students: any[];
  financeSummary: any;
  notices: any[];
  schedule: any[];
  culturalSchedule: any[];
  donors: any[];
  gallery: any[];
  magazineArticles: any[];
  adminInfo: any;
  mongoUri?: string;
}

function loadInitialStore(): DBStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        users: parsed.users || [],
        globalConfig: parsed.globalConfig || initialGlobalConfig,
        heroSlides: parsed.heroSlides || initialHeroSlides,
        teacherMessages: parsed.teacherMessages || initialTeacherMessages,
        statsData: parsed.statsData || initialStatsData,
        students: parsed.students || initialStudents,
        financeSummary: parsed.financeSummary || initialFinanceSummary,
        notices: parsed.notices || initialNotices,
        schedule: parsed.schedule || initialSchedule,
        culturalSchedule: parsed.culturalSchedule || initialCulturalSchedule,
        donors: parsed.donors || initialDonors,
        gallery: parsed.gallery || initialGallery,
        magazineArticles: parsed.magazineArticles || initialMagazineArticles,
        adminInfo: parsed.adminInfo || initialAdminInfo,
        mongoUri: parsed.mongoUri || DEFAULT_MONGODB_URI,
      };
    }
  } catch (err) {
    console.error('Failed to read data store file, using defaults:', err);
  }

  // Pre-seed the Jasmin admin user
  const jasminPasswordHash = bcrypt.hashSync('jasmin1142005', 10);
  const defaultAdmin = {
    id: 'usr-admin-jasmin',
    name: 'Jasmin (প্রধান প্রশাসক)',
    nameEn: 'Jasmin',
    username: 'jasmin',
    email: 'jasmin@nazrulacademy.edu.bd',
    passwordHash: jasminPasswordHash,
    role: 'admin',
    phone: '+880 1797-585073',
    bloodGroup: 'B+',
    batch: '২০০৫',
    location: 'ত্রিশাল, ময়মনসিংহ',
    school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
    currentJob: 'প্রধান আইটি প্রশাসক',
    company: 'অ্যালামনাই আইটি সেল',
    status: 'approved',
    createdAt: new Date().toISOString(),
  };

  const initialData: DBStore = {
    users: [defaultAdmin],
    globalConfig: initialGlobalConfig,
    heroSlides: initialHeroSlides,
    teacherMessages: initialTeacherMessages,
    statsData: initialStatsData,
    students: initialStudents,
    financeSummary: initialFinanceSummary,
    notices: initialNotices,
    schedule: initialSchedule,
    culturalSchedule: initialCulturalSchedule,
    donors: initialDonors,
    gallery: initialGallery,
    magazineArticles: initialMagazineArticles,
    adminInfo: initialAdminInfo,
    mongoUri: DEFAULT_MONGODB_URI,
  };

  saveStore(initialData);
  return initialData;
}

let db: DBStore = loadInitialStore();

// Ensure Jasmin admin user exists and is up to date in active store
(() => {
  const jasminHash = bcrypt.hashSync('jasmin1142005', 10);
  const existingJasminIndex = db.users.findIndex(
    (u) =>
      u.username === 'jasmin' ||
      u.email?.toLowerCase() === 'jasmin' ||
      u.email?.toLowerCase() === 'jasmin@nazrulacademy.edu.bd'
  );

  if (existingJasminIndex >= 0) {
    db.users[existingJasminIndex].passwordHash = jasminHash;
    db.users[existingJasminIndex].role = 'admin';
    db.users[existingJasminIndex].username = 'jasmin';
  } else {
    const jasminAdmin = {
      id: 'usr-admin-jasmin',
      name: 'Jasmin (প্রধান প্রশাসক)',
      nameEn: 'Jasmin',
      username: 'jasmin',
      email: 'jasmin@nazrulacademy.edu.bd',
      passwordHash: jasminHash,
      role: 'admin',
      phone: '+880 1797-585073',
      bloodGroup: 'B+',
      batch: '২০০৫',
      location: 'ত্রিশাল, ময়মনসিংহ',
      school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
      currentJob: 'প্রধান আইটি প্রশাসক',
      company: 'অ্যালামনাই আইটি সেল',
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    db.users.unshift(jasminAdmin);
  }
  saveStore();
})();

function saveStore(dataToSave: DBStore = db) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    // Also mirror to MongoDB asynchronously
    if (mongoManager.isConnected()) {
      mongoManager.syncAllToMongo(dataToSave).catch((err) => {
        console.error('[MongoDB] Auto-sync failed:', err);
      });
    }
  } catch (err) {
    console.error('Failed to write store file:', err);
  }
}

// Authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'অনুমোদন প্রয়োজন (টোকেন পাওয়া যায়নি)' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'টোকেন অকার্যকর বা মেয়াদোত্তীর্ণ' });
    }
    req.user = decoded;
    next();
  });
}

function requireAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'শুধুমাত্র অ্যাডমিনদের জন্য অনুমতি প্রাপ্ত' });
  }
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Temporary OTP store
  const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};

  // --- Auth APIs ---
  app.post('/api/auth/send-verification', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'সঠিক ইমেইল ঠিকানা প্রদান করুন' });
      }

      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে' });
      }

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodes[email.toLowerCase()] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
      };

      console.log(`[Verification] OTP for ${email}: ${code}`);

      res.json({
        success: true,
        message: `একটি ৬-সংখ্যার ভেরিফিকেশন কোড (${code}) ${email} এ পাঠানো হয়েছে।`,
        code, // Provided for user convenience in development & preview environments
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'ভেরিফিকেশন কোড পাঠাতে সমস্যা হয়েছে' });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, message: 'ইমেইল এবং কোড প্রদান করুন' });
      }

      const record = verificationCodes[email.toLowerCase()];
      if (!record) {
        return res.status(400).json({ success: false, message: 'কোনো ভেরিফিকেশন কোড পাওয়া যায়নি। পুনরায় পাঠান।' });
      }

      if (Date.now() > record.expiresAt) {
        return res.status(400).json({ success: false, message: 'কোডের মেয়াদ শেষ হয়ে গেছে। নতুন কোড নিন।' });
      }

      if (record.code !== code.toString().trim()) {
        return res.status(400).json({ success: false, message: 'ভুল ভেরিফিকেশন কোড। সঠিক কোড দিন।' });
      }

      // Valid OTP
      delete verificationCodes[email.toLowerCase()];
      res.json({ success: true, message: 'ইমেইল সফলভাবে যাচাই হয়েছে' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'কোড যাচাইয়ে সমস্যা হয়েছে' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const {
        email,
        password,
        name,
        nameEn,
        bloodGroup,
        batch,
        location,
        school,
        currentJob,
        company,
        image,
        phone,
        familyMembersCount,
        tshirtSize,
      } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'ইমেইল, পাসওয়ার্ড এবং নাম আবশ্যক' });
      }

      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const isBatchOld = parseInt(batch?.replace(/\D/g, '') || '2026', 10) < 2011;

      const newUser = {
        id: 'usr-' + Date.now(),
        email: email.toLowerCase(),
        passwordHash,
        name,
        nameEn: nameEn || name,
        role: 'alumni',
        bloodGroup: bloodGroup || 'O+',
        batch: batch?.includes('ব্যাচ') ? batch : `ব্যাচ ${batch || '২০১০'}`,
        location: location || 'ত্রিশাল, ময়মনসিংহ',
        school: school || 'ত্রিশাল সরকারি নজরুল একাডেমি',
        currentJob: currentJob || 'পেশাজীবী',
        company: company || '',
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        phone: phone || '',
        familyMembersCount: Number(familyMembersCount) || 0,
        tshirtSize: tshirtSize || 'L',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);

      // Add to public student list automatically
      const newStudent = {
        id: 'std-' + Date.now(),
        name: newUser.name,
        nameEn: newUser.nameEn,
        image: newUser.image,
        batch: newUser.batch,
        batchType: isBatchOld ? 'old' : 'new',
        location: newUser.location,
        bloodGroup: newUser.bloodGroup,
        phone: newUser.phone,
        email: newUser.email,
        school: newUser.school,
        currentJob: newUser.currentJob,
        company: newUser.company,
        tshirtSize: newUser.tshirtSize,
        familyMembersCount: newUser.familyMembersCount,
        status: 'approved',
      };

      db.students.unshift(newStudent);
      db.statsData.registeredStudents += 1;
      if (newUser.familyMembersCount) {
        db.statsData.familyMembersCount += newUser.familyMembersCount;
      }

      saveStore();

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'সফলভাবে নিবন্ধন সম্পন্ন হয়েছে',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          batch: newUser.batch,
          image: newUser.image,
          bloodGroup: newUser.bloodGroup,
          location: newUser.location,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ success: false, message: 'রেজিস্ট্রেশনে ত্রুটি ঘটেছে: ' + err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const rawIdentifier = (username || email || '').toString().trim().toLowerCase();

      if (!rawIdentifier || !password) {
        return res.status(400).json({ success: false, message: 'ইউজারনেম/ইমেইল এবং পাসওয়ার্ড প্রদান করুন' });
      }

      // 1. Direct verify for Jasmin Admin (username: jasmin, pass: jasmin1142005)
      if (
        (rawIdentifier === 'jasmin' || rawIdentifier === 'jasmin@nazrulacademy.edu.bd') &&
        password === 'jasmin1142005'
      ) {
        let jasminUser = db.users.find(
          (u) =>
            u.username === 'jasmin' ||
            u.email?.toLowerCase() === 'jasmin' ||
            u.email?.toLowerCase() === 'jasmin@nazrulacademy.edu.bd'
        );

        if (!jasminUser) {
          jasminUser = {
            id: 'usr-admin-jasmin',
            name: 'Jasmin (প্রধান প্রশাসক)',
            nameEn: 'Jasmin',
            username: 'jasmin',
            email: 'jasmin@nazrulacademy.edu.bd',
            passwordHash: bcrypt.hashSync('jasmin1142005', 10),
            role: 'admin',
            phone: '+880 1797-585073',
            bloodGroup: 'B+',
            batch: '২০০৫',
            location: 'ত্রিশাল, ময়মনসিংহ',
            school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
            currentJob: 'প্রধান আইটি প্রশাসক',
            company: 'অ্যালামনাই আইটি সেল',
            status: 'approved',
            createdAt: new Date().toISOString(),
          };
          db.users.unshift(jasminUser);
          saveStore();
        }

        const token = jwt.sign(
          {
            id: jasminUser.id,
            email: jasminUser.email,
            username: 'jasmin',
            role: 'admin',
            name: jasminUser.name,
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'অ্যাডমিন লগইন সফল হয়েছে (স্বাগতম Jasmin)',
          token,
          user: {
            id: jasminUser.id,
            name: jasminUser.name,
            email: jasminUser.email,
            username: 'jasmin',
            role: 'admin',
            batch: jasminUser.batch,
            image: jasminUser.image,
            bloodGroup: jasminUser.bloodGroup,
            location: jasminUser.location,
            currentJob: jasminUser.currentJob,
          },
        });
      }

      // 2. Lookup existing user in DB by username or email
      const user = db.users.find(
        (u) =>
          u.email?.toLowerCase() === rawIdentifier ||
          u.username?.toLowerCase() === rawIdentifier ||
          (rawIdentifier === 'jasmin' && (u.role === 'admin' || u.email?.includes('jasmin')))
      );

      if (!user) {
        return res.status(401).json({ success: false, message: 'ভুল ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'ভুল ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username || user.email,
          role: user.role,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'লগইন সফল হয়েছে',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username || user.email,
          role: user.role,
          batch: user.batch,
          image: user.image,
          bloodGroup: user.bloodGroup,
          location: user.location,
          currentJob: user.currentJob,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'লগইনে সমস্যা হয়েছে' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) {
      if (req.user.role === 'admin') {
        return res.json({
          success: true,
          user: {
            id: req.user.id,
            name: db.adminInfo.name,
            email: req.user.email,
            role: 'admin',
          },
        });
      }
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
    }
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });

  // --- Global API (Logo, site title, contact info) ---
  app.get('/api/global', (req, res) => {
    res.json({ success: true, data: db.globalConfig });
  });

  app.put('/api/global', authenticateToken, requireAdmin, (req, res) => {
    db.globalConfig = { ...db.globalConfig, ...req.body };
    saveStore();
    res.json({ success: true, message: 'গ্লোবাল তথ্য আপডেট করা হয়েছে', data: db.globalConfig });
  });

  // --- Hero Slides ---
  app.get('/api/hero', (req, res) => {
    res.json({ success: true, data: db.heroSlides });
  });

  app.post('/api/hero', authenticateToken, requireAdmin, (req, res) => {
    const newSlide = {
      id: 'hero-' + Date.now(),
      ...req.body,
      order: db.heroSlides.length + 1,
    };
    db.heroSlides.push(newSlide);
    saveStore();
    res.status(201).json({ success: true, data: newSlide });
  });

  app.put('/api/hero/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.heroSlides.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'স্লাইড পাওয়া যায়নি' });
    db.heroSlides[index] = { ...db.heroSlides[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.heroSlides[index] });
  });

  app.delete('/api/hero/:id', authenticateToken, requireAdmin, (req, res) => {
    db.heroSlides = db.heroSlides.filter((s) => s.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'স্লাইড ডিলিট করা হয়েছে' });
  });

  // --- Teacher Messages (প্রাক্তনদের প্রতি আহবান) ---
  app.get('/api/teachers', (req, res) => {
    res.json({ success: true, data: db.teacherMessages });
  });

  app.post('/api/teachers', authenticateToken, requireAdmin, (req, res) => {
    const newTeacher = {
      id: 'tm-' + Date.now(),
      ...req.body,
      order: db.teacherMessages.length + 1,
    };
    db.teacherMessages.push(newTeacher);
    saveStore();
    res.status(201).json({ success: true, data: newTeacher });
  });

  app.put('/api/teachers/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.teacherMessages.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'শিক্ষকের তথ্য পাওয়া যায়নি' });
    db.teacherMessages[index] = { ...db.teacherMessages[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.teacherMessages[index] });
  });

  app.delete('/api/teachers/:id', authenticateToken, requireAdmin, (req, res) => {
    db.teacherMessages = db.teacherMessages.filter((t) => t.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'মুছে ফেলা হয়েছে' });
  });

  // --- Statistics (পরিসংখ্যান) ---
  app.get('/api/stats', (req, res) => {
    const studentCount = db.students ? db.students.length : 0;
    const familyCount = (db.students || []).reduce(
      (sum: number, s: any) => sum + (Number(s.familyMembersCount) || 0),
      0
    );
    const dynamicStats = {
      ...db.statsData,
      registeredStudents: studentCount > 0 ? studentCount : (db.statsData?.registeredStudents || 0),
      familyMembersCount: familyCount > 0 ? familyCount : (db.statsData?.familyMembersCount || 0),
    };
    res.json({ success: true, data: dynamicStats });
  });

  app.put('/api/stats', authenticateToken, requireAdmin, (req, res) => {
    db.statsData = { ...db.statsData, ...req.body };
    saveStore();
    res.json({ success: true, message: 'পরিসংখ্যান আপডেট করা হয়েছে', data: db.statsData });
  });

  // --- Students / Ex-Students (প্রাক্তন ছাত্র/ছাত্রী তালিকা) ---
  app.get('/api/students', (req, res) => {
    const { batchType, batch, bloodGroup, search } = req.query;
    let list = [...db.students];

    if (batchType && batchType !== 'all') {
      list = list.filter((s) => s.batchType === batchType);
    }
    if (batch && batch !== 'all') {
      list = list.filter((s) => s.batch.includes(batch as string));
    }
    if (bloodGroup && bloodGroup !== 'all') {
      list = list.filter((s) => s.bloodGroup === bloodGroup);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
          s.batch.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, data: list, total: list.length });
  });

  app.post('/api/students', authenticateToken, requireAdmin, (req, res) => {
    const newStudent = {
      id: 'std-' + Date.now(),
      ...req.body,
      status: req.body.status || 'approved',
    };
    db.students.unshift(newStudent);
    db.statsData.registeredStudents += 1;
    saveStore();
    res.status(201).json({ success: true, data: newStudent });
  });

  app.put('/api/students/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.students.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'শিক্ষার্থী পাওয়া যায়নি' });
    db.students[index] = { ...db.students[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.students[index] });
  });

  app.delete('/api/students/:id', authenticateToken, requireAdmin, (req, res) => {
    db.students = db.students.filter((s) => s.id !== req.params.id);
    db.statsData.registeredStudents = Math.max(0, db.statsData.registeredStudents - 1);
    saveStore();
    res.json({ success: true, message: 'শিক্ষার্থী ডিলিট করা হয়েছে' });
  });

  // --- Financial Condition (পুনর্মিলনীর আর্থিক চিত্র) ---
  app.get('/api/finance', (req, res) => {
    res.json({ success: true, data: db.financeSummary });
  });

  app.put('/api/finance', authenticateToken, requireAdmin, (req, res) => {
    const { totalIncome, totalExpense, breakdown, transactions } = req.body;
    const income = Number(totalIncome) !== undefined ? Number(totalIncome) : db.financeSummary.totalIncome;
    const expense = Number(totalExpense) !== undefined ? Number(totalExpense) : db.financeSummary.totalExpense;
    const balance = income - expense;

    db.financeSummary = {
      ...db.financeSummary,
      totalIncome: income,
      totalExpense: expense,
      balance,
      breakdown: breakdown || db.financeSummary.breakdown,
      transactions: transactions !== undefined ? transactions : (db.financeSummary.transactions || []),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    saveStore();
    res.json({ success: true, message: 'আর্থিক হিসাব আপডেট করা হয়েছে', data: db.financeSummary });
  });

  // --- Notices (সর্বশেষ নোটিশ) ---
  app.get('/api/notices', (req, res) => {
    res.json({ success: true, data: db.notices });
  });

  app.post('/api/notices', authenticateToken, requireAdmin, (req, res) => {
    const newNotice = {
      id: 'notice-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      priority: req.body.priority || 'সাধারণ',
      ...req.body,
    };
    db.notices.unshift(newNotice);
    saveStore();
    res.status(201).json({ success: true, data: newNotice });
  });

  app.put('/api/notices/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.notices.findIndex((n) => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'নোটিশ পাওয়া যায়নি' });
    db.notices[index] = { ...db.notices[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.notices[index] });
  });

  app.delete('/api/notices/:id', authenticateToken, requireAdmin, (req, res) => {
    db.notices = db.notices.filter((n) => n.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'নোটিশ ডিলিট করা হয়েছে' });
  });

  // --- Schedule (কার্যক্রমের সময়সূচি) ---
  app.get('/api/schedule', (req, res) => {
    res.json({ success: true, data: db.schedule });
  });

  app.post('/api/schedule', authenticateToken, requireAdmin, (req, res) => {
    const newItem = {
      id: 'sch-' + Date.now(),
      order: db.schedule.length + 1,
      ...req.body,
    };
    db.schedule.push(newItem);
    saveStore();
    res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/schedule/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.schedule.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'কার্যক্রম পাওয়া যায়নি' });
    db.schedule[index] = { ...db.schedule[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.schedule[index] });
  });

  app.delete('/api/schedule/:id', authenticateToken, requireAdmin, (req, res) => {
    db.schedule = db.schedule.filter((s) => s.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'কার্যক্রম ডিলিট করা হয়েছে' });
  });

  // --- Cultural Schedule (সাংস্কৃতিক ও বিনোদন পর্ব) ---
  app.get('/api/cultural', (req, res) => {
    res.json({ success: true, data: db.culturalSchedule });
  });

  app.post('/api/cultural', authenticateToken, requireAdmin, (req, res) => {
    const newItem = {
      id: 'cult-' + Date.now(),
      ...req.body,
    };
    db.culturalSchedule.push(newItem);
    saveStore();
    res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/cultural/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.culturalSchedule.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'সাংস্কৃতিক পর্ব পাওয়া যায়নি' });
    db.culturalSchedule[index] = { ...db.culturalSchedule[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.culturalSchedule[index] });
  });

  app.delete('/api/cultural/:id', authenticateToken, requireAdmin, (req, res) => {
    db.culturalSchedule = db.culturalSchedule.filter((c) => c.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'সাংস্কৃতিক পর্ব মুছে ফেলা হয়েছে' });
  });

  // --- Donations (সম্মানিত দাতা ও অনুদান) ---
  app.get('/api/donations', (req, res) => {
    res.json({ success: true, data: db.donors });
  });

  app.post('/api/donations', authenticateToken, requireAdmin, (req, res) => {
    const newDonor = {
      id: 'dn-' + Date.now(),
      ...req.body,
    };
    db.donors.push(newDonor);
    saveStore();
    res.status(201).json({ success: true, data: newDonor });
  });

  app.put('/api/donations/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.donors.findIndex((d) => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'দাতা পাওয়া যায়নি' });
    db.donors[index] = { ...db.donors[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.donors[index] });
  });

  app.delete('/api/donations/:id', authenticateToken, requireAdmin, (req, res) => {
    db.donors = db.donors.filter((d) => d.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'দাতা ডিলিট করা হয়েছে' });
  });

  // --- Gallery (গ্যালারি - ছবি ও ভিডিও) ---
  app.get('/api/gallery', (req, res) => {
    res.json({ success: true, data: db.gallery });
  });

  app.post('/api/gallery', authenticateToken, requireAdmin, (req, res) => {
    const newItem = {
      id: 'gal-' + Date.now(),
      date: req.body.date || '২০২৬',
      ...req.body,
    };
    db.gallery.unshift(newItem);
    saveStore();
    res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/gallery/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.gallery.findIndex((g) => g.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'গ্যালারি আইটেম পাওয়া যায়নি' });
    db.gallery[index] = { ...db.gallery[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.gallery[index] });
  });

  app.delete('/api/gallery/:id', authenticateToken, requireAdmin, (req, res) => {
    db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'গ্যালারি আইটেম ডিলিট করা হয়েছে' });
  });

  // --- Magazine (স্মৃতির পাতা / সাময়িকী) ---
  app.get('/api/magazine', (req, res) => {
    res.json({ success: true, data: db.magazineArticles });
  });

  app.post('/api/magazine', authenticateToken, requireAdmin, (req, res) => {
    const newArticle = {
      id: 'mag-' + Date.now(),
      date: req.body.date || new Date().toISOString().split('T')[0],
      ...req.body,
    };
    db.magazineArticles.unshift(newArticle);
    saveStore();
    res.status(201).json({ success: true, data: newArticle });
  });

  app.put('/api/magazine/:id', authenticateToken, requireAdmin, (req, res) => {
    const index = db.magazineArticles.findIndex((m) => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'নিবন্ধ পাওয়া যায়নি' });
    db.magazineArticles[index] = { ...db.magazineArticles[index], ...req.body };
    saveStore();
    res.json({ success: true, data: db.magazineArticles[index] });
  });

  app.delete('/api/magazine/:id', authenticateToken, requireAdmin, (req, res) => {
    db.magazineArticles = db.magazineArticles.filter((m) => m.id !== req.params.id);
    saveStore();
    res.json({ success: true, message: 'নিবন্ধ ডিলিট করা হয়েছে' });
  });

  // --- Admin Info ---
  app.get('/api/admin/info', (req, res) => {
    res.json({ success: true, data: db.adminInfo });
  });

  app.put('/api/admin/info', authenticateToken, requireAdmin, (req, res) => {
    db.adminInfo = { ...db.adminInfo, ...req.body };
    saveStore();
    res.json({ success: true, message: 'অ্যাডমিন তথ্য সফলভাবে আপডেট হয়েছে', data: db.adminInfo });
  });

  // --- Contact info endpoint ---
  app.get('/api/contact', (req, res) => {
    const { contactPhone1, contactPhone2, contactEmail, address, facebookUrl, youtubeUrl } = db.globalConfig;
    res.json({
      success: true,
      data: { contactPhone1, contactPhone2, contactEmail, address, facebookUrl, youtubeUrl },
    });
  });

  app.put('/api/contact', authenticateToken, requireAdmin, (req, res) => {
    db.globalConfig = { ...db.globalConfig, ...req.body };
    saveStore();
    res.json({ success: true, message: 'যোগাযোগের তথ্য আপডেট হয়েছে', data: db.globalConfig });
  });

  // --- MongoDB Status & Configuration endpoints ---
  app.get('/api/system/mongo-config', async (req, res) => {
    const status = await mongoManager.getStatus();
    res.json({
      success: true,
      ...status,
      mongoUri: db.mongoUri || '',
    });
  });

  app.post('/api/system/mongo-config', authenticateToken, requireAdmin, async (req, res) => {
    const { mongoUri } = req.body;
    db.mongoUri = mongoUri;
    saveStore();

    const connectResult = await mongoManager.connect(mongoUri);
    if (connectResult.success) {
      await mongoManager.syncAllToMongo(db);
    }

    const status = await mongoManager.getStatus();
    res.json({
      success: connectResult.success,
      message: connectResult.message,
      status,
    });
  });

  // Force Full Sync to MongoDB
  app.post('/api/system/mongo-sync', authenticateToken, requireAdmin, async (req, res) => {
    if (!mongoManager.isConnected()) {
      const connectResult = await mongoManager.connect(db.mongoUri);
      if (!connectResult.success) {
        return res.status(500).json({
          success: false,
          message: `MongoDB সংযুক্ত নেই: ${connectResult.message}`,
        });
      }
    }

    const syncResult = await mongoManager.syncAllToMongo(db);
    const status = await mongoManager.getStatus();
    res.json({
      success: syncResult.success,
      message: syncResult.success
        ? 'সকল ডেটাসেট MongoDB কালেকশনগুলোতে সফলভাবে সিঙ্ক হয়েছে'
        : 'MongoDB সিঙ্কিংয়ে সমস্যা হয়েছে',
      status,
    });
  });

  // Seed Rich Demo Data to MongoDB & Store
  app.post('/api/system/seed-demo-data', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const jasminHash = bcrypt.hashSync('jasmin1142005', 10);
      const defaultAdmin = {
        id: 'usr-admin-jasmin',
        name: 'Jasmin (প্রধান প্রশাসক)',
        nameEn: 'Jasmin',
        username: 'jasmin',
        email: 'jasmin@nazrulacademy.edu.bd',
        passwordHash: jasminHash,
        role: 'admin',
        phone: '+880 1797-585073',
        bloodGroup: 'B+',
        batch: '২০০৫',
        location: 'ত্রিশাল, ময়মনসিংহ',
        school: 'ত্রিশাল সরকারি নজরুল একাডেমি',
        currentJob: 'প্রধান আইটি প্রশাসক',
        company: 'অ্যালামনাই আইটি সেল',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };

      db = {
        users: [defaultAdmin],
        globalConfig: initialGlobalConfig,
        heroSlides: initialHeroSlides,
        teacherMessages: initialTeacherMessages,
        statsData: initialStatsData,
        students: initialStudents,
        financeSummary: initialFinanceSummary,
        notices: initialNotices,
        schedule: initialSchedule,
        culturalSchedule: initialCulturalSchedule,
        donors: initialDonors,
        gallery: initialGallery,
        magazineArticles: initialMagazineArticles,
        adminInfo: initialAdminInfo,
        mongoUri: db.mongoUri || DEFAULT_MONGODB_URI,
      };

      saveStore();

      if (mongoManager.isConnected()) {
        await mongoManager.syncAllToMongo(db);
      } else {
        await mongoManager.connect(db.mongoUri);
        if (mongoManager.isConnected()) {
          await mongoManager.syncAllToMongo(db);
        }
      }

      const status = await mongoManager.getStatus();
      res.json({
        success: true,
        message: 'সম্পূর্ণ নতুন সমৃদ্ধ ডেমো ডেটা MongoDB ও সিস্টেমে সফলভাবে সিড করা হয়েছে!',
        status,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: `সিড করতে ত্রুটি: ${err.message}` });
    }
  });

  // Fetch Live MongoDB Collection Documents
  app.get('/api/system/mongo-collections/:collectionName', authenticateToken, requireAdmin, async (req, res) => {
    const { collectionName } = req.params;
    if (!mongoManager.isConnected()) {
      return res.json({
        success: false,
        message: 'MongoDB সংযুক্ত নেই',
        documents: [],
      });
    }

    const docs = await mongoManager.getCollectionDocuments(collectionName, 100);
    res.json({
      success: true,
      collection: collectionName,
      count: docs.length,
      documents: docs,
    });
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Connect MongoDB on server startup
  mongoManager
    .connect(db.mongoUri || DEFAULT_MONGODB_URI)
    .then(async (result) => {
      if (result.success) {
        console.log('[MongoDB] Boot connection successful, syncing collections...');
        await mongoManager.syncAllToMongo(db);
      } else {
        console.log('[MongoDB] Initial connection fallback to local store:', result.message);
      }
    })
    .catch((err) => {
      console.error('[MongoDB] Initial connection error:', err);
    });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ত্রিশাল সরকারি নজরুল একাডেমি সার্ভার চলছে: http://localhost:${PORT}`);
  });
}

startServer();
