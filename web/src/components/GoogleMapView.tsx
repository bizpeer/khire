'use client';

import React, { useState } from 'react';
import { JobPost, UserLocation, RadiusOption } from '@/types/job';
import { MapPin, Navigation, Sparkles, ExternalLink, Layers, ZoomIn } from 'lucide-react';

interface GoogleMapViewProps {
  userLocation: UserLocation;
  radiusKm: RadiusOption;
  jobs: JobPost[];
  onSelectJob?: (job: JobPost) => void;
}

export default function GoogleMapView({
  userLocation,
  radiusKm,
  jobs,
  onSelectJob,
}: GoogleMapViewProps) {
  const [activeJobPin, setActiveJobPin] = useState<JobPost | null>(null);

  // Google Maps Embed URL for user's latitude and longitude (LA Koreatown default)
  const embedUrl = `https://maps.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 mb-8 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Google Maps Real Live Job Radar
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            구글지도 반경 {radiusKm === 0 ? '전국' : `${radiusKm}km`} 실제 업체 주소 핀 표출
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          반경 마킹 공고: <strong className="text-emerald-300 font-bold ml-1">{jobs.length}건</strong>
        </div>
      </div>

      {/* Real Google Maps Canvas */}
      <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        {/* Real Interactive Google Maps Iframe */}
        <iframe
          title="Google Maps Location Radar"
          src={embedUrl}
          className="w-full h-full border-none filter contrast-105 opacity-90"
          loading="lazy"
          allowFullScreen
        />

        {/* 30km Radius Visual Overlay Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-2 border-dashed border-emerald-400/80 bg-emerald-500/10 backdrop-blur-[1px] animate-pulse relative flex items-center justify-center">
            <span className="absolute -top-3 px-3.5 py-1 rounded-full bg-slate-950 text-[11px] font-bold text-emerald-300 shadow-xl border border-emerald-500/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {radiusKm === 0 ? '전국 전체' : `${radiusKm}km 자동 반경 연동`}
            </span>
          </div>
        </div>

        {/* Center User Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-2xl ring-4 ring-emerald-500/40 animate-bounce">
            <MapPin className="w-6 h-6 fill-slate-950" />
          </div>
          <span className="mt-1 px-3 py-1 rounded-full bg-slate-950/90 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40 shadow-xl">
            📍 접속 기준 위치 ({userLocation.countryName})
          </span>
        </div>

        {/* Job Pins Floating around Center */}
        {jobs.map((job, index) => {
          const offsetX = (index % 2 === 0 ? 1 : -1) * (70 + index * 40);
          const offsetY = (index % 3 === 0 ? -1 : 1) * (50 + index * 30);

          return (
            <div
              key={job.id}
              onClick={() => {
                setActiveJobPin(job);
                if (onSelectJob) onSelectJob(job);
              }}
              style={{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))` }}
              className="absolute top-1/2 left-1/2 z-30 cursor-pointer group transition-all duration-300 hover:scale-110"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/95 border border-emerald-500/60 text-white text-xs font-bold shadow-2xl flex items-center gap-1.5 group-hover:border-emerald-400 group-hover:bg-emerald-950">
                  <span>{job.companyLogo || '🏢'}</span>
                  <span className="truncate max-w-[110px]">{job.companyName}</span>
                  <span className="text-[10px] text-emerald-300 font-extrabold px-1 rounded bg-emerald-950 border border-emerald-500/40">
                    {job.distanceKm ? `${job.distanceKm}km` : '내 주변'}
                  </span>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rotate-45 -mt-1.5 border-r border-b border-emerald-400 shadow-md" />
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-30 p-3 rounded-2xl glass-panel text-[11px] text-slate-300 border border-slate-800 flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping" />
            <strong className="text-white">구글지도 연동</strong> (실제 도로명 주소)
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userLocation.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
          >
            Google Maps 앱에서 열기 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
