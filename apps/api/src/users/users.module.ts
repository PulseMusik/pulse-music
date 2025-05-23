import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OauthModule } from './oauth/oauth.module';
import { EncryptionService } from 'src/common/encryption.service';
import { TokensService } from './tokens/tokens.service';
import { GoogleStrategy } from './oauth/strategies/google.strategy';
import { StrategiesService } from './strategies/strategies.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, EncryptionService, TokensService, GoogleStrategy, StrategiesService],
    imports: [OauthModule]
})
export class UsersModule { }
