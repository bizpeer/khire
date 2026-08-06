'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Clock, Calendar, Phone, Mail, User, ShieldCheck, MessageCircle, Apple } from 'lucide-react';

interface FbmVipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productEdition?: string;
}

export default function FbmVipFormModal({ isOpen, onClose, productEdition }: FbmVipFormModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [venue, setVenue] = useState<'SEOUL_LAVIP' | 'LA_BEVERLY' | 'ONLINE_VIP'>('SEOUL_LAVIP');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleInstantKakao = () => {
    alert('카카오톡 1:1 VIP 전담 컨시어지 채널로 즉시 연결됩니다.');
    onClose();
  };

  const handleInstantApple = () => {
    alert('Apple Business Chat 1:1 전담 라운지로 즉시 연결됩니다.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-hidden glass-gold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              VIP 1:1 프라이빗 예약 완료
            </h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto mb-6">
              귀하만을 위한 전담 컨시어지가 <strong className="text-amber-300">15분 이내</strong>에 제공해주신 연락처로 최고 등급 성심 상담 안내를 드리겠습니다.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-amber-500/20 text-left text-xs text-zinc-400 mb-6">
              <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                <span>선택 에디션</span>
                <span className="font-bold text-amber-300">{productEdition || '18K 샴페인 로즈골드'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                <span>신청 고객</span>
                <span className="text-white">{name} 님</span>
              </div>
              <div className="flex justify-between">
                <span>희망 장소</span>
                <span className="text-white">
                  {venue === 'SEOUL_LAVIP' ? '서울 청담 라운지' : venue === 'LA_BEVERLY' ? 'LA 비버리힐즈 라운지' : '프라이빗 1:1 온라인 시연'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition"
            >
              확인 및 닫기
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                FBM Ability: 입력 장벽 최소화 (1초 초간결 폼)
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                프라이빗 1:1 VIP 상담 신청
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                복잡한 정보 작성 없이, 이메일/전화번호 하나로 VIP 전담 컨시어지와 연결됩니다.
              </p>
            </div>

            {/* Facilitator Triggers: 1-Click Messaging */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleInstantKakao}
                className="p-3.5 rounded-2xl bg-[#FEE500] hover:bg-[#ebd300] text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950" />
                카카오 1초 간편 상담
              </button>
              <button
                type="button"
                onClick={handleInstantApple}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Apple className="w-4 h-4" />
                Apple Chat 즉시 상담
              </button>
            </div>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-zinc-500 uppercase tracking-widest">
                또는 직접 일시 예약
              </span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            {/* Super Light Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  성함 / 칭호 (Name)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 홍길동 VIP"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs placeholder:text-zinc-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  연락처 또는 이메일 (Contact)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="010-0000-0000 또는 vip@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs placeholder:text-zinc-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    희망 상담 장소
                  </label>
                  <select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs outline-none transition"
                  >
                    <option value="SEOUL_LAVIP">서울 청담 VIP 라운지</option>
                    <option value="LA_BEVERLY">미국 LA 비버리힐즈 라운지</option>
                    <option value="ONLINE_VIP">프라이빗 1:1 온라인 프레젠테이션</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    희망 일정 (선택)
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-xs tracking-wider uppercase transition shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>예약 접수 중...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      1초 만에 VIP 1:1 예약 완료하기
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>개인정보보호 및 비공개 무단 유출 금지 100% 보장</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
