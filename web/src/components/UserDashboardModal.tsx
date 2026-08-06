'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  CreditCard,
  Plus,
  Eye,
  Calendar,
  Sparkles,
  Briefcase,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { JobPost } from '@/types/job';

export interface UserResume {
  id: string;
  title: string;
  category: string;
  desiredSalary: string;
  careerSummary: string;
  skills: string[];
  updatedAt: string;
}

export interface UserApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedResumeTitle: string;
  appliedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED';
}

export interface ApplicantResumeSubmission {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeTitle: string;
  resumeSummary: string;
  appliedAt: string;
  jobTitle: string;
}

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  onOpenResumeModal: () => void;
  myApplications: UserApplication[];
  onCancelApplication: (appId: string) => void;
  myJobs: JobPost[];
  onDeleteMyJob: (jobId: string) => void;
}

export default function UserDashboardModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  onOpenResumeModal,
  myApplications,
  onCancelApplication,
  myJobs,
  onDeleteMyJob,
}: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'RESUMES' | 'APPLICATIONS' | 'MY_POSTS' | 'PAYMENTS'>('RESUMES');

  // Up to 2 Resumes Management
  const [userResumes, setUserResumes] = useState<UserResume[]>([
    {
      id: 'res-1',
      title: '이력서 1: 호주/시드니 F&B 한식 BBQ 조리장 및 바리스타 경력 이력서',
      category: 'F&B (한인식당/카페)',
      desiredSalary: '시급 AUD $28 ~ $35',
      careerSummary: '수라간 K-BBQ 메인 조리장 3년 경력, K-Cafe 바리스타 자격증 보유',
      skills: ['한식 조리', '바리스타', '주방 관리', 'Customer Service'],
      updatedAt: '2026-08-05',
    },
    {
      id: 'res-2',
      title: '이력서 2: 시드니 상업용 청소 및 타일 현장 기술 이력서',
      category: '숙박 & 청소 / 물류',
      desiredSalary: '일급 AUD $300 ~ $400',
      careerSummary: '상업용 오피스 딥 클리닝 2년, 아파트 현장 타일 방수 보조 1년 경력',
      skills: ['시드니 청소 알바', '타일 작업', '장비 운용', '현장 안전'],
      updatedAt: '2026-08-06',
    },
  ]);

  // Selected Applicant Resume for Employer Viewing
  const [selectedApplicantResume, setSelectedApplicantResume] = useState<ApplicantResumeSubmission | null>(null);

  if (!isOpen) return null;

  const handleDeleteResume = (resId: string) => {
    if (confirm('선택하신 이력서를 삭제하시겠습니까? (최대 2개까지 유지 가능)')) {
      setUserResumes((prev) => prev.filter((r) => r.id !== resId));
    }
  };

  const sampleApplicants: ApplicantResumeSubmission[] = [
    {
      applicantName: '김워홀 (Melbourne WH)',
      applicantEmail: 'worhol.kim@gmail.com',
      applicantPhone: '+61 422-333-444',
      resumeTitle: '이력서 1: 멜버른 바리스타 & 카페 서비스 경력',
      resumeSummary: '멜버른 시티 K-Cafe 바리스타 1년 및 라떼아트 자격증 보유. 즉시 출근 가능.',
      appliedAt: '2026-08-06 13:40',
      jobTitle: '시드니 K-BBQ 조리장 & 홀 매니저',
    },
    {
      applicantName: '이타일 (Sydney Tile)',
      applicantEmail: 'tile.lee@gmail.com',
      applicantPhone: '+61 411-999-888',
      resumeTitle: '이력서 2: 호주 시드니 타일공 및 방수 기술 이력서',
      resumeSummary: '시드니 스트라스필드 현장 타일 작업 2년 경력. 자차 및 개인 도구 소지.',
      appliedAt: '2026-08-06 14:15',
      jobTitle: '시드니 스트라스필드 타일공 구인',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-3xl w-full border border-emerald-500/40 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard User Info Banner */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-extrabold text-xl">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{userName} 님의 마이 대시보드</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                통합 회원
              </span>
            </h3>
            <p className="text-xs text-slate-400">{userEmail}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 text-xs font-bold mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('RESUMES')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'RESUMES'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            📄 이력서 관리 ({userResumes.length}/2개)
          </button>

          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'APPLICATIONS'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            📬 입사 지원 내역 ({myApplications.length}건)
          </button>

          <button
            onClick={() => setActiveTab('MY_POSTS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'MY_POSTS'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            🏢 내 구인공고 & 지원자 열람
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'PAYMENTS'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            💳 결제 내역 ($1 / $30)
          </button>
        </div>

        {/* TAB 1: RESUMES (MAX 2) */}
        {activeTab === 'RESUMES' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-white text-sm">내 이력서 등록 및 선택 관리</h4>
                <p className="text-slate-400 text-[11px]">
                  이력서는 **최대 2개**까지 작성 가능하며, 업종별로 다르게 선택하여 구직 신청을 할 수 있습니다.
                </p>
              </div>

              {userResumes.length < 2 && (
                <button
                  type="button"
                  onClick={onOpenResumeModal}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow transition flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>새 이력서 등록 (추가)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {userResumes.map((res, index) => (
                <div key={res.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold">
                      대표 이력서 #{index + 1} ({res.category})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">최종 수정: {res.updatedAt}</span>
                      <button
                        onClick={() => handleDeleteResume(res.id)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-950 transition"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h5 className="font-bold text-white text-sm">{res.title}</h5>
                  <p className="text-slate-300 text-xs">{res.careerSummary}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.skills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 text-[10px] font-bold border border-slate-800">
                        #{sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS & CANCELLATION */}
        {activeTab === 'APPLICATIONS' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-extrabold text-white text-sm">입사 지원 현황 및 지원 취소</h4>

            {myApplications.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
                아직 입사 지원한 공고 내역이 없습니다. 원하는 일자리에 1클릭 지원해 보세요.
              </div>
            ) : (
              <div className="space-y-2.5">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{app.jobTitle}</span>
                        <span className="text-[11px] text-emerald-400 font-bold">({app.companyName})</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        제출 이력서: <span className="text-slate-200 font-semibold">{app.appliedResumeTitle}</span> | 지원일시: {app.appliedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">
                        지원 완료
                      </span>

                      <button
                        onClick={() => {
                          if (confirm('해당 채용 공고 지원을 취소하시겠습니까?')) {
                            onCancelApplication(app.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-[11px] transition shadow"
                      >
                        지원 취소
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY POSTS & APPLICANT RESUME VIEWING */}
        {activeTab === 'MY_POSTS' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-extrabold text-white text-sm">내가 등록한 구인공고 관리 & 지원자 이력서 열람</h4>

            <div className="space-y-3">
              {myJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-white text-sm">{job.title}</h5>
                      <span className="text-[11px] text-slate-400">{job.locationName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteMyJob(job.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>

                  {/* Applicants List for this Job */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> 지원자 이력서 목록 (2명 지원 중)
                    </span>

                    <div className="space-y-1.5">
                      {sampleApplicants.map((applicant, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-[11px] text-slate-200"
                        >
                          <div>
                            <span className="font-bold text-white">{applicant.applicantName}</span> ({applicant.applicantPhone})
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedApplicantResume(applicant)}
                            className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] transition flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>이력서 열람</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS HISTORY */}
        {activeTab === 'PAYMENTS' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-extrabold text-white text-sm">PayPal 공고 결제 이력 내역 ($1 / $30)</h4>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold text-[11px]">
                  <tr>
                    <th className="p-3">PayPal Transaction ID</th>
                    <th className="p-3">상품 종류</th>
                    <th className="p-3">결제 금액</th>
                    <th className="p-3">결제일시</th>
                    <th className="p-3 text-right">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-300">GEY6YHWRDH54E-901</td>
                    <td className="p-3 font-bold text-amber-300">👑 $30 프리미엄 5초 로테이션 배너</td>
                    <td className="p-3 font-extrabold text-emerald-400">$30.00 USD</td>
                    <td className="p-3 text-slate-400">2026-08-06 14:10</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        승인 완료
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-300">R5JUWLNA7ZJJA-802</td>
                    <td className="p-3 text-slate-200">$1 일반 채용 공고 (7일)</td>
                    <td className="p-3 font-extrabold text-emerald-400">$1.00 USD</td>
                    <td className="p-3 text-slate-400">2026-08-06 12:30</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        승인 완료
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applicant Resume Viewer Popup Modal for Employer */}
        {selectedApplicantResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-emerald-500/50 shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedApplicantResume(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <FileText className="w-4 h-4" />
                <span>지원자 제출 이력서 상세 열람</span>
              </div>

              <h4 className="text-xl font-extrabold text-white">
                {selectedApplicantResume.applicantName} 님의 이력서
              </h4>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <p className="text-slate-300">이메일: <strong className="text-white">{selectedApplicantResume.applicantEmail}</strong></p>
                <p className="text-slate-300">연락처: <strong className="text-emerald-400 font-mono">{selectedApplicantResume.applicantContact || selectedApplicantResume.applicantPhone}</strong></p>
                <p className="text-slate-300">이력서 제목: <strong className="text-amber-300">{selectedApplicantResume.resumeTitle}</strong></p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 mt-2">
                  {selectedApplicantResume.resumeSummary}
                </div>
              </div>

              <button
                onClick={() => setSelectedApplicantResume(null)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
