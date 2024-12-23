import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  data: (number | null)[][];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
