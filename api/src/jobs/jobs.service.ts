import { Injectable, NotFoundException } from '@nestjs/common';

export class CreateJobDto {
  companyId!: string;
  title!: string;
  category?: string;
  salaryType?: string;
  salaryAmount?: string;
  address!: string;
  latitude!: number;
  longitude!: number;
  imageUrl?: string; // 공고 이미지 첨부 URL
  description?: string;
  employmentType?: string;
  originalJobId?: string; // 기존 공고문 재활용 시 원본 공고 ID
}

export interface JobItem {
  id: string;
  companyId: string;
  title: string;
  category: string;
  salaryAmount?: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  isPaid: boolean;
  paidAt?: Date;
  expiresAt?: Date;
  originalJobId?: string;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  createdAt: Date;
}

@Injectable()
export class JobsService {
  private jobs: Map<string, JobItem> = new Map();
  private payments: Map<string, any> = new Map();

  async createJob(dto: CreateJobDto): Promise<JobItem> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newJob: JobItem = {
      id: jobId,
      companyId: dto.companyId,
      title: dto.title,
      category: dto.category || 'F_AND_B',
      salaryAmount: dto.salaryAmount,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      imageUrl: dto.imageUrl || undefined,
      isPaid: false,
      originalJobId: dto.originalJobId || undefined,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.jobs.set(jobId, newJob);
    return newJob;
  }

  async duplicateJob(jobId: string, companyId: string): Promise<JobItem> {
    const sourceJob = this.jobs.get(jobId);
    if (!sourceJob) {
      throw new NotFoundException('재활용할 기존 공고문을 찾을 수 없습니다.');
    }

    const duplicatedJob: JobItem = {
      ...sourceJob,
      id: `job-reuse-${Date.now()}`,
      companyId,
      originalJobId: sourceJob.id,
      title: `[재게시] ${sourceJob.title}`,
      isPaid: false,
      paidAt: undefined,
      expiresAt: undefined,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.jobs.set(duplicatedJob.id, duplicatedJob);
    return duplicatedJob;
  }

  async processPaymentAndActivate(jobId: string, companyId: string, paypalHostingId: string = 'R5JUWLNA7ZJJA'): Promise<JobItem> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new NotFoundException('결제 대상 공고를 찾을 수 없습니다.');
    }

    const paidAt = new Date();
    const expiresAt = new Date(paidAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    job.isPaid = true;
    job.paidAt = paidAt;
    job.expiresAt = expiresAt;
    job.status = 'ACTIVE';

    this.jobs.set(jobId, job);

    const paymentId = `pay-${Date.now()}`;
    this.payments.set(paymentId, {
      id: paymentId,
      jobId,
      companyId,
      amount: 1.00,
      currency: 'USD',
      provider: 'PAYPAL',
      paypalHostingId,
      paymentUrl: 'https://www.paypal.com/ncp/payment/R5JUWLNA7ZJJA',
      status: 'SUCCESS',
      paidAt,
      expiresAt,
    });

    return job;
  }

  async extendJob(jobId: string, companyId: string): Promise<JobItem> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new NotFoundException('연장 대상 공고를 찾을 수 없습니다.');
    }

    const now = new Date();
    const paidAt = now;
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    job.isPaid = true;
    job.paidAt = paidAt;
    job.expiresAt = expiresAt;
    job.status = 'ACTIVE';

    this.jobs.set(jobId, job);
    return job;
  }

  async autoExpireJobs(): Promise<number> {
    const now = new Date();
    let expiredCount = 0;

    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'ACTIVE' && job.expiresAt && job.expiresAt < now) {
        job.status = 'EXPIRED';
        this.jobs.set(id, job);
        expiredCount++;
      }
    }

    return expiredCount;
  }

  async getCompanyJobs(companyId: string): Promise<JobItem[]> {
    return Array.from(this.jobs.values()).filter((j) => j.companyId === companyId);
  }

  async getActiveJobs(): Promise<JobItem[]> {
    const now = new Date();
    return Array.from(this.jobs.values()).filter(
      (j) => j.status === 'ACTIVE' && j.expiresAt && j.expiresAt >= now
    );
  }
}
