import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { AdminGateway } from './admin.gateway';
import { Board, BoardSchema } from '../schemas/board.schema';
import { Value, ValueSchema } from '../schemas/value.schema';
import { Choice, ChoiceSchema } from '../schemas/choice.schema';
import { AdminController } from './admin.controller';
import { Event, EventSchema } from '../schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Value.name, schema: ValueSchema },
      { name: Choice.name, schema: ChoiceSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    AuthModule,
    GameModule,
  ],
  providers: [AdminService, AdminGateway],
  controllers: [AdminController],
})
export class AdminModule {}
