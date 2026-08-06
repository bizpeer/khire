'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Crown,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  Apple,
  Zap,
  Info,
  ChevronDown,
  Eye,
  Star,
  Users,
  Compass,
  FileCheck,
  Layers,
  HeartHandshake
} from 'lucide-react';
import FbmViewer3D from './FbmViewer3D';
import FbmVipFormModal from './FbmVipFormModal';
import FbmLookbookModal from './FbmLookbookModal';

interface FbmShowcaseProps {
  onSwitchToKhire?: () => void;
}

export default function FbmShowcase({ onSwitchToKhire }: FbmShowcaseProps) {
  // Modals state
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isAuthenticityOpen, setIsAuthenticityOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState('18K 샴페인 로즈골드 에디션');

  // FBM Live Inspector Mode Toggle (Interactive educational UI tool)
  const [fbmInspector, setFbmInspector] = useState<boolean>(true);
  const [highlightedCategory, setHighlightedCategory] = useState<'ALL' | 'MOTIVATION' | 'ABILITY' | 'TRIGGER'>('ALL');

  // Spark Trigger Toast State (Scarcity & Social proof live updates)
  const [toastNotification, setToastNotification] = useState<{ name: string; location: string; time: string } | null>(null);

  useEffect(() => {
    const notifications = [
      { name: '김*우 VIP', location: '서울 강남구 청담동', time: '방금 전' },
      { name: 'David C.', location: '미국 Beverly Hills, CA', time: '3분 전' },
      { name: '박*혜 VIP', location: '서울 서초구 반포동', time: '7분 전' },
      { name: 'Kenji T.', location: '일본 도쿄 신주쿠', time: '12분 전' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      setToastNotification(notifications[index]);
      index = (index + 1) % notifications.length;

      // Auto hide after 4 seconds
      setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenConsultation = (editionName?: string) => {
    if (editionName) setSelectedEdition(editionName);
    setIsVipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* ---------------------------------------------------- */}
      {/* TOP FBM LIVE INSPECTOR BAR (Interactive Educator)    */}
      {/* ---------------------------------------------------- */}
      <div className="bg-zinc-950 border-b border-amber-500/30 px-4 py-2 text-xs sticky top-0 z-50 glass-gold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-serif font-bold text-[11px] border border-amber-500/30">
              BJ Fogg Behavior Model: B = MAT
            </span>
            <span className="text-zinc-300 hidden md:inline">
              행동($B$) = 동기($M$) $\times$ 능력($A$) $\times$ 트리거($T$) 실시간 매핑 레이아웃
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setHighlightedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                highlightedCategory === 'ALL'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              전체 보기
            </button>
            <button
              onClick={() => setHighlightedCategory('MOTIVATION')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                highlightedCategory === 'MOTIVATION'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-zinc-900 text-rose-300/80 hover:text-rose-200'
              }`}
            >
              동기 ($M$)
            </button>
            <button
              onClick={() => setHighlightedCategory('ABILITY')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                highlightedCategory === 'ABILITY'
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-emerald-300/80 hover:text-emerald-200'
              }`}
            >
              단순성 ($A$)
            </button>
            <button
              onClick={() => setHighlightedCategory('TRIGGER')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                highlightedCategory === 'TRIGGER'
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-amber-300/80 hover:text-amber-200'
              }`}
            >
              트리거 ($T$)
            </button>

            {onSwitchToKhire && (
              <button
                onClick={onSwitchToKhire}
                className="ml-3 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition"
              >
                KHIRE 구인구직 보기 ➔
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* LUXURY NAVIGATION HEADER                             */}
      {/* ---------------------------------------------------- */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-[41px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-serif font-bold text-lg shadow-lg">
              A
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-widest text-white block">
                AETERNO <span className="text-amber-400 font-sans text-xs uppercase tracking-normal font-semibold">HAUTE</span>
              </span>
              <span className="text-[9px] text-zinc-500 tracking-widest block uppercase">
                Swiss Independent Complications
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-zinc-400">
            <a href="#hero" className="hover:text-amber-300 transition">HERITAGE</a>
            <a href="#story" className="hover:text-amber-300 transition">CRAFTSMANSHIP</a>
            <a href="#showcase" className="hover:text-amber-300 transition">360° SHOWCASE</a>
            <a href="#vip" className="hover:text-amber-300 transition">VIP SALON</a>
            <a href="#authenticity" className="hover:text-amber-300 transition">AUTHENTICITY</a>
          </nav>

          {/* Signal Trigger CTA (Header Fixed) */}
          <div className="flex items-center gap-3">
            {(highlightedCategory === 'ALL' || highlightedCategory === 'TRIGGER') && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                <Zap className="w-3 h-3" /> Signal Trigger
              </span>
            )}
            <button
              onClick={() => handleOpenConsultation()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-serif font-bold text-xs tracking-wider uppercase transition shadow-lg hover:shadow-amber-500/20"
            >
              PRIVATE CONSULTATION
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* ---------------------------------------------------- */}
        {/* SECTION 1: HERO SECTION (Pleasure & Hope)            */}
        {/* ---------------------------------------------------- */}
        <section id="hero" className="relative pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* FBM Tag Annotation */}
          {(highlightedCategory === 'ALL' || highlightedCategory === 'MOTIVATION') && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              FBM Motivation: 즐거움(Pleasure) 자극 & 라이프스타일 희망(Hope) 부여
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Crown className="w-3.5 h-3.5" /> 전 세계 50점 리미티드 세쿼이아 에디션
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-white tracking-tight">
                Crafted for the Elite.<br />
                <span className="text-gradient-gold">Reserved for the Few.</span>
              </h1>

              <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
                시간의 가치를 온전히 소유하는 즐거움. 스위스 독립 시계 제작자의 1,000시간 손길로 완성된
                AETERNO Grand Complication 2026 에디션을 프라이빗 1:1 상담으로 만나보십시오.
              </p>

              {/* Live Inventory Scarcity Spark Trigger Indicator */}
              <div className="p-4 rounded-2xl glass-gold border border-amber-500/30 max-w-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> 2026 시즌 잔여 배정 수량
                  </span>
                  <span className="text-amber-300 font-bold">잔여 3점 / 50점</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full w-[94%]" />
                </div>
                <p className="text-[11px] text-rose-400 font-semibold">
                  ⚠️ 한국 및 아시아 지역 사전 예약 잔여 슬롯 소진 임박
                </p>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => handleOpenConsultation()}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-extrabold tracking-wider uppercase transition shadow-2xl hover:shadow-amber-500/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  프라이빗 1:1 VIP 상담 예약 (1초 신청)
                </button>

                <button
                  onClick={() => setIsLookbookOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  디지털 룩북 다운로드
                </button>
              </div>
            </div>

            {/* Visual Art Hero Canvas (Pleasure Trigger) */}
            <div className="lg:col-span-5 relative">
              <div className="w-full h-96 md:h-[450px] rounded-3xl glass-gold border border-amber-500/30 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/10 pointer-events-none" />

                {/* Animated Dial Graphics */}
                <div className="relative w-64 h-64 rounded-full border-2 border-amber-500/40 flex items-center justify-center animate-spin-slow">
                  <div className="w-48 h-48 rounded-full border border-amber-500/20" />
                  <div className="w-32 h-32 rounded-full border border-amber-500/30" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40 backdrop-blur-sm">
                  <Crown className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                  <h4 className="text-xl font-serif font-bold text-white tracking-widest uppercase">
                    AETERNO K-HAUTE
                  </h4>
                  <p className="text-xs text-amber-300 font-serif mt-1">GRAND COMPLICATION</p>
                  <span className="mt-4 px-3 py-1 rounded-full bg-zinc-900/90 border border-amber-500/30 text-[10px] text-zinc-300">
                    452 Hand-Crafted Components
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 2: BRAND STORY & TRUST (Hope & Fear Avoidance)*/}
        {/* ---------------------------------------------------- */}
        <section id="story" className="py-20 px-4 md:px-8 border-t border-zinc-900 bg-zinc-950/60">
          <div className="max-w-7xl mx-auto">
            {/* FBM Tag */}
            {(highlightedCategory === 'ALL' || highlightedCategory === 'MOTIVATION') && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                FBM Motivation: 희망(Hope) 부여 & 위조품 공포(Fear) 완전 차단
              </div>
            )}

            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Artisanal Heritage & Authenticity
              </h2>
              <p className="text-xs md:text-sm text-zinc-400">
                단순한 제품 소비를 넘어 지적/예술적 정당성을 부여하는 4단계 장인정신 아카이빙
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: '희귀 메탈 탐사',
                  desc: '전 세계 최고급 순도 18K 샴페인 골드 및 옵시디언 티타늄 엄선',
                  icon: Crown,
                },
                {
                  step: '02',
                  title: '스위스 Hand-engraving',
                  desc: '독립 시계 제작자의 100% 손조각 마이크로 세공 기법 적용',
                  icon: Award,
                },
                {
                  step: '03',
                  title: '뚜르비옹 내구성 검증',
                  desc: '6방향 중력 오차 상쇄 및 50미터 방수 정밀 검사 완료',
                  icon: Compass,
                },
                {
                  step: '04',
                  title: '온체인 정품 보증',
                  desc: '위조 우려를 원천 차단하는 암호화 NFT 소유권 보증서 발행',
                  icon: ShieldCheck,
                },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-gold border border-amber-500/20 hover:border-amber-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-serif font-bold text-amber-400">
                        {item.step}
                      </span>
                      <IconComp className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Anti-Forgery Guarantee Modal Trigger Button (Fear Avoidance) */}
            <div className="mt-12 text-center">
              <button
                onClick={() => setIsAuthenticityOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-zinc-800 transition shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                온체인 암호화 정품 보증 프로토콜 시스템 보기 (Fear 방지)
              </button>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 3: PRODUCT SHOWCASE (360 Viewer & Ability)   */}
        {/* ---------------------------------------------------- */}
        <section id="showcase" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          {/* FBM Tag */}
          {(highlightedCategory === 'ALL' || highlightedCategory === 'ABILITY') && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              FBM Ability (단순화): 뇌 소모 최소화 (Brain Cycles) & 직관적 360° 뷰어
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-white">Interactive 360° Inspector</h2>
            <p className="text-xs text-zinc-400 mt-1">
              어려운 사양표를 해석하지 않고 마우스 드래그 하나로 정밀 세공 디자인을 다각도로 직관 확인하십시오.
            </p>
          </div>

          <FbmViewer3D
            onOpenLookbook={() => setIsLookbookOpen(true)}
            onOpenConsultation={(edition) => handleOpenConsultation(edition)}
          />
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 4: SOCIAL PROOF & VIP SALON (Social Acceptance)*/}
        {/* ---------------------------------------------------- */}
        <section id="vip" className="py-20 px-4 md:px-8 border-t border-zinc-900 bg-zinc-950/80">
          <div className="max-w-7xl mx-auto">
            {/* FBM Tag */}
            {(highlightedCategory === 'ALL' || highlightedCategory === 'MOTIVATION') && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                FBM Motivation: 사회적 수용(Social Acceptance) & VIP 독점 그룹 소속감
              </div>
            )}

            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-3xl font-serif font-bold text-white">
                Global Opinion Leaders & VIP Salon
              </h2>
              <p className="text-xs text-zinc-400">
                컬렉터와 오피니언 리더들이 증명하는 독점적 가치와 품격
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "스위스 독립 시계학의 정점입니다. 다이얼 손조각 세공과 뚜르비옹 구동 모션은 완벽한 예술품입니다.",
                  author: "Jean-Luc M.",
                  role: "제네바 시계 협회(AHCI) 마스터 시계학자",
                },
                {
                  quote:
                    "희소 수량으로 인해 소유 자체만으로 VIP 살롱 커뮤니티 내 지위와 남다른 품격이 정당화됩니다.",
                  author: "Elena R.",
                  role: "글로벌 럭셔리 아트 큐레이터",
                },
                {
                  quote:
                    "온체인 보증서 덕분에 가품 걱정 없이 100% 신뢰로 구매 예약을 완료할 수 있었습니다.",
                  author: "최*우 대표",
                  role: "프라이빗 펀드 대표 및 타임피스 수집가",
                },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-gold border border-zinc-800 space-y-4"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">"{rev.quote}"</p>
                  <div className="pt-2 border-t border-zinc-800">
                    <p className="text-xs font-bold text-white">{rev.author}</p>
                    <p className="text-[10px] text-amber-300">{rev.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* VIP Serial Number Live Allocation Preview */}
            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">VIP Salon Serial Number Allocation</h4>
                  <p className="text-xs text-zinc-400">
                    구매 고객만을 위한 한정판 서리얼 넘버 인그레이빙 서비스 제공
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs tracking-widest">
                CURRENT ALLOCATION: SERIAL NO. 008 / 050
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 5: SUPER-LIGHT CTA FORM (Time & Brain Cycles) */}
        {/* ---------------------------------------------------- */}
        <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
          {/* FBM Tag */}
          {(highlightedCategory === 'ALL' || highlightedCategory === 'ABILITY') && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              FBM Ability (단순화): 시간 자원 최소화 (Time) & 1초 초간결 폼
            </div>
          )}

          <div className="p-8 md:p-12 rounded-3xl glass-gold border border-amber-500/40 relative overflow-hidden shadow-2xl">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                1:1 PRIVATE VIP RESERVATION
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                마찰력을 완전히 허문 1초 VIP 예약
              </h2>
              <p className="text-xs md:text-sm text-zinc-400">
                긴 신청서를 작성할 필요가 없습니다. 카카오/애플 간편 탭 또는 연락처 작성만으로
                전담 VIP 컨시어지가 안내를 도와드립니다.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => handleOpenConsultation()}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-extrabold tracking-wider uppercase transition shadow-2xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  프라이빗 1:1 상담 신청하기
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 pt-4">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 15분 이내 해피콜
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 전담 라운지 무료 이용
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 발렛파킹 지원
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------- */}
      {/* FLOATING TRIGGER WIDGETS (Facilitator & Spark)       */}
      {/* ---------------------------------------------------- */}

      {/* 1. Facilitator Floating Button: 1-Click Kakao/Apple */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Toast Spark Trigger Alert */}
        {toastNotification && (
          <div className="px-4 py-3 rounded-2xl bg-zinc-950/90 border border-amber-500/40 text-xs text-zinc-200 shadow-2xl glass-gold animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">{toastNotification.name} 상담 신청 완료</p>
              <p className="text-[10px] text-zinc-400">{toastNotification.location} • {toastNotification.time}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => handleOpenConsultation()}
          className="px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-zinc-950 font-bold text-xs shadow-2xl hover:scale-105 transition flex items-center gap-2 border border-amber-300/40 gold-border-glow"
        >
          <MessageCircle className="w-4 h-4 fill-zinc-950" />
          <span>1:1 간편 VIP 상담</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950 text-xs text-zinc-500 text-center space-y-2">
        <p className="font-serif text-zinc-400">
          AETERNO HAUTE HORLOGERIE © 2026. All Rights Reserved.
        </p>
        <p className="text-[11px] text-zinc-600">
          Fogg Behavior Model Framework Applied ($B = MAT$). Powered by Antigravity AI Engine.
        </p>
      </footer>

      {/* MODALS */}
      <FbmVipFormModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        productEdition={selectedEdition}
      />

      <FbmLookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
      />

      {/* Authenticity Certificate Modal (Fear Avoidance) */}
      {isAuthenticityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-emerald-500/40 p-6 md:p-8 glass-gold">
            <button
              onClick={() => setIsAuthenticityOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4" /> 온체인 위조 방지 검증 프로토콜
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              100% Cryptographic Authenticity
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              모든 시계 메커니즘 고유 번호는 암호화 분산 원장에 실시간 등기되며, 가품 유통 우려(Fear)를 완벽히 0%로 완쇄합니다.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-1">
              <p>BLOCK HASH: 0x8f2a...c94e</p>
              <p>NFT CONTRACT: 0xaef1...2026</p>
              <p>SERIAL MATCH: VERIFIED 100% MATCH</p>
            </div>
            <button
              onClick={() => setIsAuthenticityOpen(false)}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs uppercase"
            >
              검증 완료 및 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
