import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PerformanceService } from "./performance.service";
import { PerformanceController } from "./performance.controller";
import { Review } from "./review.entity";
import { Goal } from "./goal.entity";
import { Employee } from "../employee/entities/employee-entity";
import { PerformanceGateway } from "./performance.gateway";


@Module({
    imports:[TypeOrmModule.forFeature([Review, Goal, Employee])],
    providers:[PerformanceService, PerformanceGateway],
    controllers:[PerformanceController]
})
export class PerformanceModule{}