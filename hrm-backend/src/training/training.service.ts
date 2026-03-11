import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { Employee } from "src/employee/entities/employee-entity";


@Injectable()
export class TrainingService {

    constructor(
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(Enrollment) private enrollRepo: Repository<Enrollment>,
        @InjectRepository(Employee) private userRepo: Repository<Employee>
    ) { }

    createCourse(data) {
        const course = this.courseRepo.create(data);
        return this.courseRepo.save(course);
    }

    getCourses() {
        return this.courseRepo.find();
    }
    async enrollEmployee(employeeId: number, courseId: number) {

        const employee = await this.userRepo.findOne({
            where: { id: employeeId },
        });

        const course = await this.courseRepo.findOne({
            where: { id: courseId },
        });

        if (!employee) {
            throw new Error("Employee not found");
        }

        if (!course) {
            throw new Error("Course not found");
        }

        const enroll = this.enrollRepo.create({
            employee,
            course,
        });

        return this.enrollRepo.save(enroll);
    }

    getEnrollments() {
        return this.enrollRepo.find({ relations: ["employee", "course"] });
    }

}