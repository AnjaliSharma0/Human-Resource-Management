import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { EmergencyContact } from "./employement-contact.entity";
import { EmployeeDocument } from "./document-entity";

import { User } from "src/dto/users/user-entity.dto";
import { Designation } from "./desigation-entity";
import { Department } from "./department-entity";
import { EmployeeHistory } from "./employement-history.entity";
import { Attendance } from "../../attendance/attendance.entity";
import { Leave } from "src/leave/leave.entity";
import { Payroll } from "src/payroll/payroll.entity";
import { Goal } from "src/performance/goal.entity";
import { Review } from "src/performance/review.entity";
import { Enrollment } from "src/training/enrollment.entity";
import { Expense } from "src/expenses/expenses.entity";
import { OnboardingTask } from "src/onbording/onboarding.entity";

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


  // @Column({ nullable: true })
  // password: string;

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

  @Column({ default: "Pending" })
  status: string;

 @Column({ type: "varchar", nullable: true })
activationToken: string | null;

@Column({ type: "timestamp", nullable: true })
activationExpires: Date | null;

  @ManyToOne(() => Department)
  department: Department ;

  @ManyToOne(() => Designation)
  designation: Designation;


  @ManyToOne(() => Employee, emp => emp.subordinates, { nullable: true })
  @JoinColumn({ name: "managerId" })
  manager: Employee;

  @OneToOne(()=> User)
  @JoinColumn()
  user:User

  @OneToMany(() => EmergencyContact, contact => contact.employee)
  emergencyContacts: EmergencyContact[];

  @OneToMany(() => EmployeeDocument, doc => doc.employee)
  documents: EmployeeDocument[];

  @OneToMany(() => EmployeeHistory, history => history.employee)
  history: EmployeeHistory[];

  @OneToMany(() => Employee, emp => emp.manager)
  subordinates: Employee[];

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendance: Attendance[];

  @OneToMany(() => Leave, leave => leave.employee)
  leaves: Leave[];

  @OneToMany(() => Payroll, payroll => payroll.employee)
  payrolls: Payroll[];

  @OneToMany(() => Goal, goal => goal.employee)
  goals: Goal[];

  @OneToMany(() => Review, review => review.employee)
  reviews: Review[];

  @OneToMany(() => Enrollment, enrollment => enrollment.employee)
  enrollments: Enrollment[];

  @OneToMany(() => Expense, expense => expense.employee)
  expenses: Expense[];

  @OneToMany(() => OnboardingTask, task => task.employee)
  tasks: OnboardingTask[];
//   @ManyToOne(() => Organization, org => org.employees)
// organization: Organization;
}