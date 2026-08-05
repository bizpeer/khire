KHIRE (Hire Near. Hire Smart.) 상세 개발 계획서 v2.0 — F&B · 숙박 · 청소 특화

1. 프로젝트 개요 및 목표
서비스명: KHIRE (khire.net)
슬로건: Hire Near. Hire Smart.
핵심 목표: 해외 한인 커뮤니티의 한인식당·카페(F&B) 및 숙박·청소 업종에 특화된 위치 기반 AI 채용 플랫폼

핵심 차별화 요소:
• 한인식당, 카페, 숙박, 청소 등 F&B 및 현장 서비스 업종 전문 채용
• 당근마켓 방식의 반경 거리 기반 채용 검색 (15km / 30km(기본) / 60km / 150km / 국가 전체)
• 구글지도에 고용 희망 업체의 실제 도로명 주소 핀 마킹 표출
• 접속 IP 위치 미동의 시 캘리포니아 LA 한인타운(34.0618, -118.3000) 기본 렌더링 및 한국식당 위치 표시
• 접속 국가별(호주, 일본, 미국, 중국, 유럽, 캐나다, 멕시코) 최근 24시간 이내 Gemini 3 Flash AI 한인 뉴스 3개 브리핑
• 유료 채용공고 서비스 (건당 $1.00 USD / 1주일 게시, 수정·변경·재공고 별도 과금, PayPal/Apple Pay/카드 결제)
• 한국어(기본) / 영어 다국어 전환 지원
• 즉시 지원(Easy Apply), 업체-구직자 실시간 채팅

타겟 업종 카테고리:
• F&B (한인식당/카페): 한식 BBQ, 분식, 한정식, 뷔페, 베이커리, 디저트 카페, 커피숍
• 숙박 & 청소: 호텔, 레지던스, 게스트하우스, 상업용 빌딩 클리닝, 24시간 시설관리
• 물류 & 현장: 물류 센터, 배송, 재고 관리, 매장 현장직
• 기술 & IT: 개발, 디자인, 마케팅

타겟 국가 (접속 IP 자동 감지):
• 미국 (USA) — 캘리포니아 LA 한인타운 중심
• 호주 (Australia)
• 일본 (Japan)
• 중국 (China)
• 유럽 (UK, 독일, 프랑스 등)
• 캐나다 (Canada)
• 멕시코 (Mexico)

________________________________________
2. 기술 스택 및 아키텍처

2.1 Technology Stack
Frontend: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Zustand, Google Maps API (글로벌 업체 주소 핀 마킹)
Backend: NestJS (v11 / Node.js v24), Supabase, PostgreSQL + PostGIS Extension, Prisma ORM, Redis (BullMQ 작업 큐)
AI Engine: Gemini 3 Flash (주력) / OpenAI (보조) — Resume AI Parsing, F&B/숙박/청소 Job Matching AI, 접속국가 24h News AI, Semantic Search via pgvector
Infrastructure: Cloudflare Pages (Web Hosting + CDN + DNS), Supabase (DB + Storage + Auth), R2 Storage, GitHub Actions CI/CD
보안: HTTPS, JWT + Refresh Token, 2FA, Rate Limiting, CAPTCHA, OWASP Top 10 대응

2.2 서비스 시스템 아키텍처

KHIRE Platform (F&B · 숙박 · 청소 특화 Monorepo)
│
├── Web Client (Next.js 15 App Router)
│   ├── Landing Page (구글지도 30km 반경 + 업체 주소 핀 + 24h 뉴스 브리핑)
│   ├── Job Seeker Portal (이력서, 거리 검색, AI 추천, 즉시 지원)
│   ├── Employer Portal (업체 등록, 공고 등록, 지원자 관리)
│   └── Admin Portal (대시보드, 승인, AI 로그, 국가별 통계)
│
├── API Gateway / Backend Service (NestJS API & Supabase)
│   ├── Auth Service (JWT, OAuth Google/Apple, 2FA)
│   ├── User & Company Service (업체 주소 좌표 관리)
│   ├── Resume & Job Post Service (업종 카테고리 기반)
│   ├── Location & Search Service (PostGIS, 30km 기본 반경)
│   ├── AI Service (Gemini 3 Flash — 매칭 & Embedding)
│   ├── News Service (접속국가 24h Gemini AI 뉴스 브리핑)
│   └── Realtime Chat & Notification Service
│
└── Data Layer
    ├── PostgreSQL + PostGIS (업체 주소/위치/공고)
    ├── pgvector (이력서 및 공고 임베딩 벡터)
    ├── Redis + BullMQ (비동기 처리 & 큐)
    └── Object Storage (PDF, 이미지, 미디어)

________________________________________
3. 데이터베이스 (DB) 스키마 상세 구조

3.1 주요 테이블 설계
users
id (UUID, PK), email, password_hash, role (APPLICANT, EMPLOYER, ADMIN), auth_provider (LOCAL, GOOGLE, APPLE), latitude, longitude, country_code, country_name, location_geom (Geography(Point, 4326)), created_at, updated_at

companies (업체)
id (UUID, PK), user_id (FK -> users), name, ceo_name, biz_reg_number, website, address (도로명 — 구글지도 핀 연동), latitude, longitude, location_geom, description, category (F_AND_B, LODGING_CLEANING, LOGISTICS, TECH), is_verified

resumes
id (UUID, PK), user_id (FK -> users), title, name, birth_date, gender, desired_region, desired_category (F&B/숙박/청소/물류/기술), profile_image_url, media_url (Youtube/PDF/이미지), ai_summary, embedding (Vector(1536))

resume_education / resume_career / resume_license
학력(학교명, 전공, 졸업년도), 경력(식당명/호텔명, 직책(조리장/바리스타/클리닝 매니저), 기간, 업무 내용), 자격증 정보 1:N 매핑

jobs (채용공고)
id (UUID, PK), company_id (FK -> companies), title, category (F_AND_B, LODGING_CLEANING, LOGISTICS, TECH), salary_type (HOURLY/MONTHLY/ANNUAL), salary_amount, address (업체 주소 자동 연동), latitude, longitude, location_geom, employment_type, experience_required, education_required, benefits, recruits_count, deadline, is_paid (Boolean), payment_id, expires_at (Timestamp - 7일 후 만료), status (DRAFT, PENDING, ACTIVE, EXPIRED), embedding (Vector(1536))

job_payments (결제 이력)
id (UUID, PK), job_id (FK -> jobs), company_id (FK -> companies), amount (1.00), currency (USD), payment_provider (PAYPAL), paypal_hosting_id ('R5JUWLNA7ZJJA'), payment_url ('https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA'), status (PAID, REFUNDED), created_at

job_apply
id (UUID, PK), job_id (FK -> jobs), user_id (FK -> users), resume_id (FK -> resumes), ai_match_score (Float), status (APPLIED, REVIEWING, INTERVIEW, ACCEPTED, REJECTED), applied_at

messages
id (UUID, PK), channel_id, sender_id, receiver_id, content, read_at, created_at

country_news (접속국가별 24h AI 뉴스 캐싱)
id (UUID, PK), country_code, title, source, summary, fetched_at, expires_at

favorites / notifications / logs / regions / job_category / admin_users

________________________________________
4. 핵심 기능 구현 세부 계획

4.1 위치 기반 거리 검색 (ST_DWithin / ST_DistanceSphere)
접속 IP/GPS를 기준으로 30km(기본), 15km, 60km, 150km, 전국 선택 필터링.
위치 접근 권한 미동의 시: 캘리포니아 LA 한인타운 (34.0618, -118.3000) 기본값.

SQL 예시:
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
AND category IN ('F_AND_B', 'LODGING_CLEANING')
ORDER BY distance_meters ASC;

4.2 구글지도 업체 주소 핀 마킹
• 랜딩 페이지에 구글지도 렌더링
• 업체(Company) 등록 시 실제 도로명 주소를 입력하면 좌표 변환(Geocoding) 후 PostGIS 저장
• 30km 반경 원(Circle) 내에 위치한 업체들의 핀(Marker)을 지도에 표출
• 각 핀에 업체명, 업종, AI 매칭 점수 표시

4.3 접속국가별 24시간 Gemini AI 뉴스 브리핑
• 접속 IP를 기반으로 사용자의 국가를 자동 감지
• Gemini 3 Flash API로 해당 국가의 한인 F&B/숙박/청소 관련 최근 24시간 뉴스 3개를 생성
• 5초 간격 자동 슬라이드 뉴스 티커(NewsTicker) 컴포넌트로 랜딩 페이지 상단에 표시
• 지원 국가: 호주, 일본, 미국, 중국, 유럽, 캐나다, 멕시코

4.4 AI 추천 및 코어 엔진 연동
Gemini 3 Flash를 활용한 F&B/숙박/청소 이력서 파싱 및 공고 매칭:
• 이력서 작성 시 식당명, 카페, 호텔 경력 자동 파싱 및 핵심 스킬 추출
• pgvector를 통한 이력서 및 공고의 Semantic Embedding 저장
• 거리(Geographic factor) + 업종 적합도(Category match) + 직무 적합도(Semantic similarity) 가중 통합 매칭

4.5 다국어 지원 (KO/EN)
• 기본 언어: 한국어 (KO)
• 영어 (EN) 전환 가능
• 헤더에 🇰🇷 한국어 / 🇺🇸 English 1-Click 토글 버튼

________________________________________
5. 단계별 개발 로드맵 (Phased Roadmap)

Phase 1 | 기반 환경 및 DB 구축 | Week 1~2
- Next.js 15 + TypeScript 프론트엔드 및 Cloudflare Pages 배포 세팅
- NestJS 백엔드 및 Supabase PostgreSQL (PostGIS, pgvector) 초기화
- Prisma ORM 모델링 (F&B/숙박/청소 업종 카테고리 포함) 및 마이그레이션

Phase 2 | 인증 & 사용자/업체 관리 | Week 3~4
- OAuth(Google, Apple) 및 이메일 가입/로그인, JWT 토큰, 2FA
- 개인회원/업체 프로필, 이력서(F&B/숙박/청소 경력), 업체 정보(주소 좌표) CRUD

Phase 3 | 위치 기반 공고 & 구글지도 & 뉴스 | Week 5~6
- PostGIS 30km 반경 거리 검색 API 및 업종 카테고리 필터
- Google Maps API 업체 주소 핀 마킹 및 지도 뷰
- IP 위치 자동 감지 & 미동의 시 LA 한인타운 기본 렌더링
- 접속국가 24h Gemini AI 뉴스 브리핑 서비스 구현

Phase 4 | AI 추천 & 지원 시스템 | Week 7~8
- Gemini 3 Flash 연동 F&B/숙박/청소 이력서 파싱 및 Vector Embedding
- AI 매칭 점수 계산 (업종+거리+직무 가중 통합)
- 즉시 지원(Easy Apply) 및 지원자 상태 관리

Phase 5 | 실시간 채팅 & 알림 | Week 9~10
- Supabase Realtime 기반 업체-구직자 1:1 실시간 채팅
- Push 알림 (신규 F&B/숙박 공고, 지원 결과, 24h 뉴스)

Phase 6 | 관리자 대시보드 & 보안/최적화 | Week 11~12
- 대시보드 (업종별/국가별 통계, 회원/업체/공고 관리)
- OWASP 보안 검증, Throttling 적용
- Cloudflare Pages + GitHub Actions CI/CD 파이프라인 확정

________________________________________
검증 계획 (Verification Plan)

Automated Tests
• NestJS API 단위 및 통합 테스트 (npm run test:e2e)
• Prisma DB 스키마 마이그레이션 및 PostGIS 거리 계산 쿼리 테스트
• Next.js 정적 빌드 검증 (npm run build)
• Gemini AI 24h 뉴스 및 매칭 점수 API 응답 테스트

Manual Verification
• 위치 미동의 시 캘리포니아 LA 한인타운 기본 렌더링 및 한국식당 핀 표시 확인
• 30km 반경 내 F&B/숙박/청소 공고 노출 여부 구글지도에서 시각적 테스트
• 접속 국가 변경 시 Gemini AI 24h 뉴스 3개 브리핑 내용 정확도 검증
• 한국어 ↔ 영어 언어 전환 UI 동작 확인
• 업체-구직자 실시간 채팅 및 알림 수신 통합 테스트