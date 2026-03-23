import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable
} from "typeorm";
import { EmergencyContact } from "./employement-contact.entity";
import { EmployeeDocument } from "./document-entity";

import { User } from "../../dto/users/user-entity.dto";
import { Designation } from "./desigation-entity";
import { Department } from "./department-entity";
import { EmployeeHistory } from "./employement-history.entity";
import { Attendance } from "../../attendance/attendance.entity";
import { Leave } from "../../leave/leave.entity";
import { Payroll } from "../../payroll/payroll.entity";
import { Goal } from "../../performance/goal.entity";
import { Review } from "../../performance/review.entity";
import { Expense } from "../../expenses/expenses.entity";
// import { OnboardingTask } from "../../onbording/entity/onboarding.entity";
import { SalaryGrade } from "src/payroll/salaryGrade/salary-grade.entity";
import { TrainingEnrollment } from "src/training/training-enrollment.entity";
import { Skill } from "src/training/skill-entity";


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


   @ManyToOne(() => SalaryGrade, { eager: true  })
  salaryGrade: SalaryGrade;

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

  @OneToMany(() => TrainingEnrollment, enrollment => enrollment.employee)
  enrollments: TrainingEnrollment[];

  @OneToMany(() => Expense, expense => expense.employee)
  expenses: Expense[];

  // @OneToMany(() => OnboardingTask, task => task.employee)
  // tasks: OnboardingTask[];
//   @ManyToOne(() => Organization, org => org.employees)
// organization: Organization;

  @ManyToMany(() => Skill, { cascade: true })
  @JoinTable() // only put @JoinTable() on one side
  skills: Skill[];

  
 @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankIFSC: string;

  @Column({ nullable: true })
  panNumber: string;
   
}