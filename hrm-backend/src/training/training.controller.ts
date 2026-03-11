import { Controller, Post, Body, Get } from "@nestjs/common";
import { TrainingService } from "./training.service";


@Controller("training")
export class TrainingController {

  constructor(private service: TrainingService) {}

  @Post("course")
  createCourse(@Body() body) {
    return this.service.createCourse(body);
  }

  @Get("courses")
  getCourses() {
    return this.service.getCourses();
  }

  @Post("enroll")
  enroll(@Body() body) {
    return this.service.enrollEmployee(body.employeeId, body.courseId);
  }

  @Get("enrollments")
  getEnrollments() {
    return this.service.getEnrollments();
  }

}