import { Employee } from "src/employee/entities/employee-entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.payrolls)
  employee: Employee;

  @Column()
  month: string;

  @Column({ type: 'float' })
  basic: number;

  @Column({ type: 'float' })
  hra: number;

  @Column({ type: 'float' })
  tax: number;

  @Column({ type: 'float' })
  deductions: number;
  
 @Column({ type: 'float' })
  netSalary: number;
}