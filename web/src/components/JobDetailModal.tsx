'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Sparkles,
  Building2,
  CheckCircle2,
  Lock,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  Send,
  Zap,
  Car,
  Train,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { JobPost } from '@/types/job';
import { saveApplicationToDB, saveReviewToDB, getReviewsForJob } from '@/lib/jobService';

interface JobDetailModalProps {
  job: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  hasAppliedToJob?: boolean;
  onApplicationSuccess?: (jobId: string) => void;
}

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  isLoggedIn,
  onOpenAuth,
  hasAppliedToJob = false,
  onApplicationSuccess,
}: JobDetailModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleAttemptApply = () => {
    if (!isLoggedIn) {
      alert(
        '비로그인 회원 상태입니다.\n\nKHIRE 공고 상세 읽기는 가능하지만, 지원하기 기능은 회원 전용 서비스입니다.\n로그인 또는 회원가입 창으로 이동합니다.'
      );
      onClose();
      onOpenAuth();
      return;
    }
    setIsApplying(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantContact) {
      alert('지원자 성함과 연락처를 입력해주세요.');
      return;
    }

    await saveApplicationToDB({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applicantName,
      applicantEmail: applicantContact,
      applicantPhone: applicantContact,
      resumeSummary,
    });

    setAppliedSuccess(true);
    setIsApplying(false);
    if (onApplicationSuccess) {
      onApplicationSuccess(job.id);
    }
  };

  const heroImageSrc =
    job.imageUrl ||
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl bg-[#051424] md:rounded-3xl border border-white/10 shadow-2xl relative my-0 md:my-8 overflow-hidden min-h-screen md:min-h-0">
        {/* Top Header Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <span className="font-extrabold text-sm tracking-tighter text-[#ffc174] drop-shadow-md">KHIRE</span>
        </div>

        {/* Hero Image Section */}
        <div className="w-full h-[280px] md:h-[360px] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImageSrc} alt={job.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051424] via-[#051424]/50 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="px-6 md:px-8 -mt-16 relative z-10 space-y-6 pb-24">
          {/* Header Info Glass Card */}
          <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#ffc174]/15 text-[#ffc174] rounded-full text-xs font-bold border border-[#ffc174]/30">
                추천 공고
              </span>
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                즉시 시작 가능
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-1 font-bold text-slate-200">
                <Building2 className="w-4 h-4 text-amber-400" />
                {job.companyName}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-[#ffc174]">location_on</span>
                {job.locationName}
              </span>
            </div>
          </div>

          {/* Daily / Hourly Pay Highlight Card */}
          <div className="glass-panel p-6 rounded-2xl shadow-xl flex items-center gap-5 border-l-4 border-l-[#ffc174]">
            <div className="p-3.5 bg-[#ffc174]/15 rounded-2xl text-[#ffc174] flex-shrink-0 border border-[#ffc174]/30">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
            <div>
              <h3 className="text-xs text-slate-400 font-bold uppercase tracking-widest">급여 조건 (Pay)</h3>
              <div className="text-2xl md:text-3xl font-black text-amber-300">{job.salary}</div>
              <p className="text-[11px] text-slate-400 mt-1">경력별 우대 • 즉시 1클릭 지원</p>
            </div>
          </div>

          {/* Grid Section: Job Description & Location/Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Col: Description */}
            <div className="md:col-span-7 space-y-6">
              <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-3">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">description</span>
                  <span>상세 모집 내용</span>
                </h2>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description || '상세 모집 요강 참조 및 자격 요건 안내'}
                </div>
              </div>

              {/* Work Conditions */}
              <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-3 text-xs">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#ffc174]" />
                  <span>근무 환경 및 조건</span>
                </h2>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">근무 요일</span>
                    <strong className="text-white font-bold">{job.workDays || '월~금 (주 5일)'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">근무 시간</span>
                    <strong className="text-white font-bold">{job.workHours || '09:00 ~ 18:00'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Location & Logistics */}
            <div className="md:col-span-5 space-y-6">
              {/* Location Map & Commute Estimates */}
              <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">map</span>
                  <span>근무지 위치 및 출퇴근</span>
                </h2>

                <div className="w-full h-40 rounded-xl overflow-hidden relative border border-white/10 bg-slate-950">
                  <iframe
                    title="Job Location Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(job.locationName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-none opacity-85 filter contrast-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-300 font-bold">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span>자차 이용</span>
                    </div>
                    <span className="font-extrabold text-[#ffc174]">
                      {job.commuteTimeEstimate?.carMinutes || 10} 분
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-300 font-bold">
                      <Train className="w-4 h-4 text-slate-400" />
                      <span>대중교통 이용</span>
                    </div>
                    <span className="font-extrabold text-[#ffc174]">
                      {job.commuteTimeEstimate?.transitMinutes || 15} 분
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirements List */}
              <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-3 text-xs">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174]">check_circle</span>
                  <span>주요 자격 요건</span>
                </h2>

                <ul className="space-y-2 text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc174] shrink-0" />
                    <span>합법적 근무 가능 비자 (워홀, 학생, 영주권)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc174] shrink-0" />
                    <span>원활한 현장 소통 및 신뢰성</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc174] shrink-0" />
                    <span>관련 분야 경력자 및 장기 근무자 우대</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inline Application Form */}
          {isApplying && (
            <div className="glass-panel p-6 rounded-2xl border border-amber-400/50 space-y-4">
              {appliedSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-extrabold text-white">지원서 제출 완료!</h4>
                  <p className="text-xs text-slate-300">
                    <strong className="text-emerald-400">{job.companyName}</strong> 인사담당자에게 회원님의 지원서가 전달되었습니다.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs"
                  >
                    확인 및 닫기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-white text-sm flex items-center justify-between">
                    <span>즉시 지원 및 이력서 선택</span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      1-Click Easy Apply
                    </span>
                  </h4>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">제출할 이력서 선택 *</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-amber-400">
                      <option value="res-1">이력서 1: 호주/시드니 F&B 한식 BBQ 조리장 및 바리스타 경력 이력서</option>
                      <option value="res-2">이력서 2: 시드니 상업용 청소 및 타일 현장 기술 이력서</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="지원자 성함 (예: 홍길동)"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="연락처 또는 이메일 (예: +61 412-345-678)"
                    value={applicantContact}
                    onChange={(e) => setApplicantContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                  />
                  <textarea
                    rows={2}
                    placeholder="한 줄 경력 및 메시지 (선택)"
                    value={resumeSummary}
                    onChange={(e) => setResumeSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400 resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#ffc174] hover:bg-[#ffb95f] text-slate-950 font-extrabold text-xs shadow-lg transition"
                  >
                    지원서 최종 제출하기
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-[#101828]/95 backdrop-blur-xl border-t border-white/10 z-50 flex justify-between items-center max-w-4xl mx-auto gap-4">
          <div className="hidden md:block">
            <p className="font-extrabold text-white text-sm">지원하실 준비가 되셨나요?</p>
            <p className="text-xs text-slate-400">지금 지원하세요, 자리가 빠르게 마감됩니다.</p>
          </div>

          <button
            onClick={handleAttemptApply}
            className="w-full md:w-auto flex-1 md:flex-none bg-[#ffc174] hover:bg-[#ffb95f] text-slate-950 font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>간편 지원</span>
            <span className="material-symbols-outlined text-lg">bolt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
