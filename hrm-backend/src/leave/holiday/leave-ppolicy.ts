import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeaveType } from "./leave-type";

@Entity('leave_policies')
export class LeavePolicy {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @ManyToOne(() => LeaveType)
  leaveType: LeaveType;

  @Column()
  allowedDays: number;
}