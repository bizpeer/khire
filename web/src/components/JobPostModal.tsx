'use client';

import React, { useState } from 'react';
import { X, CreditCard, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Calendar, AlertCircle, Image as ImageIcon, RotateCcw, Copy, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { JobCategory, JobPost } from '@/types/job';
import { MOCK_JOBS } from '@/lib/mockJobs';
import { saveJobToDB } from '@/lib/jobService';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (newJob: JobPost) => void;
}

export const PAYPAL_PAYMENT_URL = 'https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA';

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

  // Image Upload States (URL vs Direct File Upload)
  const [imageInputMode, setImageInputMode] = useState<'URL' | 'FILE'>('FILE');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [step, setStep] = useState<'FORM' | 'PAYMENT' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAdTier, setSelectedAdTier] = useState<'STANDARD' | 'PREMIUM_30'>('STANDARD');
  const adPrice = selectedAdTier === 'PREMIUM_30' ? 30.00 : 1.00;

  if (!isOpen) return null;

  // Handle local file selection upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
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

  const handleCompletePostAndPayment = async () => {
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
      latitude: 34.0618 + (Math.random() - 0.5) * 0.02, // Near Koreatown default
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
    const updatedJobs = await saveJobToDB(newJobPost);

    if (onJobCreated) {
      onJobCreated(newJobPost);
    }

    setIsSubmitting(false);
    setStep('SUCCESS');
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

        {/* Step SUCCESS View */}
        {step === 'SUCCESS' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce border border-emerald-500/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">공고 등록 & 결제 처리 완료!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              작성하신 채용공고가 DB에 실시간 저장되어 <strong className="text-emerald-400">7일(168시간)</strong> 동안 30km 반경 지도 및 채용 목록에 즉시 정식 노출됩니다.
            </p>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
              <p className="text-slate-400">공고 제목: <span className="text-white font-bold">{title}</span></p>
              <p className="text-slate-400">업체명: <span className="text-white font-bold">{companyName}</span></p>
              <p className="text-slate-400">업체 주소: <span className="text-white font-bold">{address}</span></p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider transition"
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
                  <p className="text-[10px] text-slate-400">7일간 근거리 목록 및 지도 노출</p>
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
                    <span className="text-xs text-amber-300 font-bold">👑 $30 프리미엄 5초 광고</span>
                    <span className="text-xs font-black text-amber-300">$30.00 USD</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">상단 5초 단위 자동 로테이션 게시</p>
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

                {/* IMAGE UPLOAD DUAL OPTION: URL OR FILE SELECTION */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>공고 이미지 첨부</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] border border-slate-700 font-semibold">
                        선택사항 (Optional)
                      </span>
                    </label>

                    {/* Mode Toggle Switch */}
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

                  {/* Image Preview Window */}
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
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>다음: PayPal $1.00 USD 결제 및 공고 등록</span>
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
                    <strong>7일 만료 및 추가과금 안내:</strong> $1 결제 성공 시각부터 7일간 게시되며 7일 후 목록에서 자동 삭제됩니다.
                  </span>
                </div>

                {/* PayPal Checkout & Complete Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleOpenPayPal}
                    className="w-full py-4 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="text-lg font-black">PayPal</span>
                    <span>$1.00 USD 결제창 열기 (PayPal / Card)</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={handleCompletePostAndPayment}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>결제 승인 완료 및 공고 즉시 등록</span>
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
