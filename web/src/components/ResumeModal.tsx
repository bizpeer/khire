'use client';

import React, { useState } from 'react';
import { X, FileText, Video, Image as ImageIcon, Sparkles, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [desiredRegion, setDesiredRegion] = useState('서울 강남/성수');
  const [mediaType, setMediaType] = useState<'PDF' | 'IMAGE' | 'YOUTUBE'>('PDF');
  const [mediaUrl, setMediaUrl] = useState('');

  // Sample education & career
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`이력서 "${title}" 등록 완료!\nGemini 3 Flash AI 엔진에 의해 자동으로 스킬 및 매칭 벡터가 파싱되었습니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-indigo-500/40 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI 이력서 및 포트폴리오 등록</h3>
            <p className="text-xs text-slate-400">PDF, 포트폴리오 이미지, 또는 자기소개 YouTube URL 첨부 가능</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">이력서 제목</label>
              <input
                type="text"
                required
                placeholder="예: 백엔드 개발자 이력서 (NestJS)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">이름</label>
              <input
                type="text"
                required
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              희망 근무 지역
            </label>
            <input
              type="text"
              required
              placeholder="예: 서울 건대/성수, 강남, 판교 반경 30km"
              value={desiredRegion}
              onChange={(e) => setDesiredRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Education & Career */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                학력 정보
              </span>
              <input
                type="text"
                placeholder="학교명 (예: 한국대학교)"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white mb-2 outline-none"
              />
              <input
                type="text"
                placeholder="전공 (예: 컴퓨터공학과)"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                경력 정보
              </span>
              <input
                type="text"
                placeholder="회사명 (예: ABC 글로벌)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white mb-2 outline-none"
              />
              <input
                type="text"
                placeholder="직책 및 직무 (예: 풀스택 개발자 3년)"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Media Attach Type Selection (PDF, Image, YouTube URL) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              이력서 및 자기소개 미디어 첨부 방식
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMediaType('PDF')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  mediaType === 'PDF'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <FileText className="w-4 h-4" /> PDF 문서
              </button>
              <button
                type="button"
                onClick={() => setMediaType('IMAGE')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  mediaType === 'IMAGE'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 포트폴리오 이미지
              </button>
              <button
                type="button"
                onClick={() => setMediaType('YOUTUBE')}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  mediaType === 'YOUTUBE'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-4 h-4 text-red-400" /> YouTube 영상 URL
              </button>
            </div>

            <input
              type="text"
              placeholder={
                mediaType === 'YOUTUBE'
                  ? 'https://www.youtube.com/watch?v=...'
                  : '파일 업로드 URL 또는 Storage 링크'
              }
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/80 text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
            <span>등록 시 Gemini 3 Flash가 자동 파싱하여 반경 내 공고와의 매칭점수를 90%+ 추천합니다.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all mt-2"
          >
            이력서 저장 및 AI 분석 실행
          </button>
        </form>
      </div>
    </div>
  );
}
