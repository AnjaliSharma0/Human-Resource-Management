import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "src/attendance/attendance.entity";
import { Leave } from "src/leave/leave.entity";
import { Payroll } from "src/payroll/payroll.entity";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
    imports:[TypeOrmModule.forFeature([Attendance, Leave, Payroll])],
    controllers:[ReportsController],
    providers:[ReportsService]

})
export class ReportsModule{}