import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { Employee } from "./entities/employee-entity";
import { EmployeeDocument } from "./entities/document-entity";

import { EmergencyContact } from "./entities/employement-contact.entity";
import { EmployeeHistory } from "./entities/employement-history.entity";
import { Department } from "./entities/department-entity";
import { Designation } from "./entities/desigation-entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeeDocument, Department, Designation, EmployeeHistory , EmergencyContact])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}