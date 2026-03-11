import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DesignationService } from "./designation.service";
import { CreateDesignationDto } from "../dto/create-designation.dto";
import { UpdateDesignationDto } from "../dto/update-designation";


@Controller("designations")
export class DesignationController {

  constructor(private designationService: DesignationService) {}

  @Post()
  create(@Body() body: CreateDesignationDto) {
    return this.designationService.create(body);
  }

  @Get()
  findAll() {
    return this.designationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.designationService.findOne(Number(id));
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: UpdateDesignationDto
  ) {
    return this.designationService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.designationService.remove(Number(id));
  }
}