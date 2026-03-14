import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from 'src/dto/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGaurd } from 'src/common/guard/role.guard';


@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGaurd) // apply both JWT & roles guard
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  // ---------------------------
  // Punch-in (employee only)
  // ---------------------------
  @Post('punch-in')
  @Roles('employee', 'admin') // allow employee or admin
  async punchIn(@Req() req) {
      console.log(req.user); // check JWT payload
    const employeeId = req.user.employeeId;;
    return this.service.punchIn(employeeId);
  }

  // ---------------------------
  // Punch-out (employee only)
  // ---------------------------
  @Post('punch-out')
  @Roles('employee', 'admin') // allow employee or admin
  async punchOut(@Req() req) {
    const employeeId = req.user.employeeId;
    return this.service.punchOut(employeeId);
  }

  // ---------------------------
  // Get all attendance records (admin only)
  // ---------------------------
  @Get("all")
  @Roles('admin') // only admins
  async getAll() {
    return this.service.findAll();
  }

  // ---------------------------
  // Get attendance for logged-in user
  // ---------------------------
  @Get('me')
  @Roles('employee', 'admin') // allow both
  async getMyAttendance(@Req() req) {
    const employeeId = req.user.employeeId;
    return this.service.findByEmployee(employeeId);
  }
}