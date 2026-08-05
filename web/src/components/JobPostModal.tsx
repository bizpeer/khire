'use client';

import React, { useState } from 'react';
import { X, CreditCard, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { JobCategory } from '@/types/job';

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
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'FORM' | 'PAYMENT'>('FORM');

  if (!isOpen) return null;

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
          인재채용공고 등록 ($1.00 USD / 1주일 게시)
        </h2>

        {/* Pricing Policy Highlight Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-emerald-300 flex items-center gap-1.5 text-sm">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              게시 요금: $1.00 USD
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
              1주일 (7일) 노출
            </span>
          </div>
          <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
            <li>공고 1건당 $1.00 USD 결제로 1주일간 30km 반경 지도에 노출됩니다.</li>
            <li><strong className="text-amber-300">수정, 내용 변경, 재공고 등록 시 전부 건당 $1.00 별도로 과금됩니다.</strong></li>
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
              <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2">
                결제 주문 내역 확인
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
                  <Calendar className="w-3.5 h-3.5" /> 1주일 (7일)
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
                <strong>중요 정책:</strong> 공고 결제 완료 후 1주일간 게시됩니다. 수정, 내용 변경, 재공고 시 건당 $1.00 USD가 별도 과금되오니 결제 전 작성 내용을 다시 한번 확인해주세요.
              </span>
            </div>

            {/* PayPal Checkout Direct Link Button */}
            <div className="space-y-3">
              <button
                onClick={handleOpenPayPal}
                className="w-full py-4 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="text-lg">PayPal</span>
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
