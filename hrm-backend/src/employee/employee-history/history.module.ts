import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeHistory } from "../entities/employement-history.entity";
import { Employee } from "../entities/employee-entity";
import { EmployeeHistoryController } from "./history.controller";
import { EmployeeHistoryService } from "./history.service";


@Module({
  imports: [TypeOrmModule.forFeature([EmployeeHistory, Employee])],
  controllers: [EmployeeHistoryController],
  providers: [EmployeeHistoryService],
})
export class EmployeeHistoryModule {}