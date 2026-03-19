import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FinalSettlement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column("float")
  salaryDue: number;

  @Column("float")
  deductions: number;

  @Column("float")
  finalAmount: number;
}