import { Injectable } from '@nestjs/common';

export class CreateResumeDto {
  userId!: string;
  title!: string;
  name!: string;
  birthDate?: string;
  desiredRegion?: string;
  desiredCategory?: string;
  mediaUrl?: string; // PDF, Image, or Youtube URL
  educations?: any[];
  careers?: any[];
}

@Injectable()
export class ResumesService {
  private resumes: Map<string, any> = new Map();

  async createResume(dto: CreateResumeDto) {
    const resumeId = `res-${Date.now()}`;
    const resume = {
      id: resumeId,
      userId: dto.userId,
      title: dto.title,
      name: dto.name,
      birthDate: dto.birthDate || '1995-05-15',
      desiredRegion: dto.desiredRegion || 'LA 한인타운 / 시드니 / 도쿄',
      desiredCategory: dto.desiredCategory || 'F_AND_B',
      mediaUrl: dto.mediaUrl || undefined,
      educations: dto.educations || [],
      careers: dto.careers || [],
      aiSummary: 'F&B 조리장 및 바리스타 5년 경력 기반 AI 검증 완료 이력서',
      createdAt: new Date(),
    };

    this.resumes.set(resumeId, resume);
    return resume;
  }

  async getResumeByUserId(userId: string) {
    const userResumes = Array.from(this.resumes.values()).filter((r) => r.userId === userId);
    return userResumes[0] || undefined;
  }

  async getResumesCount() {
    return this.resumes.size;
  }
}
