import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { TrainingEnrollment } from "./training-enrollment.entity";
import { Skill } from "./skill-entity";


export enum EnrollmentStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
} 


@Entity()
export class TrainingCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({ default: false })
  isSelfPaced: boolean;

  @OneToMany(() => TrainingEnrollment, enrollment => enrollment.course)
  enrollments: TrainingEnrollment[];

  @ManyToMany(() => Skill, skill => skill.courses, { cascade: true })
  @JoinTable()
  skills: Skill[];

  @Column({
    type: "enum",
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status: EnrollmentStatus;
}