'use client';

import React, { useState, useEffect } from 'react';
import { JobPost } from '@/types/job';
import { Crown, Sparkles, MapPin, ArrowRight, Zap, ChevronRight, Clock } from 'lucide-react';

interface PremiumAdRotationTickerProps {
  jobs: JobPost[];
  onViewDetail: (job: JobPost) => void;
}

export default function PremiumAdRotationTicker({ jobs, onViewDetail }: PremiumAdRotationTickerProps) {
  // Filter jobs that paid $30 premium ad tier (or fallback to top jobs if none)
  const premiumJobs = jobs.filter((j) => j.isPremiumAd || j.adPrice === 30)
    .length > 0 ? jobs.filter((j) => j.isPremiumAd || j.adPrice === 30) : jobs.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // 5-Second Rotation Effect with Smooth Timer Progress Bar
  useEffect(() => {
    if (premiumJobs.length === 0) return;

    // Reset progress on index change
    setProgress(0);

    const stepMs = 50; // update progress every 50ms
    const totalSteps = (5 * 1000) / stepMs; // 100 steps for 5 seconds

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / totalSteps);
      });
    }, stepMs);

    const rotationTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % premiumJobs.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(rotationTimer);
    };
  }, [currentIndex, premiumJobs.length]);

  if (premiumJobs.length === 0) return null;

  const currentJob = premiumJobs[currentIndex];

  return (
    <div className="mb-6 relative rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/40 p-4 md:p-5 shadow-2xl overflow-hidden glass-gold group">
      {/* Dynamic Gold Shimmer Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-md">
            <Crown className="w-3.5 h-3.5 fill-zinc-950" />
            👑 $30.00 USD 프리미엄 5초 로테이션 광고
          </span>
          <span className="text-[11px] text-amber-300 font-semibold hidden md:inline">
            스폰서 사업자 공고 (5초 자동 전환)
          </span>
        </div>

        {/* Rotation Counter */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Clock className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{currentIndex + 1} / {premiumJobs.length}</span>
        </div>
      </div>

      {/* 5-Second Timer Progress Bar Indicator */}
      <div className="w-full bg-zinc-900/90 h-1.5 rounded-full overflow-hidden mb-3 border border-amber-500/20">
        <div
          className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Rotation Content Banner */}
      <div
        onClick={() => onViewDetail(currentJob)}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-amber-500/5 p-2 rounded-xl transition-all"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-lg gold-border-glow">
            {currentJob.companyLogo || '🏢'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-amber-300 truncate">
                {currentJob.companyName}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                {currentJob.matchScore}% AI 추천
              </span>
            </div>

            <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors truncate">
              {currentJob.title}
            </h4>

            <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{currentJob.locationName}</span>
            </p>
          </div>
        </div>

        {/* Salary & Action Callout */}
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              프리미엄 급여 조건
            </span>
            <span className="text-base font-extrabold text-emerald-400">
              {currentJob.salary}
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-xs tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>상세보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
