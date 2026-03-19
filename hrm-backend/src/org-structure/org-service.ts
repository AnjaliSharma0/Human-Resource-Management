import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/employee/entities/department-entity';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { BusinessUnit } from './buisness-unit.entity';
import { Employee } from 'src/employee/entities/employee-entity';

export interface EmployeeNode {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
  managerId?: number;
  subordinates: EmployeeNode[];
}

@Injectable()
export class OrgStructureService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,

    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,

    @InjectRepository(BusinessUnit)
    private readonly businessUnitRepo: Repository<BusinessUnit>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // ---------------- Departments ----------------
  findAllDepartments() {
    return this.departmentRepo.find({ relations: ['mappedLocation', 'businessUnit', 'employees'] });
  }

  findDepartmentById(id: number) {
    return this.departmentRepo.findOne({ where: { id }, relations: ['mappedLocation', 'businessUnit', 'employees'] });
  }

  createDepartment(data: Partial<Department>) {
    const dept = this.departmentRepo.create(data);
    return this.departmentRepo.save(dept);
  }

  // ---------------- Locations ----------------
  findAllLocations() {
    return this.locationRepo.find({ relations: ['departments'] });
  }

  createLocation(data: Partial<Location>) {
    const loc = this.locationRepo.create(data);
    return this.locationRepo.save(loc);
  }

  // ---------------- Business Units ----------------
  findAllBusinessUnits() {
    return this.businessUnitRepo.find({ relations: ['departments'] });
  }

  createBusinessUnit(data: Partial<BusinessUnit>) {
    const unit = this.businessUnitRepo.create(data);
    return this.businessUnitRepo.save(unit);
  }

  // ---------------- Org Chart / Hierarchy ----------------
 async getOrgHierarchy() {
  const employees = await this.employeeRepo.find({
    relations: ['manager', 'department'],
  });

  // Create a map of employeeId -> EmployeeNode
  const employeeMap = new Map<number, EmployeeNode>();

  employees.forEach(emp => {
    employeeMap.set(emp.id, {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department ? { id: emp.department.id, name: emp.department.name } : undefined,
      managerId: emp.manager?.id,
      subordinates: [],
    });
  });

  // Build hierarchy
  const roots: EmployeeNode[] = [];

  employeeMap.forEach(empNode => {
    if (empNode.managerId) {
      const managerNode = employeeMap.get(empNode.managerId);
      if (managerNode) {
        managerNode.subordinates.push(empNode);
      }
    } else {
      roots.push(empNode);
    }
  });

  return roots;
}
}