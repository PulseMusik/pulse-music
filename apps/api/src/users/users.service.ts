import { BadRequestException, HttpCode, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

import PulseAccount, { DefaultPulseAccount } from '../models/User';

import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PROFILE_PICTURE_URL } from 'src/constants';
import { EncryptionService } from 'src/common/encryption.service';
import { TokensService } from './tokens/tokens.service';
import User from '../models/User';

@Injectable()
export class UsersService {
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokenService: TokensService,
    ) { }

    async createOne(user: CreateUserDto, req: any, res: any) {
        if (!user) {
            throw new BadRequestException('Missing required user fields')
        }

        if (!user.password) {
            throw new BadRequestException('No password provided')
        }

        if (req.ip) { } // Handle ip metadata
        const ip = req.ip
        const userAgent = req.headers['user-agent'] || 'unknown';

        let hashedPassword;
        let userId;

        try {
            const saltRounds = 10;
            const password = await bcrypt.hash(user.password, saltRounds)
            const id = uuidv4()

            hashedPassword = password;
            userId = id;

        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException('Something went wrong!')
        }

        const dob = {
            month: user.dob.month,
            year: user.dob.year,
            day: user.dob.day
        }

        const picture = PROFILE_PICTURE_URL;

        let email = user.email

        if (email) {
            email = this.encryptionService.encrypt(email)
        } // Call welcome or verification email

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        const newUser = new PulseAccount({
            pulseId: userId,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            gender: user.gender,
            dob,
            email,
            emailVerified: false,
            pictures: {
                current: { url: picture, uploadedAt: Date.now() },
                history: []
            },
            password: hashedPassword,
            language: 'en',
            loginMetadata: {
                loginCount: 0,
                lastLoginIP: ip,
                lastLogin: Date.now()
            },
            role: 'user',
            userDeleted: false,
            metadata: {
                ip: ip
            },
        })

        try {
            await newUser.save();
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            throw new InternalServerErrorException('Failed to save user');
        }

        try {
            const response = await this.tokenService.generateToken(userId, res, userAgent, ip)
            return {
                data: response
            }
        } catch (e) {
            throw new InternalServerErrorException('Something went wrong')
        }
    }
}