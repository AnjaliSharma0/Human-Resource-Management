import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { Request } from "express";
import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";


interface AuthRequest extends Request {
  user: { id: number }; // define the user object your JWT guard adds
}

@UseGuards(JwtAuthGuard)
@Controller("reports")
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get("attendance")
  async attendance(@Req() req: AuthRequest) {
    return this.service.attendanceReport(req.user.id);
  }

  @Get("leave")
  async leave(@Req() req: AuthRequest) {
    return this.service.leaveReport(req.user.id);
  }

  @Get("payroll")
  async payroll(@Req() req: AuthRequest) {
    return this.service.payrollReport(req.user.id);
  }
}