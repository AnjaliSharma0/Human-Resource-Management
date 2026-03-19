import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobRequisition, RequisitionStatus } from "./entity/job-requisition-entity";
import { Repository } from "typeorm";
import { CreateJobRequisitionDto } from "./dto/job-requition-dto";
import { Employee } from "src/employee/entities/employee-entity";

@Injectable()
export class JobRequisitionService {
    [x: string]: any;
    constructor(@InjectRepository(JobRequisition) private repo: Repository<JobRequisition>) {}

      async create(dto: CreateJobRequisitionDto, userId: number) {

  const job = this.repo.create({
    ...dto,
    status: RequisitionStatus.DRAFT,
    createdBy: { id: userId } as any
  });

  return this.repo.save(job);
}
    async approve(id: number, adminId: number) {

  const job = await this.repo.findOne({ where: { id } });
 if (!job) {
    throw new NotFoundException("Job requisition not found");
  }
  job.status = RequisitionStatus.APPROVED;
  job.approvedBy = { id: adminId } as any;

  return this.repo.save(job);
}

    findAll() {
        return this.repo.find({ relations: ['createdBy', 'approvedBy'] });
    }

    findOne(id: number) {
        return this.repo.findOne({ where: { id }, relations: ['createdBy', 'approvedBy'] });
    }

    async updateStatus(id: number, status: RequisitionStatus, adminId: number) {

  const job = await this.repo.findOne({ where: { id } });

  if (!job) {
    throw new NotFoundException("Requisition not found");
  }

  job.status = status;
  job.approvedBy = { id: adminId } as any;

  return this.repo.save(job);
}
}