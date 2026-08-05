'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import RadiusFilter from '@/components/RadiusFilter';
import JobCard from '@/components/JobCard';
import GoogleMapView from '@/components/GoogleMapView';
import NewsTicker from '@/components/NewsTicker';
import AuthModal from '@/components/AuthModal';
import ResumeModal from '@/components/ResumeModal';
import JobPostModal from '@/components/JobPostModal';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import {
  MOCK_JOBS,
  calculateHaversineDistance,
} from '@/lib/mockJobs';
import { detectUserLocation } from '@/lib/geoIp';
import { RadiusOption, JobPost, UserLocation, JobCategory } from '@/types/job';
import { Language, DICTIONARY } from '@/lib/i18n';
import { Sparkles, Map, List, Search, Globe2, Utensils, Hotel, Truck, Cpu, Navigation, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('KO');
  const t = DICTIONARY[language];

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
  const [appliedJob, setAppliedJob] = useState<JobPost | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJobPostOpen, setIsJobPostOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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

  // Calculate distance for all mock jobs relative to user's location
  const jobsWithDistance = useMemo(() => {
    return MOCK_JOBS.map((job) => {
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
  }, [userLocation]);

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

  const handleApply = (job: JobPost) => {
    setAppliedJob(job);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenJobPost={() => setIsJobPostOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
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
              30km 반경 자동 연동
            </span>
          </div>
        </div>

        {/* 24h Gemini AI Country News Ticker */}
        <NewsTicker
          countryCode={userLocation.countryCode}
          countryName={userLocation.countryName}
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
              접속 위치 기반 30km 반경 구글지도에서 고용 희망 업체의 정확한 주소와 실시간 구인 정보를 확인하세요.
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

        {/* Radius Filter Component */}
        <RadiusFilter
          currentRadius={selectedRadius}
          onSelectRadius={setSelectedRadius}
          userAddress={userLocation.address}
          totalMatchCount={filteredJobs.length}
        />

        {/* Google Maps View Component (30km Radius Interactive Map with Employer Addresses) */}
        <GoogleMapView
          userLocation={userLocation}
          radiusKm={selectedRadius}
          jobs={filteredJobs}
          onSelectJob={handleApply}
        />

        {/* Jobs Grid Section */}
        <section id="ai-match" className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>한인식당·카페 & 숙박·청소 업체 채용 공고</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                고용 희망 업체의 실제 주소와 30km 반경 근거리 매칭 순으로 자동 노출됩니다.
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
                <JobCard key={job.id} job={job} onApply={handleApply} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Easy Apply Success Modal */}
      {appliedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full border border-emerald-500/40 shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white text-center mb-2">
              {t.appliedSuccessTitle}
            </h3>
            <p className="text-xs text-slate-300 text-center mb-6 leading-relaxed">
              <strong className="text-emerald-300 font-bold">{appliedJob.companyName}</strong>의 <br />
              &quot;{appliedJob.title}&quot; 공고에 회원님의 AI 이력서가 성공적으로 전달되었습니다.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 mb-6 flex justify-between items-center">
              <span>업체 주소:</span>
              <span className="text-emerald-300 font-bold truncate max-w-[200px]">{appliedJob.locationName}</span>
            </div>

            <button
              onClick={() => setAppliedJob(null)}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all"
            >
              {t.confirmBtn}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Feature Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      <JobPostModal isOpen={isJobPostOpen} onClose={() => setIsJobPostOpen(false)} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

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
