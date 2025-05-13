import { BadRequestException, Injectable } from '@nestjs/common';

interface UserTemplate {
    firstName: string,
    middleName?: string,
    lastName: string,
    username: string,
    password: string,
    dob: {
        day: number,
        month: string,
        year: number
    }
}

@Injectable()
export class UsersService {
    createOne(user: UserTemplate) {
        if (!user) {
            throw new BadRequestException('Missing required user fields')
        }
    }
}