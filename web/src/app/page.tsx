'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import RadiusFilter from '@/components/RadiusFilter';
import JobCard from '@/components/JobCard';
import GoogleMapView from '@/components/GoogleMapView';
import AuthModal from '@/components/AuthModal';
import ResumeModal from '@/components/ResumeModal';
import JobPostModal from '@/components/JobPostModal';
import JobDetailModal from '@/components/JobDetailModal';
import PremiumAdRotationTicker from '@/components/PremiumAdRotationTicker';
import { getJobsFromDB } from '@/lib/jobService';
import { MOCK_JOBS, calculateHaversineDistance } from '@/lib/mockJobs';
import { detectUserLocation } from '@/lib/geoIp';
import { RadiusOption, JobPost, UserLocation, JobCategory } from '@/types/job';
import { Language, DICTIONARY } from '@/lib/i18n';
import { Sparkles, Map, List, Search, Globe2, Utensils, Hotel, Truck, Cpu, Navigation, CheckCircle2, Lock, UserCheck, Eye, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const [activeApp, setActiveApp] = useState<'KHIRE_RECRUITMENT' | 'FBM_SHOWCASE'>('KHIRE_RECRUITMENT');
  const [language, setLanguage] = useState<Language>('KO');
  const t = DICTIONARY[language];

  // Auth State (Non-logged in by default as per prompt)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);

  // Dynamic Jobs State from DB
  const [rawJobs, setRawJobs] = useState<JobPost[]>(MOCK_JOBS as JobPost[]);
  const [selectedDetailJob, setSelectedDetailJob] = useState<JobPost | null>(null);

  const [userLocation, setUserLocation] = useState<UserLocation>({
    address: '미국 캘리포니아 로스앤젤레스 한인타운 (LA Koreatown)',
    latitude: 34.0618,
    longitude: -118.3000,
    countryCode: 'US',
    countryName: '미국 (USA)',
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
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load jobs from DB / LocalStorage on mount
  const refreshJobs = async () => {
    const loaded = await getJobsFromDB();
    if (loaded && loaded.length > 0) {
      setRawJobs(loaded);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  // Detect IP & GPS location automatically. Fallback to LA Koreatown if permission denied.
  useEffect(() => {
    detectUserLocation().then((loc) => {
      setUserLocation(loc);
      setIsLocating(false);
    });
  }, []);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'KO' ? 'EN' : 'KO'));
  };

  // Login handler
  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserProfile({ email, name: email.split('@')[0] });
    setIsAuthOpen(false);
    alert(`로그인 성공! (${email})\nKHIRE 모든 기능 및 지원하기 권한이 활성화되었습니다.`);
  };

  // Calculate distance for all jobs relative to user's location
  const jobsWithDistance = useMemo(() => {
    return rawJobs.map((job) => {
      const distanceKm = calculateHaversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        job.latitude,
        job.longitude
      );
      return {
        ...job,
        distanceKm,
      } as JobPost;
    });
  }, [rawJobs, userLocation]);

  // Filter jobs based on radius option, category, and search keyword
  const filteredJobs = useMemo(() => {
    return jobsWithDistance
      .filter((job) => {
        // Radius filter (30km default)
        if (selectedRadius !== 0 && job.distanceKm !== undefined) {
          if (job.distanceKm > selectedRadius) return false;
        }
        // Category filter (F&B, Lodging/Cleaning, etc.)
        if (selectedCategory !== 'ALL') {
          if (job.category !== selectedCategory) return false;
        }

        // Search keyword
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

  // Handle Protected Feature Triggers (Requires Login)
  const handleOpenResume = () => {
    if (!isLoggedIn) {
      alert('이력서 등록은 회원 전용 서비스입니다.\n\n로그인 또는 회원가입 후 이용해 주세요.');
      setIsAuthOpen(true);
      return;
    }
    setIsResumeOpen(true);
  };

  const handleOpenJobPost = () => {
    if (!isLoggedIn) {
      alert('채용 공고등록은 회원 전용 서비스입니다.\n\n로그인 또는 회원가입 후 이용해 주세요.');
      setIsAuthOpen(true);
      return;
    }
    setIsJobPostOpen(true);
  };

  const handleApply = (job: JobPost) => {
    if (!isLoggedIn) {
      alert('입사 지원하기는 회원 전용 서비스입니다.\n\n공고 내용은 자유롭게 읽어보실 수 있으며, 실제 지원은 로그인 후 가능합니다.');
      setSelectedDetailJob(job);
      setIsAuthOpen(true);
      return;
    }
    setSelectedDetailJob(job);
  };

  const handleViewDetail = (job: JobPost) => {
    setSelectedDetailJob(job);
  };

  if (activeApp === 'FBM_SHOWCASE') {
    return <FbmShowcase onSwitchToKhire={() => setActiveApp('KHIRE_RECRUITMENT')} />;
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenResume={handleOpenResume}
        onOpenJobPost={handleOpenJobPost}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userProfile?.email}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserProfile(null);
          alert('로그아웃되었습니다. 비로그인 회원 상태로 전환됩니다.');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* IP Location Status Bar */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 shadow-md">
          <div className="flex items-center gap-2">
            <Navigation className={`w-4 h-4 text-emerald-400 shrink-0 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              <strong className="text-white">{t.ipDetected}:</strong> {userLocation.address}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!userLocation.isGranted && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
                위치 미동의 ➔ 캘리포니아 한인타운 기본 설정
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
              IP 접속 근거리 위치 연동
            </span>
          </div>
        </div>

        {/* $30 Premium Sponsor Ad 5-Second Rotation Ticker Banner */}
        <PremiumAdRotationTicker
          jobs={rawJobs}
          onViewDetail={handleViewDetail}
        />

        {/* Hero Section */}
        <section className="mb-10 p-6 md:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>해외 한인식당·카페 (F&B) & 숙박·청소 전문 채용</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {t.heroTitle1} <br />
              <span className="text-gradient-emerald">F&B 식당·카페 & 숙박·청소</span> 일자리
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mb-6 font-normal leading-relaxed">
              접속자 위치 근거리 순으로 가장 가깝고 적합한 한인 채용 정보를 바로 확인하세요. 공고 상세 페이지에서 해당 업체의 구글지도 주소를 확인할 수 있습니다.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[
                { id: 'ALL', label: '전체 업종', icon: Sparkles },
                { id: 'F_AND_B', label: 'F&B (한인식당/카페)', icon: Utensils },
                { id: 'LODGING_CLEANING', label: '숙박 & 청소', icon: Hotel },
                { id: 'LOGISTICS', label: '물류 & 현장', icon: Truck },
                { id: 'TECH', label: '기술 & IT', icon: Cpu },
              ].map((cat) => {
                const IconComp = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as JobCategory)}
                    className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 font-semibold'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-slate-700/80 max-w-xl shadow-xl">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="식당 조리장, 카페 바리스타, 청소 관리자, 업체 주소 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full px-2 py-1.5 font-medium"
              />
              <button className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-xs text-slate-950 shrink-0 transition-all shadow-md shadow-emerald-500/30">
                {t.searchBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Jobs Grid Section */}
        <section id="ai-match" className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>접속 위치 근거리 최우선 한인 채용 공고</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                접속자 위치와의 거리가 가까운 순서대로 채용 공고가 자동 정렬됩니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('LIST')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'LIST'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
                <span>{t.listView}</span>
              </button>
              <button
                onClick={() => setViewMode('MAP')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>{t.mapView}</span>
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
              <Globe2 className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-200 mb-1">
                {t.noJobsTitle}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                {t.noJobsDesc}
              </p>
              <button
                onClick={() => {
                  setSelectedRadius(150);
                  setSelectedCategory('ALL');
                  setSearchKeyword('');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-extrabold text-slate-950 transition-all shadow-md shadow-emerald-500/20"
              >
                {t.viewAllJobs}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Interactive Feature Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(email) => handleLoginSuccess(email)}
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
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <span>KHIRE Platform</span>
            <span>·</span>
            <span>한인식당/카페 & 숙박/청소 전문 위치기반 AI 채용</span>
          </div>
          <div>© 2026 KHIRE Inc. All rights reserved. (khire.net)</div>
        </div>
      </footer>
    </div>
  );
}
