import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from '../entities/desigation-entity';
import { Department } from '../entities/department-entity';

@Module({
  imports:[TypeOrmModule.forFeature([Designation, Department])],
  providers: [DesignationService],
  controllers: [DesignationController]
})
export class DesignationModule {}
