import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';

import { UpdateJobPostingDto } from './dto/update-job-posting.dto';
import { RolesGaurd } from 'src/common/guard/role.guard';
import { JobPostingService } from './job-posting-service';
import { CreateJobPostingDto } from './dto/job-posting.dto';
import { Roles } from 'src/common/decorators/role.decorator';

@UseGuards(RolesGaurd)
@Controller('job-postings')
export class JobPostingController {
  constructor(private service: JobPostingService) {}

  @Post()
  //@Roles('Admin')
  create(@Body() dto: CreateJobPostingDto) {
    return this.service.create(dto);
  }

  @Get()
 // @Roles('Admin', 'Employee')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  //@Roles('Admin', 'Employee')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
 // @Roles('Admin')
  update(@Param('id') id: number, @Body() dto: UpdateJobPostingDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
 // @Roles('Admin')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}