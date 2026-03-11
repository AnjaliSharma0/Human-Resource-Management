import { Employee } from "src/employee/entities/employee-entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class OnboardingTask{

@PrimaryGeneratedColumn()
id:number

@ManyToOne(()=>Employee,user=>user.tasks)
employee:Employee

@Column()
taskName:string

@Column({default:false})
completed:boolean

}