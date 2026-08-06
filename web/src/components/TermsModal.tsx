'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Globe2, CheckCircle2 } from 'lucide-react';
import { TERMS_DATA } from '@/lib/termsData';
import { Language } from '@/lib/i18n';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export default function TermsModal({ isOpen, onClose, language = 'KO' }: TermsModalProps) {
  const [lang, setLang] = useState<Language>(language);
  const currentTerms = TERMS_DATA[lang] || TERMS_DATA.KO;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-4xl w-full border border-indigo-500/40 shadow-2xl relative max-h-[85vh] flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{currentTerms.title}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  2026 개정법 준수
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {currentTerms.subtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Language Switcher & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang((prev) => (prev === 'KO' ? 'EN' : 'KO'))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'KO' ? '🇰🇷 한국어' : '🇺🇸 English'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto py-6 pr-2 space-y-6 text-xs text-slate-300">
          {currentTerms.chapters.map((ch) => (
            <div key={ch.id} className="p-4 md:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>{ch.title}</span>
              </h4>

              <div className="space-y-4">
                {ch.articles.map((art) => (
                  <div key={art.id} className="space-y-1.5 pl-2 border-l-2 border-slate-800 hover:border-indigo-500/50 transition-colors">
                    <h5 className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="text-emerald-400">{art.number}</span>
                      <span>({art.title})</span>
                    </h5>
                    {art.content.map((p, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>KHIRE 플랫폼은 공정거래위원회 표준약관 및 사용자 동의권을 엄격히 보장합니다.</span>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-all"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
