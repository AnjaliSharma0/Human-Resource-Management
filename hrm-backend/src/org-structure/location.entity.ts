import { Department } from "src/employee/entities/department-entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";


@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  // Add this line to link back to departments
   @OneToMany(() => Department, dept => dept.mappedLocation)
  departments: Department[];
}