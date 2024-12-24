import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as ISchema } from 'mongoose';
import { User } from './user.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: ISchema.Types.Mixed })
  data: { user: User } & Record<string, any>;

  @Prop({ required: true })
  timestamp: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
