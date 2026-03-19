import { Employee } from "../employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Expense {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.expenses)
  employee: Employee;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ default: "pending" })
  status: string;

}