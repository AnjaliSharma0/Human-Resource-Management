import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";
import { HolidayService } from "./holidayService";

@Controller("holiday")
@UseGuards(JwtAuthGuard)
export class HolidayController {

  constructor(private service: HolidayService) {}
@Post()
createHoliday(@Body() body: { name: string; date: string }) {
  return this.service.create({
    name: body.name,
    date: new Date(body.date),
  });
}

 @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(id);
  }

  @Get()
  getAllHolidays() {
    return this.service.findAll();
  }

}