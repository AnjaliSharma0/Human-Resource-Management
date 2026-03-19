import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { LeaveTypeService } from "./leave-type-service";
import { CreateLeaveTypeDto } from "./dto/create-type-leave.dto";


@Controller("leave-types")
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  // Create a new leave type
  @Post()
  async create(@Body() dto: CreateLeaveTypeDto) {
    return this.leaveTypeService.create(dto);
  }

  // Get all leave types
  @Get()
  async findAll() {
    return this.leaveTypeService.findAll();
  }

  // Get a single leave type by id
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.leaveTypeService.findOne(id);
  }
}