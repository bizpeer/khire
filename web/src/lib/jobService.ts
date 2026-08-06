import { JobPost, DaangnReview } from '@/types/job';
import { MOCK_JOBS } from './mockJobs';
import { supabase } from './supabaseClient';

const JOBS_STORAGE_KEY = 'khire_jobs_database_v2';
const APPLICATIONS_STORAGE_KEY = 'khire_job_applications_v2';
const REVIEWS_STORAGE_KEY = 'khire_daangn_reviews_v1';
const PAYMENTS_STORAGE_KEY = 'khire_paypal_payments_v1';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  appliedAt: string;
  resumeSummary?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface PaymentRecord {
  id: string;
  paypalOrderId: string;
  employerEmail: string;
  companyName: string;
  jobTitle: string;
  adTier: 'STANDARD' | 'PREMIUM_30';
  amount: number;
  currency: string;
  status: 'APPROVED' | 'COMPLETED';
  paidAt: string;
  hostedButtonId: string;
}

// Initial default jobs tagged as Khire Official Example Employers
export const DEFAULT_JOBS: JobPost[] = MOCK_JOBS.map((job) => ({
  ...job,
  companyName: `[Khire 공식 예시 사업자] ${job.companyName}`,
  workDays: job.workDays || '월~금 (주 5일)',
  workHours: job.workHours || '09:00 ~ 18:00 (휴게시간 1시간)',
  workPeriod: job.workPeriod || '3개월 이상 / 장기 우대',
  benefits: job.benefits || ['식사 제공', '주휴수당', '유니폼 지원', '초보 가능', '친구 동반 지원'],
  daangnScore: job.daangnScore || 4.8,
  daangnBadges: job.daangnBadges || ['💖 급여를 제때 줘요', '😊 사장님이 친절해요', '🧹 근무 환경이 쾌적해요'],
  reviewCount: job.reviewCount || 12,
})) as JobPost[];

/**
 * Fetch all jobs from Supabase / LocalStorage / Fallback
 */
export async function getJobsFromDB(): Promise<JobPost[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as JobPost[];
      }
    }
  } catch (e) {
    console.warn('Supabase fetch notice, using local DB:', e);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(JOBS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse local jobs:', err);
      }
    }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(DEFAULT_JOBS));
  }

  return DEFAULT_JOBS;
}

/**
 * Create a new job post and save to DB
 */
export async function saveJobToDB(newJob: JobPost): Promise<JobPost[]> {
  let updatedJobs: JobPost[] = [];

  if (typeof window !== 'undefined') {
    const existing = await getJobsFromDB();
    updatedJobs = [newJob, ...existing];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));

    // Also record PayPal transaction if paid
    if (newJob.isPaid) {
      savePaymentRecordToDB({
        id: `pay-${Date.now()}`,
        paypalOrderId: newJob.originalJobId || `PAYPAL-${Date.now()}`,
        employerEmail: 'employer@khire.net',
        companyName: newJob.companyName,
        jobTitle: newJob.title,
        adTier: newJob.isPremiumAd ? 'PREMIUM_30' : 'STANDARD',
        amount: newJob.adPrice || 1.0,
        currency: 'USD',
        status: 'APPROVED',
        paidAt: newJob.paidAt || new Date().toISOString(),
        hostedButtonId: newJob.isPremiumAd ? 'GEY6YHWRDH54E' : 'R5JUWLNA7ZJJA',
      });
    }
  }

  try {
    if (supabase) {
      await supabase.from('jobs').insert([
        {
          id: newJob.id,
          title: newJob.title,
          company_name: newJob.companyName,
          category: newJob.category,
          location_name: newJob.locationName,
          latitude: newJob.latitude,
          longitude: newJob.longitude,
          salary: newJob.salary,
          employment_type: newJob.employmentType,
          description: newJob.description,
          image_url: newJob.imageUrl,
          is_paid: newJob.isPaid,
          paid_at: newJob.paidAt,
          expires_at: newJob.expiresAt,
        },
      ]);
    }
  } catch (e) {
    console.warn('Supabase insert notice, saved locally:', e);
  }

  return updatedJobs;
}

/**
 * Admin: Update existing job in DB
 */
export async function updateJobInDB(updatedJob: JobPost): Promise<JobPost[]> {
  let allJobs = await getJobsFromDB();
  allJobs = allJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));

  if (typeof window !== 'undefined') {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(allJobs));
  }

  try {
    if (supabase) {
      await supabase
        .from('jobs')
        .update({
          title: updatedJob.title,
          company_name: updatedJob.companyName,
          salary: updatedJob.salary,
          description: updatedJob.description,
          category: updatedJob.category,
        })
        .eq('id', updatedJob.id);
    }
  } catch (e) {
    console.warn('Supabase update notice:', e);
  }

  return allJobs;
}

/**
 * Admin: Delete job from DB
 */
export async function deleteJobFromDB(jobId: string): Promise<JobPost[]> {
  let allJobs = await getJobsFromDB();
  allJobs = allJobs.filter((j) => j.id !== jobId);

  if (typeof window !== 'undefined') {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(allJobs));
  }

  try {
    if (supabase) {
      await supabase.from('jobs').delete().eq('id', jobId);
    }
  } catch (e) {
    console.warn('Supabase delete notice:', e);
  }

  return allJobs;
}

/**
 * Save job application
 */
export async function saveApplicationToDB(app: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>): Promise<JobApplication> {
  const newApp: JobApplication = {
    ...app,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    appliedAt: new Date().toISOString(),
    status: 'PENDING',
  };

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [newApp, ...existing];
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));
  }

  try {
    if (supabase) {
      await supabase.from('job_apply').insert([
        {
          id: newApp.id,
          job_id: newApp.jobId,
          applicant_name: newApp.applicantName,
          applicant_email: newApp.applicantEmail,
          applied_at: newApp.appliedAt,
        },
      ]);
    }
  } catch (e) {
    console.warn('Supabase application insert notice:', e);
  }

  return newApp;
}

/**
 * Save PayPal Payment Record to DB
 */
export function savePaymentRecordToDB(record: PaymentRecord): PaymentRecord[] {
  let records: PaymentRecord[] = [];
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    records = [record, ...existing];
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(records));
  }
  return records;
}

/**
 * Fetch all PayPal Payment Records from DB
 */
export function getPaymentRecordsFromDB(): PaymentRecord[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
}

/**
 * Save Daangn Employer Review
 */
export async function saveReviewToDB(review: DaangnReview): Promise<DaangnReview[]> {
  let reviews: DaangnReview[] = [];

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    reviews = [review, ...existing];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }

  // Update employer score on job
  const allJobs = await getJobsFromDB();
  const targetJob = allJobs.find((j) => j.id === review.jobId);
  if (targetJob) {
    const currentScore = targetJob.daangnScore || 4.8;
    const currentCount = targetJob.reviewCount || 10;
    const newCount = currentCount + 1;
    const newScore = Math.round(((currentScore * currentCount + review.rating) / newCount) * 10) / 10;

    targetJob.daangnScore = newScore;
    targetJob.reviewCount = newCount;
    if (review.selectedBadges.length > 0) {
      targetJob.daangnBadges = Array.from(new Set([...(targetJob.daangnBadges || []), ...review.selectedBadges]));
    }
    await updateJobInDB(targetJob);
  }

  return reviews;
}

/**
 * Get Daangn Reviews for a Job/Company
 */
export function getReviewsForJob(jobId: string): DaangnReview[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: DaangnReview[] = JSON.parse(saved);
        return parsed.filter((r) => r.jobId === jobId);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
}

/**
 * Fetch all submitted applications
 */
export function getApplicationsFromDB(): JobApplication[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
}
