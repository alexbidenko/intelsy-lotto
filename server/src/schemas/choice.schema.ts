import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChoiceDocument = HydratedDocument<Choice>;

@Schema()
export class Choice {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  timestamp: number;
}

export const ChoiceSchema = SchemaFactory.createForClass(Choice);
