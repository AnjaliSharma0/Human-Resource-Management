import { Department } from "src/employee/entities/department-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BusinessUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Department, dept => dept.businessUnit)
  departments: Department[];
}