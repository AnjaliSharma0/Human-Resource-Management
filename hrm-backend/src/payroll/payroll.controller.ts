import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";
import { PayrollService } from "./payroll.service";
import { CreatePayrollDto } from "./dto/payroll.dto";

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Post()
  generate(@Body() dto: CreatePayrollDto) {
    return this.service.generate(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }
}