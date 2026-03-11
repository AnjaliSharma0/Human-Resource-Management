import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Department } from "./entities/department-entity";
import { Designation } from "./entities/desigation-entity";
import { CreateEmployeeDto } from "./dto/create.employee.dto";
import { UpdateEmployeeDto } from "./dto/update.employee.dto";
import { Employee } from "./entities/employee-entity";
import { EmployeeProfileDto } from "./dto/create-employee-profile";
import { EmployeeTeamDto } from "./dto/employee-team.dto";
import { Role } from "src/dto/users/user.role";
import { UserService } from "src/dto/users/users-service";


@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

   private userService: UserService,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,

    @InjectRepository(Designation)
    private designationRepo: Repository<Designation>,
  ) { }

  async create(dto: CreateEmployeeDto) {

    const department = await this.departmentRepo.findOne({
      where: { id: dto.departmentId }
    });

    const designation = await this.designationRepo.findOne({
      where: { id: dto.designationId }
    });

    const manager = dto.managerId
      ? await this.employeeRepo.findOne({ where: { id: dto.managerId } })
      : null;

    const employee = this.employeeRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      address: dto.address,
      joiningDate: dto.joiningDate,
      department: department!,
      designation: designation!,
      manager: manager ?? undefined
    });

    /* STEP 2: generate activation token */

    employee.activationToken = Math.random().toString(36).substring(2);

    employee.activationExpires = new Date(
      Date.now() + 1000 * 60 * 60 * 24
    );


    const savedEmployee = await this.employeeRepo.save(employee);

    await this.userService.create({
      name: savedEmployee.firstName,
      email: savedEmployee.email,
      role: Role.EMPLOYEE
    });

    return savedEmployee;
  }

  async findAll() {
    return this.employeeRepo.find({
      relations: ["department", "designation", "manager"]
    });
  }

  async findOne(id: number) {

    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ["department", "designation", "manager"]
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    return employee;
  }

  async updateSelf(userId: number, dto: any) {

    const employee = await this.employeeRepo.findOne({
      relations: ["user"],
      where: { user: { id: userId } }
    })
    if (!employee) {
      throw new Error("Employee not found.")
    }
    employee.address = dto.address
    employee.phone = dto.phone

    return this.employeeRepo.save(employee)
  }
  async update(id: number, dto: UpdateEmployeeDto) {

    const employee = await this.findOne(id);

    Object.assign(employee, dto);

    return this.employeeRepo.save(employee);
  }

  async remove(id: number) {

    const employee = await this.findOne(id);

    return this.employeeRepo.remove(employee);
  }

  async getEmployeeTeam(id: number): Promise<EmployeeTeamDto> {
    // Fetch manager with direct subordinates
    const manager = await this.employeeRepo.findOne({
      where: { id },
      relations: ["subordinates"]
    });

    if (!manager) throw new NotFoundException("Manager not found");

    // Recursive function to map subordinates
    const buildTree = (emp: Employee): EmployeeTeamDto => ({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      subordinates: emp.subordinates?.map(buildTree) || []
    });

    return buildTree(manager);
  }

  async getEmployeeProfile(id: number): Promise<EmployeeProfileDto> {
    const emp = await this.employeeRepo.findOne({
      where: { id },
      relations: [
        "department",
        "designation",
        "manager",
        "emergencyContacts",
        "documents",
        "history"
      ]
    });

    if (!emp) throw new NotFoundException("Employee not found");

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      dateOfBirth: emp.dateOfBirth,
      gender: emp.gender,
      address: emp.address,
      joiningDate: emp.joiningDate,
      status: emp.status,

      // ✅ Optional fields now
      department: emp.department
        ? { id: emp.department.id, name: emp.department.name }
        : undefined,
      designation: emp.designation
        ? { id: emp.designation.id, title: emp.designation.title }
        : undefined,
      manager: emp.manager
        ? { id: emp.manager.id, firstName: emp.manager.firstName, lastName: emp.manager.lastName }
        : undefined,

      emergencyContacts: emp.emergencyContacts?.map(c => ({
        name: c.name,
        relationship: c.relationship,
        phone: c.phone
      })) ?? [],
      documents: emp.documents?.map(d => ({
        documentName: d.documentName,
        filePath: d.filePath
      })) ?? [],
      history: emp.history?.map(h => ({
        companyName: h.companyName,
        designation: h.designation,
        startDate: h.startDate,
        endDate: h.endDate,
        description: h.description
      })) ?? []
    }
  }

}


