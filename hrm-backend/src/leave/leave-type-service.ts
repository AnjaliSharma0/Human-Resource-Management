import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveType } from "./holiday/leave-type";


@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepo: Repository<LeaveType>
  ) {}

  // Create a new leave type
  async create(dto: { name: string; daysPerYear: number; description?: string }) {
    // Validate required fields
    if (!dto.name || dto.daysPerYear === undefined) {
      throw new BadRequestException("Name and daysPerYear are required");
    }

    // Check if name already exists
    const exists = await this.leaveTypeRepo.findOne({ where: { name: dto.name } });
    if (exists) {
      throw new BadRequestException("Leave type with this name already exists");
    }

    // Create entity and save
    const leaveType = this.leaveTypeRepo.create(dto);
    return this.leaveTypeRepo.save(leaveType);
  }

  // Get all leave types
  async findAll() {
    return this.leaveTypeRepo.find({ order: { id: "ASC" } });
  }

  // Get single leave type
  async findOne(id: number) {
    return this.leaveTypeRepo.findOne({ where: { id } });
  }
}