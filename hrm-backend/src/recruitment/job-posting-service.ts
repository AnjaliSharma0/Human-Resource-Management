import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosting } from './entity/job-posting-entity';
import { JobRequisition } from './entity/job-requisition-entity';
import { CreateJobPostingDto } from './dto/job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';


@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private repo: Repository<JobPosting>,
    @InjectRepository(JobRequisition)
    private requisitionRepo: Repository<JobRequisition>,
  ) {}

  async create(dto: CreateJobPostingDto) {
    const requisition = await this.requisitionRepo.findOne({ where: { id: dto.jobRequisitionId } });
    if (!requisition) throw new NotFoundException('Job Requisition not found');

    const posting = this.repo.create({
      jobRequisition: requisition,
      isInternal: dto.isInternal,
      isExternal: dto.isExternal,
      postingStartDate: dto.postingStartDate,
      postingEndDate: dto.postingEndDate,
    });
    return this.repo.save(posting);
  }

  findAll() {
    return this.repo.find({ relations: ['jobRequisition'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['jobRequisition'] });
  }

  async update(id: number, dto: UpdateJobPostingDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const posting = await this.findOne(id);
    if (!posting) throw new NotFoundException('Job Posting not found');
    return this.repo.remove(posting);
  }
}