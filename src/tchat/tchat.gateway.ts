import { ForbiddenException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'https';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: '*' })
export class TchatGateway {
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer()
  server: Server;

  //Recepteur des messages du front
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string) {
    const data = JSON.parse(message);
    const user = await this.usersService.findOneById(data.id);

    if (user) {
      if (data.pseudo === user.pseudo) {
        //Emission des messages reçu aux fronts connectés
        return this.server.emit('message', message);
      }
    }
    throw new ForbiddenException();
  }
}
