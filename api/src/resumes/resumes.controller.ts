import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ResumesService, CreateResumeDto } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  async createResume(@Body() dto: CreateResumeDto) {
    return this.resumesService.createResume(dto);
  }

  @Get('user/:userId')
  async getResume(@Param('userId') userId: string) {
    return this.resumesService.getResumeByUserId(userId);
  }
}
