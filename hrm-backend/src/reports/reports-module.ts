import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "../attendance/attendance.entity";
import { Leave } from "../leave/leave.entity";
import { Payroll } from "../payroll/payroll.entity";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { Employee } from "src/employee/entities/employee-entity";

@Module({
    imports:[TypeOrmModule.forFeature([Attendance, Leave, Payroll,Employee])],
    controllers:[ReportsController],
    providers:[ReportsService]

})
export class ReportsModule{}