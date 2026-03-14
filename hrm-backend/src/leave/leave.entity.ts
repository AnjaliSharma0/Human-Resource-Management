import { Employee } from 'src/employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { LeaveType } from './holiday/leave-type';


@Entity("leaves")
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.leaves)
  employee: Employee;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  reason: string;
  
  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => LeaveType)
  leaveType: LeaveType;


@Column({
  type: "enum",
  enum: ["full", "first_half", "second_half"],
  default: "full"
})
duration: "full" | "first_half" | "second_half";
}