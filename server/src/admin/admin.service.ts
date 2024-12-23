import { Injectable, NotFoundException } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from '../schemas/board.schema';
import { Model } from 'mongoose';
import { Value } from '../schemas/value.schema';
import { Choice } from '../schemas/choice.schema';
import { Event } from '../schemas/event.schema';
import { EventService } from '../game/event.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Value.name) private valueModel: Model<Value>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Choice.name) private choiceModel: Model<Choice>,
    private readonly gameService: GameService,
    private readonly eventService: EventService,
  ) {}

  async updateState(value: string) {
    if (value === 'finished') {
      await Promise.all([
        this.boardModel.deleteMany(),
        this.valueModel.deleteMany(),
        this.choiceModel.deleteMany(),
        this.eventModel.deleteMany(),
      ]);
    }

    return this.gameService.updateState(value);
  }

  getMembers() {
    return User.value([...this.gameService.members.values()]);
  }

  async getUserBoard(userId: number) {
    const [board, choices] = await Promise.all([
      this.boardModel.findOne({ userId }).exec(),
      this.choiceModel.find({ userId }).exec(),
    ]);

    if (!board) throw new NotFoundException();

    return {
      board: board.data,
      choices: choices.map((item) => item.value),
    };
  }

  events() {
    return this.eventService.list();
  }
}
