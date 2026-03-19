

import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, ValidationPipe } from "@nestjs/common";
import { LeaveService } from "./leave.service";
import { ApplyLeaveDto } from "./dto/leave.dto";
import { JwtAuthGuard } from "../dto/auth/jwt-auth.guard";
import { CreateLeaveBalanceDto } from "./dto/create-balanceLeave.dto";

@Controller("leave")
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  // Apply leave (employeeId from JWT)
  @Post()
  applyLeave(@Request() req, @Body() dto: ApplyLeaveDto) {
    const employeeId = req.user.id;
    return this.leaveService.applyLeave({ ...dto, employeeId });
  }

  // Admin view all leaves
  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  // Employee leave history
  @Get("employee/:id")
  getEmployeeLeaves(@Param("id") id: number) {
    return this.leaveService.getEmployeeLeaves(id);
  }

  // Admin approve/reject
  @Put(":id/status")
  updateStatus(@Param("id") id: number, @Body() body: { status: string }) {
    return this.leaveService.updateStatus(id, body.status.toLowerCase() as "approved" | "rejected");
  }

  @Get("calendar")
  getCalendar() {
    return this.leaveService.getLeaveCalendar();
  }


@Post("balance")
createBalance(@Body() dto: CreateLeaveBalanceDto) {
  return this.leaveService.createLeaveBalance(dto);
}

@Get("balance/:employeeId")
getBalance(@Param("employeeId") employeeId: number) {
  return this.leaveService.getEmployeeBalance(employeeId);
}

}