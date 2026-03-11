import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/dto/auth/jwt-auth.guard";
import { LeaveService } from "./leave.service";
import { ApplyLeaveDto } from "./dto/leave.dto";

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private service: LeaveService) {}

  @Post()
  applyLeave(@Body() dto: ApplyLeaveDto) {
    return this.service.apply(dto);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Put(':id')
  updateStatus(@Param('id') id: number, @Body() body: { status: 'approved' | 'rejected' }) {
    return this.service.updateStatus(+id, body.status);
  }
}