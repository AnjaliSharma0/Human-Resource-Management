import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/dto/auth/jwt-auth.guard';
import { AttendanceDto } from './dto/attendence.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Post('punch-in')
  punchIn(@Body() dto: AttendanceDto) {
    return this.service.punchIn(dto.employeeId);
  }

  @Post('punch-out')
  punchOut(@Body() dto: { attendanceId: number }) {
    return this.service.punchOut(dto.attendanceId);
  }
    @Get()
  getAll() {
    return this.service.findAll();
  }
}
