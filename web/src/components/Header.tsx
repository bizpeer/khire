'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, User, Bell, ShieldCheck, Globe, PlusCircle } from 'lucide-react';
import { Language, DICTIONARY } from '@/lib/i18n';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenAuth?: () => void;
  onOpenResume?: () => void;
  onOpenJobPost?: () => void;
  onOpenAdmin?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({
  language,
  onToggleLanguage,
  onOpenAuth,
  onOpenResume,
  onOpenJobPost,
  onOpenAdmin,
  isLoggedIn = false,
  userEmail,
  onLogout,
}: HeaderProps) {
  const t = DICTIONARY[language];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              KHIRE
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {t.badgeAiRadius}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 tracking-tight font-medium">
              {t.brandTagline}
            </span>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{t.navDistance}</span>
          </Link>
          <Link
            href="#ai-match"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{t.navAiMatch}</span>
          </Link>
          <button
            onClick={onOpenAdmin}
            className="hover:text-purple-300 transition-colors text-slate-300 flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-purple-950/50 border border-purple-800/60 font-bold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.navAdmin}</span>
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Toggle KO / EN */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all shadow-sm"
            title="언어 변경 (Language Switcher)"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{language === 'KO' ? '한국어 🇰🇷' : 'English 🇺🇸'}</span>
          </button>

          <button
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors relative"
            title="알림"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={onOpenResume}
            className="hidden sm:flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>{t.navResume}</span>
          </button>

          <button
            onClick={onOpenJobPost}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>{t.navPostJob}</span>
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{userEmail || '로그인 회원'}</span>
              </span>
              <button
                onClick={onLogout}
                className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
            >
              <User className="w-3.5 h-3.5 text-slate-950" />
              <span>로그인 / 회원가입</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
