import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { EmergencyContact } from "./employement-contact.entity";
import { EmployeeDocument } from "./document-entity";

import { User } from "src/dto/users/user-entity.dto";
import { Designation } from "./desigation-entity";
import { Department } from "./department-entity";
import { EmployeeHistory } from "./employement-history.entity";

@Entity()
export class Employee {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  joiningDate: Date;

  @Column({ default: "active" })
  status: string;

  @ManyToOne(() => Department)
  department: Department;

  @ManyToOne(() => Designation)
  designation: Designation;

   @ManyToOne(() => Employee, emp => emp.subordinates, { nullable: true })
  @JoinColumn({ name: "managerId" })
  manager: Employee;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => EmergencyContact, contact => contact.employee)
  emergencyContacts: EmergencyContact[];

  @OneToMany(() => EmployeeDocument, doc => doc.employee)
  documents: EmployeeDocument[];

  @OneToMany(() => EmployeeHistory, history => history.employee)
  history: EmployeeHistory[];

  @OneToMany(() => Employee, emp => emp.manager)
subordinates: Employee[];

}