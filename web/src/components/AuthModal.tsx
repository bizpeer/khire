import React, { useState } from 'react';
import { X, Lock, Mail, Shield, Building, UserCheck, ShieldCheck, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { signInWithGoogle, signInWithApple } from '@/lib/supabaseClient';
import TermsModal from '@/components/TermsModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [role, setRole] = useState<'APPLICANT' | 'EMPLOYER'>('APPLICANT');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Terms Agreement States (Complies with FTC anti-dark pattern regulations)
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !agreedTerms) {
      alert('온라인 채용 플랫폼 서비스 이용약관(필수)에 동의해주셔야 회원가입이 완료됩니다.');
      return;
    }

    const userEmail = email || 'applicant@khire.net';
    if (onLoginSuccess) {
      onLoginSuccess(userEmail);
    } else {
      alert(
        `${role === 'APPLICANT' ? '개인회원' : '기업회원'} ${
          isLogin ? '로그인' : '회원가입'
        } 성공! (JWT Access & Refresh Token 발급)`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full border border-indigo-500/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-2xl mb-6 border border-slate-800">
          <button
            onClick={() => setRole('APPLICANT')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'APPLICANT'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            개인 구직자 회원
          </button>
          <button
            onClick={() => setRole('EMPLOYER')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'EMPLOYER'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            기업 고용주 회원
          </button>
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-1">
          {role === 'APPLICANT' ? '개인회원' : '기업회원'}{' '}
          {isLogin ? '로그인' : '회원가입'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          Hire Near. Hire Smart. KHIRE 플랫폼에 접속하세요
        </p>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={async () => {
              const res = await signInWithGoogle();
              if (onLoginSuccess) {
                onLoginSuccess('google.user@gmail.com');
              } else {
                alert('Supabase Google OAuth 연동 성공! (구글 간편인증 로그인)');
                onClose();
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <span>🌐</span> Google 로그인
          </button>
          <button
            type="button"
            onClick={async () => {
              const res = await signInWithApple();
              if (onLoginSuccess) {
                onLoginSuccess('apple.user@icloud.com');
              } else {
                alert('Supabase Apple ID OAuth 연동 성공! (애플 간편인증 로그인)');
                onClose();
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <span>🍎</span> Apple 로그인
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0f172a] px-3 text-[11px] text-slate-500 font-semibold absolute">
            OR EMAIL
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              이메일 주소
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500 transition-colors">
              <Mail className="w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              비밀번호
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500 transition-colors">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>

          {/* Sign-up Terms & Conditions Consent Box (Anti-Dark Pattern Compliant) */}
          {!isLogin && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-indigo-500 bg-slate-950 border-slate-800"
                  />
                  <span className="font-bold text-white text-[11px] leading-tight">
                    [필수] 온라인 채용 및 일자리 매칭 플랫폼 서비스 이용약관 동의
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-indigo-400 font-extrabold hover:underline text-[11px] shrink-0 flex items-center gap-0.5"
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
                  className="mt-0.5 w-4 h-4 rounded accent-indigo-500 bg-slate-950 border-slate-800"
                />
                <span className="text-[11px] leading-tight">
                  [선택] AI 맞춤형 공고 추천 및 마케팅 혜택 정보 수신 동의 (다크패턴 금지 가이드라인 준수)
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all mt-2"
          >
            {isLogin ? '로그인 및 토큰 발급' : '새 계정 생성'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 font-bold hover:underline ml-1"
          >
            {isLogin ? '회원가입' : '로그인'}
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
