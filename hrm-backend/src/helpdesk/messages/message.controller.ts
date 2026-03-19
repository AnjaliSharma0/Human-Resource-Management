
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('helpdesk/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // Get all messages for a ticket
  @Get(':ticketId')
  async getMessages(@Param('ticketId') ticketId: string) {
    return this.messageService.getMessagesByTicket(+ticketId);
  }

  // Add a new message
  @Post(':ticketId')
  async addMessage(
    @Param('ticketId') ticketId: string,
    @Body() body: { senderId: number; content: string },
  ) {
    const { senderId, content } = body;
    return this.messageService.addMessage(+ticketId, senderId, content);
  }
}