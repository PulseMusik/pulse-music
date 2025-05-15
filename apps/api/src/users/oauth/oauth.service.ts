import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthService {
    async login(user: any) {
        return user;
    }
}
