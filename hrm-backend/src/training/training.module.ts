import { Module } from "@nestjs/common";
import { TrainingController } from "./training.controller";
import { TrainingService } from "./training.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { Employee } from "src/employee/entities/employee-entity";

@Module({
imports:[TypeOrmModule.forFeature([Course, Enrollment, Employee])],
providers:[TrainingService],
controllers:[TrainingController]
})
export class TrainingModule{}