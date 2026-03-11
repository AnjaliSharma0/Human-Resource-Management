
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./user.role";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column({unique: true})
    email:string

    @Column({nullable:true})
    password:string

    // @Column({default:"employee"})
    // role:string
    @Column({
    type: "enum",
    enum: Role,
    default: Role.EMPLOYEE
    })
    role: Role;
}