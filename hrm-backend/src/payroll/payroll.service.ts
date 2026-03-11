import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payroll } from "./payroll.entity";
import { Repository } from "typeorm";
import { Employee } from "src/employee/entities/employee-entity";
import { CreatePayrollDto } from "./dto/payroll.dto";

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll) private repo: Repository<Payroll>,
    @InjectRepository(Employee) private userRepo: Repository<Employee>,
  ) {}

  async generate(dto: CreatePayrollDto) {
    const employee = await this.userRepo.findOne({ where: { id: dto.employeeId } });
    const netSalary = dto.basic + dto.hra - dto.tax - dto.deductions;
    if(!employee) {
        throw new Error("Employee not found.")
    }
    const payroll = this.repo.create({ ...dto, employee, netSalary });
    return this.repo.save(payroll);
  }

  findAll() {
    return this.repo.find({ relations: ['employee'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['employee'] });
  }
}