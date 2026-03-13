
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./user.role";
// import { Organization } from "src/employee/entities/org-entity.dto";

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

    
//  @ManyToOne(()=>Organization,(org)=>org.users)
//  organization:Organization;
}