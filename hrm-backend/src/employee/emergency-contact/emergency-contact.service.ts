import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmergencyContact } from "../entities/employement-contact.entity";
import { Employee } from "../entities/employee-entity";
import { CreateEmergencyContactDto } from "../dto/create-emergencyContact.dto";

@Injectable()
export class EmergencyContactService {

  constructor(

    @InjectRepository(EmergencyContact)
    private contactRepo: Repository<EmergencyContact>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>

  ) {}

  async create(employeeId: number, dto: CreateEmergencyContactDto) {

    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    const contact = this.contactRepo.create({
      ...dto,
      employee
    });

    return this.contactRepo.save(contact);
  }

  findByEmployee(employeeId: number) {

    return this.contactRepo.find({
      where: { employee: { id: employeeId } }
    });

  }

  async remove(id: number) {

    const contact = await this.contactRepo.findOne({
      where: { id }
    });

    if (!contact) {
      throw new NotFoundException("Contact not found");
    }

    return this.contactRepo.remove(contact);
  }
}