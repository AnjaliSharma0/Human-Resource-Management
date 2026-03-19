import { Module } from "@nestjs/common";

import { Payroll } from "./payroll.entity";
import { Employee } from "../employee/entities/employee-entity";
import { PayrollService } from "./payroll.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalaryGrade } from "./salaryGrade/salary-grade.entity";
import { PayrollController } from "./payroll.controller";
import { SalaryGradeService } from "./salary-grade.service";
import { SalaryGradeController } from "./salary-grade.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee, SalaryGrade])],
  providers: [PayrollService, SalaryGradeService], // <-- Add SalaryGradeService here
  controllers: [PayrollController, SalaryGradeController],
  exports: [PayrollService, SalaryGradeService],   // <-- Now it's valid to export
})

export class PayrollModule{}