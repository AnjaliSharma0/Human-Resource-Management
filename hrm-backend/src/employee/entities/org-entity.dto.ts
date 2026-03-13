// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Employee } from "./employee-entity";

// @Entity()
// export class Organization {

//  @PrimaryGeneratedColumn()
//  id: number;

//  @Column()
//  name: string;

//  @Column()
//  email: string;

//  @Column()
//  phone: string;

//  @Column()
//  website: string;

//  @Column()
//  industry: string;

//  @Column()
//  companySize: string;

//  @Column()
//  foundedYear: number;

//  @Column()
//  address: string;

//  @Column()
//  city: string;

//  @Column()
//  state: string;

//  @Column()
//  country: string;

//  @Column()
//  zipCode: string;

//  @Column({ default: "Asia/Kolkata" })
//  timezone: string;

//  @Column({ default: "INR" })
//  currency: string;

//  @OneToMany(() => Employee, employee => employee.organization)
//  employees: Employee[];

// }