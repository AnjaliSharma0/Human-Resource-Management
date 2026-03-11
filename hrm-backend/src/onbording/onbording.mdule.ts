import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OnboardingTask } from "./onboarding.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { OnboardingService } from "./onbording.service";
import { OnboardingController } from "./onbording.controller";

@Module({
    imports:[TypeOrmModule.forFeature([OnboardingTask, Employee])],
    providers:[OnboardingService],
    controllers:[OnboardingController]
})
export class OnbordingModule{}