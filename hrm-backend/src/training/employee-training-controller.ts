import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { TrainingService } from "./training.service";
import { EnrollTrainingDto, TrainingFeedbackDto } from "./dto/create-enroll.dto";


@Controller("employee/training")
export class EmployeeTrainingController {
  constructor(private trainingService: TrainingService) {}

  @Post("enroll/:employeeId")
 @Post("enroll")
enroll(@Body() body) {
  return this.trainingService.enroll(body.employeeId, body.courseId);
}

  @Post("feedback")
  submitFeedback(@Body() dto: TrainingFeedbackDto) {
    return this.trainingService.submitFeedback(dto);
  }

  @Get("my-courses/:employeeId")
  getMyCourses(@Param("employeeId") employeeId: number) {
    return this.trainingService.getEmployeeCourses(employeeId);
  }
}