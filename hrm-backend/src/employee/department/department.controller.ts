import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "../dto/create.department";
import { UpdateDepartmentDto } from "../dto/update.department";


@Controller("departments")
export class DepartmentController {

  constructor(private departmentService: DepartmentService) {}

  @Post()
  create(@Body() body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.departmentService.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateDepartmentDto) {
    return this.departmentService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.departmentService.remove(Number(id));
  }
}