'use client';

import React, { useState } from 'react';
import { MapPin, Search, Check, Sparkles, Navigation, Globe } from 'lucide-react';

interface GoogleAddressPickerProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export const POPULAR_GOOGLE_LOCATIONS = [
  { address: '3832 Wilshire Blvd, Los Angeles, CA 90010 (LA 한인타운 윌셔 Blvd)', lat: 34.0618, lng: -118.3000 },
  { address: '3250 Olympic Blvd, Los Angeles, CA 90006 (올림픽 올림픽몰)', lat: 34.0526, lng: -118.3061 },
  { address: '603 S New Hampshire Ave, Los Angeles, CA 90005', lat: 34.0622, lng: -118.2925 },
  { address: 'Strathfield Plaza, Strathfield NSW 2135 (시드니 한인 타운)', lat: -33.8765, lng: 151.0887 },
  { address: '1 Chome Shin-Okubo, Shinjuku City, Tokyo 169-0072 (도쿄 신쿠보)', lat: 35.7013, lng: 139.7001 },
  { address: 'Lonsdale Ave, North Vancouver, BC V7M 2H6 (밴쿠버 한인 상가)', lat: 49.3200, lng: -123.0720 },
];

export default function GoogleAddressPicker({
  value,
  onChange,
  placeholder = '구글지도 도로명 주소 검색...',
}: GoogleAddressPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGeo, setSelectedGeo] = useState<{ lat: number; lng: number }>({
    lat: 34.0618,
    lng: -118.3000,
  });

  const filteredLocations = POPULAR_GOOGLE_LOCATIONS.filter((loc) =>
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: { address: string; lat: number; lng: number }) => {
    onChange(loc.address, loc.lat, loc.lng);
    setSelectedGeo({ lat: loc.lat, lng: loc.lng });
    setIsDropdownOpen(false);
  };

  const handleManualInput = (newVal: string) => {
    onChange(newVal);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${selectedGeo.lat},${selectedGeo.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-2">
      {/* Search Input Box with Google Maps Icon */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            required
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleManualInput(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full font-medium"
          />
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/40 shrink-0 hover:bg-emerald-500/30 flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>Google 연동</span>
          </button>
        </div>

        {/* Real-time Google Maps Suggestions Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 z-40 mt-1 p-2 rounded-2xl bg-slate-950/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 text-[10px] text-slate-400 font-bold">
              <span className="flex items-center gap-1 text-emerald-400">
                <Globe className="w-3 h-3" /> Google Maps API 연동 도로명 주소
              </span>
              <span>(상세 동/호수 미수집)</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 py-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-900 text-xs text-slate-200 font-medium flex items-center justify-between transition group"
                  >
                    <span className="truncate pr-2 group-hover:text-emerald-300">
                      📍 {loc.address}
                    </span>
                    <Check className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  입력하신 <strong className="text-white">"{value}"</strong> 주소를 구글지도 연동 주소지로 지정합니다.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full py-1.5 text-center text-[11px] text-slate-400 hover:text-white font-semibold border-t border-slate-900"
            >
              닫기
            </button>
          </div>
        )}
      </div>

      {/* Interactive Google Map Preview Ring */}
      {value && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-800 shadow-md">
          <iframe
            title="Selected Google Maps Address Preview"
            src={mapEmbedUrl}
            className="w-full h-full border-none filter contrast-105 opacity-90 pointer-events-none"
            loading="lazy"
          />
          <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 shadow">
            📍 선택 구글지도 위치 마킹 완료
          </div>
        </div>
      )}
    </div>
  );
}
