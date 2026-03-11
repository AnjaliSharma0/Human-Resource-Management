import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "../entities/department-entity";
import { CreateDepartmentDto } from "../dto/create.department";
import { UpdateDepartmentDto } from "../dto/update.department";


@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(Department)
    private deptRepo: Repository<Department>
  ) {}

  create(dto: CreateDepartmentDto) {
    const dept = this.deptRepo.create(dto);
    return this.deptRepo.save(dept);
  }

  findAll() {
    return this.deptRepo.find();
  }

  async findOne(id: number) {

    const dept = await this.deptRepo.findOne({ where: { id } });

    if (!dept) throw new NotFoundException("Department not found");

    return dept;
  }

  async update(id: number, dto: UpdateDepartmentDto) {

    const dept = await this.findOne(id);

    Object.assign(dept, dto);

    return this.deptRepo.save(dept);
  }

  async remove(id: number) {

    const dept = await this.findOne(id);

    return this.deptRepo.remove(dept);
  }
}