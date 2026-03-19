import { Controller, Post, Body, Param, Get, Patch, UseGuards } from '@nestjs/common';
import { RolesGaurd } from 'src/common/guard/role.guard';
import { InterviewService } from './interview-service';
import { ScheduleInterviewDto } from './dto/interview-schedule.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { InterviewStatus } from './entity/interview-entity';


// @UseGuards(RolesGaurd)
@Controller('interviews')
export class InterviewController {
  constructor(private service: InterviewService) {}

  @Post()
  //@Roles('Admin')
  schedule(@Body() dto: ScheduleInterviewDto) {
    return this.service.schedule(dto);
  }

  @Get()
  //@Roles('Admin', 'Employee')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  //@Roles('Admin', 'Employee')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/feedback')
  //@Roles('Admin')
  updateFeedback(@Param('id') id: number, @Body('feedback') feedback: string, @Body('status') status?: InterviewStatus) {
    return this.service.updateFeedback(+id, feedback, status);
  }
}