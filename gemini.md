KHIRE 개발 기획서 (Development Specification v1.0)
프로젝트 개요
해외 이민자 커뮤니티 위주의 채용플랫폼 입니다. 지역 기반성을 위주로 서비스를 제공합니다. KHIRE는 이를 핵심 경쟁력으로 삼을 수 있습니다.

khire.net
슬로건
Hire Near. Hire Smart.

________________________________________
서비스 목표
지역기반(Location Based) AI 채용 플랫폼
개인회원과 기업회원이
•	회원가입 
•	이력서 등록 
•	채용공고 등록 
•	거리 기반 검색 
•	AI 추천 
을 수행할 수 있는 플랫폼
________________________________________
핵심 특징
① 당근마켓 방식 거리 검색
회원 위치
↓
GPS 또는 주소
↓
거리 계산
↓
15km
30km
60km
150km
해당국가 전체 검색 가능
예) 
서울 건대입구
↓
15km
↓
성수
잠실
왕십리
↓
30km
↓
강남
판교
↓
60km
↓
수원
안양
↓
150km
↓
대전
원주
________________________________________
위치 저장
latitude

longitude

PostGIS
또는
Supabase GIS
________________________________________
회원 구분
개인회원
가입
이력서 등록 (PDF, 이미지, 혹은 Youtube URL 등록)
관심기업
지원내역
________________________________________
기업회원
기업등록
공고등록
지원자관리
채용관리
메시지
________________________________________
관리자
회원관리
기업관리
공고승인
신고관리
통계
배너관리
AI 로그
________________________________________
주요 기능
회원가입
이메일
Google
Apple
________________________________________
로그인
JWT
Refresh Token
2FA(Optional)
________________________________________
Resume
기본정보
사진
이름
생년월일
성별
희망지역 
________________________________________
학력
학교
전공
졸업년도
________________________________________
경력
회사명
직책
기간
업무
________________________________________
기업회원
기업(고용주)소개
대표자
홈페이지
주소
사업자등록번호
________________________________________
채용공고
제목
직무
급여
근무지역
근무형태
경력
학력
복리후생
모집인원
접수기간
________________________________________
검색
키워드
지역
거리
직무
연봉
기업
근무형태
AI 추천
________________________________________
거리검색
예)
현재위치

↓

15km

↓

SQL

ST_DWithin()
예)
PostGIS

ST_DistanceSphere()
________________________________________
AI 추천
회원 이력서 분석
↓
유사공고 추천
↓
매칭점수
92%

85%

76%
________________________________________
메시지
기업 ↔ 구직자
실시간 채팅
알림
Push
________________________________________
즐겨찾기
관심공고
관심기업
스크랩
________________________________________
알림
새 공고
지원결과
메시지
추천공고
________________________________________
관리자
Dashboard
회원
기업
공고
신고
통계
배너
공지사항
FAQ
________________________________________
DB 구조
users

companies

jobs

resumes

resume_education

resume_career

resume_license

job_apply

favorites

messages

notifications

regions

job_category

logs

admin_users
________________________________________
API
POST /auth/login

POST /auth/register

GET /jobs

POST /jobs

PUT /jobs

DELETE /jobs

GET /resume

POST /resume

POST /apply

GET /companies

GET /search
________________________________________
Front-end
Next.js 15
React 19
TypeScript
TailwindCSS
shadcn/ui
TanStack Query
Zustand
MapLibre 또는 Kakao Maps
________________________________________
Back-end
NestJS
Supabase
PostgreSQL
Prisma
Redis
BullMQ
JWT
________________________________________
AI
OpenAI
Gemini
Claude
Resume AI
Interview AI
Job Matching AI
________________________________________
검색엔진
PostgreSQL Full Text
•	
pgvector
•	
AI Semantic Search
________________________________________
서버
Cloudflare
Vercel
Supabase
R2 Storage
GitHub Actions
________________________________________
보안
HTTPS
JWT
2FA
Rate Limit
Captcha
SQL Injection 방지
XSS
CSRF
OWASP Top10 대응
________________________________________
관리자 Dashboard
회원수

기업수

공고수

오늘 가입

오늘 지원

오늘 채용

거리검색 통계

AI 사용량
________________________________________
•	글로벌 채용(국가별) 
•	취업 비자 정보 
권장 아키텍처
서비스의 장기적인 확장성을 고려하면 다음과 같은 구조를 권장합니다.
KHIRE Platform
│
├── Web (Next.js)
├── Mobile App (React Native)
├── Admin Portal
├── API Gateway
│
├── Auth Service
├── User Service
├── Resume Service
├── Job Service
├── Company Service
├── Search Service
├── AI Service
├── Notification Service
│
├── PostgreSQL + PostGIS
├── Redis
├── Object Storage (Supabase/R2)
└── Elasticsearch (선택)
추가로 제안하는 핵심 차별화 기능
해외 이민자 커뮤니티 위주의 채용플랫폼 입니다. 한국도 지역 기반성이 약합니다. KHIRE는 이를 핵심 경쟁력으로 삼을 수 있습니다.
•	15km / 30km / 60km / 150km 반경 채용 검색을 기본 UI로 제공 
•	출퇴근 예상 시간(대중교통/자가용) 표시 
•	즉시 지원(Easy Apply) 기능 
•	기업과 구직자 간 실시간 채팅 
•	반경 내 신규 공고 푸시 알림 
•	지도 기반 채용공고(Map View)

