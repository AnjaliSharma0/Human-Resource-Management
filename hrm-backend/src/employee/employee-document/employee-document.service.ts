import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeDocument } from "../entities/document-entity";
import { Employee } from "../entities/employee-entity";


@Injectable()
export class EmployeeDocumentService {

  constructor(

    @InjectRepository(EmployeeDocument)
    private documentRepo: Repository<EmployeeDocument>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>

  ) {}

  async upload(employeeId: number, documentName: string, filePath: string) {

    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    const doc = this.documentRepo.create({
      documentName,
      filePath,
      employee
    });

    return this.documentRepo.save(doc);
  }

  findEmployeeDocuments(employeeId: number) {

    return this.documentRepo.find({
      where: { employee: { id: employeeId } }
    });

  }

  async remove(id: number) {

    const doc = await this.documentRepo.findOne({
      where: { id }
    });

    if (!doc) {
      throw new NotFoundException("Document not found");
    }

    return this.documentRepo.remove(doc);
  }
}