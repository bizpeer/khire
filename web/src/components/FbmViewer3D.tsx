'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Sparkles, ShieldCheck, Eye, Layers, Palette } from 'lucide-react';

interface FbmViewer3DProps {
  onOpenLookbook: () => void;
  onOpenConsultation: (productEdition: string) => void;
}

export default function FbmViewer3D({ onOpenLookbook, onOpenConsultation }: FbmViewer3DProps) {
  const [angle, setAngle] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<'OBSIDIAN' | 'ROSE_GOLD' | 'PLATINUM'>('ROSE_GOLD');
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

  const materials = {
    OBSIDIAN: {
      name: '티타늄 옵시디언 (Obsidian Black)',
      accentColor: '#1e293b',
      ringColor: '#64748b',
      bgGradient: 'from-slate-900 via-zinc-950 to-black',
      caseBorder: 'border-slate-700/50',
      editionCode: 'EDITION NO. 03 / 50',
    },
    ROSE_GOLD: {
      name: '18K 샴페인 로즈골드 (Champagne Gold)',
      accentColor: '#d4af37',
      ringColor: '#fbbf24',
      bgGradient: 'from-amber-950/40 via-zinc-950 to-black',
      caseBorder: 'border-amber-500/30',
      editionCode: 'EDITION NO. 01 / 50 (RECOMMENDED)',
    },
    PLATINUM: {
      name: '플래티넘 실버 (Pure Platinum)',
      accentColor: '#e2e8f0',
      ringColor: '#94a3b8',
      bgGradient: 'from-slate-900/60 via-zinc-950 to-black',
      caseBorder: 'border-slate-400/30',
      editionCode: 'EDITION NO. 07 / 50',
    },
  };

  const currentMat = materials[selectedMaterial];

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
    <div className="w-full rounded-3xl bg-zinc-950/90 border border-amber-500/20 p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Subtle background luxury glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            FBM Ability: 인지 피로 제로 (Brain Cycles Minimalized)
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
            AETERNO K-CHRONO <span className="text-gradient-gold">Grand Complication</span>
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            복잡한 스펙 표를 읽을 필요 없이, 드래그하여 360° 장인정신과 디테일을 체험하십시오.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isAutoRotate
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
            {isAutoRotate ? '자동 회전 중' : '회전 일시정지'}
          </button>
        </div>
      </div>

      {/* 360° Visual Canvas Container */}
      <div
        className={`relative h-[360px] md:h-[450px] w-full rounded-2xl bg-gradient-to-b ${currentMat.bgGradient} border ${currentMat.caseBorder} flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden transition-all duration-700 shadow-inner`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Dynamic Rotation Visual Dial */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotateY(${angle}deg)` }}
        >
          {/* Outer Dial Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-amber-500/20" />

          {/* Central Luxury Watch/Artifact Graphic Representation */}
          <div
            className="w-48 h-48 md:w-60 md:h-60 rounded-full glass-gold flex items-center justify-center relative shadow-2xl transition-colors duration-500"
            style={{
              borderColor: currentMat.accentColor,
              boxShadow: `0 0 50px ${currentMat.accentColor}25`,
            }}
          >
            {/* Tourbillon / Core Dial Hands */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border border-amber-500/40 bg-zinc-950/80 flex items-center justify-center">
              {/* Dial Hour Markers */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1 h-3 bg-amber-500/60 top-1 origin-bottom"
                  style={{ transform: `rotate(${deg}deg) translateY(0px)` }}
                />
              ))}

              {/* Watch Hands */}
              <div
                className="absolute w-1 h-16 bg-gradient-to-t from-amber-400 to-white top-4 origin-bottom rounded-full"
                style={{ transform: `rotate(${angle * 2}deg)` }}
              />
              <div
                className="absolute w-1.5 h-12 bg-amber-500 top-8 origin-bottom rounded-full"
                style={{ transform: `rotate(${angle * 0.5}deg)` }}
              />
              <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-zinc-950 z-10 gold-border-glow" />

              <span className="absolute bottom-6 font-serif text-[10px] tracking-widest text-amber-300 font-bold uppercase">
                K-HAUTE 2026
              </span>
            </div>

            {/* Interactive Hotspot 1: Tourbillon Movement */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'tourbillon' ? null : 'tourbillon');
              }}
              className="absolute top-6 right-6 w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 text-amber-300 flex items-center justify-center animate-ping-slow hover:scale-110 transition shadow-lg"
              title="무브먼트 관찰"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Interactive Hotspot 2: Authenticity Seal */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === 'seal' ? null : 'seal');
              }}
              className="absolute bottom-6 left-6 w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 text-amber-300 flex items-center justify-center hover:scale-110 transition shadow-lg"
              title="정품 온체인 보증"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotspot Tooltip Overlays */}
        {activeHotspot === 'tourbillon' && (
          <div className="absolute top-6 right-6 max-w-xs p-4 rounded-2xl glass-gold border border-amber-500/40 text-left z-20 animate-in fade-in zoom-in-95 duration-200">
            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 뚜르비옹(Tourbillon) 자이로 매커니즘
            </h5>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              중력 오차를 완벽히 상쇄하는 스위스 독립 장인의 452개 Hand-crafted 파츠 결합.
            </p>
            <button
              onClick={() => setActiveHotspot(null)}
              className="mt-2 text-[10px] text-amber-400 underline"
            >
              닫기
            </button>
          </div>
        )}

        {/* Hotspot Tooltip 2 */}
        {activeHotspot === 'seal' && (
          <div className="absolute bottom-6 left-6 max-w-xs p-4 rounded-2xl glass-gold border border-amber-500/40 text-left z-20 animate-in fade-in zoom-in-95 duration-200">
            <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 온체인 블록체인 100% 정품 보증
            </h5>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              위조품 걱정 완전 차단. 고유 시리얼 넘버 및 소유권 암호화 NFT 보증서 발행 (Fear 회피).
            </p>
            <button
              onClick={() => setActiveHotspot(null)}
              className="mt-2 text-[10px] text-amber-400 underline"
            >
              닫기
            </button>
          </div>
        )}

        {/* Instruction Badge at bottom */}
        <div className="absolute bottom-3 px-4 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 pointer-events-none flex items-center gap-2">
          <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
          <span>마우스로 좌우 드래그 시 각도가 실시간 변경됩니다.</span>
        </div>
      </div>

      {/* Material & Finish Selector (Simplicity & Ability) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['ROSE_GOLD', 'OBSIDIAN', 'PLATINUM'] as const).map((matKey) => {
          const mat = materials[matKey];
          const isSelected = selectedMaterial === matKey;
          return (
            <button
              key={matKey}
              onClick={() => setSelectedMaterial(matKey)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> {matKey.replace('_', ' ')}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <p className="text-sm font-semibold text-white">{mat.name}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{mat.editionCode}</p>
            </button>
          );
        })}
      </div>

      {/* Action Bar (Trigger & Primary Target Behavior) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">시즌 2026 희소 한정 에디션</span>
          <span className="text-xl font-serif font-bold text-amber-300">
            {currentMat.name}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenLookbook}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            룩북 (Lookbook) 다운로드
          </button>

          <button
            onClick={() => onOpenConsultation(currentMat.name)}
            className="flex-1 sm:flex-initial px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-extrabold shadow-xl hover:shadow-amber-500/30 transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            1:1 VIP 상담 신청 (1초 완료)
          </button>
        </div>
      </div>
    </div>
  );
}
