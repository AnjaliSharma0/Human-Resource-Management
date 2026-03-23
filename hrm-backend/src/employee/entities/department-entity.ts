import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Employee } from "./employee-entity";
import { BusinessUnit } from "src/org-structure/buisness-unit.entity";
import { Location } from "src/org-structure/location.entity";

@Entity()
export class Department {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({nullable:true})
  description:string

    // Link to a Location entity
  @ManyToOne(() => Location, loc => loc.departments, { nullable: true })
  mappedLocation: Location;

  // Link to a Business Unit
  @ManyToOne(() => BusinessUnit, unit => unit.departments, { nullable: true })
  businessUnit: BusinessUnit;

  // Employees in this department
  @OneToMany(() => Employee, emp => emp.department)
  employees: Employee[];
}