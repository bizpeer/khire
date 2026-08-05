KHIRE (Hire Near. Hire Smart.) 상세 개발 계획서
1. 프로젝트 개요 및 목표
서비스명: KHIRE (khire.net)
슬로건: Hire Near. Hire Smart.
핵심 목표: 해외 이민자 커뮤니티 및 지역 기반 구직자/구인기업을 위한 위치 기반 AI 채용 플랫폼
핵심 차별화 요소:
당근마켓 방식의 반경 거리 기반 채용 검색 (15km / 30km / 60km / 150km / 국가 전체)
AI 스마트 매칭 시스템 (이력서 분석 기반 매칭 점수 90%+, 유사 공고 자동 추천)
해외 이민자 특화 기능 (국가별 글로벌 채용, 취업 비자 정보, 출퇴근 예상 시간 제공)
지도(Map) 인터페이스 및 즉시 지원(Easy Apply), 기업-구직자 실시간 채팅
2. 기술 스택 및 아키텍처
2.1 Technology Stack
Frontend: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Zustand, MapLibre GL / Kakao Maps
Backend: NestJS (v11 / Node.js v24), Supabase, PostgreSQL + PostGIS Extension, Prisma ORM, Redis (BullMQ 작업 큐, 세션/캐싱)
AI Engine: OpenAI API / Gemini 3 Flash / Claude (Resume AI Parsing, Job Matching AI, Semantic Search via pgvector)
Infrastructure & Storage: Vercel (Web Hosting), Cloudflare R2 / Supabase Storage (이력서 및 이미지 저장소), Cloudflare CDN & DNS, GitHub Actions CI/CD
보안: HTTPS, JWT + Refresh Token, 2FA, Rate Limiting (Throttler), CAPTCHA, OWASP Top 10 대응 (XSS, CSRF, SQL Injection 방지)
2.2 서비스 시스템 아키텍처

KHIRE Platform (Monorepo / Multi-tier Structure)
│
├── Web Client (Next.js 15 App Router)
│   ├── Member Portal (구직자: 이력서, 거리 검색, AI 추천, 지원)
│   ├── Employer Portal (기업: 공고 등록, 지원자 관리, 채용)
│   └── Admin Portal (관리자: 대시보드, 신고, 승인, AI 로그)
│
├── API Gateway / Backend Service (NestJS API & Supabase Client)
│   ├── Auth Service (JWT Auth, OAuth, 2FA)
│   ├── User & Company Service
│   ├── Resume & Job Post Service
│   ├── Location & Search Service (PostGIS 거리 계산 SQL)
│   ├── AI Service (Gemini/OpenAI 매칭 & Vector Embedding)
│   └── Realtime Notification & Chat Service (WebSockets / Supabase Realtime)
│
└── Data Layer
    ├── PostgreSQL + PostGIS (공고/위치/사용자 데이터)
    ├── pgvector (이력서 및 공고 임베딩 벡터 저장)
    ├── Redis + BullMQ (비동기 처리 & 큐)
    └── Object Storage (PDF, 이미지, 미디어)
3. 데이터베이스 (DB) 스키마 상세 구조
3.1 주요 테이블 설계
users
id (UUID, PK), email, password_hash, role (APPLICANT, EMPLOYER, ADMIN), auth_provider (LOCAL, GOOGLE, APPLE), latitude, longitude, location_geom (Geography(Point, 4326)), created_at, updated_at
companies
id (UUID, PK), user_id (FK -> users), name, ceo_name, biz_reg_number, website, address, latitude, longitude, location_geom, description, is_verified
resumes
id (UUID, PK), user_id (FK -> users), title, name, birth_date, gender, desired_region, profile_image_url, media_url (Youtube/PDF/이미지), ai_summary, embedding (Vector(1536))
resume_education / resume_career / resume_license
학력(학교명, 전공, 졸업년도), 경력(회사명, 직책, 기간, 업무 내용), 자격증 정보 1:N 매핑
jobs
id (UUID, PK), company_id (FK -> companies), title, category_id, salary_type, salary_amount, address, latitude, longitude, location_geom (Geography(Point, 4326)), employment_type, experience_required, education_required, benefits, recruits_count, deadline, status (DRAFT, PENDING, ACTIVE, CLOSED), embedding (Vector(1536))
job_apply
id (UUID, PK), job_id (FK -> jobs), user_id (FK -> users), resume_id (FK -> resumes), ai_match_score (Float), status (APPLIED, REVIEWING, INTERVIEW, ACCEPTED, REJECTED), applied_at
messages
id (UUID, PK), channel_id, sender_id, receiver_id, content, read_at, created_at
favorites / notifications / logs / regions / job_category / admin_users
4. 핵심 기능 구현 세부 계획
4.1 위치 기반 거리 검색 (ST_DWithin / ST_DistanceSphere)
구직자 현재 위치(GPS 또는 주소 변환 Lat/Lng)를 기준으로 15km, 30km, 60km, 150km, 전국 선택 필터링 구현.
PostgreSQL PostGIS 함수 사용:
sql

-- 특정 위치 (lat, lng) 반경 radius_km 내의 공고 검색
SELECT *, ST_DistanceSphere(
  location_geom, 
  ST_MakePoint(:user_lng, :user_lat)
) AS distance_meters
FROM jobs
WHERE ST_DWithin(
  location_geom, 
  ST_MakePoint(:user_lng, :user_lat)::geography, 
  :radius_meters
) AND status = 'ACTIVE'
ORDER BY distance_meters ASC;
4.2 AI 추천 및 코어 엔진 연동
Gemini 3 Flash & OpenAI API를 활용한 이력서 파싱 및 공고 매칭 알고리즘:
구직자 이력서 작성 시 텍스트 파싱 및 핵심 스킬/경력 추출.
pgvector를 통한 이력서 및 공고의 Semantic Embedding 벡터화 저장.
구직자 맞춤 추천 시 거리(Geographic factor) + 직무 적합도(Semantic similarity)를 가중 통합하여 매칭점수(예: 92%, 85%) 산출.
4.3 글로벌 이민자 특화 기능
취업 비자(H-1, E-7, F-4, F-6 등) 요구 사항 및 스폰서십 표시 필터.
다국어 (한국어/영어 기본 지원) UI 구조 설계.
대중교통/자가용 기반 출퇴근 예상 소요시간 계산 widget 연동.
5. 단계별 개발 로드맵 (Phased Roadmap)
단계	과업 명칭	상세 작업 내용	예상 기간
Phase 1	기반 환경 및 DB 구축	- Next.js 15 + TypeScript 프론트엔드 기본 구조 수립
- NestJS 백엔드 및 Supabase PostgreSQL (PostGIS, pgvector) 초기화
- Prisma ORM 모델링 및 마이그레이션	Week 1~2
Phase 2	인증 & 사용자/기업 관리	- OAuth(Google, Apple) 및 이메일/비밀번호 가입/로그인
- JWT Access/Refresh Token 및 2FA 기능
- 개인회원/기업회원 프로필 & 이력서/기업 정보 CRUD	Week 3~4
Phase 3	위치 기반 공고 & 검색 엔진	- PostGIS 기반 반경 거리 검색 (15k~150k) 백엔드 API 작성
- MapLibre/Kakao Map 지도 뷰 매핑 및 거리/조건 필터 구현
- 채용 공고 생성, 수정, 승인 프로세스	Week 5~6
Phase 4	AI 추천 & 지원 시스템	- Gemini 3 Flash / OpenAI 연동 이력서 파싱 및 Vector Embedding 생성
- AI 매칭 점수 계산 엔진 및 추천 공고 리스트업
- 즉시 지원(Easy Apply) 및 지원자 상태 관리	Week 7~8
Phase 5	실시간 채팅 & 알림	- Supabase Realtime / WebSocket 기반 기업-구직자 1:1 실시간 채팅
- Push 알림 & 신규 공고/지원 결과 시스템 구축	Week 9~10
Phase 6	관리자 대시보드 & 보안/최적화	- 대시보드 (통계, 회원/기업/공고/신고/배너 관리)
- OWASP 보안 검증, Throttling/Rate limit 적용
- Vercel 및 Cloudflare 배포 CI/CD 파이프라인 정립	Week 11~12
User Review Required
IMPORTANT

백엔드 아키텍처 구성 선택 gemini.md에는 백엔드로 NestJS와 Supabase가 동시에 명시되어 있습니다.

NestJS 중심 아키텍처 (NestJS가 Main REST API, PostGIS, Prisma, Redis 큐를 담당하고 Supabase는 DB & Storage 서비스로 활용)
Next.js + Supabase Serverless 아키텍처 (Next.js Server Actions & Supabase Edge Functions 활용으로 백엔드 복잡도 최소화)
기본 계획은 NestJS + Supabase (PostgreSQL + PostGIS) 구조로 수립하였습니다.

NOTE

지도 라이브러리 (Map Engine) 해외 이민자 커뮤니티 특성(글로벌 타겟)상 한국 전용 Kakao Maps보다는 글로벌 타겟 지원이 용이한 MapLibre GL 또는 Google Maps API 사용을 기본 추천합니다.

Open Questions
IMPORTANT

비자 정보 관리: 해외 이민자를 위한 특정 국가(예: 한국, 미국, 캐나다 등)의 비자 필터링 기준이 초기 릴리즈에 포함되어야 합니까?
AI 엔진 선호: 기본 AI 매칭 및 파싱 엔지니어링 시 Gemini 3 Flash와 OpenAI GPT-4o 중 어떤 엔진을 주력으로 설정할지 결정이 필요합니다. (비용/속도 면에서는 Gemini 3 Flash 추천)
Verification Plan
Automated Tests
NestJS API 단위 및 통합 테스트 (npm run test:e2e)
Prisma DB 스키마 마이그레이션 및 PostGIS 거리 계산 쿼리 테스트 (ST_DWithin 성능 측정)
Next.js E2E 테스트 및 빌드 검증 (npm run build)
Manual Verification
실제 GPS 좌표 기반 15km/30km/60km/150km 범위 내 채용공고 노출 여부 지도에서 시각적 테스트
이력서 업로드 후 AI 매칭 점수 계산 결과의 정확도 검증
기업-구직자 실시간 채팅 및 알림 수신 동합 테스트