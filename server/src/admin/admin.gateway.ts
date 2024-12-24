import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AdminService } from './admin.service';
import { OnModuleInit } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { EventService } from '../game/event.service';
import { MemberService } from '../game/member.service';

@WebSocketGateway({ namespace: '/admin' })
export class AdminGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly adminService: AdminService,
    private readonly gameService: GameService,
    private readonly eventService: EventService,
    private readonly memberService: MemberService,
  ) {}

  onModuleInit() {
    this.memberService.memberSubject.subscribe((value) => {
      this.server.emit('member', { value });
    });

    this.eventService.events.subscribe((value) => {
      this.server.emit('events', { value });
    });
  }

  @SubscribeMessage('state')
  async updateState(@MessageBody() data: { value: string }) {
    await this.adminService.updateState(data.value);
  }

  @SubscribeMessage('value')
  async createValue(@MessageBody() data: { value: number }) {
    await this.gameService.createValue(data.value);
  }
}
