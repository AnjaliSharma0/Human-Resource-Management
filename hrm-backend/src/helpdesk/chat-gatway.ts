// import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { TicketService } from './ticket/ticket.service';

// @WebSocketGateway({ cors: true })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private ticketService: TicketService) {}

//   // Listen to 'sendMessage' event
//   @SubscribeMessage('sendMessage')
//   async handleMessage(@MessageBody() payload: { ticketId: number; senderId: number; content: string }) {
//     // Save message to database
//     const msg = await this.ticketService.addMessage(payload.ticketId, payload.senderId, payload.content);

//     // Emit message to all connected clients
//     this.server.emit('receiveMessage', { ...msg, ticketId: payload.ticketId });
//   }
// }

import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TicketService } from './ticket/ticket.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private ticketService: TicketService) {}

  // ✅ Join specific ticket room
  @SubscribeMessage('joinTicket')
  handleJoin(
    @MessageBody() ticketId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ticket_${ticketId}`);
  }

  // ✅ Send message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: { ticketId: number; senderId: number; content: string },
  ) {
    // 1. Save message
    await this.ticketService.addMessage(
      payload.ticketId,
      payload.senderId,
      payload.content,
    );

    // 2. Fetch latest message with sender name
    const messages = await this.ticketService.getMessages(payload.ticketId);
    const latestMessage = messages[messages.length - 1];

    // 3. Emit ONLY to that ticket room
    this.server
      .to(`ticket_${payload.ticketId}`)
      .emit('receiveMessage', latestMessage);
  }
}