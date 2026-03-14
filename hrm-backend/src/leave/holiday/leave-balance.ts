import { Employee } from 'src/employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { LeaveType } from './leave-type';


@Entity('leave_balance')
export class LeaveBalance {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee
)
  employee: Employee;

  @ManyToOne(() => LeaveType)
  leaveType: LeaveType;

   @Column()
  year: number;

  @Column({ default: 0 })
  accrued: number;

  @Column({ default: 0 })
  used: number;
  
  @Column()
  remainingDays: number;

}