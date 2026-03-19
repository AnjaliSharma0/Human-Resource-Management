// ticket.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Message } from '../messages/mesages.entity';


@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  create(userId: number, subject: string) {
    const ticket = this.ticketRepo.create({ user: { id: userId }, subject });
    return this.ticketRepo.save(ticket);
  }

  async getTicketsByUser(userId: number) {
    return this.ticketRepo.find({ where: { user: { id: userId } } });
  }

  async getMessages(ticketId: number) {
    return this.messageRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }

  async addMessage(ticketId: number, senderId: number, content: string) {
    const message = this.messageRepo.create({
      ticket: { id: ticketId },
      sender: { id: senderId },
      content,
    });
    return this.messageRepo.save(message);
  }
}

