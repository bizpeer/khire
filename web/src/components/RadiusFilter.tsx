'use client';

import React from 'react';
import { RadiusOption } from '@/types/job';
import { Navigation, Compass, Globe } from 'lucide-react';

interface RadiusFilterProps {
  currentRadius: RadiusOption;
  onSelectRadius: (radius: RadiusOption) => void;
  userAddress: string;
  totalMatchCount: number;
}

const RADIUS_OPTIONS: { value: RadiusOption; label: string; subtext: string }[] = [
  { value: 15, label: '15 km', subtext: '초근거리 도보·대중교통' },
  { value: 30, label: '30 km (기본)', subtext: '권역내 30분 출퇴근' },
  { value: 60, label: '60 km', subtext: '광역권 광역 버스·차량' },
  { value: 150, label: '150 km', subtext: '인근 주요 한인 타운' },
  { value: 0, label: '국가 전체', subtext: '해당 국가 전체 직무' },
];

export default function RadiusFilter({
  currentRadius,
  onSelectRadius,
  userAddress,
  totalMatchCount,
}: RadiusFilterProps) {
  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6 mb-8 relative overflow-hidden border border-slate-800 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>당근마켓 방식 반경 거리 기반 채용 검색</span>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-white flex flex-wrap items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400 fill-emerald-400/20 shrink-0" />
            <span className="text-slate-100">{userAddress}</span>
            <span className="text-[11px] font-semibold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              기준 위치
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>반경 내 활성 공고:</span>
            <strong className="text-emerald-300 font-extrabold text-sm">{totalMatchCount}건</strong>
          </div>
        </div>
      </div>

      {/* Radius Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {RADIUS_OPTIONS.map((opt) => {
          const isActive = currentRadius === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectRadius(opt.value)}
              className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 text-center border ${
                isActive
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02] font-extrabold'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                </span>
              )}
              <div className="flex items-center gap-1.5 text-sm md:text-base font-extrabold">
                {opt.value === 0 && <Globe className="w-4 h-4" />}
                <span>{opt.label}</span>
              </div>
              <span
                className={`text-[11px] mt-1 truncate max-w-full font-medium ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                {opt.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
