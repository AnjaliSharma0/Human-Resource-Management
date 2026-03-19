import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PreJoiningDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  documentName: string;

  
  @Column()
  fileUrl: string;

  @Column({ default: false })
  isVerified: boolean;
}