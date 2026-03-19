import { Module } from "@nestjs/common";
import { TrainingController } from "./training.controller";
import { TrainingService } from "./training.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainingEnrollment } from "./training-enrollment.entity";
import { TrainingCourse } from "./training-course.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { Skill } from "./skill-entity";
import { SkillMatrixController } from "./skill-matric-controler";
import { EmployeeTrainingController } from "./employee-training-controller";
import { AdminTrainingController } from "./admin-training-controller";
import { SkillMatrixService } from "./skill-service";
import { SkillController } from "./employee-skill-controllerr";


@Module({
imports:[TypeOrmModule.forFeature([TrainingEnrollment,SkillController, TrainingCourse, Employee,Skill])],
providers:[TrainingService, SkillMatrixService],
controllers:[TrainingController, SkillMatrixController,EmployeeTrainingController, AdminTrainingController ]
})
export class TrainingModule{}