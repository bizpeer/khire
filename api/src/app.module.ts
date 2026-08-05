import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationService } from './location/location.service';
import { JobsService } from './jobs/jobs.service';
import { JobsController } from './jobs/jobs.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ResumesService } from './resumes/resumes.service';
import { ResumesController } from './resumes/resumes.controller';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    JobsController,
    AuthController,
    ResumesController,
    AdminController,
  ],
  providers: [
    AppService,
    LocationService,
    JobsService,
    AuthService,
    ResumesService,
    AdminService,
  ],
})
export class AppModule {}
