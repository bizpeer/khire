import { JobPost } from '@/types/job';
import { MOCK_JOBS } from './mockJobs';
import { supabase } from './supabaseClient';

const JOBS_STORAGE_KEY = 'khire_jobs_database_v2';
const APPLICATIONS_STORAGE_KEY = 'khire_job_applications_v2';

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

// Initial default jobs tagged as Khire Official Example Employers
export const DEFAULT_JOBS: JobPost[] = MOCK_JOBS.map((job) => ({
  ...job,
  companyName: `[Khire 공식 예시 사업자] ${job.companyName}`,
})) as JobPost[];

/**
 * Fetch all jobs from Supabase / LocalStorage / Fallback
 */
export async function getJobsFromDB(): Promise<JobPost[]> {
  try {
    // 1. Try Supabase fetch if client available
    if (supabase) {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as JobPost[];
      }
    }
  } catch (e) {
    console.warn('Supabase fetch notice, using local DB:', e);
  }

  // 2. LocalStorage Fallback
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
    // Initialize LocalStorage with default example data
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(DEFAULT_JOBS));
  }

  return DEFAULT_JOBS;
}

/**
 * Create a new job post and save to DB
 */
export async function saveJobToDB(newJob: JobPost): Promise<JobPost[]> {
  let updatedJobs: JobPost[] = [];

  // LocalStorage sync
  if (typeof window !== 'undefined') {
    const existing = await getJobsFromDB();
    updatedJobs = [newJob, ...existing];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
  }

  // Supabase sync
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
