'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Sparkles, Utensils, Hotel, Truck, Cpu, Eye, ShieldCheck, Layers, Palette, MapPin } from 'lucide-react';
import { JobCategory } from '@/types/job';

interface KhireWorkplaceViewerProps {
  category?: JobCategory;
  onOpenConsultation?: () => void;
}

export default function KhireWorkplaceViewer({ category = 'F_AND_B', onOpenConsultation }: KhireWorkplaceViewerProps) {
  const [angle, setAngle] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<'ROSE_GOLD' | 'OBSIDIAN' | 'PLATINUM'>('ROSE_GOLD');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const themes = {
    ROSE_GOLD: {
      name: '18K 샴페인 로즈골드 럭셔리 라운지 (Rose Gold)',
      accentColor: '#d4af37',
      bgGradient: 'from-amber-950/40 via-zinc-950 to-black',
      borderColor: 'border-amber-500/30',
      badge: 'F&B K-카페 & 디저트 인테리어',
    },
    OBSIDIAN: {
      name: '티타늄 옵시디언 K-BBQ 다이닝 (Obsidian Black)',
      accentColor: '#64748b',
      bgGradient: 'from-slate-900 via-zinc-950 to-black',
      borderColor: 'border-slate-700/50',
      badge: '정통 한식 BBQ 다이닝 인테리어',
    },
    PLATINUM: {
      name: '플래티넘 부티크 호텔 & 스마트 센터 (Platinum Silver)',
      accentColor: '#e2e8f0',
      bgGradient: 'from-slate-900/60 via-zinc-950 to-black',
      borderColor: 'border-slate-400/30',
      badge: '호스피탈리티 & 물류 인프라',
    },
  };

  const currentTheme = themes[selectedTheme];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    setAngle((prev) => (prev + deltaX * 0.5 + 360) % 360);
    startX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full rounded-3xl bg-zinc-950/90 border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden glass-gold">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            인지적 과부하 방지 (Brain Cycles Minimalized)
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
            360° 인터랙티브 <span className="text-gradient-gold">근무지/매장 인스펙터</span>
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            빽빽하고 어려운 스펙 텍스트 대신, 마우스 드래그 하나로 매장 인테리어와 업무 환경을 360° 즉시 감상하십시오.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isAutoRotate
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
            {isAutoRotate ? '360° 자동회전 중' : '회전 일시정지'}
          </button>
        </div>
      </div>

      {/* 360° Visual Canvas */}
      <div
        className={`relative h-[340px] md:h-[400px] w-full rounded-2xl bg-gradient-to-b ${currentTheme.bgGradient} border ${currentTheme.borderColor} flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden transition-all duration-700 shadow-inner`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Rotating Dial Frame */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotateY(${angle}deg)` }}
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-amber-500/20" />

          {/* Central 360 Workplace Graphic Canvas */}
          <div
            className="w-48 h-48 md:w-60 md:h-60 rounded-full glass-gold flex flex-col items-center justify-center relative shadow-2xl transition-colors duration-500 p-4 text-center"
            style={{
              borderColor: currentTheme.accentColor,
              boxShadow: `0 0 45px ${currentTheme.accentColor}25`,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-950/80 border border-amber-500/40 flex items-center justify-center text-3xl mb-2 shadow-lg">
              {selectedTheme === 'ROSE_GOLD' ? '☕' : selectedTheme === 'OBSIDIAN' ? '🍲' : '🏨'}
            </div>

            <span className="font-serif text-xs font-bold text-amber-300 uppercase tracking-widest block">
              WORKPLACE 360°
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
              {currentTheme.badge}
            </span>

            {/* Hotspot 1: Environment Detail */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'env' ? null : 'env');
              }}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 text-amber-300 flex items-center justify-center hover:scale-110 transition shadow-lg"
              title="근무 환경 확인"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Hotspot 2: Safety & Amenities */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'safety' ? null : 'safety');
              }}
              className="absolute bottom-4 left-4 w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center hover:scale-110 transition shadow-lg"
              title="복리후생 및 안전"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotspot Tooltip Overlays */}
        {activeHotspot === 'env' && (
          <div className="absolute top-6 right-6 max-w-xs p-4 rounded-2xl glass-gold border border-amber-500/40 text-left z-20 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-amber-300 uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 쾌적한 최신 인테리어 & 환기 시스템
            </h5>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              쾌적한 덕트 및 주방 덕트 시설 완비. 근무자 피로도를 최소화하는 수직 에르고노믹 동선 구조.
            </p>
            <button onClick={() => setActiveHotspot(null)} className="mt-2 text-[10px] text-amber-400 underline">
              닫기
            </button>
          </div>
        )}

        {activeHotspot === 'safety' && (
          <div className="absolute bottom-6 left-6 max-w-xs p-4 rounded-2xl glass-gold border border-emerald-500/40 text-left z-20 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-emerald-300 uppercase mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 주 40시간 보장 & 오버타임 수당
            </h5>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              정식 노동법 준수 및 상해보험 100% 가입. 팁 정산 투명화 및 중식 제공.
            </p>
            <button onClick={() => setActiveHotspot(null)} className="mt-2 text-[10px] text-emerald-400 underline">
              닫기
            </button>
          </div>
        )}

        <div className="absolute bottom-3 px-4 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 pointer-events-none flex items-center gap-2">
          <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
          <span>마우스 좌우 드래그 시 매장 근무지 시야가 360° 변경됩니다</span>
        </div>
      </div>

      {/* Theme / Material Switcher Buttons */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {(['ROSE_GOLD', 'OBSIDIAN', 'PLATINUM'] as const).map((tKey) => {
          const tItem = themes[tKey];
          const isSelected = selectedTheme === tKey;
          return (
            <button
              key={tKey}
              onClick={() => setSelectedTheme(tKey)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> {tKey.replace('_', ' ')}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <p className="text-xs font-bold text-white truncate">{tItem.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
