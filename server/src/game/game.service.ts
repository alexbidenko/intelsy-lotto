import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Setting } from '../schemas/setting.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from '../schemas/board.schema';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Value } from '../schemas/value.schema';
import { Choice } from '../schemas/choice.schema';
import { PartialUser, User } from '../schemas/user.schema';
import { EventService } from './event.service';

@Injectable()
export class GameService implements OnModuleInit {
  gameState = new BehaviorSubject<string>('finished');

  values = new ReplaySubject<number>();

  fastestUser = new Subject<PartialUser>();

  memberSubject = new Subject<{
    event: 'connected' | 'disconnected';
    user: User;
  }>();

  members = new Map<number, User>();

  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Value.name) private valueModel: Model<Value>,
    @InjectModel(Choice.name) private choiceModel: Model<Choice>,
    private readonly boardService: BoardService,
    private readonly eventService: EventService,
  ) {}

  async onModuleInit() {
    const state = await this.settingModel
      .findOneAndUpdate(
        { key: 'game_state' },
        { $setOnInsert: { key: 'game_state', value: 'finished' } },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
    this.gameState.next(state.value);

    this.memberSubject.subscribe((value) => {
      if (value.event === 'disconnected') this.members.delete(value.user.id);
      else this.members.set(value.user.id, value.user);
    });

    this.gameState.subscribe((value) => {
      if (value === 'results') this.eventService.checkFastestUser();
    });
  }

  getState() {
    return this.settingModel.findOne({ key: 'game_state' }).exec();
  }

  getValues() {
    return this.valueModel.find().sort('timestamp').exec();
  }

  async createValue(value: number) {
    const createdValue = new this.valueModel({ value, timestamp: Date.now() });
    await createdValue.save();

    this.values.next(value);

    await this.eventService.checkOnValueCreated(value);
  }

  async createChoice(userId: number, value: number) {
    const allowed = await this.valueModel.findOne({ value }).exec();
    if (!allowed) throw new BadRequestException();

    const existed = await this.choiceModel.findOne({ value }).exec();
    if (!existed) {
      const user = await this.userModel.findOne({ id: userId }).exec();
      if (!user) throw new InternalServerErrorException();

      this.fastestUser.next(User.value(user));

      await this.eventService.create('faster_user', {
        user,
        value,
        duration: Date.now() - allowed.timestamp,
      });
    }

    const choice = await this.choiceModel
      .findOneAndUpdate(
        { userId, value },
        { $setOnInsert: { userId, value, timestamp: Date.now() } },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();

    await this.eventService.checkOnChoiceCreated(userId, value);

    return choice;
  }

  async updateState(value: string) {
    const result = await this.settingModel
      .findOneAndUpdate(
        { key: 'game_state' },
        { value },
        { returnOriginal: false },
      )
      .exec();

    this.gameState.next(result.value);

    return result;
  }

  async getBoard(userId: number) {
    const state = await this.settingModel.findOne({ key: 'game_state' }).exec();
    if (state.value === 'finished') throw new ForbiddenException();

    let board = await this.boardModel.findOne({ userId }).exec();

    if (!board) {
      const data = this.boardService.generate();
      board = new this.boardModel({ userId, data });
      await board.save();
    }

    return board.data;
  }

  getChoices(userId: number) {
    return this.choiceModel.find({ userId }).exec();
  }
}
