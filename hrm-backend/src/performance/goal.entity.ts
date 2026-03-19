import { Employee } from "../employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Goal {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.goals)
  employee: Employee;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: "in-progress" })
  status: string;

}