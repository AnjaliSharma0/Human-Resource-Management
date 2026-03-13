
import { Employee } from 'src/employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';


@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.attendance)
  employee: Employee;

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendance: Attendance[];

  @Column({ type: "jsonb", default: [] })
  sessions: {
    clockIn: Date;
    clockOut?: Date;
  }[]; 

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float', default: 0 })
  totalHours: number;

  @Column({ type: 'float', default: 0 })
overtimeHours: number;
}
