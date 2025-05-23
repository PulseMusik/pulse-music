import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OauthModule } from './users/oauth/oauth.module';

import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { ArtistsController } from './artists/artists.controller';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: minutes(1),
          limit: 10
        },
      ],
      errorMessage: 'Too many requests'
    }),
    ChatModule
  ],
  controllers: [AppController, ArtistsController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})

export class AppModule { }
