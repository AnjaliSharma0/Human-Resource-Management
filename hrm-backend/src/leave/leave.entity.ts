import { Employee } from 'src/employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';


@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() =>Employee , user => user.leaves)
  employee: Employee;

  @Column()
  type: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';
}