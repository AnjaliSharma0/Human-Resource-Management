import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Orientation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  employeeId: number;

  @Column()
  date: Date;

  @Column()
  trainer: string;

  @Column()
  meetingLink: string;
}