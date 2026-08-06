-- ====================================================================
-- KHIRE Platform - Supabase PostgreSQL Database Schema (v2.0)
-- PostGIS, pgvector, 30km Radius Search, $1 PayPal Payment & 7-Day Auto Expiry
-- Idempotent & Re-runnable Script (Supabase SQL Editor Ready)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enum Types (Idempotent safe checks)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('APPLICANT', 'EMPLOYER', 'ADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_provider_enum') THEN
        CREATE TYPE auth_provider_enum AS ENUM ('LOCAL', 'GOOGLE', 'APPLE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status_enum') THEN
        CREATE TYPE job_status_enum AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'CLOSED', 'EXPIRED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'apply_status_enum') THEN
        CREATE TYPE apply_status_enum AS ENUM ('APPLIED', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_category_enum') THEN
        CREATE TYPE job_category_enum AS ENUM ('F_AND_B', 'LODGING_CLEANING', 'LOGISTICS', 'TECH');
    END IF;
END $$;

-- 3. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE, -- 회원 로그인 ID 겸용
    name VARCHAR(100) NOT NULL, -- 회원 성명(이름)
    phone VARCHAR(50), -- +국가번호 모바일 전화번호 (예: +1 213-123-4567)
    address VARCHAR(255), -- 구글지도 연동 도로명 주소지 (상세 동호수 미수집)
    biz_reg_number VARCHAR(100), -- 사업자등록번호 (선택사항 / Optional)
    password_hash VARCHAR(255),
    role role_enum NOT NULL DEFAULT 'APPLICANT',
    auth_provider auth_provider_enum NOT NULL DEFAULT 'LOCAL',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_geom GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for Spatial Queries on Users
CREATE INDEX IF NOT EXISTS idx_users_location_geom ON public.users USING GIST(location_geom);

-- 4. Companies (Employer Businesses) Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ceo_name VARCHAR(100),
    biz_reg_number VARCHAR(100) UNIQUE,
    website VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_geom GEOGRAPHY(Point, 4326) NOT NULL,
    category job_category_enum NOT NULL DEFAULT 'F_AND_B',
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for Spatial Queries on Companies
CREATE INDEX IF NOT EXISTS idx_companies_location_geom ON public.companies USING GIST(location_geom);

-- 5. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    birth_date VARCHAR(50),
    gender VARCHAR(20),
    desired_region VARCHAR(255),
    desired_category job_category_enum DEFAULT 'F_AND_B',
    profile_image_url TEXT,
    media_url TEXT, -- PDF, Image, or Youtube Video URL
    ai_summary TEXT, -- Gemini 3 Flash Generated Resume Summary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Jobs (Job Postings) Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category job_category_enum NOT NULL DEFAULT 'F_AND_B',
    salary_type VARCHAR(50) DEFAULT 'HOURLY',
    salary_amount VARCHAR(100),
    address VARCHAR(255) NOT NULL, -- 고용 희망 업체 구글지도 주소
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_geom GEOGRAPHY(Point, 4326) NOT NULL,
    image_url TEXT, -- 공고 실물 매장/식당 첨부 이미지
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    experience_required VARCHAR(100),
    education_required VARCHAR(100),
    benefits TEXT,
    recruits_count INT DEFAULT 1,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE, -- $1.00 USD 결제 성공 시각
    expires_at TIMESTAMP WITH TIME ZONE, -- 결제 시각 기준 정확히 7일(168시간) 후 자동 만료
    original_job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL, -- 기존 공고 복사/재활용 ID
    status job_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for Spatial & Status Queries on Jobs
CREATE INDEX IF NOT EXISTS idx_jobs_location_geom ON public.jobs USING GIST(location_geom);
CREATE INDEX IF NOT EXISTS idx_jobs_status_expires ON public.jobs(status, expires_at);

-- 7. Job Payments ($1 PayPal Transactions) Table
CREATE TABLE IF NOT EXISTS public.job_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    provider VARCHAR(50) NOT NULL DEFAULT 'PAYPAL',
    paypal_hosting_id VARCHAR(100) DEFAULT 'R5JUWLNA7ZJJA',
    payment_url TEXT DEFAULT 'https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA',
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_apply (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    ai_match_score DOUBLE PRECISION, -- Gemini 3 Flash Matching Score (0~100)
    status apply_status_enum NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Country 24h Gemini AI News Table
CREATE TABLE IF NOT EXISTS public.country_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(10) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    summary TEXT,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- ====================================================================
-- 10. PostGIS 30km Radius Distance Search Function
-- ====================================================================
CREATE OR REPLACE FUNCTION public.get_jobs_within_radius(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 30000.0,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    job_id UUID,
    company_name VARCHAR(255),
    title VARCHAR(255),
    category job_category_enum,
    address VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    salary_amount VARCHAR(100),
    distance_km DOUBLE PRECISION,
    expires_at TIMESTAMP WITH TIME ZONE,
    status job_status_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id AS job_id,
        c.name AS company_name,
        j.title,
        j.category,
        j.address,
        j.latitude,
        j.longitude,
        j.image_url,
        j.salary_amount,
        ROUND((ST_DistanceSphere(j.location_geom, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)) / 1000.0)::numeric, 1)::DOUBLE PRECISION AS distance_km,
        j.expires_at,
        j.status
    FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE j.status = 'ACTIVE'
      AND (j.expires_at IS NULL OR j.expires_at >= CURRENT_TIMESTAMP)
      AND (radius_meters = 0 OR ST_DWithin(j.location_geom, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_meters))
      AND (category_filter IS NULL OR category_filter = 'ALL' OR j.category::text = category_filter)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 11. 7-Day Auto Expiration Function ($1 Payment Expiry Engine)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.auto_expire_7day_jobs()
RETURNS INT AS $$
DECLARE
    expired_count INT;
BEGIN
    UPDATE public.jobs
    SET status = 'EXPIRED',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'ACTIVE'
      AND expires_at IS NOT NULL
      AND expires_at < CURRENT_TIMESTAMP;

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 12. Trigger: Update Geography Location Point on Lat/Lng Insert
-- ====================================================================
CREATE OR REPLACE FUNCTION public.update_location_geom()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location_geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_location ON public.users;
CREATE TRIGGER trg_users_location BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_location_geom();

DROP TRIGGER IF EXISTS trg_companies_location ON public.companies;
CREATE TRIGGER trg_companies_location BEFORE INSERT OR UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.update_location_geom();

DROP TRIGGER IF EXISTS trg_jobs_location ON public.jobs;
CREATE TRIGGER trg_jobs_location BEFORE INSERT OR UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_location_geom();

-- ====================================================================
-- 13. Supabase Row Level Security (RLS) Policies (Safe Re-execution)
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Active Jobs" ON public.jobs;
CREATE POLICY "Public Read Active Jobs" ON public.jobs
    FOR SELECT USING (status = 'ACTIVE');

DROP POLICY IF EXISTS "Employer Manage Own Jobs" ON public.jobs;
CREATE POLICY "Employer Manage Own Jobs" ON public.jobs
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.companies WHERE id = company_id));

DROP POLICY IF EXISTS "Public Read Companies" ON public.companies;
CREATE POLICY "Public Read Companies" ON public.companies
    FOR SELECT USING (true);

-- Admin Full Access Policy for Security Hardening
DROP POLICY IF EXISTS "Admin Full Access Jobs" ON public.jobs;
CREATE POLICY "Admin Full Access Jobs" ON public.jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- 14. Daangn Employer Reviews Table
CREATE TABLE IF NOT EXISTS public.company_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    reviewer_name VARCHAR(100) DEFAULT '당근 구직 회원',
    rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    selected_badges TEXT[], -- e.g. ARRAY['💖 급여를 제때 줘요', '😊 사장님이 친절해요']
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Reviews" ON public.company_reviews;
CREATE POLICY "Public Read Reviews" ON public.company_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated Insert Review" ON public.company_reviews;
CREATE POLICY "Authenticated Insert Review" ON public.company_reviews FOR INSERT WITH CHECK (true);

-- ====================================================================
-- 15. Initial Admin Account Seed Data
-- ====================================================================
INSERT INTO public.users (id, email, password_hash, role, auth_provider, name)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'siteadmin@khire.net',
    '$2b$10$e846zK7qL1U/2QvW.7O6/.SECURE_HASHED_PASSWORD_PLACEHOLDER',
    'ADMIN',
    'LOCAL',
    'KHIRE System Admin'
)
ON CONFLICT (email) DO UPDATE 
SET role = 'ADMIN',
    name = 'KHIRE System Admin';
