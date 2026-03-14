import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('leave_types')
export class LeaveType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  daysPerYear: number;

}