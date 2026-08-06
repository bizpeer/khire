'use client';

import React, { useState } from 'react';
import { X, MapPin, Sparkles, Clock, Bus, Car, Zap, Building2, CalendarCheck, ShieldCheck, CheckCircle2, AlertTriangle, UserCheck, Lock } from 'lucide-react';
import { JobPost } from '@/types/job';
import { saveApplicationToDB } from '@/lib/jobService';

interface JobDetailModalProps {
  job: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
  isLoggedIn,
  onOpenAuth,
}: JobDetailModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen || !job) return null;

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
      resumeSummary: resumeSummary || '1클릭 이력서 자동 제출',
    });

    setAppliedSuccess(true);
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

            {/* Address */}
            <div className="mb-4 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" /> 근무지 도로명 주소:
              </span>
              <p className="pl-5 text-white font-semibold">{job.locationName}</p>
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
                <h4 className="font-bold text-white text-xs">즉시 지원 정보 입력</h4>
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
                  placeholder="연락처 또는 이메일 (예: 010-1234-5678)"
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
      </div>
    </div>
  );
}
