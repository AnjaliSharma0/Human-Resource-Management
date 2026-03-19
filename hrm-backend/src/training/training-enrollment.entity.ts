import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";

import { TrainingCourse } from "./training-course.entity";
import { Employee } from "src/employee/entities/employee-entity";

@Entity()
export class TrainingEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, employee => employee.enrollments)
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => TrainingCourse, course => course.enrollments)
  @JoinColumn()
  course: TrainingCourse;

  @Column({ default: "pending" })
  status: "pending" | "in-progress" | "completed";

  @Column({ type: "text", nullable: true })
  feedback: string | null;
}