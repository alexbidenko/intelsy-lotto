import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { BoardService } from './board.service';
import { Setting, SettingSchema } from '../schemas/setting.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Board, BoardSchema } from '../schemas/board.schema';
import { Value, ValueSchema } from '../schemas/value.schema';
import { Choice, ChoiceSchema } from '../schemas/choice.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Event, EventSchema } from '../schemas/event.schema';
import { EventService } from './event.service';
import { MemberService } from './member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema },
      { name: Board.name, schema: BoardSchema },
      { name: Value.name, schema: ValueSchema },
      { name: Choice.name, schema: ChoiceSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    AuthModule,
  ],
  providers: [
    GameService,
    GameGateway,
    BoardService,
    EventService,
    MemberService,
  ],
  controllers: [GameController],
  exports: [GameService, EventService, MemberService],
})
export class GameModule {}
