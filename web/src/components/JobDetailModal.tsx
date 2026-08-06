'use client';

import React, { useState } from 'react';
import { X, MapPin, Sparkles, Clock, Bus, Car, Zap, Building2, CalendarCheck, ShieldCheck, CheckCircle2, AlertTriangle, UserCheck, Lock, Star, Heart, Smile, ThumbsUp } from 'lucide-react';
import { JobPost } from '@/types/job';
import { saveApplicationToDB } from '@/lib/jobService';
import DaangnReviewModal from '@/components/DaangnReviewModal';

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!isOpen || !job) return null;

  const handleOpenReviewModal = () => {
    if (!isLoggedIn) {
      alert('비로그인 상태입니다. 업체 평점 작성은 해당 공고에 실제 입사 지원을 완료한 회원만 가능합니다.');
      return;
    }

    if (!hasAppliedToJob && !appliedSuccess) {
      alert('당근알바 업체 평점 및 뱃지 평가는 해당 업체의 공고에 실제로 입사 지원(이력서 제출)을 완료한 구직 회원만 작성하실 수 있습니다.');
      return;
    }

    setIsReviewModalOpen(true);
  };

  const handleAttemptApply = () => {
    if (!isLoggedIn) {
      alert('비로그인 회원 상태입니다.\n\nKHIRE 공고 상세 읽기는 가능하지만, 지원하기 기능은 회원 전용 서비스입니다.\n로그인 또는 회원가입 창으로 이동합니다.');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-emerald-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {appliedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">채용 지원 완료!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              <strong className="text-emerald-400">{job.companyName}</strong> 인사담당자에게 회원님의 지원서가 전달되었습니다. 실시간 서류 검토 후 입력하신 연락처로 연락이 진행됩니다.
            </p>
            <button
              onClick={() => {
                setAppliedSuccess(false);
                setIsApplying(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider transition"
            >
              확인 및 닫기
            </button>
          </div>
        ) : (
          <div>
            {/* Header badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {job.categoryName}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs font-semibold">
                [Khire 공식 사업자 예시 데이터]
              </span>
            </div>

            {/* Attached Image if present */}
            {job.imageUrl && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-slate-800 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={job.imageUrl} alt={job.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            )}

            <span className="text-xs font-bold text-emerald-400 block mb-1">
              {job.companyName}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-4 leading-snug">
              {job.title}
            </h2>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">급여 조건</span>
                <span className="text-emerald-400 font-extrabold text-sm">{job.salary}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">근무 형태</span>
                <span className="text-white font-bold">{job.employmentType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">AI 매칭 점수</span>
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {job.matchScore}%
                </span>
              </div>
            </div>

            {/* Exact Employer Address Google Maps Location Embed */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  근무지 도로명 주소 구글지도 위치
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {job.locationName}
                </span>
              </div>
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800">
                <iframe
                  title="Employer Google Maps Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(job.locationName || `${job.latitude},${job.longitude}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-none filter contrast-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Daangn Jobs Work Specifications (언제 어떻게 일하는지 고용내용) */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 text-xs space-y-3">
              <h4 className="font-extrabold text-amber-300 flex items-center gap-1.5 text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                🥕 당근알바 근무 스펙 (언제 어떻게 일하는지)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold block mb-0.5">근무 요일</span>
                  <span className="text-white font-extrabold">{job.workDays || '월~금 (주 5일)'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold block mb-0.5">근무 시간</span>
                  <span className="text-white font-extrabold">{job.workHours || '09:00 ~ 18:00 (휴게 1h)'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold block mb-0.5">근무 기간</span>
                  <span className="text-amber-300 font-extrabold">{job.workPeriod || '3개월 이상 / 장기 우대'}</span>
                </div>
              </div>

              {/* Benefits & Perks Pills */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5">복리후생 & 우대 조건</span>
                <div className="flex flex-wrap gap-1.5">
                  {(job.benefits || ['식사 제공', '주휴수당', '유니폼 지원', '초보 환영', '친구 동반 지원']).map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30"
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Daangn Employer Rating & 5-Badge Review Summary */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm flex items-center gap-1 border border-amber-500/40">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{job.daangnScore || 4.8} / 5.0</span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">당근알바 매장 평가</h5>
                    <span className="text-[10px] text-slate-400">구직 회원 리뷰 {job.reviewCount || 12}개 기준</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenReviewModal}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>업체 평가 남기기</span>
                </button>
              </div>

              {/* Daangn 5-Badge Keyword Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(job.daangnBadges || ['💖 급여를 제때 줘요', '😊 사장님이 친절해요', '🧹 근무 환경이 쾌적해요']).map((badge, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-slate-950 text-amber-300 text-[11px] font-bold border border-amber-500/30 shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white block">상세 모집 내용</span>
              <p className="leading-relaxed whitespace-pre-line text-slate-300">
                {job.description}
              </p>
            </div>

            {/* Non-logged in Restriction Notice */}
            {!isLoggedIn && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">비로그인 회원 공고 읽기 전용 상태</p>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    현재 공고 내용을 자유롭게 읽으실 수 있습니다. 단, 실제 입사 지원서 제출은 <strong className="text-amber-300">회원 전용</strong> 기능이므로 지원 시 로그인창으로 자동 이동합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Inline Application Form for Logged in User */}
            {isApplying ? (
              <form onSubmit={handleSubmitApplication} className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="font-extrabold text-white text-xs flex items-center justify-between">
                  <span>즉시 지원 및 이력서 선택</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    최대 2개 이력서 보유 중
                  </span>
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-300 font-bold mb-1">제출할 이력서 선택 *</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold outline-none focus:border-emerald-500"
                  >
                    <option value="res-1">이력서 1: 호주/시드니 F&B 한식 BBQ 조리장 및 바리스타 경력 이력서 (F&B)</option>
                    <option value="res-2">이력서 2: 시드니 상업용 청소 및 타일 현장 기술 이력서 (숙박 & 청소 / 물류)</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="지원자 성함 (예: 홍길동)"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  required
                  placeholder="연락처 또는 이메일 (예: +61 412-345-678)"
                  value={applicantContact}
                  onChange={(e) => setApplicantContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
                />
                <textarea
                  rows={2}
                  placeholder="한 줄 경력 및 자기소개 (선택)"
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg transition"
                >
                  제출 완료하기
                </button>
              </form>
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleAttemptApply}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition shadow-xl flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{isLoggedIn ? '즉시 입사지원하기' : '입사지원하기 (로그인 필요)'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Daangn Review Modal */}
        <DaangnReviewModal
          job={job}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      </div>
    </div>
  );
}
