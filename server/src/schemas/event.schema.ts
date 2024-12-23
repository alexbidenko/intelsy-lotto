import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as ISchema } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: ISchema.Types.Mixed })
  data: object;

  @Prop({ required: true })
  timestamp: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
