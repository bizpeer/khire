'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, User, Briefcase, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenAuth?: () => void;
  onOpenResume?: () => void;
  onOpenAdmin?: () => void;
}

export default function Header({ onOpenAuth, onOpenResume, onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              KHIRE
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Radius
              </span>
            </span>
            <span className="text-[11px] text-slate-400 tracking-wide font-medium">
              Hire Near. Hire Smart.
            </span>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-indigo-400"
          >
            <MapPin className="w-4 h-4" />
            거리 기반 채용
          </Link>
          <Link
            href="#ai-match"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            AI 매칭 공고
          </Link>
          <Link
            href="#visa-info"
            className="hover:text-indigo-400 transition-colors text-slate-300"
          >
            이민자 비자 정보
          </Link>
          <button
            onClick={onOpenAdmin}
            className="hover:text-purple-400 transition-colors text-slate-300 flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            관리자 Portal
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors relative"
            title="알림"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          
          <button
            onClick={onOpenResume}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <User className="w-4 h-4 text-indigo-400" />
            이력서 등록
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all"
          >
            로그인 / 가입
          </button>
        </div>
      </div>
    </header>
  );
}
