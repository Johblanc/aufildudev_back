import { ForbiddenException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(8001, { cors: '*' })
export class TchatGateway {
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer()
  server: any;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    const data = JSON.parse(message);
    console.log(message);
    const user = await this.usersService.findOneById(data.id);

    if (user) {
      if (data.pseudo === user.pseudo) {
        return this.server.emit('message', message);
      }
    }
    throw new ForbiddenException();
  }
}
