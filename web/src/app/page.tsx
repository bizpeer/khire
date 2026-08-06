'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import ResumeModal from '@/components/ResumeModal';
import JobPostModal from '@/components/JobPostModal';
import JobDetailModal from '@/components/JobDetailModal';
import UserProfileModal from '@/components/UserProfileModal';
import UserDashboardModal, { UserApplication } from '@/components/UserDashboardModal';
import PremiumAdRotationTicker from '@/components/PremiumAdRotationTicker';
import { getJobsFromDB } from '@/lib/jobService';
import { MOCK_JOBS, calculateHaversineDistance } from '@/lib/mockJobs';
import { detectUserLocation } from '@/lib/geoIp';
import { RadiusOption, JobPost, UserLocation, JobCategory } from '@/types/job';
import { Language, DICTIONARY } from '@/lib/i18n';
import {
  Sparkles,
  Map,
  List,
  Search,
  Globe2,
  Utensils,
  Hotel,
  Truck,
  Cpu,
  Navigation,
  CheckCircle2,
  Lock,
  Bookmark,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('KO');
  const t = DICTIONARY[language];

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);
  const [userMode, setUserMode] = useState<'APPLICANT' | 'EMPLOYER'>('APPLICANT');

  // Applications & Favorites
  const [userAppliedJobIds, setUserAppliedJobIds] = useState<string[]>([]);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>([]);
  const [myApplications, setMyApplications] = useState<UserApplication[]>([
    {
      id: 'app-1',
      jobId: 'job-au-tile-1',
      jobTitle: '시드니 스트라스필드 현장 타일공 및 타일 구인',
      companyName: '시드니 K-Tile Construction',
      appliedResumeTitle: '이력서 2: 시드니 상업용 청소 및 타일 현장 기술 이력서',
      appliedAt: '2026-08-06 14:15',
      status: 'PENDING',
    },
  ]);

  // Dynamic Jobs State
  const [rawJobs, setRawJobs] = useState<JobPost[]>(MOCK_JOBS as JobPost[]);
  const [selectedDetailJob, setSelectedDetailJob] = useState<JobPost | null>(null);

  // Default Location: Sydney Australia
  const [userLocation, setUserLocation] = useState<UserLocation>({
    address: 'Sydney Strathfield',
    latitude: -33.8688,
    longitude: 151.2093,
    countryCode: 'AU',
    countryName: '호주 (Australia)',
    isGranted: false,
  });
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [selectedRadius, setSelectedRadius] = useState<RadiusOption>(30); // Default 30km
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJobPostOpen, setIsJobPostOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);

  // Load jobs from DB / LocalStorage
  const refreshJobs = async () => {
    const loaded = await getJobsFromDB();
    if (loaded && loaded.length > 0) {
      setRawJobs(loaded);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  // Detect IP & GPS location automatically
  useEffect(() => {
    detectUserLocation().then((loc) => {
      setUserLocation(loc);
      setIsLocating(false);
    });
  }, []);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'KO' ? 'EN' : 'KO'));
  };

  const handleLoginSuccess = (email: string, name?: string) => {
    setIsLoggedIn(true);
    setUserProfile({ email, name: name || email.split('@')[0] });
    setIsAuthOpen(false);
  };

  const toggleBookmark = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setBookmarkedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Calculate distance & filter jobs
  const jobsWithDistance = useMemo(() => {
    return rawJobs.map((job) => {
      const distanceKm = calculateHaversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        job.latitude,
        job.longitude
      );
      return { ...job, distanceKm };
    });
  }, [rawJobs, userLocation]);

  const filteredJobs = useMemo(() => {
    return jobsWithDistance
      .filter((job) => {
        if (selectedRadius !== 0 && job.distanceKm !== undefined) {
          if (job.distanceKm > selectedRadius) return false;
        }
        if (selectedCategory !== 'ALL') {
          if (job.category !== selectedCategory) return false;
        }
        if (searchKeyword.trim() !== '') {
          const kw = searchKeyword.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(kw);
          const matchComp = job.companyName.toLowerCase().includes(kw);
          const matchSkill = job.skills.some((s) => s.toLowerCase().includes(kw));
          const matchLoc = job.locationName.toLowerCase().includes(kw);
          if (!matchTitle && !matchComp && !matchSkill && !matchLoc) return false;
        }
        return true;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [jobsWithDistance, selectedRadius, selectedCategory, searchKeyword]);

  // Protected actions
  const handleOpenResume = () => {
    if (!isLoggedIn) {
      alert('이력서 등록은 회원 전용 서비스입니다.\n로그인 후 이용해 주세요.');
      setIsAuthOpen(true);
      return;
    }
    setIsResumeOpen(true);
  };

  const handleOpenJobPost = () => {
    if (!isLoggedIn) {
      alert('공고 등록은 회원 전용 서비스입니다.\n로그인 후 이용해 주세요.');
      setIsAuthOpen(true);
      return;
    }
    setIsJobPostOpen(true);
  };

  const handleApply = (job: JobPost) => {
    if (!isLoggedIn) {
      alert('입사 지원하기는 회원 전용 서비스입니다.\n로그인 후 이용 가능합니다.');
      setSelectedDetailJob(job);
      setIsAuthOpen(true);
      return;
    }
    setSelectedDetailJob(job);
  };

  const handleViewDetail = (job: JobPost) => {
    setSelectedDetailJob(job);
  };

  const topMatchJob = filteredJobs[0] || jobsWithDistance[0];

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex flex-col font-sans pb-24 md:pb-8 relative overflow-x-hidden selection:bg-[#ffc174] selection:text-slate-950">
      {/* Ambient Glow Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#f59e0b] blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ee9800] blur-[100px] opacity-10"></div>
      </div>

      {/* Top Header Bar */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenResume={handleOpenResume}
        onOpenJobPost={handleOpenJobPost}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userProfile?.email}
        currentAddress={userLocation.address}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserProfile(null);
          alert('로그아웃되었습니다.');
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* $30 Premium Ad Ticker */}
        <div className="pt-2">
          <PremiumAdRotationTicker jobs={rawJobs} onViewDetail={(job) => setSelectedDetailJob(job)} />
        </div>

        {/* Hero Section: AI Recommendation Bento */}
        <section className="animate-fade-in-up">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
                <span>나를 위한 추천</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffc174]/15 text-[#ffc174] border border-[#ffc174]/30 font-bold">
                  AI 큐레이션
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">접속 위치 기반 실시간 파싱 AI 추천 공고</p>
            </div>
            <span className="material-symbols-outlined text-[#ffc174]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>

          {topMatchJob && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary AI Match Card */}
              <div
                onClick={() => setSelectedDetailJob(topMatchJob)}
                className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden group cursor-pointer transition-all duration-300 glow-hover flex flex-col justify-between gap-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc174]/10 to-transparent opacity-50 z-0"></div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center gap-1.5 bg-[#ffc174]/15 text-[#ffc174] px-3 py-1 rounded-full text-xs font-bold border border-[#ffc174]/30 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[15px]">psychology</span>
                      <span>{topMatchJob.matchScore || 98}% Match Score</span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(e, topMatchJob.id)}
                      className="w-9 h-9 rounded-full glass-overlay flex items-center justify-center text-slate-300 hover:text-[#ffc174] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: bookmarkedJobIds.includes(topMatchJob.id) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#F8FAFC] mb-2 group-hover:text-[#ffc174] transition-colors">
                      {topMatchJob.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1 text-slate-200">
                        <span className="material-symbols-outlined text-[16px] text-amber-400">payments</span>
                        {topMatchJob.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                        {topMatchJob.employmentType}
                      </span>
                      <span className="flex items-center gap-1 text-[#ffc174]">
                        <span className="material-symbols-outlined text-[16px]">near_me</span>
                        {topMatchJob.distanceKm ? `${topMatchJob.distanceKm} km` : '1.2 km'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-bold border border-slate-800">
                        {topMatchJob.companyName}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(topMatchJob);
                      }}
                      className="bg-[#ffc174] hover:bg-[#ffb95f] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>지원하기</span>
                      <span className="material-symbols-outlined text-base">bolt</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Match Stats Card */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">시장 수요 현황</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-[#F8FAFC]">높음</span>
                    <span className="material-symbols-outlined text-[#ffc174] mb-1">trending_up</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    호주 시드니·멜버른 F&B, 타일, 청소 직종 채용 수요가 실시간으로 수집되고 있습니다.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-bold mb-2">
                    <span>Profile Strength</span>
                    <span className="text-[#ffc174]">Strong</span>
                  </div>
                  <div className="progress-thin rounded-full overflow-hidden">
                    <div className="progress-thin-fill w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Categories Hub */}
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#F8FAFC]">카테고리 탐색</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedCategory('F_AND_B')}
              className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                selectedCategory === 'F_AND_B'
                  ? 'bg-amber-500/20 border-amber-400/50 ring-1 ring-amber-400/40 text-amber-300'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center text-amber-400">
                <span className="material-symbols-outlined text-[26px]">restaurant</span>
              </div>
              <span className="text-xs font-bold">F&B (식당·카페)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('LODGING_CLEANING')}
              className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                selectedCategory === 'LODGING_CLEANING'
                  ? 'bg-emerald-500/20 border-emerald-400/50 ring-1 ring-emerald-400/40 text-emerald-300'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center text-emerald-400">
                <span className="material-symbols-outlined text-[26px]">cleaning_services</span>
              </div>
              <span className="text-xs font-bold">Cleaning (숙박·청소)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('LOGISTICS')}
              className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                selectedCategory === 'LOGISTICS'
                  ? 'bg-sky-500/20 border-sky-400/50 ring-1 ring-sky-400/40 text-sky-300'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center text-sky-400">
                <span className="material-symbols-outlined text-[26px]">local_shipping</span>
              </div>
              <span className="text-xs font-bold">Logistics (타일·물류)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('TECH')}
              className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                selectedCategory === 'TECH'
                  ? 'bg-indigo-500/20 border-indigo-400/50 ring-1 ring-indigo-400/40 text-indigo-300'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-white/10 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined text-[26px]">terminal</span>
              </div>
              <span className="text-xs font-bold">Tech & Professional</span>
            </button>
          </div>
        </section>

        {/* Search & Radius Filter Controls */}
        <section className="p-4 rounded-2xl glass-panel space-y-3 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus-within:border-amber-400 transition-colors">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold shrink-0">반경:</span>
              {[15, 30, 60, 150].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setSelectedRadius(radius as RadiusOption)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedRadius === radius
                      ? 'bg-[#ffc174] text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Postings List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-[#F8FAFC] flex items-center gap-2">
              <span>내 주변 공고 ({filteredJobs.length}건)</span>
            </h2>
            <button
              onClick={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
              className="text-xs text-[#ffc174] hover:underline font-extrabold flex items-center gap-1"
            >
              <span>{viewMode === 'LIST' ? '지도로 보기' : '리스트로 보기'}</span>
              <span className="material-symbols-outlined text-[16px]">map</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleViewDetail(job)}
                className="glass-panel p-4 rounded-2xl flex gap-4 items-center group cursor-pointer hover:bg-white/5 transition-all glow-hover"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 relative bg-slate-900 flex items-center justify-center">
                  {job.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={job.imageUrl} alt={job.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{job.companyLogo || '🏢'}</span>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-bold text-[#F8FAFC] truncate mb-1 group-hover:text-[#ffc174] transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate">
                    <span className="font-semibold text-slate-300">{job.companyName}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[#ffc174] flex items-center gap-0.5 font-bold">
                      <span className="material-symbols-outlined text-[12px]">route</span>
                      {job.distanceKm !== undefined ? `${job.distanceKm} km` : '2.5 km'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">directions_transit</span>
                      {job.commuteTimeEstimate?.transitMinutes || 15}m
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-amber-300">{job.salary}</span>
                  <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {job.isPremiumAd ? '👑 5초 배너' : '즉시 가능'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#122131]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex justify-around items-center h-16 px-4 md:hidden">
        <button
          onClick={() => setViewMode('LIST')}
          className="flex flex-col items-center justify-center text-[#ffc174] hover:opacity-90 active:scale-95 transition-all w-full h-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            home_work
          </span>
          <span className="text-[10px] font-bold mt-0.5">홈</span>
        </button>

        <button
          onClick={() => {
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) searchInput.focus();
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all w-full h-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-[10px] font-bold mt-0.5">검색</span>
        </button>

        <button
          onClick={() => {
            if (isLoggedIn) {
              setIsUserDashboardOpen(true);
            } else {
              setIsAuthOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all w-full h-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
          <span className="text-[10px] font-bold mt-0.5">내 공고</span>
        </button>

        <button
          onClick={() => {
            if (isLoggedIn) {
              setIsProfileOpen(true);
            } else {
              setIsAuthOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all w-full h-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[10px] font-bold mt-0.5">프로필</span>
        </button>
      </nav>

      {/* Feature Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(email, name) => handleLoginSuccess(email, name)}
      />
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      <JobPostModal
        isOpen={isJobPostOpen}
        onClose={() => setIsJobPostOpen(false)}
        onJobCreated={() => refreshJobs()}
      />
      <JobDetailModal
        job={selectedDetailJob}
        isOpen={!!selectedDetailJob}
        onClose={() => setSelectedDetailJob(null)}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => setIsAuthOpen(true)}
        hasAppliedToJob={selectedDetailJob ? userAppliedJobIds.includes(selectedDetailJob.id) : false}
        onApplicationSuccess={(jobId) => setUserAppliedJobIds((prev) => [...prev, jobId])}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userEmail={userProfile?.email || 'user@khire.net'}
        userName={userProfile?.name || 'KHIRE 회원'}
        currentMode={userMode}
        onModeSwitch={(newMode) => {
          setUserMode(newMode);
          alert(`이용 모드가 [${newMode === 'APPLICANT' ? '개인 구직 지원자 모드' : '기업 고용주 모드'}]로 전환되었습니다.`);
        }}
      />
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        userEmail={userProfile?.email || 'applicant@khire.net'}
        userName={userProfile?.name || 'KHIRE 회원'}
        onOpenResumeModal={() => {
          setIsUserDashboardOpen(false);
          setIsResumeOpen(true);
        }}
        myApplications={myApplications}
        onCancelApplication={(appId) => {
          setMyApplications((prev) => prev.filter((a) => a.id !== appId));
          alert('해당 입사 지원이 성공적으로 취소되었습니다.');
        }}
        myJobs={rawJobs}
        onDeleteMyJob={(jobId) => {
          if (confirm('해당 구인 공고를 삭제하시겠습니까?')) {
            setRawJobs((prev) => prev.filter((j) => j.id !== jobId));
            alert('구인 공고가 삭제되었습니다.');
          }
        }}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#051424] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <span>KHIRE Platform</span>
            <span>·</span>
            <span>호주·뉴질랜드 해외 한인 특화 위치기반 AI 구인구직 (khire.net)</span>
          </div>
          <div>© 2026 KHIRE Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
