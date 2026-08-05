'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import RadiusFilter from '@/components/RadiusFilter';
import JobCard from '@/components/JobCard';
import GoogleMapView from '@/components/GoogleMapView';
import AuthModal from '@/components/AuthModal';
import ResumeModal from '@/components/ResumeModal';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import {
  MOCK_JOBS,
  INITIAL_USER_LOCATION,
  calculateHaversineDistance,
} from '@/lib/mockJobs';
import { detectUserLocation } from '@/lib/geoIp';
import { RadiusOption, JobPost, UserLocation } from '@/types/job';
import { Language, DICTIONARY } from '@/lib/i18n';
import { Sparkles, Map, List, Search, ShieldCheck, Globe2, Briefcase, Navigation } from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('KO');
  const t = DICTIONARY[language];

  const [userLocation, setUserLocation] = useState<UserLocation>(INITIAL_USER_LOCATION);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [selectedRadius, setSelectedRadius] = useState<RadiusOption>(30); // Default 30km as requested
  const [selectedVisa, setSelectedVisa] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [appliedJob, setAppliedJob] = useState<JobPost | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Detect IP & GPS location automatically on landing page load
  useEffect(() => {
    detectUserLocation().then((loc) => {
      setUserLocation(loc);
      setIsLocating(false);
    });
  }, []);

  // Toggle KO <-> EN language
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'KO' ? 'EN' : 'KO'));
  };

  // Calculate distance for all mock jobs relative to user's current location
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

  // Filter jobs based on radius option, visa filter, and search keyword
  const filteredJobs = useMemo(() => {
    return jobsWithDistance
      .filter((job) => {
        // Radius filter (30km default)
        if (selectedRadius !== 0 && job.distanceKm !== undefined) {
          if (job.distanceKm > selectedRadius) return false;
        }
        // Visa filter
        if (selectedVisa !== 'ALL') {
          if (!job.visaTypes.some((v) => v.includes(selectedVisa))) return false;
        }
        // Search keyword
        if (searchKeyword.trim() !== '') {
          const kw = searchKeyword.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(kw);
          const matchComp = job.companyName.toLowerCase().includes(kw);
          const matchSkill = job.skills.some((s) => s.toLowerCase().includes(kw));
          if (!matchTitle && !matchComp && !matchSkill) return false;
        }
        return true;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [jobsWithDistance, selectedRadius, selectedVisa, searchKeyword]);

  const handleApply = (job: JobPost) => {
    setAppliedJob(job);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {/* IP Location Status Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <Navigation className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              <strong>{t.ipDetected}:</strong> {userLocation.address}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            30km 반경 자동 감지 완료
          </span>
        </div>

        {/* Hero Section */}
        <section className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {t.heroTag}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {t.heroTitle1} <br />
              <span className="text-gradient">{t.heroTitle2}</span>
              {t.heroTitle3}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mb-6 font-normal leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Keyword Search Input */}
            <div className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-slate-700 max-w-xl">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full px-2 py-1.5"
              />
              <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shrink-0 transition-all shadow-md shadow-indigo-600/30">
                {t.searchBtn}
              </button>
            </div>
          </div>

          {/* Visa Info Spotlight */}
          <div className="w-full md:w-80 glass-card p-5 rounded-2xl border border-slate-700/80 shrink-0 relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              {t.visaFilterTitle}
            </div>
            <p className="text-xs text-slate-300 mb-4">
              {t.visaFilterDesc}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'E-7', 'F-4', 'F-6', 'H-1', 'D-10'].map((visa) => (
                <button
                  key={visa}
                  onClick={() => setSelectedVisa(visa)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedVisa === visa
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {visa === 'ALL' ? t.visaAll : `Visa ${visa}`}
                </button>
              ))}
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

        {/* Google Maps View Component (30km Radius Interactive Map) */}
        <GoogleMapView
          userLocation={userLocation}
          radiusKm={selectedRadius}
          jobs={filteredJobs}
          onSelectJob={handleApply}
        />

        {/* Jobs Grid Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                반경 내 추천 채용 공고
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                가장 근거리에 위치한 매칭 공고순으로 자동 정렬됩니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'LIST'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                <List className="w-4 h-4" />
                {t.listView}
              </button>
              <button
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                <Map className="w-4 h-4 text-emerald-400" />
                {t.mapView}
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
              <Globe2 className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-300 mb-1">
                {t.noJobsTitle}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {t.noJobsDesc}
              </p>
              <button
                onClick={() => {
                  setSelectedRadius(150);
                  setSelectedVisa('ALL');
                  setSearchKeyword('');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full border border-indigo-500/40 shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              ✨
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              {t.appliedSuccessTitle}
            </h3>
            <p className="text-xs text-slate-300 text-center mb-6 leading-relaxed">
              <strong className="text-indigo-300 font-bold">{appliedJob.companyName}</strong>의 <br />
              &quot;{appliedJob.title}&quot; 공고에 회원님의 AI 분석 이력서가 성공적으로 전달되었습니다.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 mb-6 flex justify-between">
              <span>AI 매칭 점수:</span>
              <span className="text-emerald-400 font-bold">{appliedJob.matchScore}% Match</span>
            </div>

            <button
              onClick={() => setAppliedJob(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              {t.confirmBtn}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Feature Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <span>KHIRE Platform</span>
            <span>·</span>
            <span>{t.brandTagline}</span>
          </div>
          <div>© 2026 KHIRE Inc. All rights reserved. (khire.net)</div>
        </div>
      </footer>
    </div>
  );
}
