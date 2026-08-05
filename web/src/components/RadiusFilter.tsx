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
  { value: 15, label: '15 km', subtext: '성수 · 잠실 · 왕십리' },
  { value: 30, label: '30 km', subtext: '강남 · 판교 · 분당' },
  { value: 60, label: '60 km', subtext: '수원 · 안양 · 인천' },
  { value: 150, label: '150 km', subtext: '대전 · 원주 · 충청' },
  { value: 0, label: '국가 전체', subtext: '전국 및 글로벌' },
];

export default function RadiusFilter({
  currentRadius,
  onSelectRadius,
  userAddress,
  totalMatchCount,
}: RadiusFilterProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 mb-8 shadow-xl relative overflow-hidden border border-indigo-500/20">
      {/* Background Ambient Blur */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 animate-spin-slow" />
            위치 기반 당근마켓 방식 반경 검색
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            <span>{userAddress}</span>
            <span className="text-xs font-normal text-slate-400 px-2 py-1 rounded bg-slate-800 border border-slate-700">
              기준 위치
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            반경 내 활성 공고: <strong className="text-white font-bold">{totalMatchCount}건</strong>
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
              className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl transition-all duration-300 text-left border ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-600/90 to-blue-700/90 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              )}
              <div className="flex items-center gap-1.5 font-bold text-base md:text-lg">
                {opt.value === 0 ? <Globe className="w-4 h-4 text-indigo-300" /> : null}
                {opt.label}
              </div>
              <span
                className={`text-[11px] mt-0.5 truncate max-w-full font-medium ${
                  isActive ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                {opt.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
