import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { JobsService, CreateJobDto } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() dto: CreateJobDto) {
    return this.jobsService.createJob(dto);
  }

  @Post(':id/duplicate')
  async duplicateJob(@Param('id') jobId: string, @Body('companyId') companyId: string) {
    return this.jobsService.duplicateJob(jobId, companyId);
  }

  @Post(':id/pay')
  async processPayment(
    @Param('id') jobId: string,
    @Body('companyId') companyId: string,
    @Body('paypalHostingId') paypalHostingId?: string
  ) {
    return this.jobsService.processPaymentAndActivate(jobId, companyId, paypalHostingId);
  }

  @Post(':id/extend')
  async extendJob(@Param('id') jobId: string, @Body('companyId') companyId: string) {
    return this.jobsService.extendJob(jobId, companyId);
  }

  @Get('company/:companyId')
  async getCompanyJobs(@Param('companyId') companyId: string) {
    return this.jobsService.getCompanyJobs(companyId);
  }

  @Get()
  async getActiveJobs() {
    return this.jobsService.getActiveJobs();
  }

  @Post('cron/expire-check')
  async triggerAutoExpire() {
    const count = await this.jobsService.autoExpireJobs();
    return { message: '7일 만료 체크 완료', expiredCount: count };
  }
}
