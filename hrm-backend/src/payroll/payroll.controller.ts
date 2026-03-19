
import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards, Req, BadRequestException } from "@nestjs/common";
import { PayrollService } from "./payroll.service";
import { CreatePayrollDto } from "./dto/payroll.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";


@Controller("payrolls")
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // Admin: generate single payroll
  @Post("generate")
  @Roles('admin')
  generate(@Body() dto: CreatePayrollDto) {
    return this.payrollService.generate(dto);
  }

  // Admin: get all payrolls
 @Get()

findAll() {
  return this.payrollService.findAll().then(payrolls =>
    payrolls.map(p => ({
      id: p.id,
      employee: {
        id: p.employee.id,
        firstName: p.employee.firstName,
        lastName: p.employee.lastName,
      },
      month: p.month,
      year: p.year,
      netSalary: Number(p.net_salary),
    }))
  );
}


@UseGuards(JwtAuthGuard)
@Get("me")
@Roles("employee")
async findMyPayrolls(@Req() req) {
  const employeeId = req.user?.employeeId ?? req.user?.id;
console.log("USER:", req.user);
  if (!employeeId) {
    throw new BadRequestException("Employee ID not found in token.");
  }

  const payrolls = await this.payrollService.findByEmployee(employeeId);

  return payrolls.map(p => ({
    id: p.id,
    month: p.month,
    year: p.year,
    netSalary: Number(p.net_salary),
  }));
}

  // Admin/Employee: get payroll by ID
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.payrollService.findOne(id);
  }

  // Admin: generate payslip PDF
  @Get("payslip/:id")
  generatePayslip(@Param("id", ParseIntPipe) payrollId: number) {
    return this.payrollService.generatePayslip(payrollId);
  }

  // Admin: generate bank advice CSV
  @Get("bank-advice")
  generateBankAdvice(@Query("month") month: number, @Query("year") year: number) {
    return this.payrollService.generateBankAdvice(month, year);
  }
  // src/payroll/payroll.controller.ts
@Post("generate-all")
@Roles('admin')
generateAll(@Body() body: { month: number, year: number }) {
  return this.payrollService.generateAll(body.month, body.year);
}
}