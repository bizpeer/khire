'use client';

import React, { useState } from 'react';
import { X, Star, Heart, Smile, Sparkles, CheckCircle2, ShieldCheck, ThumbsUp, Clock, MessageSquare } from 'lucide-react';
import { JobPost, DaangnReview } from '@/types/job';
import { saveReviewToDB } from '@/lib/jobService';

interface DaangnReviewModalProps {
  job: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newReview: DaangnReview) => void;
}

export const DAANGN_BADGES = [
  { id: 'PAY_ON_TIME', label: '💖 급여를 제때 줘요', icon: Heart },
  { id: 'KIND_EMPLOYER', label: '😊 사장님이 친절해요', icon: Smile },
  { id: 'CLEAN_WORKSPACE', label: '🧹 근무 환경이 쾌적해요', icon: Sparkles },
  { id: 'RESPECT_BREAK', label: '⏰ 휴게 시간을 잘 지켜요', icon: Clock },
  { id: 'CLEAR_GUIDE', label: '🤝 업무 가이드가 명확해요', icon: ThumbsUp },
];

export default function DaangnReviewModal({
  job,
  isOpen,
  onClose,
  onReviewSubmitted,
}: DaangnReviewModalProps) {
  const [rating, setRating] = useState<number>(5.0);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['💖 급여를 제때 줘요', '😊 사장님이 친절해요']);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const toggleBadge = (badgeLabel: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeLabel)
        ? prev.filter((b) => b !== badgeLabel)
        : [...prev, badgeLabel]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReview: DaangnReview = {
      id: `rev-${Date.now()}`,
      jobId: job.id,
      companyName: job.companyName,
      reviewerName: reviewerName || '당근 구직 회원',
      rating,
      selectedBadges,
      comment: comment || '근무 환경과 사장님이 만족스러웠습니다!',
      createdTime: '방금 전',
    };

    await saveReviewToDB(newReview);

    if (onReviewSubmitted) {
      onReviewSubmitted(newReview);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-lg w-full border border-amber-500/40 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">당근알바 업체 평가 완료!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              회원님이 등록해주신 당근 뱃지 평가가 <strong className="text-amber-300">{job.companyName}</strong>의 매장 평점에 실시간 반영되었습니다.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition"
            >
              확인 및 닫기
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1">
              <span>🥕 Daangn Jobs Employer Rating</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {job.companyName} 업체 평가하기
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              당근알바 평가 기준 5대 지표 및 별점으로 사장님과 매장 근무 환경을 평가해 주세요.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-2 text-center">
                  근무 만족도 별점 ({rating.toFixed(1)}점 / 5.0점)
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Daangn 5-Badge Evaluation Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">
                  당근알바 추천 키워드 뱃지 선택 (다중 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAANGN_BADGES.map((b) => {
                    const isChecked = selectedBadges.includes(b.label);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleBadge(b.label)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isChecked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow ring-1 ring-amber-500/30'
                            : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">작성자 닉네임</label>
                <input
                  type="text"
                  placeholder="예: 당근 구직자 (미입력 시 익명)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">상세 리뷰 한줄평</label>
                <textarea
                  rows={3}
                  placeholder="사장님의 친절도, 급여 정산 날짜 준수, 근무 분위기 등을 작성해 주세요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition shadow-xl"
              >
                {isSubmitting ? '평가 등록 중...' : '당근알바 평가 등록 완료하기'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
