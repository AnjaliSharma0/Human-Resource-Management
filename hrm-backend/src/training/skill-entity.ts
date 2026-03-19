import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { TrainingCourse } from "./training-course.entity";

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => TrainingCourse, course => course.skills)
  courses: TrainingCourse[];
}