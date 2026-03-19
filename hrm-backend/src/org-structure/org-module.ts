import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/employee/entities/department-entity';
import { Location } from './location.entity';
import { BusinessUnit } from './buisness-unit.entity';
import { Employee } from 'src/employee/entities/employee-entity';
import { OrgStructureController } from './org-controller';
import { OrgStructureService } from './org-service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Location, BusinessUnit, Employee]),
  ],
  providers: [OrgStructureService],
  controllers: [OrgStructureController],
})
export class OrgStructureModule {}