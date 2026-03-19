import { Controller, Get, Param } from "@nestjs/common";
import { SkillMatrixService } from "./skill-service";


@Controller("admin/skills")
export class SkillMatrixController {
  constructor(private skillMatrixService: SkillMatrixService) {}

  @Get("matrix")
  getAllEmployeeSkills() {
    return this.skillMatrixService.getEmployeeSkillMatrix();
  }

  @Get("employee/:id")
  getEmployeeSkills(@Param("id") employeeId: number) {
    return this.skillMatrixService.getEmployeeSkills(+employeeId);
  }
  
}