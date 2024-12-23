import { Module } from '@nestjs/common';
import { BitrixService } from './bitrix.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [BitrixService],
  exports: [BitrixService],
})
export class BitrixModule {}
