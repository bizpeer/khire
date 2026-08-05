'use client';

import React, { useEffect, useState } from 'react';
import { CountryNews } from '@/types/job';
import { fetchCountry24hNews } from '@/lib/geminiNewsService';
import { Newspaper, Sparkles, Clock, Globe } from 'lucide-react';

interface NewsTickerProps {
  countryCode: string;
  countryName: string;
}

export default function NewsTicker({ countryCode, countryName }: NewsTickerProps) {
  const [newsList, setNewsList] = useState<CountryNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    fetchCountry24hNews(countryCode, countryName).then((data) => {
      setNewsList(data);
      setLoading(false);
    });
  }, [countryCode, countryName]);

  // Auto rotate news every 5 seconds
  useEffect(() => {
    if (newsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % newsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsList]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-4 mb-6 border border-purple-500/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
          <span>Gemini 3 Flash AI가 <strong>{countryName}</strong> 최근 24시간 이민자/F&B 주요 뉴스 3개를 분석 중입니다...</span>
        </div>
      </div>
    );
  }

  const currentNews = newsList[activeIdx] || newsList[0];

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-5 mb-8 border border-purple-500/30 relative overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Badge & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-300 font-bold text-xs flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>{countryName} 24h AI News</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Gemini 3 Flash 브리핑
          </span>
        </div>

        {/* Middle News Slide Content */}
        {currentNews && (
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold shrink-0">
                TOP {activeIdx + 1}
              </span>
              <strong className="text-white font-semibold truncate hover:text-indigo-300 cursor-pointer">
                {currentNews.title}
              </strong>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
              <span className="text-indigo-300 font-medium">{currentNews.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {currentNews.timeAgo}
              </span>
            </div>
          </div>
        )}

        {/* Right Dots Selector */}
        <div className="flex items-center gap-1.5 shrink-0 justify-end">
          {newsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeIdx === idx ? 'bg-purple-400 w-5' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
