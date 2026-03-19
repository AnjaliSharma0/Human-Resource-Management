import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PayrollRun {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: string;

  @Column()
  year: number;

  @Column({ default: "draft" })
  status: string;

}