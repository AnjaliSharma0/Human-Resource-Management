import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-entity";

@Entity()
export class EmergencyContact {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  relationship: string;

  @Column()
  phone: string;

  @ManyToOne(() => Employee, employee => employee.emergencyContacts)
  employee: Employee;
}