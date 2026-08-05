'use client';

import React, { useState } from 'react';
import { X, CreditCard, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Calendar, AlertCircle, Image as ImageIcon, RotateCcw, Copy } from 'lucide-react';
import { JobCategory, JobPost } from '@/types/job';
import { MOCK_JOBS } from '@/lib/mockJobs';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PAYPAL_PAYMENT_URL = 'https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA';
export const PAYPAL_HOSTING_ID = 'R5JUWLNA7ZJJA';

export default function JobPostModal({ isOpen, onClose }: JobPostModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('F_AND_B');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [originalJobId, setOriginalJobId] = useState<string | null>(null);
  const [step, setStep] = useState<'FORM' | 'PAYMENT'>('FORM');

  if (!isOpen) return null;

  // Reuse / Load Existing Job Posting
  const handleReuseJob = (sourceJob: JobPost) => {
    setTitle(`[재게시] ${sourceJob.title}`);
    setCategory(sourceJob.category);
    setCompanyName(sourceJob.companyName);
    setAddress(sourceJob.locationName);
    setSalary(sourceJob.salary);
    setImageUrl(sourceJob.imageUrl || '');
    setDescription(sourceJob.description || '');
    setOriginalJobId(sourceJob.id);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !address) {
      alert('공고 제목, 업체명, 업체 주소는 필수 입력 사항입니다.');
      return;
    }
    setStep('PAYMENT');
  };

  const handleOpenPayPal = () => {
    window.open(PAYPAL_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-xl w-full border border-emerald-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Employer Job Posting & PayPal Checkout</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
          인재채용공고 등록 ($1.00 USD / 7일 게시)
        </h2>

        {/* Reuse Existing Job Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              기존 등록 공고 불러오기 & 재활용 (Reuse)
            </span>
            <span className="text-[10px] text-slate-400 font-normal">과거 공고 원클릭 복사</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOCK_JOBS.slice(0, 3).map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleReuseJob(job as JobPost)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-all"
              >
                <Copy className="w-3 h-3 text-indigo-400" />
                <span className="truncate max-w-[140px]">{job.companyName} - {job.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Policy Highlight Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-emerald-300 flex items-center gap-1.5 text-sm">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              게시 요금: $1.00 USD
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
              결제 성공 시 7일(168시간) 게시
            </span>
          </div>
          <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
            <li>결제 성공 시간부터 정확히 7일간 30km 반경 지도 및 목록에 노출되며 이후 자동으로 사라집니다.</li>
            <li><strong className="text-amber-300">수정, 내용 변경, 재공고 등록 및 연장 시 전부 건당 $1.00 별도로 과금됩니다.</strong></li>
            <li>결제 수단: PayPal, Apple Pay, 신용카드 또는 직불카드 지원</li>
          </ul>
        </div>

        {step === 'FORM' ? (
          <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">공고 제목 *</label>
              <input
                type="text"
                required
                placeholder="예: LA 한인타운 K-BBQ 식당 주방 총괄 조리장 채용"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">업체명 (식당/카페/호텔명) *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 수라간 K-BBQ"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">업종 카테고리 *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="F_AND_B">F&B (한인식당 / 카페)</option>
                  <option value="LODGING_CLEANING">숙박 & 청소 (호텔 / 클리닝)</option>
                  <option value="LOGISTICS">물류 & 현장</option>
                  <option value="TECH">기술 & IT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">업체 도로명 주소 (구글지도 핀 표출) *</label>
              <input
                type="text"
                required
                placeholder="예: 3832 Wilshire Blvd, Los Angeles, CA 90010"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">공고 이미지 첨부 (매장/근무지 이미지 URL)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... 이미지 URL 입력"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              {imageUrl && (
                <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="공고 이미지 미리보기" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-300">이미지 첨부 완료</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">급여 조건</label>
              <input
                type="text"
                placeholder="예: 시급 $25 ~ $32 + Tip"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">상세 모집 요강</label>
              <textarea
                rows={3}
                placeholder="담당 업무, 자격 요건, 복리후생 등 상세 내용을 작성해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>다음: PayPal $1.00 USD 결제 단계로 이동</span>
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>결제 주문 내역 확인</span>
                {originalJobId && <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">기존 공고 재활용</span>}
              </h3>
              <div className="flex justify-between text-slate-300">
                <span>공고 제목:</span>
                <strong className="text-white font-bold truncate max-w-[220px]">{title}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>업체명 / 주소:</span>
                <span className="text-slate-400 truncate max-w-[220px]">{companyName} ({address})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>게시 기간:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> 결제 성공 시부터 정확히 7일 (168시간)
                </span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 text-sm">
                <span className="font-bold text-white">결제 금액:</span>
                <strong className="text-emerald-400 text-base font-extrabold">$1.00 USD</strong>
              </div>
            </div>

            {/* Notice Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>7일 만료 및 추가과금 안내:</strong> $1 결제 성공 시각부터 7일간 게시되며 7일 후 목록에서 자동 삭제됩니다. 연장 게시 또는 수정 시건당 $1.00 USD가 별도 과금되오니 결제 전 내용을 확인해주세요.
              </span>
            </div>

            {/* PayPal Checkout Direct Link Button */}
            <div className="space-y-3">
              <button
                onClick={handleOpenPayPal}
                className="w-full py-4 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="text-lg font-black">PayPal</span>
                <span>$1.00 USD 결제하기 (PayPal / Apple Pay / Card)</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-800"
              >
                이전: 공고 내용 수정
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
