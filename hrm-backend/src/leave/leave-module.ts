import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leave } from "./leave.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { LeaveService } from "./leave.service";
import { LeaveController } from "./leave.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Leave, Employee])],
    providers:[LeaveService],
    controllers:[LeaveController]
})

export class LeaveModule{}