import { Employee } from "../employee/entities/employee-entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Course } from "./course.entity"

@Entity()
export class Enrollment{

@PrimaryGeneratedColumn()
id:number

@ManyToOne(()=>Employee,user=>user.enrollments)
employee:Employee

@ManyToOne(()=>Course)
course:Course

@Column({default:false})
completed:boolean

}