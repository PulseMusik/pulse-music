import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import Session from 'src/models/Session';

import * as jwt from 'jsonwebtoken'

import User from 'src/models/User';
import { request } from 'http';
import { EncryptionService } from 'src/common/encryption.service';

import { COOKIE_OPTIONS } from '../../../../../packages/lib/src/lib/constants'

@Injectable()
export class TokensService {
    constructor(private readonly encryptionService: EncryptionService) { }

    async generateToken(userId: string, response: any, userAgent: any, ip?: string) {
        if (!userId || !userAgent || !response) {
          throw new InternalServerErrorException('Something went wrong, please try again later.');
        }
      
        const sessionId = uuidv4();
        const refreshToken = uuidv4() + uuidv4();
      
        const sanitizedUserAgent = userAgent.substring(0, 255);
        const sanitizedIp = ip?.substring(0, 45) || '';
      
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const accessTokenExpiresIn = '15m';
      
        const session = new Session({
          userId,
          sessionId,
          refreshTokenHash,
          createdAt: Date.now(),
          expiresAt: refreshTokenExpiresAt,
          ip: sanitizedIp,
          userAgent: sanitizedUserAgent,
          isActive: true,
        });
      
        try {
          await session.save();
        } catch (e) {
          console.error('Failed to save session:', e);
          throw new InternalServerErrorException('Failed to start session. Please try again.');
        }
      
        const JWT_TOKEN = process.env.JWT_TOKEN;
        if (!JWT_TOKEN) {
          try {
            await Session.deleteOne({ sessionId });
            console.error('Session deleted due to missing JWT secret');
          } catch (e) {
            console.error("Couldn't delete session after missing JWT secret:", e);
          }
          throw new InternalServerErrorException('A server error occurred. Please try again later.');
        }
      
        let accessToken: string;
        try {
          accessToken = jwt.sign({ userId, sessionId }, JWT_TOKEN, { expiresIn: accessTokenExpiresIn });
        } catch (e) {
          try {
            await Session.deleteOne({ sessionId });
            console.error('Session deleted due to JWT signing failure');
          } catch (delError) {
            console.error("Couldn't delete session after JWT signing failure:", delError);
          }
          console.error('JWT signing error:', e);
          throw new InternalServerErrorException('We were unable to log you in. Please try again.');
        }
      
        try {
          await User.updateOne(
            { pulseId: userId },
            {
              $inc: { 'loginMetadata.loginCount': 1 },
              $set: {
                'loginMetadata.lastLoginIP': sanitizedIp,
                'loginMetadata.lastLogin': new Date(),
              },
            },
          );
        } catch (e) {
          try {
            await Session.deleteOne({ sessionId });
            console.error('Session deleted due to user login update error');
          } catch (delError) {
            console.error("Couldn't delete session after user login update error:", delError);
          }
          console.error('User login metadata update failed:', e);
          throw new InternalServerErrorException('We were unable to log you in. Please try again.');
        }
      
      
        const accessTokenMaxAge = 45 * 60 * 1000; // 15 minutes
        const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      
        try {
          response.cookie('PULSE_ACCESS', accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: accessTokenMaxAge,
          });
          response.cookie('PULSE_REFRESH', refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: refreshTokenMaxAge,
          });
        } catch (e) {
          console.error('Failed to set cookies:', e);
          throw new InternalServerErrorException('A server error occurred. Please try again later.');
        }
      
        return;
      }

    async refreshToken(response: any) {
        try {
            const refreshToken = response.cookies['PULSE_REFRESH']
            if (!refreshToken) throw new UnauthorizedException('Your session has expired. Please log in again.');

            const session = await Session.findOne({ isActive: true });
            if (!session) throw new UnauthorizedException('Your session is no longer valid. Please log in again.');

            const valid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (!valid) throw new UnauthorizedException('Your session has expired. Please log in again.');

            const JWT_SECRET = process.env.JWT_TOKEN;
            if (!JWT_SECRET) throw new InternalServerErrorException('A server error occurred. Please try again later.');

            const accessToken = jwt.sign(
                { userId: session.userId, sessionId: session.sessionId },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            response.cookie('PULSE_ACCESS', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
                path: '/',
            });

            return response.json({ message: 'Token refreshed' });
        } catch (e) {
            throw new UnauthorizedException('We could not refresh your session. Please log in again.');
        }
    }

    async decodeToken(request: any) {
        let token = request.cookies['PULSE_ACCESS']

        if (!token) {
            throw new UnauthorizedException('You are not logged in. Please log in to continue.');
        }

        let decodedData;
        try {
            decodedData = await jwt.verify(token, process.env.JWT_TOKEN as string)
        } catch (e) { throw new InternalServerErrorException('We could not verify your session. Please try again.'); }

        if (!decodedData) {
            throw new InternalServerErrorException('We could not verify your session. Please try again.');
        }

        let userData;
        try {
            userData = await User.findOne({ pulseId: decodedData.userId })
        } catch (e) { throw new InternalServerErrorException('We could not retrieve your account information. Please try again.'); }

        if (!userData) {
            throw new UnauthorizedException('We could not find your account. Please log in again.');
        }

        if (userData?.userDeleted === true) {
            throw new UnauthorizedException('Your account has been deleted.');
        }

        let decryptedEmail;
        try {
            decryptedEmail = this.encryptionService.decrypt(userData.email)
        } catch (e) { console.error('Cannot decode email') }

        const publicFacingData = {
            pulseId: userData.pulseId,
            dob: userData.dob,
            pictures: userData.pictures,
            preferences: userData.preferences,
            username: userData.username,
            email: decryptedEmail || '',
            emailVerified: userData.emailVerified,
            language: userData.language,
            friends: userData.friends,
            gender: userData.gender,
            firstName: userData.firstName
        }

        return {
            data: publicFacingData
        }
    }

    async createAccountSwitcherSession(request: any, response: any) {
        let token = request.cookies['PULSE_ACCESS']

        if (!token) {
            throw new UnauthorizedException('You are not logged in. Please log in to continue.');
        }

        let userData;
        try {
            userData = await jwt.verify(token, process.env.JWT_TOKEN as string)
        } catch (e) { throw new InternalServerErrorException('We could not verify your session. Please try again.'); }

        if (!userData) {throw new InternalServerErrorException("We couldn't verify your session")}
    }
}