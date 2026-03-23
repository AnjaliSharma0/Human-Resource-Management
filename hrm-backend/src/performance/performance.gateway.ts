import {
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class PerformanceGateway {
  @WebSocketServer()
  server: Server;

  emitUpdate() {
    this.server.emit("performanceUpdated");
  }
}