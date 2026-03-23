import { Controller, Post, Get, Param, Patch, Delete, Body } from "@nestjs/common";
import { SalaryGradeService } from "./salary-grade.service";
import { CreateSalaryGradeDto } from "./dto/salary-grade.dto";


@Controller("salary-grades")
export class SalaryGradeController {
  constructor(private readonly service: SalaryGradeService) {}

  @Post()
  create(@Body() dto: CreateSalaryGradeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: Partial<CreateSalaryGradeDto>) {
    return this.service.update(Number(id), dto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(Number(id));
  }
  
}