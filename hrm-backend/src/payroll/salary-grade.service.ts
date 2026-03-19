import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SalaryGrade } from "./salaryGrade/salary-grade.entity";
import { CreateSalaryGradeDto } from "./dto/salary-grade.dto";


@Injectable()
export class SalaryGradeService {
  constructor(
    @InjectRepository(SalaryGrade)
    private salaryGradeRepo: Repository<SalaryGrade>
  ) {}

  async create(dto: CreateSalaryGradeDto) {
    const grade = this.salaryGradeRepo.create(dto);
    return this.salaryGradeRepo.save(grade);
  }

  findAll() {
    return this.salaryGradeRepo.find();
  }

  async findOne(id: number) {
    const grade = await this.salaryGradeRepo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException("Salary grade not found");
    return grade;
  }

  async update(id: number, dto: Partial<CreateSalaryGradeDto>) {
    const grade = await this.findOne(id);
    Object.assign(grade, dto);
    return this.salaryGradeRepo.save(grade);
  }

  async remove(id: number) {
    const grade = await this.findOne(id);
    return this.salaryGradeRepo.remove(grade);
  }
}