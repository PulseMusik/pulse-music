import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy],
})
export class OauthModule { }