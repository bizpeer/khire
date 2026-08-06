'use client';

import React, { useState } from 'react';
import { X, Download, FileText, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';

interface FbmLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FbmLookbookModal({ isOpen, onClose }: FbmLookbookModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-hidden glass-gold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold w-fit mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          FBM Secondary Target Behavior: 디지털 룩북 아카이빙
        </div>

        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          2026 Haute Horlogerie Official Digital Lookbook
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          스위스 독립 제작자의 손길과 4K 매크로 고화질 화보집을 고해상도 PDF 디지털 룩북으로 즉시 감상하실 수 있습니다.
        </p>

        {/* Lookbook Pages Preview Carousel Simulation */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center justify-center h-36 relative overflow-hidden group">
            <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black rounded-xl p-2 flex flex-col justify-between">
              <span className="text-[9px] text-amber-400 font-serif font-bold">VOL. 01</span>
              <p className="text-[10px] text-zinc-300 font-bold">Grand Complication Movement</p>
              <span className="text-[8px] text-zinc-500">COVER PAGE</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center justify-center h-36 relative overflow-hidden group">
            <div className="w-full h-full bg-gradient-to-br from-rose-500/20 via-zinc-900 to-black rounded-xl p-2 flex flex-col justify-between">
              <span className="text-[9px] text-rose-400 font-serif font-bold">VOL. 02</span>
              <p className="text-[10px] text-zinc-300 font-bold">Hand-Engraved Artisanal Bezel</p>
              <span className="text-[8px] text-zinc-500">PAGE 12-19</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center justify-center h-36 relative overflow-hidden group">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-black rounded-xl p-2 flex flex-col justify-between">
              <span className="text-[9px] text-emerald-400 font-serif font-bold">VOL. 03</span>
              <p className="text-[10px] text-zinc-300 font-bold">VIP Private Salon Heritage</p>
              <span className="text-[8px] text-zinc-500">PAGE 24-32</span>
            </div>
          </div>
        </div>

        {/* Download Action Bar */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AETERNO_2026_HAUTE_LOOKBOOK.pdf</p>
              <p className="text-[10px] text-zinc-400">파일 크기: 48.2 MB (초고화질 600DPI)</p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 shrink-0 shadow-lg"
          >
            {isDownloading ? (
              <span>다운로드 중...</span>
            ) : downloadComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                다운로드 완료
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                즉시 다운로드 (1-Click)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
