import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from '../schemas/event.schema';
import { Model, PipelineStage } from 'mongoose';
import { Subject } from 'rxjs';
import { User } from '../schemas/user.schema';
import { Board } from '../schemas/board.schema';
import { Value } from '../schemas/value.schema';
import { Choice } from '../schemas/choice.schema';

const EVENT_TYPES = ['first_row', 'second_row', 'third_row', 'full_card'];

@Injectable()
export class EventService {
  events = new Subject<Event>();

  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Value.name) private valueModel: Model<Value>,
    @InjectModel(Choice.name) private choiceModel: Model<Choice>,
  ) {}

  async create(name: string, data: Record<string, any>) {
    const createdEvent = new this.eventModel({
      name,
      data: {
        ...data,
        user: data && User.value(data.user),
      },
      timestamp: Date.now(),
    });
    await createdEvent.save();

    this.events.next(createdEvent);
  }

  list() {
    return this.eventModel.find().sort({ timestamp: 'desc' }).exec();
  }

  async checkFastestUser() {
    const events = await this.eventModel
      .find()
      .sort({ timestamp: 'asc' })
      .exec();
    const excludedUsers = new Map<string, number>();
    events.forEach((event) => {
      if (
        EVENT_TYPES.includes(event.name) &&
        event.data.completed &&
        !excludedUsers.has(event.name)
      ) {
        excludedUsers.set(event.name, event.data.user.id);
      }
    });

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'id',
          as: 'user',
        },
      },
      { $match: { 'user.0': { $exists: true } } },
      { $unwind: '$user' },
      {
        $match: {
          userId: { $nin: [...excludedUsers.values()] },
        },
      },
      {
        $lookup: {
          from: 'values',
          localField: 'value',
          foreignField: 'value',
          as: 'val',
        },
      },
      { $match: { 'val.0': { $exists: true } } },
      { $unwind: '$val' },
      {
        $project: {
          user: 1,
          userId: 1,
          reactionTime: {
            $subtract: ['$timestamp', '$val.timestamp'],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          user: { $first: '$user' },
          averageTime: { $avg: '$reactionTime' },
        },
      },
      { $sort: { averageTime: 1 } },
      { $limit: 1 },
    ];

    const [result] = await this.choiceModel.aggregate(pipeline).exec();

    if (!result) return null;

    await this.create('fastest_user', {
      user: result.user,
      duration: result.averageTime,
    });
  }

  async checkOnValueCreated(value: number) {
    const values = (await this.valueModel.find().exec()).map(
      (item) => item.value,
    );
    const boards = await this.boardModel.find().exec();

    await Promise.all(
      boards.reduce<Promise<any>[]>(
        (acc, board) =>
          acc.concat(this.checkBoard(board, values, value, false)),
        [],
      ),
    );
  }

  async checkOnChoiceCreated(userId: number, value: number) {
    const values = (await this.choiceModel.find({ userId }).exec()).map(
      (item) => item.value,
    );
    const board = await this.boardModel.findOne({ userId }).exec();

    await Promise.all(this.checkBoard(board, values, value, true));
  }

  checkBoard(
    board: Board,
    values: number[],
    value: number,
    completed: boolean,
  ) {
    return [
      ...board.data.map(async (row, i) => {
        if (
          row.includes(value) &&
          row.every((item) => !item || values.includes(item))
        ) {
          const user = await this.userModel
            .findOne({ id: board.userId })
            .exec();
          await this.create(['first_row', 'second_row', 'third_row'][i], {
            user,
            completed,
          });
        }
      }),
      (async () => {
        if (
          board.data.every(
            (row) =>
              row.includes(value) &&
              row.every((item) => !item || values.includes(item)),
          )
        ) {
          const user = await this.userModel
            .findOne({ id: board.userId })
            .exec();
          await this.create('full_card', {
            user,
            completed,
          });
        }
      })(),
    ];
  }
}
