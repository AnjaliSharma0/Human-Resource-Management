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
    EmployeeHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
