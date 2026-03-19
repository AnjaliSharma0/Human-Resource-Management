import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview, InterviewStatus } from './entity/interview-entity';
import { Candidate } from './entity/candidate.entity';
import { ScheduleInterviewDto } from './dto/interview-schedule.dto';
import { Employee } from 'src/employee/entities/employee-entity';


@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview) private repo: Repository<Interview>,
    @InjectRepository(Candidate) private candidateRepo: Repository<Candidate>,
  ) {}

  async schedule(dto: ScheduleInterviewDto) {
    const candidate = await this.candidateRepo.findOne({ where: { id: dto.candidateId } });
    if (!candidate) throw new NotFoundException('Candidate not found');

    const interview = this.repo.create({
      candidate,
      interviewer: { id: dto.interviewerId } as Employee,
      dateTime: dto.dateTime,
      mode: dto.mode,
      feedback: dto.feedback,
      status: InterviewStatus.SCHEDULED,
    });

    return this.repo.save(interview);
  }

  findAll() {
    return this.repo.find({ relations: ['candidate', 'interviewer'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['candidate', 'interviewer'] });
  }

  async updateFeedback(id: number, feedback: string, status?: InterviewStatus) {
    const interview = await this.findOne(id);
    if (!interview) throw new NotFoundException('Interview not found');

    interview.feedback = feedback;
    if (status) interview.status = status;
    return this.repo.save(interview);
  }
}