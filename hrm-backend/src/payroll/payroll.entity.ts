import { Employee } from "../employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, emp => emp.payrolls)
  employee: Employee;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column("decimal")
  basic: number;

  @Column("decimal")
  hra: number;

  @Column("decimal")
  allowances: number;

  @Column("decimal")
  deductions: number;

  @Column("decimal")
  pf: number;

  @Column("decimal")
  esi: number;

  @Column("decimal", {default:0})
  tax: number;

  @Column("decimal", { default: 0 })
  bonus: number;

  @Column("decimal", { default: 0 })
  arrears: number;

  @Column("decimal")
  net_salary: number;

  @Column({ type: "decimal", default: 0 })
gross_salary: number;

  @Column({ default: "processed" })
  status: string;
}