import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NoDues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  department: string;

  @Column({ default: false })
  cleared: boolean;
}