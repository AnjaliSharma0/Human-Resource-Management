import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Leave } from "./leave.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { Repository } from "typeorm";
import { ApplyLeaveDto } from "./dto/leave.dto";

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private repo: Repository<Leave>,
    @InjectRepository(Employee) private userRepo: Repository<Employee>,
  ) {}

  async apply(dto: ApplyLeaveDto) {
    const employee = await this.userRepo.findOne({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const leave = this.repo.create({
      ...dto,
      employee,
    });

    return this.repo.save(leave);
  }

  findAll() {
    return this.repo.find({ relations: ['employee'] });
  }

  async updateStatus(id: number, status: 'approved' | 'rejected') {
    const leave = await this.repo.findOne({ where: { id } });

    if (!leave) {
      throw new Error('Leave request not found');
    }

    leave.status = status;
    return this.repo.save(leave);
  }
}