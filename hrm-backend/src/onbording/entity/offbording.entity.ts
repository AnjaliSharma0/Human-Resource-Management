import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Offboarding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  lastWorkingDay: Date;

  @Column({ default: "initiated" })
  status: string; // initiated, in_progress, completed
}