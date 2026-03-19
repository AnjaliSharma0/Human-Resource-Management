import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './dto/auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './employee/department/department.module';
import { DesignationModule } from './employee/designation/designation.module';
import { EmergencyContactModule } from './employee/emergency-contact/emergency-contact.module';
import { EmployeeDocumentModule } from './employee/employee-document/employee-document.module';
import { EmployeeHistoryModule } from './employee/employee-history/history.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave-module';
import { ExpenseModule } from './expenses/expenses.module';
import { IntegrationModule } from './integrations/integration-module';

import { PayrollModule } from './payroll/payroll-module';
import { PerformanceModule } from './performance/performance-module';
import { ReportsModule } from './reports/reports-module';
import { TrainingModule } from './training/training.module';
import { HolidayModule } from './leave/holiday/holiday-module';
import { OfferLetterModule } from './recruitment/offer-letter-module';
import { JobPostingModule } from './recruitment/job-posting-module';
import { InterviewModule } from './recruitment/interview-module';
import { CandidateModule } from './recruitment/candidate-module';
import { JobRequisitionModule } from './recruitment/job-requisition-module';
import { HrModule } from './onbording/onbording.mdule';
import { OrgStructureModule } from './org-structure/org-module';
import { HelpdeskModule } from './helpdesk/helpdesk.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true
    })
    ,AuthModule, 
    EmployeeModule, 
    DepartmentModule,
    DesignationModule,
    EmergencyContactModule,
    EmployeeDocumentModule,
    EmployeeHistoryModule,
    AttendanceModule,
    LeaveModule,
    ExpenseModule,
    IntegrationModule,
    HrModule,
    OrgStructureModule,
    PayrollModule,
    PerformanceModule,
    ReportsModule,
    TrainingModule,
    HolidayModule,
    OfferLetterModule,
    JobPostingModule,
    InterviewModule,
    CandidateModule,
    JobRequisitionModule,
    HelpdeskModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


