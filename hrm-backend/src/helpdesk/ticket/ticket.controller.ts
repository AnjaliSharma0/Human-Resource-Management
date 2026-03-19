import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('helpdesk/tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  createTicket(@Body() body: { userId: number; subject: string }) {
    return this.ticketService.create(body.userId, body.subject);
  }

  @Get('user/:id')
  getTickets(@Param('id') id: string) {
    return this.ticketService.getTicketsByUser(+id);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.ticketService.getMessages(+id);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() body: { senderId: number; content: string }) {
    return this.ticketService.addMessage(+id, body.senderId, body.content);
  }
}