import { Module } from '@nestjs/common';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContactController } from './emergency-contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from '../entities/employement-contact.entity';
import { Employee } from '../entities/employee-entity';

@Module({
  imports:[TypeOrmModule.forFeature([EmergencyContact, Employee])],
  providers: [EmergencyContactService],
  controllers: [EmergencyContactController]
})
export class EmergencyContactModule {}
