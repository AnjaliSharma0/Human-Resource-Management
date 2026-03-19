import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { EnrollmentStatus, TrainingCourse } from "./training-course.entity";
import { TrainingEnrollment } from "./training-enrollment.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { CreateTrainingCourseDto } from "./dto/create-course.dto";
import { EnrollTrainingDto, TrainingFeedbackDto } from "./dto/create-enroll.dto";
import { Skill } from "./skill-entity";




@Injectable()
export class TrainingService {
 
  constructor(
    @InjectRepository(TrainingCourse) private courseRepo: Repository<TrainingCourse>,
    @InjectRepository(TrainingEnrollment) private enrollmentRepo: Repository<TrainingEnrollment>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>
  ) {}

  // Admin: Create Course
  async createCourse(dto: CreateTrainingCourseDto) {
    const { skills, ...courseData } = dto;

    const course = this.courseRepo.create(courseData);

    // ✅ Fetch real skill entities
    if (skills && skills.length > 0) {
      const skillEntities = await this.skillRepo.find({
        where: { id: In(skills) },
      });

      course.skills = skillEntities;
    }

    return this.courseRepo.save(course);
  }

  // Employee: Enroll in Course
  // async enroll(employeeId: number, dto: EnrollTrainingDto) {
  //   const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
  //   const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });

  //   if (!employee || !course) throw new Error("Invalid employee or course");

  //   const enrollment = this.enrollmentRepo.create({ employee, course });
  //   return this.enrollmentRepo.save(enrollment);
  // }
 async enroll(employeeId: number, courseId: number) {
  const employee = await this.employeeRepo.findOne({
    where: { id: employeeId },
  });

  const course = await this.courseRepo.findOne({
    where: { id: courseId },
  });

  if (!employee || !course) {
    throw new Error("Employee or Course not found");
  }

  // ✅ FIX: check both employee + course
  const existing = await this.enrollmentRepo.findOne({
    where: {
      employee: { id: employeeId },
      course: { id: courseId },
    },
  });

  if (existing) {
    throw new Error("Already enrolled");
  }

  const enrollment = this.enrollmentRepo.create({
    employee,
    course,
  });

  return this.enrollmentRepo.save(enrollment);
}

  // Employee: Submit Feedback
  async submitFeedback(dto: TrainingFeedbackDto) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id: dto.enrollmentId } });
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.feedback = dto.feedback;
    enrollment.status = EnrollmentStatus.COMPLETED;
    return this.enrollmentRepo.save(enrollment);
  }

  // Admin: Get all enrollments
  getAllEnrollments() {
    return this.enrollmentRepo.find({ relations: ["employee", "course"] });
  }

  // Employee: Get own courses
  getEmployeeCourses(employeeId: number) {
    return this.enrollmentRepo.find({ where: { employee: { id: employeeId } }, relations: ["course"] });
  }
  async getCourses() {
      return this.courseRepo.find({
        relations: ["skills"],
      });
}
// async enrollEmployee(employeeId: number, courseId: number) {
//   const employee = await this.employeeRepo.findOne({
//     where: { id: employeeId },
//   });

//   const course = await this.courseRepo.findOne({
//     where: { id: courseId },
//   });

//   if (!employee) {
//     throw new Error("Employee not found");
//   }

//   if (!course) {
//     throw new Error("Course not found");
//   }

//   // Prevent duplicate enrollment (IMPORTANT)
//   const existing = await this.enrollmentRepo.findOne({
//     where: {
//       employee: { id: employeeId },
//       course: { id: courseId },
//     },
//   });

//   if (existing) {
//     throw new Error("Employee already enrolled in this course");
//   }

//   const enrollment = this.enrollmentRepo.create({
//     employee,
//     course,
//     status: EnrollmentStatus.PENDING// default status
//   });

//   return this.enrollmentRepo.save(enrollment);
// }
async deleteCourse(id: number) {
  const enrollments = await this.enrollmentRepo.find({
    where: { course: { id } },
  });

  if (enrollments.length > 0) {
    await this.enrollmentRepo.delete({
      course: { id },
    });
  }

  return this.courseRepo.delete(id);
}
async updateStatus(id: number, status: EnrollmentStatus) {
  const enrollment = await this.enrollmentRepo.findOne({ where: { id } });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  enrollment.status = status;
  return this.enrollmentRepo.save(enrollment);
}
}