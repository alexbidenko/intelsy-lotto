import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  @Expose()
  id: number;

  @Prop({ required: true })
  @Expose()
  firstName: string;

  @Prop({ required: true })
  @Expose()
  lastName: string;

  @Prop({ required: true })
  @Expose()
  email: string;

  @Prop({ required: true })
  @Expose()
  avatar: string;

  @Prop({ required: true })
  @Exclude()
  accessToken: string;

  @Prop({ required: true })
  @Exclude()
  refreshToken: string;

  static value(data: User | User[]) {
    return plainToInstance(PartialUser, data, {
      excludeExtraneousValues: true,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export class PartialUser extends OmitType(User, [
  'accessToken',
  'refreshToken',
]) {}
