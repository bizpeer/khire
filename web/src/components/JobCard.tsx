'use client';

import React from 'react';
import { JobPost } from '@/types/job';
import { MapPin, Sparkles, Clock, Bus, Car, Zap, Building2, Utensils, Hotel, Truck, Cpu } from 'lucide-react';

interface JobCardProps {
  job: JobPost;
  onApply?: (job: JobPost) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const getCategoryBadge = () => {
    switch (job.category) {
      case 'F_AND_B':
        return {
          label: 'F&B (식당·카페)',
          icon: Utensils,
          style: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'LODGING_CLEANING':
        return {
          label: '숙박 & 청소',
          icon: Hotel,
          style: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
        };
      case 'LOGISTICS':
        return {
          label: '물류 & 현장',
          icon: Truck,
          style: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        };
      case 'TECH':
        return {
          label: '기술 & IT',
          icon: Cpu,
          style: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        };
      default:
        return {
          label: '일반 채용',
          icon: Building2,
          style: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const categoryMeta = getCategoryBadge();
  const CategoryIcon = categoryMeta.icon;

  return (
    <article className="glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative group border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl">
      <div>
        {/* Top Header Row: Category Badge & AI Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${categoryMeta.style}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{categoryMeta.label}</span>
          </span>

          {/* AI Match Score Badge */}
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{job.matchScore}% AI 추천</span>
          </div>
        </div>

        {/* Company Logo & Job Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            {job.companyLogo || '🏢'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-400 block tracking-tight truncate">
              {job.companyName}
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Location & Radius Distance Pill */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{job.distanceKm !== undefined ? `${job.distanceKm} km 거리` : '위치 미상'}</span>
          </span>

          <span className="text-slate-400 truncate max-w-[200px] text-[11px]">
            {job.locationName}
          </span>
        </div>

        {/* Skill Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-900/90 text-slate-300 border border-slate-800"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Commute Time Estimate Widget */}
        {job.commuteTimeEstimate && (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 mb-4 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300 flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              예상 출퇴근:
            </span>
            <div className="flex items-center gap-3 text-slate-200 font-bold text-xs">
              <span className="flex items-center gap-1">
                <Bus className="w-3.5 h-3.5 text-blue-400" />
                {job.commuteTimeEstimate.transitMinutes}분
              </span>
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                {job.commuteTimeEstimate.carMinutes}분
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Salary & Action Button */}
      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            급여 조건
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {job.salary}
          </span>
        </div>

        <button
          onClick={() => onApply && onApply(job)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
            job.isEasyApply
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {job.isEasyApply && <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />}
          <span>{job.isEasyApply ? '즉시 지원 (Easy Apply)' : '상세보기'}</span>
        </button>
      </div>
    </article>
  );
}
