import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leave } from "./leave.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { LeaveService } from "./leave.service";
import { LeaveController } from "./leave.controller";
import { LeaveType } from "./holiday/leave-type";
import { LeaveBalance } from "./holiday/leave-balance";
import { Holiday } from "./holiday/holiday.entity";

@Module({
    imports:[TypeOrmModule.forFeature([
        Leave,
         Employee,
    LeaveType,
    LeaveBalance,
    Holiday
])],
    providers:[LeaveService],
    controllers:[LeaveController]
})

export class LeaveModule{}