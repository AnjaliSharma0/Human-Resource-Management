import { Employee } from "../employee/entities/employee-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Review {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, user => user.reviews)
  employee: Employee;

 @ManyToOne(() => Employee)
  reviewer: Employee;
  
  @Column()
  rating: number;

  @Column()
  feedback: string;

   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}