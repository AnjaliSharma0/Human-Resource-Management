import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosting } from './entity/job-posting-entity';
import { JobRequisition } from './entity/job-requisition-entity';
import { JobPostingService } from './job-posting-service';
import { JobPostingController } from './job-posting-controller';


@Module({
  imports: [TypeOrmModule.forFeature([JobPosting, JobRequisition])],
  providers: [JobPostingService],
  controllers: [JobPostingController],
})
export class JobPostingModule {}