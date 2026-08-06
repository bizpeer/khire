'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, ShieldCheck, ExternalLink, User, Phone, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import TermsModal from '@/components/TermsModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string, username?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bizRegNumber, setBizRegNumber] = useState('');

  // Terms Agreement States (Complies with FTC anti-dark pattern regulations)
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      // 1. Password Double Check Validation
      if (password !== passwordConfirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 확인해 주세요.');
        return;
      }

      // 2. Mandatory Terms Agreement Validation
      if (!agreedTerms) {
        alert('온라인 채용 플랫폼 서비스 이용약관(필수)에 동의해주셔야 회원가입이 완료됩니다.');
        return;
      }
    }

    const userEmail = email || 'user@khire.net';
    const userDisplay = username || userEmail.split('@')[0];

    if (onLoginSuccess) {
      onLoginSuccess(userEmail, userDisplay);
    } else {
      alert(
        `KHIRE 회원가입 및 로그인 성공!\n\n- 아이디/이름: ${userDisplay}\n- 이메일: ${userEmail}\n- 구직자 및 고용주 통합 권한(공고 등록 가능)이 부여되었습니다.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full border border-emerald-500/40 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Unified Member Badge Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4 w-fit mx-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>통합 회원 권한 (일반 지원자 + 고용주 공고 등록 동시 지원)</span>
        </div>

        <h3 className="text-2xl font-extrabold text-white text-center mb-1">
          KHIRE {isLogin ? '로그인' : '회원가입'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          {isLogin
            ? '아이디와 비밀번호를 입력하고 KHIRE 서비스에 접속하세요.'
            : '회원 정보를 입력하시면 일자리 지원과 공고 등록이 동시에 가능합니다.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* ID (Username) */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              아이디 (ID / 성함) *
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                required
                placeholder="예: khire_user01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">이메일 주소 *</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">비밀번호 (PW) *</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Password Double Check (Only in Sign Up Mode) */}
          {!isLogin && (
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                비밀번호 확인 (Double Check) *
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                />
              </div>
            </div>
          )}

          {/* Additional Fields in Sign-up Mode */}
          {!isLogin && (
            <>
              {/* Phone Number */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">전화번호 *</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678 또는 +1 213-123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">거주지/업체 주소 *</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="예: 미국 캘리포니아 LA 한인타운 윌셔 Blvd"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                  />
                </div>
              </div>

              {/* Business Registration Number (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">사업자등록번호</label>
                  <span className="text-[10px] text-amber-300 font-extrabold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    선택사항 (Optional)
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="예: 123-45-67890 (고용주 기업회원 선택 등록 가능)"
                    value={bizRegNumber}
                    onChange={(e) => setBizRegNumber(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                  />
                </div>
              </div>

              {/* Sign-up Terms & Conditions Consent Box (Anti-Dark Pattern Compliant) */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <label className="flex items-start gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-800"
                    />
                    <span className="font-bold text-white text-[11px] leading-tight">
                      [필수] 온라인 채용 및 일자리 매칭 플랫폼 서비스 이용약관 동의
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-emerald-400 font-extrabold hover:underline text-[11px] shrink-0 flex items-center gap-0.5"
                  >
                    <span>[약관보기]</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <label className="flex items-start gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedMarketing}
                    onChange={(e) => setAgreedMarketing(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-800"
                  />
                  <span className="text-[11px] leading-tight">
                    [선택] AI 맞춤형 공고 추천 및 마케팅 혜택 정보 수신 동의 (다크패턴 금지 조항 준수)
                  </span>
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all mt-2"
          >
            {isLogin ? '로그인하기' : 'KHIRE 회원가입 완료'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 font-extrabold hover:underline ml-1"
          >
            {isLogin ? '새 회원가입' : '로그인으로 이동'}
          </button>
        </div>
      </div>

      {/* Full Terms Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
}
