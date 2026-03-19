
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { User } from 'src/dto/users/user-entity.dto';


@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, ticket => ticket.id, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @ManyToOne(() => User)
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}