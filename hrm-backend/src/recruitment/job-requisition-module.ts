import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequisitionService } from './job-recuigition-service';
import { JobRequisitionController } from './job-requition.controller';
import { JobRequisition } from './entity/job-requisition-entity';
import { Employee } from 'src/employee/entities/employee-entity';


@Module({
  imports: [TypeOrmModule.forFeature([JobRequisition, Employee])],
  providers: [JobRequisitionService],
  controllers: [JobRequisitionController],
})
export class JobRequisitionModule {}