import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-entity";

@Entity()
export class EmployeeHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  designation: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Employee, employee => employee.history, { onDelete: "CASCADE" })
  employee: Employee;
}