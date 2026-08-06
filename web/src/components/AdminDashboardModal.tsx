'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Building2, Briefcase, TrendingUp, Cpu, Navigation, AlertTriangle, ShieldCheck, CheckCircle, Trash2, Edit3, Save } from 'lucide-react';
import { JobPost } from '@/types/job';
import { getJobsFromDB, deleteJobFromDB, updateJobInDB } from '@/lib/jobService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobsUpdated?: () => void;
}

export default function AdminDashboardModal({ isOpen, onClose, onJobsUpdated }: AdminDashboardModalProps) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSalary, setEditSalary] = useState('');

  const loadAdminJobs = async () => {
    const loaded = await getJobsFromDB();
    setJobs(loaded);
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminJobs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteJob = async (jobId: string, title: string) => {
    if (confirm(`[관리자 권한 삭제]\n정말로 다음 채용 공고를 삭제하시겠습니까?\n\n- 공고명: ${title}`)) {
      const updated = await deleteJobFromDB(jobId);
      setJobs(updated);
      if (onJobsUpdated) onJobsUpdated();
      alert('관리자 권한으로 공고가 삭제되었습니다.');
    }
  };

  const handleStartEdit = (job: JobPost) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditSalary(job.salary);
  };

  const handleSaveEdit = async () => {
    if (!editingJob) return;
    const updatedJob: JobPost = {
      ...editingJob,
      title: editTitle,
      salary: editSalary,
    };
    const updatedList = await updateJobInDB(updatedJob);
    setJobs(updatedList);
    setEditingJob(null);
    if (onJobsUpdated) onJobsUpdated();
    alert('관리자 권한으로 공고 내용이 수정되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-5xl w-full border border-purple-500/40 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
              KHIRE 최고 관리자 전용 센터 (System Admin)
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                👑 Super Admin
              </span>
            </h3>
            <p className="text-xs text-slate-400">모든 채용 공고 실시간 모니터링, 정보 수정 및 강제 삭제 통합 관리</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>전체 등록 공고</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{jobs.length}건</div>
            <span className="text-[10px] text-emerald-400 font-semibold">DB 실시간 동기화</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>$30 스폰서 공고</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">
              {jobs.filter((j) => j.isPremiumAd || j.adPrice === 30).length}건
            </div>
            <span className="text-[10px] text-amber-400 font-semibold">5초 로테이션 게시 중</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>등록 기업 회원</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">1,840개</div>
            <span className="text-[10px] text-blue-400 font-semibold">실시간 승인 완료</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Gemini 3 Flash</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">28,940회</div>
            <span className="text-[10px] text-purple-400 font-semibold">AI 자동 매칭 작동</span>
          </div>
        </div>

        {/* Job Edit Modal Popup inside Admin */}
        {editingJob && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-3">
            <h4 className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" /> 공고 정보 수정 (ID: {editingJob.id})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">공고 제목</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">급여 정보</label>
                <input
                  type="text"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingJob(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> 저장하기
              </button>
            </div>
          </div>
        )}

        {/* All Job Postings Management Table */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            전체 등록 공고 목록 및 관리자 수정/삭제 조치
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">업체 / 대표자</th>
                  <th className="p-3">공고 제목</th>
                  <th className="p-3">급여 조건</th>
                  <th className="p-3">상품 구분</th>
                  <th className="p-3 text-right">관리 조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-emerald-300 max-w-[140px] truncate">
                      {job.companyName}
                    </td>
                    <td className="p-3 font-semibold text-white max-w-[200px] truncate">
                      {job.title}
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {job.salary}
                    </td>
                    <td className="p-3">
                      {job.isPremiumAd || job.adPrice === 30 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                          👑 $30 프리미엄
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium text-[10px]">
                          $1 일반
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleStartEdit(job)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[11px] border border-indigo-500/40"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] border border-rose-500/40"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold transition-all"
          >
            관리자 대시보드 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
