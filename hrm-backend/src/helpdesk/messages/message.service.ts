
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './mesages.entity';
import { Ticket } from '../ticket/ticket.entity';
import { User } from 'src/dto/users/user-entity.dto';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
  ) {}

  // Get all messages for a ticket
  async getMessagesByTicket(ticketId: number) {
    return this.messageRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }

  // Add a message to a ticket
  async addMessage(ticketId: number, senderId: number, content: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new Error('Ticket not found');

    const message = this.messageRepo.create({
      ticket: ticket,
      sender: { id: senderId } as User,
      content,
    });

    return this.messageRepo.save(message);
  }
}