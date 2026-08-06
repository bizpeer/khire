'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, User, Bell, Globe, ChevronDown, PlusCircle } from 'lucide-react';
import { Language, DICTIONARY } from '@/lib/i18n';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenAuth?: () => void;
  onOpenResume?: () => void;
  onOpenJobPost?: () => void;
  onOpenProfile?: () => void;
  onOpenUserDashboard?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
  currentAddress?: string;
}

export default function Header({
  language,
  onToggleLanguage,
  onOpenAuth,
  onOpenResume,
  onOpenJobPost,
  onOpenProfile,
  onOpenUserDashboard,
  isLoggedIn = false,
  userEmail,
  onLogout,
  currentAddress = 'Sydney Strathfield',
}: HeaderProps) {
  const t = DICTIONARY[language];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#101828]/70 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-4 md:px-8 h-16 transition-all duration-300">
      {/* Left: Location Selector */}
      <button
        onClick={onOpenProfile}
        className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-opacity active:scale-95 duration-200 cursor-pointer group"
      >
        <span className="material-symbols-outlined text-[20px] text-amber-400 group-hover:scale-110 transition-transform">
          location_on
        </span>
        <span className="text-xs font-semibold tracking-tight text-slate-200 max-w-[140px] sm:max-w-none truncate">
          {currentAddress}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Center Logo */}
      <Link
        href="/"
        className="text-xl md:text-2xl font-black tracking-tighter text-[#ffc174] hover:opacity-90 transition-opacity absolute left-1/2 -translate-x-1/2 flex items-center gap-1"
      >
        <span>KHIRE</span>
        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
          AU/NZ AI
        </span>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-bold transition shadow-sm"
          title="Language Switcher"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'KO' ? 'KO 🇰🇷' : 'EN 🇺🇸'}</span>
        </button>

        {/* Post Job Quick Button */}
        <button
          onClick={onOpenJobPost}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold transition"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>공고 등록 ($1)</span>
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUserDashboard}
              className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">대시보드</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-amber-400 transition-colors flex items-center justify-center bg-slate-900"
              title={userEmail}
            >
              <span className="material-symbols-outlined text-slate-300 text-lg">person</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-full bg-[#ffc174] hover:bg-[#ffb95f] text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            <span>로그인</span>
          </button>
        )}
      </div>
    </header>
  );
}
