import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./department.entity";
import { OrgService } from "./org-service";
import { OrgController } from "./org-controller";

@Module({
    imports:[TypeOrmModule.forFeature([Department])],
    providers:[OrgService],
   controllers:[OrgController]
})

export class OrgModule{}