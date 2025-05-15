import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './create-user.dto';

import { Request } from 'express';
import { minutes, Throttle } from '@nestjs/throttler';
import { LoginSanitizeDto } from './login-user.dto';

import { EncryptionService } from 'src/common/encryption.service';
import User from 'src/models/User';

import * as bcrypt from 'bcrypt'

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersServices: UsersService,
        private readonly encryptionService: EncryptionService,
    ) { }

    @Get()
    findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN' | 'DEVELOPER') {
        return []
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return { id }
    }

    @Throttle({ default: { ttl: minutes(1), limit: 10 } })
    @Post('create_user')
    createUser(@Body() user: CreateUserDto, @Req() req: Request, @Res() res: Response) {
        return this.usersServices.createOne(user, req as any, res as Response)
    }

    @HttpCode(200)
    @Throttle({ default: { ttl: minutes(1), limit: 10 } })
    @Post('login')
    async login(
        @Body() user: LoginSanitizeDto,
        @Req() req: Request
    ) {
        const encryptedEmail = this.encryptionService.encrypt(user.email)

        const response = await User.findOne({ email: encryptedEmail });

        if (!response) {
            throw new NotFoundException("Cannot find user");
        }

        const isMatch = await bcrypt.compare(user.password, response.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return {
            message: "Authorized"
        }
    }

    @Patch(':id')
    updateOne(@Param('id') id: string, @Body() userUpdate: any) {
        return { id, userUpdate }
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return { id }
    }
}