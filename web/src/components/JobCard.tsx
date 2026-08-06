'use client';

import React from 'react';
import { JobPost } from '@/types/job';
import { MapPin, Sparkles, Clock, Bus, Car, Zap, Building2, Utensils, Hotel, Truck, Cpu, CalendarCheck, Image as ImageIcon, Eye } from 'lucide-react';

interface JobCardProps {
  job: JobPost;
  onApply?: (job: JobPost) => void;
  onViewDetail?: (job: JobPost) => void;
}

export default function JobCard({ job, onApply, onViewDetail }: JobCardProps) {
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

  // Calculate remaining days for 7-day post duration
  const get7DayStatus = () => {
    if (!job.expiresAt) return { text: '7일 게시 중', badgeStyle: 'bg-slate-800 text-slate-300' };
    const expiresDate = new Date(job.expiresAt);
    const now = new Date();
    const diffMs = expiresDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: '7일 게시 기간 만료 (연장 결제 필요)', badgeStyle: 'bg-rose-950/80 text-rose-300 border-rose-800/80' };
    }
    return { text: `7일 게시 중 (D-${diffDays}일 남음)`, badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' };
  };

  const dayStatus = get7DayStatus();

  return (
    <article
      onClick={() => onViewDetail && onViewDetail(job)}
      className="glass-card rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative group border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer"
    >
      <div>
        {/* Attached Job Image (if available - either URL or uploaded file) */}
        {job.imageUrl && (
          <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-slate-800 shadow-inner group-hover:border-emerald-500/30 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.imageUrl}
              alt={job.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-slate-200 font-medium flex items-center gap-1 border border-white/10">
              <ImageIcon className="w-3 h-3 text-emerald-400" /> 공고 이미지 첨부됨
            </span>
          </div>
        )}

        {/* Top Header Row: Category Badge & AI Match Score & Daangn Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${categoryMeta.style}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{categoryMeta.label}</span>
            </span>

            {/* Daangn Employer Score Badge */}
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-extrabold border border-amber-500/30 flex items-center gap-1">
              ⭐ {job.daangnScore || 4.8}
            </span>
          </div>

          {/* AI Match Score Badge */}
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{job.matchScore}% AI 추천</span>
          </div>
        </div>

        {/* Company Logo & Job Title */}
        <div className="flex items-start gap-3.5 mb-3.5">
          {!job.imageUrl && (
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              {job.companyLogo || '🏢'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-400 block tracking-tight truncate">
              {job.companyName}
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
              {job.title}
            </h3>
          </div>
        </div>

        {/* 7-Day Payment Expiration Indicator Pill */}
        <div className="mb-3.5">
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 w-fit ${dayStatus.badgeStyle}`}>
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dayStatus.text}</span>
          </span>
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

      {/* Footer: Salary & Action Buttons */}
      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            급여 조건
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {job.salary}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetail) onViewDetail(job);
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>읽기</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onApply) onApply(job);
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>지원하기</span>
          </button>
        </div>
      </div>
    </article>
  );
}
