import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Employee } from "../employee/entities/employee-entity";

@Entity()
export class Attendance {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, employee => employee.attendance, { eager: true })
  employee: Employee;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "jsonb", default: [] })
  sessions: {
    clockIn: Date;
    clockOut?: Date;
  }[];

  @Column({ type: "float", default: 0 })
  totalHours: number;

  @Column({ type: "float", default: 0 })
  overtimeHours: number;

}