import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "src/employee/entities/employee-entity";
import { RecruitmentService } from "./recruitment.service";
import { RecruitmentController } from "./recruitment.controller";
import { Candidate } from "./candidate.entity";
import { Job } from "./job.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Job, Candidate])],
    providers:[RecruitmentService],
    controllers:[RecruitmentController]
})
export class RecruitmentModule{}