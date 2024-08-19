import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StatusGateway {
  @WebSocketServer()
  server: Server;

  sendStatusUpdate(userId: string, status: string) {
    this.server.emit('statusChange', { userId, status });
  }
}
