import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("holidays")
export class Holiday {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "date" })
  date: Date;

}