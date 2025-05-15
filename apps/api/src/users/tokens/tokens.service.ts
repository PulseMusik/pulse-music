import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import Session from 'src/models/Session';

import * as jwt from 'jsonwebtoken'

import User from 'src/models/User';

@Injectable()
export class TokensService {
    async generateToken(userId: string, response: any, userAgent: any, ip?: string) {
        if (!userAgent || !userId || !response) {
            throw new InternalServerErrorException('Something went wrong, please try again later.')
        }

        const sessionId = uuidv4();

        const refreshToken = uuidv4() + uuidv4();

        const sanitizedUserAgent = userAgent.substring(0, 255);
        const sanitizedIp = ip?.substring(0, 45) || '';

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const accessTokenExpiresIn = '15m';

        const session = new Session({
            userId,
            sessionId,
            refreshTokenHash,
            createdAt: Date.now(),
            expiresAt: refreshTokenExpiresAt,
            ip: sanitizedIp,
            userAgent: sanitizedUserAgent,
            isActive: true
        });

        try { await session.save(); } catch (e) { throw new InternalServerErrorException(); }

        const JWT_TOKEN = process.env.JWT_TOKEN as string;
        if (!JWT_TOKEN) {
            try {
                await Session.deleteOne({ sessionId });
                console.error('Session deleted due to missing JWT secret');
            } catch (e) {
                console.error("Couldn't delete DB entry", e);
            }
            throw new InternalServerErrorException('Missing JWT secret');
        }

        let accessToken: string;
        try {
            accessToken = jwt.sign({ userId, sessionId }, JWT_TOKEN, { expiresIn: accessTokenExpiresIn });
        } catch (e) {
            try {
                await Session.deleteOne({ sessionId });
                console.error('Session deleted due to JWT signing failure');
            } catch (delError) {
                console.error("Couldn't delete DB entry after JWT error", delError);
            }
            console.error('JWT signing error:', e);
            throw new InternalServerErrorException('Failed to generate access token');
        }

        try {
            await User.updateOne(
                { pulseId: userId },
                {
                    $inc: { 'loginMetadata.loginCount': 1 },
                    $set: {
                        'loginMetadata.lastLoginIP': sanitizedIp,
                        'loginMetadata.lastLogin': new Date(),
                    }
                }
            );
        } catch (e) {
            try {
                await Session.deleteOne({ sessionId });
                console.error('Session deleted due to user login error');
            } catch (delError) {
                console.error("Couldn't delete DB entry after user login error", delError);
            }
            console.error('User login error:', e);
            throw new InternalServerErrorException();
        }

        const cookieOptionsBase = {
            httpOnly: false, // Testing purposes
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        };

        const accessTokenMaxAge = 15 * 60 * 1000;
        const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

        try {
            response.cookie('__Secure-1PSID', accessToken, { ...cookieOptionsBase, maxAge: accessTokenMaxAge });
            response.cookie('__Secure-1PSIDCC', refreshToken, { ...cookieOptionsBase, maxAge: refreshTokenMaxAge });
        } catch (e) {
            throw new InternalServerErrorException();
        }

        response.status(201).json({
            code: 201,
            message: 'Success',
        });
    }

}