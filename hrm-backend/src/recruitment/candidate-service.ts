import { Get, Injectable, NotFoundException, Param, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate, CandidateStatus } from './entity/candidate.entity';
import { JobPosting } from './entity/job-posting-entity';
import { ApplyCandidateDto } from './dto/apply-candidate.dto';
import { join } from 'path';
import { existsSync } from 'fs';
import express from 'express'; // ✅ Use Express Response

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private repo: Repository<Candidate>,
    @InjectRepository(JobPosting)
    private postingRepo: Repository<JobPosting>,
  ) {}


  async apply(jobPostingId: number, file: Express.Multer.File, userId: number) {

  const posting = await this.postingRepo.findOne({
    where: { id: jobPostingId }
  });

  if (!posting) {
    throw new NotFoundException("Job Posting not found");
  }

  const candidate = this.repo.create({
    employee: { id: userId } as any,   // ✅ LINK EMPLOYEE
    appliedFor: posting,
    resumeUrl: file.filename,
    status: CandidateStatus.APPLIED
  });

  return this.repo.save(candidate);
}

  findAll() {
    return this.repo.find({ relations: ['appliedFor',"appliedFor.jobRequisition","employee" ] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['appliedFor',"appliedFor.jobRequisition","employee" ] });
  }

  async updateStatus(id: number, status: CandidateStatus) {
    await this.repo.update(id, { status });
    return this.findOne(id);
  }
@Get('resume/:filename')
async getResume(@Param('filename') filename: string, @Res() res: express.Response) {
  const path = join(__dirname, '..', '..', 'uploads', filename); // folder where resumes are saved
  if (!existsSync(path)) throw new NotFoundException("Resume not found");
  res.sendFile(path);
}
  
}