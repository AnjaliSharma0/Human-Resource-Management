import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Designation } from "../entities/desigation-entity";
import { Department } from "../entities/department-entity";
import { CreateDesignationDto } from "../dto/create-designation.dto";
import { UpdateDesignationDto } from "../dto/update-designation";


@Injectable()
export class DesignationService {

  constructor(
    @InjectRepository(Designation)
    private designationRepo: Repository<Designation>,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>
  ) {}

  async create(dto: CreateDesignationDto) {

    const department = await this.departmentRepo.findOne({
      where: { id: dto.departmentId }
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    const designation = this.designationRepo.create({
      title: dto.title,
      department
    });

    return this.designationRepo.save(designation);
  }

  findAll() {
    return this.designationRepo.find({
      relations: ["department"]
    });
  }

  async findOne(id: number) {

    const designation = await this.designationRepo.findOne({
      where: { id },
      relations: ["department"]
    });

    if (!designation) {
      throw new NotFoundException("Designation not found");
    }

    return designation;
  }

  async update(id: number, dto: UpdateDesignationDto) {

    const designation = await this.findOne(id);

    if (dto.departmentId) {

      const department = await this.departmentRepo.findOne({
        where: { id: dto.departmentId }
      });

      if (!department) {
        throw new NotFoundException("Department not found");
      }

      designation.department = department;
    }

    if (dto.title) {
      designation.title = dto.title;
    }

    return this.designationRepo.save(designation);
  }

  async remove(id: number) {

    const designation = await this.findOne(id);

    return this.designationRepo.remove(designation);
  }
}