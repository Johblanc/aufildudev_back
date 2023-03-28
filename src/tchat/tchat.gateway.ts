import { ForbiddenException } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'https';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: '*' })
export class TchatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string) {
    const data = JSON.parse(message);
    const user = await this.usersService.findOneById(data.id);

    if (user) {
      if (data.pseudo === user.pseudo) {
        return this.server.emit('message', message);
      }
    }
    throw new ForbiddenException();
  }
}
