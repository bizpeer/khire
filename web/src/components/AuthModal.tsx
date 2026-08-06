'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Shield, Building, UserCheck } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            onClick={() => {
              alert('Google 계정 간편 로그인 연동');
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <span>🌐</span> Google 로그인
          </button>
          <button
            onClick={() => {
              alert('Apple ID 간편 로그인 연동');
              onClose();
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
    </div>
  );
}
