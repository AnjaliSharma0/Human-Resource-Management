import { Controller, Post, Get, Body } from "@nestjs/common";
import { TrainingService } from "./training.service";
import { CreateTrainingCourseDto } from "./dto/create-course.dto";


@Controller("admin/training")
export class AdminTrainingController {
  constructor(private trainingService: TrainingService) {}

  @Post("courses")
  createCourse(@Body() dto: CreateTrainingCourseDto) {
    return this.trainingService.createCourse(dto);
  }

  @Get("enrollments")
  getAllEnrollments() {
    return this.trainingService.getAllEnrollments();
  }
}