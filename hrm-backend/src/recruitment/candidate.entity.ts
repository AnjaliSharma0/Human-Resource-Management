import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Candidate{

@PrimaryGeneratedColumn()
id:number

@Column()
name:string

@Column()
email:string

@Column()
resumeUrl:string

@Column({default:"applied"})
status:string

}