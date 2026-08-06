'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, ShieldCheck, CheckCircle2, RefreshCw, Globe, Search } from 'lucide-react';
import { COUNTRY_CODES } from './AuthModal';
import GoogleAddressPicker from '@/components/GoogleAddressPicker';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
  currentMode: 'APPLICANT' | 'EMPLOYER';
  onModeSwitch: (newMode: 'APPLICANT' | 'EMPLOYER') => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  currentMode,
  onModeSwitch,
}: UserProfileModalProps) {
  const [name, setName] = useState(userName || '홍길동');
  const [countryCode, setCountryCode] = useState('+61');
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryCode, setCustomCountryCode] = useState('+82');
  const [phoneNum, setPhoneNum] = useState('213-123-4567');
  const [address, setAddress] = useState('보문로 9길 48');
  const [bizRegNumber, setBizRegNumber] = useState('123-45-67890');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{name} 님</span>
            </h3>
            <p className="text-xs text-slate-400">이메일 ID: {userEmail}</p>
          </div>
        </div>

        {/* Mode Switch Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              회원 이용 모드 스위칭
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
              {currentMode === 'APPLICANT' ? '개인 구직자 모드' : '기업 고용주 모드'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onModeSwitch('APPLICANT')}
              className={`p-2.5 rounded-xl border text-center font-extrabold transition-all ${
                currentMode === 'APPLICANT'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🙋‍♂️ 구직 지원자 모드
            </button>

            <button
              type="button"
              onClick={() => onModeSwitch('EMPLOYER')}
              className={`p-2.5 rounded-xl border text-center font-extrabold transition-all ${
                currentMode === 'EMPLOYER'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🏢 기업 고용주 모드
            </button>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <h4 className="font-extrabold text-white text-sm">회원 정보 수정</h4>

          {/* Name */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">성명 (이름)</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full"
              />
            </div>
          </div>

          {/* Phone with Country Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">
                휴대폰 번호 (+국가번호 수동 직접 입력 지원)
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
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full"
                />
              </div>
            </div>
          </div>

          {/* Google Maps Address (No Apt/Unit) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">
                주소지 (Google Maps API 실시간 연동)
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">(동/호수 수집 제외)</span>
            </div>

            <GoogleAddressPicker
              value={address}
              onChange={(newAddr) => setAddress(newAddr)}
              placeholder="Google Maps 도로명 위치 검색..."
            />
          </div>

          {/* Business Reg Number (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">사업자등록번호</label>
              <span className="text-[10px] text-amber-300 font-extrabold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                선택사항 (Optional)
              </span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500">
              <Building2 className="w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={bizRegNumber}
                onChange={(e) => setBizRegNumber(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition shadow-xl flex items-center justify-center gap-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>회원 정보 수정 완료!</span>
              </>
            ) : (
              <span>회원 정보 수정 저장</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
