import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeHistory } from "../entities/employement-history.entity";
import { Employee } from "../entities/employee-entity";
import { CreateHistoryDto } from "../dto/create-employee-history.dto";


@Injectable()
export class EmployeeHistoryService {

  constructor(

    @InjectRepository(EmployeeHistory)
    private historyRepo: Repository<EmployeeHistory>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>

  ) {}

  async create(employeeId: number, dto: CreateHistoryDto) {

    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    const history = this.historyRepo.create({
      ...dto,
      employee
    });

    return this.historyRepo.save(history);
  }

  findEmployeeHistory(employeeId: number) {

    return this.historyRepo.find({
      where: { employee: { id: employeeId } }
    });

  }

  async remove(id: number) {

    const history = await this.historyRepo.findOne({
      where: { id }
    });

    if (!history) {
      throw new NotFoundException("History not found");
    }

    return this.historyRepo.remove(history);
  }
}