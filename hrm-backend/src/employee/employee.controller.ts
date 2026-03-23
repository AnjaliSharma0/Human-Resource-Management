import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../dto/auth/jwt-auth.guard";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create.employee.dto";
import { Roles } from "../common/decorators/role.decorator";
import { RolesGaurd } from "../common/guard/role.guard";
import { EmployeeTeamDto } from "./dto/employee-team.dto";
import { EmailService } from "./employee-invitation/email-service";

@Controller("employees")
@UseGuards(JwtAuthGuard,RolesGaurd)
export class EmployeeController {

constructor(
 private emailService:EmailService,
  private employeeService:EmployeeService
){}

@Post()
@Roles("admin")
async create(@Body() body: CreateEmployeeDto) {

  const employee = await this.employeeService.create(body);


  if(!employee ){
    throw new Error("Employee not found")
  }
  // send activation email
  await this.emailService.sendInviteEmail(
    employee.email,
    employee.activationToken!
  );

  return {
    message: "Employee created successfully. Invitation email sent.",
    employee
  };
}
@Get()
// @Roles("admin","manager","employee")
findAll(){
  return this.employeeService.findAll();
}



@Get("me")
@Roles("employee")
findMe(@Req() req: Request & { user: { id: number } }) {
  return this.employeeService.findByUserId(req.user.id);
}

@Patch("me")
@Roles("employee")
updateSelf(
 @Req() req,
 @Body() body:any
){
 return this.employeeService.updateSelf(req.user.id, body)
}

@Get(":id/team")
async getTeam(@Param("id") id: number): Promise<EmployeeTeamDto> {
  return this.employeeService.getEmployeeTeam(id);
}

@Get(":id/profile")
findProfile(@Param("id") id: number) {
  return this.employeeService.getEmployeeProfile(id);
}

@Get(":id")
findOne(@Param("id") id:string){
  return this.employeeService.findOne(Number(id));
}

@Patch(":id")
@Roles("admin")
update(@Param("id") id:number,@Body() body:any){
 return this.employeeService.update(id,body);
}

@Delete(":id")
@Roles("admin")
remove(@Param("id") id:number){
 return this.employeeService.remove(id);
}

  @Patch(":id/salary-grade")
  assignSalaryGrade(
    @Param("id") empId: number,
    @Body() body: { salaryGradeId: number }
  ) {
    return this.employeeService.assignSalaryGrade(empId, body.salaryGradeId);
  }

}