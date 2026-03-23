import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Skill } from "./skill-entity";
import { Employee } from "src/employee/entities/employee-entity";

@Controller("skills")
export class SkillController {
  constructor(
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
    @InjectRepository(Employee) private employeerepo: Repository<Employee>
  ) {}

//   @Post()
//   async addSkill(@Body("name") name: string) {
//     const skill = this.skillRepo.create({ name });
//     return this.skillRepo.save(skill);
//   }
  @Post("employee/:id/add-skill")
    async addSkill(
      @Param("id") employeeId: number,
      @Body("skillId") skillId: number
    ) {
  // 1️⃣ Find employee with existing skills
  const employee = await this.employeerepo.findOne({
    where: { id: employeeId },
    relations: ["skills"],
  });

  if (!employee) {
    return { message: "Employee not found" };
  }

  // 2️⃣ Find the skill
  const skill = await this.skillRepo.findOne({ where: { id: skillId } });

  if (!skill) {
    return { message: "Skill not found" };
  }

  // 3️⃣ Check if employee already has this skill
  if (!employee.skills.some(s => s.id === skill.id)) {
    employee.skills.push(skill); // ✅ skill is guaranteed not null
    await this.employeerepo.save(employee);
  }

  return { message: "Skill added" };
}

@Get("all")
async getAllSkills() {
  return await this.skillRepo.find(); // returns [{id, name}, ...]
}
}