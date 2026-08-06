'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Building2, CheckCircle2, Globe, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import TermsModal from '@/components/TermsModal';
import GoogleAddressPicker from '@/components/GoogleAddressPicker';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string, userName?: string) => void;
}

export const COUNTRY_CODES = [
  { code: '+1', country: '미국 / 캐나다 (USA / Canada)', flag: '🇺🇸' },
  { code: '+82', country: '대한민국 (Korea)', flag: '🇰🇷' },
  { code: '+61', country: '호주 (Australia)', flag: '🇦🇺' },
  { code: '+81', country: '일본 (Japan)', flag: '🇯🇵' },
  { code: '+86', country: '중국 (China)', flag: '🇨🇳' },
  { code: '+52', country: '멕시코 (Mexico)', flag: '🇲🇽' },
  { code: '+44', country: '영국 (UK)', flag: '🇬🇧' },
  { code: '+49', country: '독일 (Germany)', flag: '🇩🇪' },
];

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  // Registration Fields
  const [emailId, setEmailId] = useState(''); // Email used as Member ID
  const [fullName, setFullName] = useState(''); // Name
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Phone with Country Code (Supports direct manual input +xx, +xxx)
  const [countryCode, setCountryCode] = useState('+1');
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryCode, setCustomCountryCode] = useState('+82');
  const [mobileNumber, setMobileNumber] = useState('');

  // Google Maps Address Selection (No Apt / Room details collected)
  const [address, setAddress] = useState('');

  // Business Reg Number (Optional)
  const [bizRegNumber, setBizRegNumber] = useState('');

  // Terms Agreement States
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      // 1. Password Double Check
      if (password !== passwordConfirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 확인해 주세요.');
        return;
      }

      // 2. Mandatory Terms Agreement Check
      if (!agreedTerms) {
        alert('온라인 채용 플랫폼 서비스 이용약관(필수)에 동의해주셔야 회원가입이 완료됩니다.');
        return;
      }
    }

    const finalEmail = emailId || 'user@khire.net';
    const finalName = fullName || finalEmail.split('@')[0];
    const finalCountryCode = isCustomCountry ? customCountryCode : countryCode;
    const fullPhone = `${finalCountryCode} ${mobileNumber}`;

    if (onLoginSuccess) {
      onLoginSuccess(finalEmail, finalName);
    } else {
      alert(
        `KHIRE 회원가입 및 로그인 성공!\n\n- 이메일 ID: ${finalEmail}\n- 성명: ${finalName}\n- 연락처: ${fullPhone}\n- 주소(Google Maps 연동): ${address}\n- 구직 지원 및 공고 등록 권한이 활성화되었습니다.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full border border-emerald-500/40 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4 w-fit mx-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>통합 회원가입 (구직자 + 고용주 공고 등록 통합 제공)</span>
        </div>

        <h3 className="text-2xl font-extrabold text-white text-center mb-1">
          KHIRE {isLogin ? '로그인' : '회원가입'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          {isLogin
            ? '이메일 ID와 비밀번호를 입력하고 접속하세요.'
            : '이메일을 ID로 지정하며, 개인정보 보호를 위해 도로명 주소지 정보만 수집합니다.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Email used as Primary Login ID */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              이메일 주소 (로그인 ID) *
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@example.com (이메일로 ID 지정)"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Full Name Field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="text-slate-300 font-bold block mb-1">성명 (이름) *</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 transition-colors">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동 (John Doe)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                />
              </div>
            </div>
          )}

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

          {/* Password Double Check (Sign Up Only) */}
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

          {/* International Phone Input (+Country Code + Mobile) */}
          {!isLogin && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-bold">
                  휴대폰 번호 (+국가번호 수동 직접 입력 지원) *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCountry(!isCustomCountry)}
                  className="text-[10px] text-emerald-400 font-bold hover:underline"
                >
                  {isCustomCountry ? '목록 선택 전환' : '✏️ 수동 입력 (+xx)'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isCustomCountry ? (
                  <input
                    type="text"
                    required
                    placeholder="+82 / +1 / +xx"
                    value={customCountryCode}
                    onChange={(e) => setCustomCountryCode(e.target.value)}
                    className="w-28 px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-300 font-extrabold outline-none text-xs"
                  />
                ) : (
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-32 px-2.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-bold outline-none focus:border-emerald-500 shrink-0 text-xs"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678 또는 213-123-4567"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Google Maps Live Address Autocomplete & Picker */}
          {!isLogin && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-bold">
                  주소지 (Google Maps API 실시간 연동) *
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">
                  (동/호수 수집 제외)
                </span>
              </div>

              <GoogleAddressPicker
                value={address}
                onChange={(newAddr) => setAddress(newAddr)}
                placeholder="Google Maps 도로명 위치 검색..."
              />
            </div>
          )}

          {/* Business Registration Number (Optional) */}
          {!isLogin && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-bold">사업자등록번호</label>
                <span className="text-[10px] text-amber-300 font-extrabold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                  선택사항 (Optional)
                </span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="예: 123-45-67890 (기업 고용주 선택 입력)"
                  value={bizRegNumber}
                  onChange={(e) => setBizRegNumber(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                />
              </div>
            </div>
          )}

          {/* Sign-up Terms & Conditions Consent Box (Anti-Dark Pattern Compliant) */}
          {!isLogin && (
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
