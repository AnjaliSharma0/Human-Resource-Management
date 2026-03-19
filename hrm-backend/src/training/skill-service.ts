import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TrainingEnrollment } from "./training-enrollment.entity";
import { Employee } from "src/employee/entities/employee-entity";

@Injectable()
export class SkillMatrixService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(TrainingEnrollment) private enrollmentRepo: Repository<TrainingEnrollment>
  ) {}

  // Returns skill matrix for all employees
  async getEmployeeSkillMatrix() {
    const employees = await this.employeeRepo.find({
      relations: ["enrollments", "enrollments.course", "enrollments.course.skills","skills"]
    });

    return employees.map(emp => {
      const skills: Record<string, string> = {};

      emp.enrollments
        .filter(enroll => enroll.status === "completed")
        .forEach(enroll => {
          enroll.course.skills.forEach(skill => {
            skills[skill.name] = "Acquired (course)";
          });
        });


  // Manually added skills
  emp.skills.forEach((skill) => {
    skills[skill.name] = "Acquired (Manual)";
  });

      return {
        employeeId: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        department: emp.department?.name,
        skills
      };
    });
  }

  // Returns skills for a single employee
  async getEmployeeSkills(employeeId: number) {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
      relations: ["enrollments", "enrollments.course", "enrollments.course.skills"]
    });

    if (!employee) return null;

    const skills: Record<string, string> = {};
    employee.enrollments
      .filter(e => e.status === "completed")
      .forEach(enroll => {
        enroll.course.skills.forEach(skill => {
          skills[skill.name] = "Acquired";
        });
      });

    return {
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department?.name,
      skills
    };
  }
  
}