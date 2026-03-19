import { Employee } from '../../employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { LeaveType } from './leave-type';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';


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

  @Column()
 accrued: number;

  @Column({ default: 0 })
  used: number;
  
  @Column()
  remainingDays: number;

}