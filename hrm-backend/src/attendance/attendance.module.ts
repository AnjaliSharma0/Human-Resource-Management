import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "./attendance.entity";
import { Employee } from "../employee/entities/employee-entity";

@Module({
    imports:[TypeOrmModule.forFeature([Attendance, Employee])],
    providers:[AttendanceService],
    controllers:[AttendanceController]
})

export class AttendanceModule{}