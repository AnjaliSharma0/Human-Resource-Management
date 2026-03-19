import { Controller, Post, Body, Get, Delete, Param, Patch } from "@nestjs/common";
import { TrainingService } from "./training.service";
import { TrainingFeedbackDto } from "./dto/create-enroll.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";


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
    return this.service.enroll(body.employeeId, body.courseId);
  }

  @Get("enrollments")
  getEnrollments() {
    return this.service.getAllEnrollments();
  }

  @Post("employee/training/feedback")
async submitFeedback(@Body() dto: TrainingFeedbackDto) {
  return this.service.submitFeedback(dto);
}


@Delete("course/:id")
deleteCourse(@Param("id") id: number) {
  return this.service.deleteCourse(id);
}

@Patch('enrollment/:id/status')
updateStatus(
  @Param('id') id: number,
  @Body() body: UpdateStatusDto
) {
  return this.service.updateStatus(id, body.status);
}

}