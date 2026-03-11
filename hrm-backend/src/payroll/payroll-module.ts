import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PayrollService } from "./payroll.service";
import { Payroll } from "./payroll.entity";
import { PayrollController } from "./payroll.controller";
import { Employee } from "src/employee/entities/employee-entity";

@Module({
    imports:[TypeOrmModule.forFeature([Payroll,Employee])],
    providers:[PayrollService],
    controllers:[PayrollController]
})
export class PayrollModule{}