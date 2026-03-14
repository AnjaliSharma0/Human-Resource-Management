import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";

import { LeaveService } from "./leave.service";
import { ApplyLeaveDto } from "./dto/leave.dto";
import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";


@Controller("leave")
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // Employee applies leave
  @Post()
  applyLeave(@Body() dto: ApplyLeaveDto) {
    return this.leaveService.applyLeave(dto);
  }

  // Admin / Manager view all leave requests
  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  // Employee view their leave history
  @Get("employee/:id")
  getEmployeeLeaves(@Param("id") id: number) {
    return this.leaveService.getEmployeeLeaves(+id);
  }

  // Admin / Manager approve or reject leave
  @Put(":id/status")
  updateStatus(
    @Param("id") id: number,
    @Body() body: { status: "approved" | "rejected" },
  ) {
    return this.leaveService.updateStatus(+id, body.status);
  }

  @Get("calendar")
getCalendar() {
  return this.leaveService.getLeaveCalendar();
}
}