import { Employee } from '../employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { LeaveType } from './holiday/leave-type';

@Entity("leaves")
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, employee => employee.leaves, { eager: true })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @ManyToOne(() => LeaveType, { eager: true })
  leaveType: LeaveType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({
    type: 'enum',
    enum: ['full', 'first_half', 'second_half'],
    default: 'full',
  })
  duration: 'full' | 'first_half' | 'second_half';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}