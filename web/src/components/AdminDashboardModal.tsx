'use client';

import React from 'react';
import { X, Users, Building2, Briefcase, TrendingUp, Cpu, Navigation, AlertTriangle, ShieldCheck, CheckCircle, BarChart3 } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-4xl w-full border border-indigo-500/40 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              KHIRE 플랫폼 통합 관리자 대시보드 (Admin Portal)
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                Admin
              </span>
            </h3>
            <p className="text-xs text-slate-400">회원, 기업, 공고 승인, AI 사용량 및 거리검색 실시간 통계 모니터링</p>
          </div>
        </div>

        {/* Realtime Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>총 개인 회원</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-extrabold text-white">14,250명</div>
            <span className="text-[10px] text-emerald-400 font-semibold">↑ 오늘 가입 128명</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>등록 기업 수</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-extrabold text-white">1,840개</div>
            <span className="text-[10px] text-emerald-400 font-semibold">↑ 오늘 신규 14개</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>활성 채용 공고</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-white">3,920건</div>
            <span className="text-[10px] text-indigo-400 font-semibold">오늘 지원 412건</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>AI 매칭 로그 수</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-extrabold text-white">28,940회</div>
            <span className="text-[10px] text-purple-400 font-semibold">Gemini 3 Flash 사용량</span>
          </div>
        </div>

        {/* Distance Search Statistics & Pending Approval List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Distance Analytics */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              당근마켓 반경 거리 검색 이용 비율 통계
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>15 km 반경 (성수·잠실·강남)</span>
                  <span className="font-bold text-indigo-400">42%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>30 km 반경 (판교·수원·인천)</span>
                  <span className="font-bold text-blue-400">31%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '31%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>60 km ~ 150 km 반경</span>
                  <span className="font-bold text-emerald-400">18%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Job Approvals */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              승인 대기 중인 기업 공고 (2건)
            </h4>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">K-Tech System - 풀스택 개발자</div>
                  <span className="text-[10px] text-slate-400">사업자 등록 확인 완료</span>
                </div>
                <button
                  onClick={() => alert('공고가 승인 처리되었습니다.')}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> 승인
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">LogiKorea - 물류 현장 관리자</div>
                  <span className="text-[10px] text-slate-400">신규 기업 신청</span>
                </div>
                <button
                  onClick={() => alert('공고가 승인 처리되었습니다.')}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> 승인
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
