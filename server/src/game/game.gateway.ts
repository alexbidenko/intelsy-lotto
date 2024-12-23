import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { fastifyCookie } from '@fastify/cookie';

@WebSocketGateway({ namespace: '/user' })
export class GameGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly gameService: GameService,
  ) {}

  onModuleInit() {
    this.gameService.gameState.subscribe((value) => {
      this.server.emit('state', { value });
    });

    this.gameService.values.subscribe((value) => {
      this.server.emit('value', { value });
    });

    this.gameService.fastestUser.subscribe((value) => {
      this.server.emit('faster_user', { value });
    });
  }

  async handleConnection(socket: Socket) {
    const token = fastifyCookie.parse(
      socket.client.request.headers.cookie,
    ).auth_token;
    const user = await this.userModel.findOne({ accessToken: token }).exec();
    if (!user) {
      socket.disconnect(true);
      return;
    }

    this.gameService.memberSubject.next({
      event: 'connected',
      user,
    });
  }

  async handleDisconnect(socket: Socket) {
    const token = fastifyCookie.parse(
      socket.client.request.headers.cookie,
    ).auth_token;
    const user = await this.userModel.findOne({ accessToken: token }).exec();
    if (!user) {
      socket.disconnect(true);
      return;
    }

    this.gameService.memberSubject.next({
      event: 'disconnected',
      user,
    });
  }
}
