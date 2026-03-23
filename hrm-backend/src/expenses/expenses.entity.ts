import { Employee } from "../employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

export enum ExpenseStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (user) => user.expenses)
  employee: Employee;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ default: ExpenseStatus.PENDING })
  status: string;
}