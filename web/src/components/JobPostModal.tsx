'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Calendar, AlertCircle, Image as ImageIcon, RotateCcw, Copy, Upload, Link as LinkIcon, Trash2, Zap, Lock } from 'lucide-react';
import { JobCategory, JobPost } from '@/types/job';
import { MOCK_JOBS } from '@/lib/mockJobs';
import { saveJobToDB } from '@/lib/jobService';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (newJob: JobPost) => void;
}

export const PAYPAL_STANDARD_URL = 'https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA';
export const PAYPAL_PREMIUM_URL = 'https://www.paypal.com/ncp/payment/GEY6YHWRDH54E';

export const PAYPAL_STANDARD_BUTTON_ID = 'R5JUWLNA7ZJJA';
export const PAYPAL_PREMIUM_BUTTON_ID = 'GEY6YHWRDH54E';

export default function JobPostModal({ isOpen, onClose, onJobCreated }: JobPostModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('F_AND_B');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [originalJobId, setOriginalJobId] = useState<string | null>(null);

  // Daangn Jobs Work Specification States
  const [workDays, setWorkDays] = useState('월~금 (주 5일)');
  const [workHours, setWorkHours] = useState('09:00 ~ 18:00 (휴게시간 1시간)');
  const [workPeriod, setWorkPeriod] = useState('3개월 이상 / 장기 우대');
  const [benefitsInput, setBenefitsInput] = useState('식사 제공, 주휴수당, 유니폼 지원, 초보 가능, 친구 동반 지원');

  // Image Upload States
  const [imageInputMode, setImageInputMode] = useState<'URL' | 'FILE'>('FILE');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [step, setStep] = useState<'FORM' | 'PAYMENT' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ad Tier: Standard ($1.00 USD) vs Premium ($30.00 USD)
  const [selectedAdTier, setSelectedAdTier] = useState<'STANDARD' | 'PREMIUM_30'>('STANDARD');
  const adPrice = selectedAdTier === 'PREMIUM_30' ? 30.00 : 1.00;
  const currentHostedButtonId = selectedAdTier === 'PREMIUM_30' ? PAYPAL_PREMIUM_BUTTON_ID : PAYPAL_STANDARD_BUTTON_ID;
  const currentPaypalUrl = selectedAdTier === 'PREMIUM_30' ? PAYPAL_PREMIUM_URL : PAYPAL_STANDARD_URL;

  const [paypalApproved, setPaypalApproved] = useState(false);

  // Dynamically load PayPal Hosted Buttons SDK when step enters PAYMENT
  useEffect(() => {
    if (!isOpen || step !== 'PAYMENT') return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'Afp-Bd2GA_eoz-KhptZiUK1A25suV-PRFPDVdZLFqnX3pa03aIb4nMlM8J7MwWcHnWxQ5ZoZJKz_YMQU';
    const scriptId = 'paypal-js-sdk-script';

    const renderHostedButtons = () => {
      const containerId = `#paypal-container-${currentHostedButtonId}`;
      const containerElem = document.querySelector(containerId);
      if (containerElem) {
        containerElem.innerHTML = ''; // Clear previous container
      }

      // @ts-ignore
      if (window.paypal && window.paypal.HostedButtons) {
        try {
          // @ts-ignore
          window.paypal
            .HostedButtons({
              hostedButtonId: currentHostedButtonId,
              onApprove: function (data: any) {
                alert(`PayPal 결제가 성공적으로 승인되었습니다! (Order ID: ${data?.orderID || currentHostedButtonId})`);
                setPaypalApproved(true);
                handleCompletePostAndPayment({
                  paymentId: data?.orderID || `PAYPAL-${Date.now()}`,
                  status: 'APPROVED',
                });
              },
            })
            .render(containerId);
        } catch (err) {
          console.warn('PayPal HostedButtons render warning:', err);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&enable-funding=venmo`;
      script.async = true;
      script.onload = () => {
        setTimeout(renderHostedButtons, 300);
      };
      document.body.appendChild(script);
    } else {
      setTimeout(renderHostedButtons, 300);
    }
  }, [isOpen, step, selectedAdTier, currentHostedButtonId]);

  if (!isOpen) return null;

  // Handle local file selection upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Reuse Existing Job Posting
  const handleReuseJob = (sourceJob: JobPost) => {
    setTitle(`[재게시] ${sourceJob.title}`);
    setCategory(sourceJob.category);
    setCompanyName(sourceJob.companyName);
    setAddress(sourceJob.locationName);
    setSalary(sourceJob.salary);
    setImageUrl(sourceJob.imageUrl || '');
    setImagePreview(sourceJob.imageUrl || null);
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

  const handleCompletePostAndPayment = async (paypalResult?: { paymentId: string; status: string }) => {
    setIsSubmitting(true);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const categoryNames: Record<JobCategory, string> = {
      ALL: '전체',
      F_AND_B: 'F&B (한인식당/카페)',
      LODGING_CLEANING: '숙박 & 청소',
      LOGISTICS: '물류 & 현장',
      TECH: '기술 & IT',
    };

    const newJobPost: JobPost = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      companyName,
      category,
      categoryName: categoryNames[category],
      locationName: address,
      latitude: 34.0618 + (Math.random() - 0.5) * 0.02,
      longitude: -118.3000 + (Math.random() - 0.5) * 0.02,
      salary: salary || '시급 $20 ~ $25 (협의)',
      employmentType: 'Full-time',
      matchScore: Math.floor(Math.random() * 10) + 90,
      skills: ['친절 응대', '팀워크', '경력 우대'],
      postedAt: '방금 전',
      deadline: '7일 게시 중 (D-7일)',
      description: description || '상세 모집 요강 참조',
      isEasyApply: true,
      imageUrl: imagePreview || imageUrl || undefined,
      isPaid: true,
      isPremiumAd: selectedAdTier === 'PREMIUM_30',
      adPrice,
      paidAt: now.toISOString(),
      expiresAt: expiresAt,
      originalJobId: originalJobId || undefined,
      commuteTimeEstimate: { transitMinutes: 15, carMinutes: 10 },
      workDays: workDays || '월~금 (주 5일)',
      workHours: workHours || '09:00 ~ 18:00 (휴게시간 1시간)',
      workPeriod: workPeriod || '3개월 이상 / 장기 우대',
      benefits: benefitsInput ? benefitsInput.split(',').map((b) => b.trim()) : ['식사 제공', '주휴수당'],
      daangnScore: 4.8,
      daangnBadges: ['💖 급여를 제때 줘요', '😊 사장님이 친절해요', '🧹 근무 환경이 쾌적해요'],
      reviewCount: 1,
    };

    // Save to DB (Supabase + LocalStorage)
    await saveJobToDB(newJobPost);

    if (onJobCreated) {
      onJobCreated(newJobPost);
    }

    setIsSubmitting(false);
    setStep('SUCCESS');
  };

  const handleOpenPayPalWindow = () => {
    window.open(currentPaypalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-xl w-full border border-emerald-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto my-8">
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
          <span>Employer Job Posting & PayPal Hosted Checkout</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
          인재채용공고 등록 ({selectedAdTier === 'PREMIUM_30' ? '$30.00 USD 프리미엄 5초 로테이션' : '$1.00 USD / 7일 게시'})
        </h2>

        {/* Step SUCCESS View */}
        {step === 'SUCCESS' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce border border-emerald-500/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">PayPal 결제 승인 & 공고 등록 완료!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {selectedAdTier === 'PREMIUM_30' ? (
                <span>
                  작성하신 공고가 <strong className="text-amber-300">$30 프리미엄 공고</strong>로 등록되어 상단 배너에서 <strong className="text-amber-400">5초 단위 자동 로테이션</strong>으로 최우선 게시됩니다!
                </span>
              ) : (
                <span>
                  작성하신 채용공고가 DB에 실시간 저장되어 <strong className="text-emerald-400">7일(168시간)</strong> 동안 30km 반경 지도 및 채용 목록에 정식 노출됩니다.
                </span>
              )}
            </p>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
              <p className="text-slate-400">공고 제목: <span className="text-white font-bold">{title}</span></p>
              <p className="text-slate-400">업체명: <span className="text-white font-bold">{companyName}</span></p>
              <p className="text-slate-400">결제 상품: <span className="text-emerald-400 font-bold">${adPrice.toFixed(2)} USD ({selectedAdTier === 'PREMIUM_30' ? '프리미엄 5초 배너' : '일반 공고'})</span></p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider transition shadow-lg"
            >
              확인 및 닫기
            </button>
          </div>
        ) : (
          <>
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

            {/* Pricing Tier Selector (Standard $1 vs Premium Ad Rotation $30) */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 mb-6 text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  광고 상품 선택 (Pricing Plan)
                </span>
                <span className="text-[11px] font-bold text-amber-300">
                  선택 금액: <strong className="text-sm text-emerald-400 font-black">${adPrice.toFixed(2)} USD</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAdTier('STANDARD')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAdTier === 'STANDARD'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/50 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-emerald-300 font-bold">기존 일반 공고</span>
                    <span className="text-xs font-black text-white">$1.00 USD</span>
                  </div>
                  <p className="text-[10px] text-slate-400">7일간 근거리 목록 및 지도 노출 (HostedButton: R5JUWLNA7ZJJA)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAdTier('PREMIUM_30')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAdTier === 'PREMIUM_30'
                      ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/50 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      $30 프리미엄 5초 배너
                    </span>
                    <span className="text-xs font-black text-amber-300">$30.00 USD</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">상단 5초 단위 자동 로테이션 (HostedButton: GEY6YHWRDH54E)</p>
                </button>
              </div>
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

                {/* IMAGE UPLOAD DUAL OPTION */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>공고 이미지 첨부</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] border border-slate-700 font-semibold">
                        선택사항 (Optional)
                      </span>
                    </label>

                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('FILE')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                          imageInputMode === 'FILE'
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        파일 선택
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('URL')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                          imageInputMode === 'URL'
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        URL 입력
                      </button>
                    </div>
                  </div>

                  {imageInputMode === 'FILE' ? (
                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 cursor-pointer transition-colors p-2 text-center">
                        <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                        <span className="text-xs text-slate-300 font-semibold">내 컴퓨터/기기에서 공고 이미지 선택</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG, GIF (최대 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... 이미지 URL 주소 입력"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  )}

                  {imagePreview && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-emerald-500/40 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="공고 이미지 미리보기" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold">
                          ✓ 이미지 첨부 준비 완료
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageUrl('');
                          }}
                          className="p-1 rounded bg-rose-600/80 text-white hover:bg-rose-500 transition"
                          title="이미지 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>다음: PayPal 결제 (${adPrice.toFixed(2)} USD) 및 공고 등록</span>
                </button>
              </form>
            ) : (
              <div className="space-y-5 text-xs">
                {/* Payment Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>결제 주문 내역 확인</span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      {selectedAdTier === 'PREMIUM_30' ? '👑 $30 프리미엄 5초 배너' : '$1 일반 공고'}
                    </span>
                  </h3>
                  <div className="flex justify-between text-slate-300">
                    <span>공고 제목:</span>
                    <strong className="text-white font-bold truncate max-w-[220px]">{title}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>업체명 / 주소:</span>
                    <span className="text-slate-400 truncate max-w-[220px]">{companyName} ({address})</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 text-sm">
                    <span className="font-bold text-white">결제 금액:</span>
                    <strong className={selectedAdTier === 'PREMIUM_30' ? 'text-amber-400 text-base font-extrabold' : 'text-emerald-400 text-base font-extrabold'}>
                      ${adPrice.toFixed(2)} USD
                    </strong>
                  </div>
                </div>

                {/* PayPal Official Hosted Button Container */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>PayPal Hosted Buttons ({selectedAdTier === 'PREMIUM_30' ? '$30 ID: GEY6YHWRDH54E' : '$1 ID: R5JUWLNA7ZJJA'})</span>
                    </span>
                    <span className="text-[10px] text-slate-400">PayPal 보안 결제 연동</span>
                  </div>

                  {/* PayPal Hosted Button Render Container Target */}
                  <div
                    id={`paypal-container-${currentHostedButtonId}`}
                    className="min-h-[50px] flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <span className="text-xs text-slate-400 animate-pulse">
                      PayPal 결제 버튼 로딩 중... ({currentHostedButtonId})
                    </span>
                  </div>
                </div>

                {/* Backup PayPal Direct Link & Completion Action */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleOpenPayPalWindow}
                    className="w-full py-3.5 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="text-base font-black">PayPal</span>
                    <span>${adPrice.toFixed(2)} USD 결제창 직접 열기 (HostedButton: {currentHostedButtonId})</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleCompletePostAndPayment({ paymentId: `PAYPAL-APPROVED-${Date.now()}`, status: 'APPROVED' })}
                    disabled={isSubmitting || !paypalApproved}
                    className={`w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                      paypalApproved
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{paypalApproved ? `PayPal 결제 승인 확인 완료 — 공고 즉시 등록 ($${adPrice.toFixed(2)} USD)` : `PayPal 결제 승인 대기 중... (위 버튼으로 먼저 결제하세요)`}</span>
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
          </>
        )}
      </div>
    </div>
  );
}
