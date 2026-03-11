import { Module } from '@nestjs/common';
import { EmployeeDocumentService } from './employee-document.service';
import { EmployeeDocumentController } from './employee-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDocument } from '../entities/document-entity';
import { Employee } from '../entities/employee-entity';

@Module({
  imports:[TypeOrmModule.forFeature([EmployeeDocument, Employee])],
  providers: [EmployeeDocumentService],
  controllers: [EmployeeDocumentController]
})
export class EmployeeDocumentModule {}
