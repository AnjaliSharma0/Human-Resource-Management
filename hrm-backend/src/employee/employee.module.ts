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
import { UserModule } from "../dto/users/user.module";
import { EmailService } from "./employee-invitation/email-service";
import { SalaryGrade } from "src/payroll/salaryGrade/salary-grade.entity";


@Module({
  imports: [TypeOrmModule.forFeature
    ([Employee, 
      EmployeeDocument,
       Department, 
       Designation,
        EmployeeHistory ,
         EmergencyContact,
         SalaryGrade
        ]),
       UserModule
      ]
    ,
  controllers: [EmployeeController],
  providers: [EmployeeService,EmailService],
})
export class EmployeeModule {}