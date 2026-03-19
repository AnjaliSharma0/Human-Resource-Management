import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entity/candidate.entity';
import { JobPosting } from './entity/job-posting-entity';
import { CandidateService } from './candidate-service';
import { CandidateController } from './candidate-controller';


@Module({
  imports: [TypeOrmModule.forFeature([Candidate, JobPosting])],
  providers: [CandidateService],
  controllers: [CandidateController],
})
export class CandidateModule {}