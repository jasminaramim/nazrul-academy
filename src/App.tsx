import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { apiService } from './shared/services/api';
import { Navbar } from './frontend/components/Navbar';
import { Footer } from './frontend/components/Footer';
import { HomePage } from './frontend/pages/HomePage';
import { RegistrationPage } from './frontend/pages/RegistrationPage';
import { LoginPage } from './frontend/pages/LoginPage';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { NoticeDetailPage } from './frontend/pages/NoticeDetailPage';
import { StudentListSection } from './frontend/components/StudentListSection';
import { GallerySection } from './frontend/components/GallerySection';
import { ScheduleSection } from './frontend/components/ScheduleSection';
import { MagazineSection } from './frontend/components/MagazineSection';

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
} from './shared/types';
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
} from './shared/data/initialData';

function MainAppContent() {
  const { user, isAdmin } = useAuth();
  
  // Read current URL path for initial page determination (e.g. /admin, /login, /register)
  const getInitialPage = (): string => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    if (path === '/admin' || path.startsWith('/admin')) return 'admin';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/alumni') return 'alumni';
    if (path === '/gallery') return 'gallery';
    if (path === '/activities') return 'activities';
    if (path === '/magazine') return 'magazine';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // App dynamic data states
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialGlobalConfig);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [teacherMessages, setTeacherMessages] = useState<TeacherMessage[]>(initialTeacherMessages);
  const [statsData, setStatsData] = useState<StatsData>(initialStatsData);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [finance, setFinance] = useState<FinanceSummary>(initialFinanceSummary);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [culturalSchedule, setCulturalSchedule] = useState<CulturalItem[]>(initialCulturalSchedule);
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [magazineArticles, setMagazineArticles] = useState<MagazineArticle[]>(initialMagazineArticles);

  const fetchData = async () => {
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
    } catch (err) {
      console.error('Error fetching website data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to browser forward/back buttons
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin')) setCurrentPage('admin');
      else if (path === '/login') setCurrentPage('login');
      else if (path === '/register') setCurrentPage('register');
      else if (path === '/alumni') setCurrentPage('alumni');
      else if (path === '/gallery') setCurrentPage('gallery');
      else if (path === '/activities') setCurrentPage('activities');
      else if (path === '/magazine') setCurrentPage('magazine');
      else setCurrentPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin page, show the dedicated admin layout
  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        onNavigateHome={() => handleNavigate('home')}
        onRefreshData={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#00732A] selection:text-white">
      {/* Universal Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        globalConfig={globalConfig}
      />

      {/* Main Page View Routing */}
      <main className="flex-1">
        {/* 1. HOME PAGE */}
        {currentPage === 'home' && (
          <HomePage
            heroSlides={heroSlides}
            teacherMessages={teacherMessages}
            statsData={statsData}
            students={students}
            finance={finance}
            notices={notices}
            schedule={schedule}
            culturalSchedule={culturalSchedule}
            donors={donors}
            gallery={gallery}
            magazineArticles={magazineArticles}
            onNavigate={handleNavigate}
            onSelectNotice={(notice) => {
              setSelectedNotice(notice);
              handleNavigate('notice-detail');
            }}
          />
        )}

        {/* 2. REGISTRATION PAGE (নিবন্ধন) */}
        {currentPage === 'register' && (
          <RegistrationPage
            onSuccessNavigate={(page) => {
              fetchData();
              handleNavigate(page);
            }}
          />
        )}

        {/* 3. ALUMNI DIRECTORY PAGE (প্রাক্তন ছাত্র/ছাত্রী) */}
        {currentPage === 'alumni' && (
          <div className="py-8 bg-slate-50 min-h-[80vh]">
            <StudentListSection
              students={students}
              onNavigate={handleNavigate}
              showAll={true}
            />
          </div>
        )}

        {/* 4. GALLERY PAGE (গ্যালারি) */}
        {currentPage === 'gallery' && (
          <div className="py-8 bg-white min-h-[80vh]">
            <GallerySection gallery={gallery} showAll={true} />
          </div>
        )}

        {/* 5. ACTIVITIES & SCHEDULE PAGE (কার্যক্রম) */}
        {currentPage === 'activities' && (
          <div className="py-8 bg-white min-h-[80vh]">
            <ScheduleSection
              schedule={schedule}
              culturalSchedule={culturalSchedule}
            />
          </div>
        )}

        {/* 6. MAGAZINE / MEMORIES PAGE (স্মৃতির পাতা) */}
        {currentPage === 'magazine' && (
          <div className="py-8 bg-slate-50 min-h-[80vh]">
            <MagazineSection articles={magazineArticles} />
          </div>
        )}

        {/* 7. LOGIN PAGE */}
        {currentPage === 'login' && (
          <LoginPage
            onSuccessNavigate={(page) => {
              fetchData();
              handleNavigate(page);
            }}
          />
        )}

        {/* 8. SINGLE NOTICE DETAILS PAGE (একক নোটিশ বিস্তারিত) */}
        {currentPage === 'notice-detail' && selectedNotice && (
          <NoticeDetailPage
            notice={selectedNotice}
            allNotices={notices}
            onBack={() => handleNavigate('home')}
            onSelectNotice={(notice) => {
              setSelectedNotice(notice);
            }}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        globalConfig={globalConfig}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
