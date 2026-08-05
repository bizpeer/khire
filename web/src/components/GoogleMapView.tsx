'use client';

import React, { useEffect, useRef } from 'react';
import { JobPost, UserLocation, RadiusOption } from '@/types/job';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

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
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 mb-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Google Maps 30km Radius Live Job Radar
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            구글지도 반경 {radiusKm === 0 ? '전국' : `${radiusKm}km`} 일자리 맵 뷰
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          지도 표출 공고: <strong className="text-emerald-300 font-bold ml-1">{jobs.length}건</strong>
        </div>
      </div>

      {/* Map Container Canvas */}
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
        {/* Interactive Simulated Google Maps Surface */}
        <div
          ref={mapRef}
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${userLocation.latitude},${userLocation.longitude}&zoom=11&size=800x450&maptype=roadmap&key=AIzaSyA_sample_key')`,
            backgroundColor: '#0f172a',
          }}
        />

        {/* 30km Radius Visual Overlay Circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border-2 border-dashed border-indigo-400/60 bg-indigo-500/10 backdrop-blur-[1px] animate-pulse relative flex items-center justify-center">
            <span className="absolute -top-3 px-3 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-lg border border-indigo-400">
              {radiusKm === 0 ? '전국' : `${radiusKm}km 반경 레이더`}
            </span>
          </div>
        </div>

        {/* Center User Pin */}
        <div className="absolute flex flex-col items-center z-20 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-500/30 animate-bounce">
            <MapPin className="w-6 h-6 fill-slate-950" />
          </div>
          <span className="mt-1 px-2.5 py-1 rounded-md bg-slate-900/90 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 shadow-md">
            내 위치 (접속 IP/GPS)
          </span>
        </div>

        {/* Job Pins Floating around Center */}
        {jobs.map((job, index) => {
          // Calculate mock offset coordinates for map display
          const offsetX = (index % 2 === 0 ? 1 : -1) * (60 + index * 45);
          const offsetY = (index % 3 === 0 ? -1 : 1) * (50 + index * 35);

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob && onSelectJob(job)}
              style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
              className="absolute z-30 cursor-pointer group transition-all duration-300 hover:scale-110"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-900/95 to-slate-900/95 border border-indigo-400/80 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 group-hover:border-emerald-400 group-hover:from-emerald-950">
                  <span>{job.companyLogo}</span>
                  <span className="truncate max-w-[120px]">{job.companyName}</span>
                  <span className="text-[10px] text-emerald-300 font-extrabold px-1 rounded bg-emerald-950/80 border border-emerald-500/30">
                    {job.matchScore}%
                  </span>
                </div>
                <div className="w-3 h-3 bg-indigo-500 rotate-45 -mt-1.5 border-r border-b border-indigo-400 group-hover:bg-emerald-400" />
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-30 p-2.5 rounded-xl glass-panel text-[11px] text-slate-300 border border-slate-800 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            현재 접속 위치
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            30km 반경 핀
          </span>
        </div>
      </div>
    </div>
  );
}
