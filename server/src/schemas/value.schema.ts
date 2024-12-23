import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ValueDocument = HydratedDocument<Value>;

@Schema()
export class Value {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  timestamp: number;
}

export const ValueSchema = SchemaFactory.createForClass(Value);
