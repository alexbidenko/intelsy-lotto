import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : ['.env.development', '.env.development.local'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://root:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}`,
        dbName: 'game',
      }),
    }),
    AdminModule,
    GameModule,
  ],
})
export class AppModule {}
