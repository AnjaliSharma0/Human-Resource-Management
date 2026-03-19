import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket/ticket.entity';
import { Message } from './messages/mesages.entity';
import { FAQ } from './faq/faq.entity';
import { TicketService } from './ticket/ticket.service';
import { FaqService } from './faq/faq.service';
import { ChatGateway } from './chat-gatway';
import { TicketController } from './ticket/ticket.controller';
import { FaqController } from './faq/faq.cotroller';
import { MessageService } from './messages/message.service';
import { MessageController } from './messages/message.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Message, FAQ])],
  providers: [TicketService, MessageService, FaqService, ChatGateway],
  controllers: [TicketController, MessageController, FaqController],
})
export class HelpdeskModule {}