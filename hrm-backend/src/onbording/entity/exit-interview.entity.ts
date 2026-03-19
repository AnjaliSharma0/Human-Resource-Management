import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExitInterview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column("text")
  feedback: string;

  @Column()
  rating: number;
}