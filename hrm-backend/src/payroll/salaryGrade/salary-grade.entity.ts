
import { Employee } from "src/employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";


@Entity()
export class SalaryGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grade_name: string;

  @Column("decimal")
  basic: number;

  @Column("decimal")
  hra: number;

  @Column("decimal", { default: 0 })
  allowances: number;

  @Column("decimal", { default: 0 })
  deductions: number;

  @Column("decimal", { default: 12 })
  pf_rate: number;

  @Column("decimal", { default: 1.75 })
  esi_rate: number;

  @OneToMany(() => Employee, emp => emp.salaryGrade)
  employees: Employee[];
}