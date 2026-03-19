import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { JwtAuthGuard } from "../dto/auth/jwt-auth.guard";


@Controller("attendance")
export class AttendanceController {

  constructor(private service: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post("punch-in")
  punchIn(@Req() req) {
      console.log("JWT USER:", req.user);
    return this.service.punchIn(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("punch-out")
  punchOut(@Req() req) {
    return this.service.punchOut(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  myAttendance(@Req() req) {
    return this.service.myAttendance(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("all")
  all() {
    return this.service.allAttendance();
  }

}