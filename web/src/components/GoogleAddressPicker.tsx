'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, CheckCircle2, Globe, Sparkles } from 'lucide-react';

interface GoogleAddressPickerProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export default function GoogleAddressPicker({
  value,
  onChange,
  placeholder = '예: 호주 시드니 스트라스필드 메인 St 또는 오클랜드 Queen St',
}: GoogleAddressPickerProps) {
  const [confirmedAddress, setConfirmedAddress] = useState<string>(
    value || 'Strathfield Plaza, Strathfield NSW 2135 (호주 시드니 스트라스필드)'
  );
  const [isConfirmed, setIsConfirmed] = useState<boolean>(true);

  // Sync internal confirmed address if external value changes
  useEffect(() => {
    if (value) {
      setConfirmedAddress(value);
      setIsConfirmed(true);
    }
  }, [value]);

  const handleInputChange = (newVal: string) => {
    onChange(newVal);
    setIsConfirmed(false);
  };

  const handleConfirmGoogleMaps = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!value.trim()) {
      alert('구글지도 연동할 호주/뉴질랜드 주소를 입력해 주세요. (예: 호주 시드니 스트라스필드)');
      return;
    }
    setConfirmedAddress(value.trim());
    setIsConfirmed(true);
  };

  // Live Google Maps Embed URL generated dynamically from user's exact input query (Default: Sydney Australia)
  const queryParam = encodeURIComponent(
    confirmedAddress || value || 'Strathfield Plaza, Strathfield NSW 2135, Sydney Australia'
  );
  const mapEmbedUrl = `https://maps.google.com/maps?q=${queryParam}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-2.5">
      {/* Input box + Google Maps Sync button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            required
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirmGoogleMaps();
              }
            }}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full font-medium"
          />
        </div>

        <button
          type="button"
          onClick={handleConfirmGoogleMaps}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-950" />
          <span>Google 연동</span>
        </button>
      </div>

      {/* Confirmation Banner */}
      {isConfirmed && confirmedAddress && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-[11px] text-emerald-300 font-bold animate-in fade-in">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">구글지도 연동 위치 확정: "{confirmedAddress}"</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
            동/호수 수집 제외
          </span>
        </div>
      )}

      {/* Live Interactive Google Map Preview (Sydney Australia Default) */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-800 shadow-lg bg-slate-950">
        <iframe
          key={confirmedAddress || 'sydney-default'}
          title="Google Maps Sydney Address Embed"
          src={mapEmbedUrl}
          className="w-full h-full border-none filter contrast-105 opacity-90"
          loading="lazy"
        />
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/90 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 shadow backdrop-blur-sm flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-400" />
          <span>Google Maps 실시간 핀 마킹 ({confirmedAddress || '호주 시드니 기본 마킹'})</span>
        </div>
      </div>
    </div>
  );
}
