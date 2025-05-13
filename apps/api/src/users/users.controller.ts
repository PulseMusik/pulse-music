import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersServices: UsersService) { }

    @Get()
    findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN' | 'DEVELOPER') {
        return []
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return { id }
    }

    @Post('create_user')
    createUser(@Body() user: any) {
        return user
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