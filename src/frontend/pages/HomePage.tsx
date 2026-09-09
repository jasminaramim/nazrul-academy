import React from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { TeacherCallSection } from '../components/TeacherCallSection';
import { StatsSection } from '../components/StatsSection';
import { StudentListSection } from '../components/StudentListSection';
import { FinanceSection } from '../components/FinanceSection';
import { NoticeSection } from '../components/NoticeSection';
import { ScheduleSection } from '../components/ScheduleSection';
import { DonationSection } from '../components/DonationSection';
import { GallerySection } from '../components/GallerySection';
import { MagazineSection } from '../components/MagazineSection';
import {
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
} from '../../shared/types';

interface HomePageProps {
  heroSlides: HeroSlide[];
  teacherMessages: TeacherMessage[];
  statsData: StatsData;
  students: Student[];
  finance: FinanceSummary;
  notices: Notice[];
  schedule: ScheduleItem[];
  culturalSchedule: CulturalItem[];
  donors: Donor[];
  gallery: GalleryItem[];
  magazineArticles: MagazineArticle[];
  onNavigate: (page: string) => void;
  onSelectNotice: (notice: Notice) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  heroSlides,
  teacherMessages,
  statsData,
  students,
  finance,
  notices,
  schedule,
  culturalSchedule,
  donors,
  gallery,
  magazineArticles,
  onNavigate,
  onSelectNotice,
}) => {
  return (
    <div>
      {/* Dynamic Hero Slider */}
      <HeroSlider
        slides={heroSlides}
        onNavigate={onNavigate}
        festivalDate={statsData?.festivalDate || ''}
        festivalTime={statsData?.festivalTime || ''}
      />

      {/* প্রাক্তনদের প্রতি আহবান */}
      <TeacherCallSection messages={teacherMessages} />

      {/* পরিসংখ্যান */}
      <StatsSection
        stats={statsData}
        studentsCount={students.length}
        familyMembersCount={
          students.reduce((sum, s) => sum + (s.familyMembersCount || 0), 0) ||
          statsData?.familyMembersCount || 0
        }
      />

      {/* প্রাক্তন ছাত্র/ছাত্রী তালিকা (All ex-student lists) */}
      <StudentListSection
        students={students}
        onNavigate={onNavigate}
        showAll={false}
      />

      {/* আর্থিক চিত্র (Financial Condition) */}
      <FinanceSection finance={finance} />

      {/* সর্বশেষ নোটিশ (Notice) */}
      <NoticeSection
        notices={notices}
        showAll={false}
        onSelectNotice={onSelectNotice}
      />

      {/* কার্যক্রমের সময়সূচি ও সাংস্কৃতিক পর্ব (Schedule & Cultural) */}
      <ScheduleSection
        schedule={schedule}
        culturalSchedule={culturalSchedule}
      />

      {/* সম্মানিত দাতা ও অনুদান (Donation) */}
      <DonationSection donors={donors} />

      {/* স্মৃতির পাতা ম্যাগাজিন (Magazine) */}
      <MagazineSection articles={magazineArticles} />

      {/* গ্যালারি (Gallery) */}
      <GallerySection gallery={gallery} showAll={false} />
    </div>
  );
};
