import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entity/interview-entity';
import { Candidate } from './entity/candidate.entity';
import { InterviewService } from './interview-service';
import { InterviewController } from './interview-Controller';


@Module({
  imports: [TypeOrmModule.forFeature([Interview, Candidate])],
  providers: [InterviewService],
  controllers: [InterviewController],
})
export class InterviewModule {}