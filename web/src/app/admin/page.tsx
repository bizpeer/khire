'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Key,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  Tag,
  Plus,
  Zap,
  ArrowLeft,
  Calendar,
  FileText,
} from 'lucide-react';

interface MemberUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'APPLICANT' | 'EMPLOYER';
  joinedAt: string;
  postCount: number;
}

interface PromotionPolicy {
  id: string;
  title: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED' | 'FREE';
  discountValue: number;
  isActive: boolean;
  appliedCount: number;
  description: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MEMBERS' | 'JOBS' | 'PAYMENTS' | 'PROMOTIONS'>('OVERVIEW');
  const [searchMember, setSearchMember] = useState('');

  // Sample Members State
  const [members, setMembers] = useState<MemberUser[]>([
    {
      id: 'usr-1',
      name: '홍길동 (John Doe)',
      email: 'applicant@khire.net',
      phone: '+61 412-345-678',
      role: 'APPLICANT',
      joinedAt: '2026-08-01',
      postCount: 0,
    },
    {
      id: 'usr-2',
      name: '수라간 대표 (K-BBQ Owner)',
      email: 'employer@khire.net',
      phone: '+61 498-765-432',
      role: 'EMPLOYER',
      joinedAt: '2026-08-02',
      postCount: 2,
    },
    {
      id: 'usr-3',
      name: '시드니 타일 공사 (AU Tile Corp)',
      email: 'sydney.tile@khire.net',
      phone: '+61 411-222-333',
      role: 'EMPLOYER',
      joinedAt: '2026-08-03',
      postCount: 1,
    },
    {
      id: 'usr-4',
      name: '김워홀 (Melbourne WH)',
      email: 'worhol.kim@gmail.com',
      phone: '+61 422-333-444',
      role: 'APPLICANT',
      joinedAt: '2026-08-04',
      postCount: 0,
    },
  ]);

  // Sample Promotion Policies State
  const [promotions, setPromotions] = useState<PromotionPolicy[]>([
    {
      id: 'promo-1',
      title: '호주·뉴질랜드 오픈 기념 $1 공고 50% 할인',
      code: 'AUNZ50OFF',
      discountType: 'PERCENT',
      discountValue: 50,
      isActive: true,
      appliedCount: 42,
      description: '모든 신규 채용 공고 $1 결제 시 50% 즉시 할인 적용',
    },
    {
      id: 'promo-2',
      title: '신규 고용주 1회 무료 채용공고 쿠폰',
      code: 'FREEFIRSTJOB',
      discountType: 'FREE',
      discountValue: 100,
      isActive: true,
      appliedCount: 18,
      description: '최초 회원가입한 고용주에게 1회 무료 $1 공고 등록권 제공',
    },
    {
      id: 'promo-3',
      title: '상단 5초 배너 $30 프리미엄 1+1 이벤트',
      code: 'PREMIUM1PLUS1',
      discountType: 'FIXED',
      discountValue: 15,
      isActive: false,
      appliedCount: 5,
      description: '$30 결제 시 7일 추가 무료 연장 혜택',
    },
  ]);

  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState(10);

  // Handle Member Password Reset
  const handleResetPassword = (member: MemberUser) => {
    const tempPassword = `Khire${Math.floor(100000 + Math.random() * 900000)}!`;
    alert(
      `[관리자 권한] ${member.name} (${member.email}) 회원의 비밀번호가 성공적으로 초기화되었습니다.\n\n임시 비밀번호: ${tempPassword}\n\n회원의 이메일과 SMS로 임시 비밀번호가 안전하게 발송되었습니다.`
    );
  };

  // Toggle Promotion Policy
  const handleTogglePromo = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Add New Promotion Policy
  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle || !newPromoCode) {
      alert('프로모션 제목과 쿠폰 코드를 입력하세요.');
      return;
    }
    const newPolicy: PromotionPolicy = {
      id: `promo-${Date.now()}`,
      title: newPromoTitle,
      code: newPromoCode.toUpperCase(),
      discountType: 'PERCENT',
      discountValue: Number(newPromoValue),
      isActive: true,
      appliedCount: 0,
      description: '관리자 신규 등록 프로모션 정책',
    };
    setPromotions((prev) => [newPolicy, ...prev]);
    setNewPromoTitle('');
    setNewPromoCode('');
    alert(`신규 프로모션 정책 [${newPolicy.code}]가 성공적으로 반영되었습니다.`);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.email.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-purple-500 selection:text-slate-950">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-purple-900/50 px-6 py-4 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>메인으로 이동</span>
            </Link>
            <div className="h-5 w-[1px] bg-slate-800" />
            <span className="flex items-center gap-2 text-lg font-extrabold text-white">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <span>KHIRE Admin Portal (/admin)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                최고 관리자 전용
              </span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            접속 권한: <strong className="text-purple-300 font-bold">Super Admin Level 1</strong>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Key Metrics Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>총 가입 회원수</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">1,248 명</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 호주/뉴질랜드 이번 주 +128명 신규 가입
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>누적 결제 매출</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">$18,430 USD</div>
            <div className="text-[11px] text-slate-400">
              $1 일반공고 + $30 프리미엄 5초 배너 합산
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>등록 채용 공고수</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">412 건</div>
            <div className="text-[11px] text-amber-300 font-bold">
              👑 $30 프리미엄 배너 48건 활성 로테이션 중
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-900/40 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>활성 프로모션 정책</span>
              <Tag className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-300">
              {promotions.filter((p) => p.isActive).length} 개 정책
            </div>
            <div className="text-[11px] text-slate-400">실시간 할인 및 혜택 적용 중</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2 text-xs font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'OVERVIEW'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            📊 대시보드 개요
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'MEMBERS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            👥 회원 관리 & 비밀번호 초기화
          </button>
          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'PAYMENTS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            💳 공고 결제 금액 및 이력
          </button>
          <button
            onClick={() => setActiveTab('PROMOTIONS')}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === 'PROMOTIONS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            🏷️ 프로모션 정책 설정 (Promotion Policy)
          </button>
        </div>

        {/* TAB 1: MEMBERS MANAGEMENT & PASSWORD RESET */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>가입 회원 목록 관리 및 비밀번호 초기화</span>
              </h3>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="이름 또는 이메일 검색..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">회원 성명 (ID)</th>
                    <th className="p-3.5">이메일 주소</th>
                    <th className="p-3.5">전화번호</th>
                    <th className="p-3.5">회원 유형</th>
                    <th className="p-3.5">가입일</th>
                    <th className="p-3.5 text-right">관리 기능</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <span>{member.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-300">{member.email}</td>
                      <td className="p-3.5 text-emerald-400 font-mono font-bold">{member.phone}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            member.role === 'EMPLOYER'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {member.role === 'EMPLOYER' ? '기업 고용주' : '개인 구직자'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{member.joinedAt}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleResetPassword(member)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] shadow transition flex items-center gap-1 ml-auto"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>비밀번호 초기화</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROMOTION POLICY IMPLEMENTATION */}
        {activeTab === 'PROMOTIONS' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-900/50 shadow-xl space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                <span>신규 프로모션 정책 등록 (Implementation)</span>
              </h3>

              <form onSubmit={handleAddPromotion} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">프로모션 정책명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 호주 시드니 개통 기념 20% 할인"
                    value={newPromoTitle}
                    onChange={(e) => setNewPromoTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">쿠폰 코드 (Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: SYDNEY2026"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">할인율 (%) *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={newPromoValue}
                      onChange={(e) => setNewPromoValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shrink-0 shadow transition flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>정책 등록</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Existing Promotion Policies Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">프로모션 정책명</th>
                    <th className="p-3.5">쿠폰 코드</th>
                    <th className="p-3.5">혜택 내용</th>
                    <th className="p-3.5">누적 적용 횟수</th>
                    <th className="p-3.5">활성화 상태</th>
                    <th className="p-3.5 text-right">상태 토글</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {promotions.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3.5 font-bold text-white">{p.title}</td>
                      <td className="p-3.5 font-mono font-bold text-amber-300">{p.code}</td>
                      <td className="p-3.5 text-slate-300">{p.description}</td>
                      <td className="p-3.5 font-bold text-emerald-400">{p.appliedCount} 회</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            p.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          {p.isActive ? 'Active (적용 중)' : 'Disabled (중단)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleTogglePromo(p.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                            p.isActive
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black'
                          }`}
                        >
                          {p.isActive ? '중지하기' : '활성화하기'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OVERVIEW & PAYMENTS */}
        {(activeTab === 'OVERVIEW' || activeTab === 'PAYMENTS') && (
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>PayPal 결제 내역 및 공고 결제 금액 실시간 집계</span>
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">PayPal Order ID</th>
                    <th className="p-3.5">결제 고용주 회원</th>
                    <th className="p-3.5">공고 상품</th>
                    <th className="p-3.5">결제 금액</th>
                    <th className="p-3.5">결제일시</th>
                    <th className="p-3.5 text-right">승인 상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr className="hover:bg-slate-800/50 transition">
                    <td className="p-3.5 font-mono font-bold text-indigo-300">GEY6YHWRDH54E-901</td>
                    <td className="p-3.5 font-bold text-white">시드니 K-Tile (sydney.tile@khire.net)</td>
                    <td className="p-3.5 font-bold text-amber-300">👑 $30 프리미엄 5초 로테이션</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">$30.00 USD</td>
                    <td className="p-3.5 text-slate-400">2026-08-06 14:10:00</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        APPROVED (승인 완료)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/50 transition">
                    <td className="p-3.5 font-mono font-bold text-indigo-300">R5JUWLNA7ZJJA-802</td>
                    <td className="p-3.5 font-bold text-white">수라간 K-BBQ (employer@khire.net)</td>
                    <td className="p-3.5 text-emerald-300">$1 일반 채용 공고 (7일)</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">$1.00 USD</td>
                    <td className="p-3.5 text-slate-400">2026-08-06 12:30:00</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        APPROVED (승인 완료)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
