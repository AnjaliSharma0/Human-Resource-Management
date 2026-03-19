import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('leave_types')
export class LeaveType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  daysPerYear: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}