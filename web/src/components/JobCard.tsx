'use client';

import React from 'react';
import { JobPost } from '@/types/job';
import { MapPin, Sparkles, Clock, Bus, Car, Zap, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: JobPost;
  onApply?: (job: JobPost) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col justify-between h-full relative group border border-slate-800 hover:border-indigo-500/40">
      {/* Top Banner & AI Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
              {job.companyLogo || '🏢'}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block tracking-tight">
                {job.companyName}
              </span>
              <h3 className="text-base md:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          {/* AI Match Score Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{job.matchScore}% AI Match</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">이력서 분석 추천</span>
          </div>
        </div>

        {/* Location & Radius Distance Pill */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {job.distanceKm !== undefined ? `${job.distanceKm} km 거리` : job.locationName}
          </span>

          <span className="text-slate-400 truncate max-w-[200px]">
            {job.locationName}
          </span>
        </div>

        {/* Visa Types & Skills Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {job.visaTypes.map((visa) => (
            <span
              key={visa}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-950/60 border border-purple-800/60 text-purple-300"
            >
              비자 {visa}
            </span>
          ))}
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Commute Time Estimate */}
        {job.commuteTimeEstimate && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-4 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              예상 출퇴근 시간:
            </span>
            <div className="flex items-center gap-3 text-slate-300 font-semibold">
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
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        <div>
          <span className="text-[11px] text-slate-400 block">급여 조건</span>
          <span className="text-sm md:text-base font-bold text-emerald-400">
            {job.salary}
          </span>
        </div>

        <button
          onClick={() => onApply && onApply(job)}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
            job.isEasyApply
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {job.isEasyApply && <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
          {job.isEasyApply ? '즉시 지원 (Easy Apply)' : '상세보기 및 지원'}
        </button>
      </div>
    </div>
  );
}
