import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TicketService } from './ticket/ticket.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private ticketService: TicketService) {}

  // Listen to 'sendMessage' event
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: { ticketId: number; senderId: number; content: string }) {
    // Save message to database
    const msg = await this.ticketService.addMessage(payload.ticketId, payload.senderId, payload.content);

    // Emit message to all connected clients
    this.server.emit('receiveMessage', { ...msg, ticketId: payload.ticketId });
  }
}