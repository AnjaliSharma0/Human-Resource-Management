import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Employee } from "./employee-entity";


@Entity()
export class EmployeeDocument {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentName: string;

  @Column()
  filePath: string;

  @ManyToOne(() => Employee, employee => employee.documents)
  employee: Employee;
}