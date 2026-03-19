import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  employeeId: number;

  @Column()
  department: string; // IT, HR, Admin

  @Column()
  task: string;

  @Column({ default: false })
  completed: boolean;
}