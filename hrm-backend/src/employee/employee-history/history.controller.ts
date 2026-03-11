import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EmployeeHistoryService } from "./history.service";
import { CreateHistoryDto } from "../dto/create-employee-history.dto";


@Controller("employees")
export class EmployeeHistoryController {

  constructor(private historyService: EmployeeHistoryService) {}

  @Post(":id/history")
  create(
    @Param("id") id: string,
    @Body() body: CreateHistoryDto
  ) {
    return this.historyService.create(Number(id), body);
  }

  @Get(":id/history")
  findEmployeeHistory(@Param("id") id: string) {
    return this.historyService.findEmployeeHistory(Number(id));
  }

  @Delete("history/:id")
  remove(@Param("id") id: string) {
    return this.historyService.remove(Number(id));
  }
}