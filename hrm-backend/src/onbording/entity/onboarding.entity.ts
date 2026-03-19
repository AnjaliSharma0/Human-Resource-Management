import { User } from "src/dto/users/user-entity.dto";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Onboarding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  employee: User;

  @Column({ default: "pending" })
  status: string; // pending, in_progress, completed

  @Column({ nullable: true })
  joiningDate: Date;
}