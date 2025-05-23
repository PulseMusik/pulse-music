import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    InternalServerErrorException,
    Ip,
    NotFoundException,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    UseGuards,
    Logger,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './create-user.dto';
  import { Request, Response } from 'express';
  import { minutes, Throttle } from '@nestjs/throttler';
  import { LoginSanitizeDto } from './login-user.dto';
  import { EncryptionService } from 'src/common/encryption.service';
  import User from 'src/models/User';
  import * as bcrypt from 'bcrypt';
  import {
    API_URL,
    AUTH_PROVIDERS_ENABLED,
    PROFILE_PICTURE_URL,
    REDIRECT_WHITELIST,
    ACCOUNTS_URL,
  } from 'src/constants';
  import { ForgotPasswordDto } from './forgot-password.dto';
  import * as jwt from 'jsonwebtoken';
  import { v4 as uuidv4 } from 'uuid';
  import { TokensService } from './tokens/tokens.service';
  import { AuthGuard } from '@nestjs/passport';
  import { FileValidationPipe } from './upload-profile-picture.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { StrategiesService } from './strategies/strategies.service';
  
  const logger = new Logger('UsersController');
  
  @Controller('users')
  export class UsersController {
    constructor(
      private readonly usersServices: UsersService,
      private readonly encryptionService: EncryptionService,
      private readonly tokenService: TokensService,
      private readonly strategiesService: StrategiesService,
    ) {}
  
    @Get()
    findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN' | 'DEVELOPER') {
      return [];
    }
  
    @Throttle({ default: { ttl: minutes(1), limit: 15 } })
    @Get('get_user')
    async findOne(@Query('id') id: string, @Query('role') role?: 'user' | 'admin' | 'moderator') {
      if (!id) {
        throw new BadRequestException({ message: 'User ID is required', code: 'ID_MISSING' });
      }
  
      let user;
      try {
        user = await User.findOne({ pulseId: id });
      } catch (e) {
        logger.error(`Error fetching user with ID ${id}`, e.stack);
        throw new InternalServerErrorException({ message: 'Failed to retrieve user', code: 'DB_ERROR' });
      }
  
      if (!user) {
        logger.warn(`User not found: ${id}`);
        throw new NotFoundException({ message: 'User not found', code: 'USER_NOT_FOUND' });
      }
  
      try {
        const baseData = {
          pulseId: user.pulseId,
          username: user.username,
          profilePicture: user.pictures?.current?.url ?? PROFILE_PICTURE_URL,
        };
  
        if (!role || role === 'user') {
          return { data: baseData };
        }
  
        if (role === 'admin') {
          return {
            data: {
              ...baseData,
              dob: user?.dob ?? null,
              gender: user?.gender ?? 'unspecified',
              language: user?.language ?? 'en',
              emailVerified: user?.emailVerified ?? false,
              phoneVerified: user?.verifiedPhoneNumber ?? false,
              role: user?.role ?? 'user',
              accountCreated: user?.createdAt ?? null,
              lastLogin: user?.loginMetadata?.lastLogin ?? null,
              loginCount: user?.loginMetadata?.loginCount ?? 0,
              userDeleted: user?.userDeleted ?? false,
            },
          };
        }
  
        if (role === 'moderator') {
          return {
            data: {
              ...baseData,
              gender: user?.gender ?? 'unspecified',
              language: user?.language ?? 'en',
              emailVerified: user?.emailVerified ?? false,
              phoneVerified: user?.verifiedPhoneNumber ?? false,
              role: user?.role ?? 'user',
              accountCreated: user?.createdAt ?? null,
              userDeleted: user?.userDeleted ?? false,
            },
          };
        }
      } catch (e) {
        logger.error('Error processing user data', e.stack);
        throw new InternalServerErrorException({ message: 'Failed to prepare user data', code: 'DATA_ERROR' });
      }
    }
  
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}
  
    @Get('google/callback')
    async googleAuthRedirect(@Req() req) {
      const { email, firstName, lastName, picture } = req.user;
      return { email, firstName, lastName, picture };
    }
  
    @HttpCode(204)
    @Throttle({ default: { ttl: minutes(1), limit: 10 } })
    @Post('create_user')
    createUser(@Body() user: CreateUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
      logger.log(`Creating user: ${user.email}`);
      return this.usersServices.createOne(user, req as any, res as any);
    }
  
    @HttpCode(200)
    @Throttle({ default: { ttl: minutes(1), limit: 2 } })
    @Post('forgot_password')
    async forgotPassword(@Body() email: ForgotPasswordDto) {
      if (!email.email) {
        throw new BadRequestException({ message: 'Email is required', code: 'EMAIL_REQUIRED' });
      }
  
      const encryptedEmail = this.encryptionService.encrypt(email.email);
  
      let emailMatch;
      try {
        emailMatch = await User.findOne({ email: encryptedEmail });
      } catch (e) {
        logger.error('Error checking email in DB', e.stack);
        throw new InternalServerErrorException({ message: 'Could not look up account', code: 'EMAIL_LOOKUP_FAILED' });
      }
  
      if (!emailMatch) {
        throw new NotFoundException({ message: 'No account found for that email', code: 'EMAIL_NOT_FOUND' });
      }
  
      if (!emailMatch.pulseId) {
        throw new InternalServerErrorException({ message: 'User ID missing', code: 'PULSE_ID_MISSING' });
      }
  
      const id = uuidv4();
      if (!id) {
        throw new InternalServerErrorException({ message: 'Token generation failed', code: 'TOKEN_ID_FAILED' });
      }
  
      const payload = {
        createdAt: Date.now(),
        expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
        pulseId: emailMatch.pulseId,
        id,
      };
  
      let token: string;
      try {
        token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '15m' });
      } catch (e) {
        logger.error('JWT signing failed', e.stack);
        throw new InternalServerErrorException({ message: 'Token creation failed', code: 'JWT_SIGN_ERROR' });
      }
  
      logger.log(`Password reset token created for: ${email.email}`);
      return { link: `${API_URL}/auth/reset_password?token=${token}` };
    }
  
    @Post('upload-profile-picture')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(FileValidationPipe)
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      const userData = await this.tokenService.decodeToken(req);
  
      if (!userData) {
        throw new UnauthorizedException({ message: 'Invalid or expired token', code: 'UNAUTHORIZED' });
      }
  
      try {
        const uploaded = await this.strategiesService.uploadImageBuffer(file.buffer, file.filename);
        const pulseId = userData?.data?.pulseId;
  
        if (!pulseId) {
          throw new UnauthorizedException({ message: 'User ID missing from token', code: 'PULSE_ID_MISSING' });
        }
  
        const oldCurrent = userData?.data?.pictures?.current;
        const oldHistory = userData?.data?.pictures?.history || [];
        const newPicture = { uploadedAt: Date.now(), url: uploaded.secure_url };
        const updatedHistory = oldCurrent ? [oldCurrent, ...oldHistory] : oldHistory;
  
        await User.updateOne(
          { pulseId },
          {
            $set: {
              'pictures.current': newPicture,
              'pictures.history': updatedHistory,
            },
          },
        );
  
        logger.log(`Profile picture updated for user ${pulseId}`);
        return {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        };
      } catch (e) {
        logger.error('Profile picture upload failed', e.stack);
        throw new InternalServerErrorException({ message: 'Upload failed', code: 'UPLOAD_ERROR' });
      }
    }
  
    @HttpCode(200)
    @Throttle({ default: { ttl: minutes(1), limit: 10 } })
    @Post('send_verification_email')
    async sendVerificationEmail(@Req() req: Request) {
      const userData = await this.tokenService.decodeToken(req);
  
      if (!userData?.data) {
        throw new UnauthorizedException({ message: 'User not authenticated', code: 'UNAUTHORIZED' });
      }
  
      if (userData?.data?.emailVerified) {
        throw new BadRequestException({ message: 'Email already verified', code: 'EMAIL_ALREADY_VERIFIED' });
      }
  
      logger.log(`Verification email request for ${userData?.data?.pulseId}`);
    }
  
    @HttpCode(200)
    @Throttle({ default: { ttl: minutes(1), limit: 10 } })
    @Post('login')
    async login(@Body() user: LoginSanitizeDto, @Req() req: Request, @Res({ passthrough: true }) res: Response, @Query('redirect_url') redirect?: any) {
      const encryptedEmail = this.encryptionService.encrypt(user.email);
      const ip = req.ip;
      const userAgent = req.headers['user-agent'] || 'unknown';
  
      const response = await User.findOne({ email: encryptedEmail });
      if (!response || response.userDeleted === true) {
        throw new NotFoundException({ message: 'User not found', code: 'USER_NOT_FOUND' });
      }
  
      const isMatch = await bcrypt.compare(user.password, response.password);
      if (!isMatch) {
        throw new UnauthorizedException({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
      }
  
      try {
        await this.tokenService.generateToken(response.pulseId, res, userAgent, ip);
      } catch (e) {
        logger.error('Token generation failed', e.stack);
        throw new InternalServerErrorException({ message: 'Login failed', code: 'TOKEN_GENERATION_FAILED' });
      }
  
      const cleanRedirect = typeof redirect === 'string' ? redirect.replace(/\/$/, '') : '';
      const redirectUrl = REDIRECT_WHITELIST.includes(cleanRedirect) ? cleanRedirect : ACCOUNTS_URL;
  
      logger.log(`User ${response.pulseId} logged in`);
      return { redirectUrl };
    }
  
    @HttpCode(204)
    @Throttle({ default: { ttl: minutes(1), limit: 2 } })
    @Delete('delete_account')
    async deleteUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const token = req.cookies['PULSE_ACCESS'];
      if (!token) {
        throw new UnauthorizedException({ message: 'User not authenticated', code: 'UNAUTHORIZED' });
      }
  
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN);
      } catch (e) {
        logger.error('Token verification failed', e.stack);
        throw new InternalServerErrorException({ message: 'Session expired or invalid', code: 'TOKEN_VERIFY_FAILED' });
      }
  
      const userId = decoded?.userId;
      if (!userId) {
        throw new UnauthorizedException({ message: 'Invalid user token', code: 'INVALID_TOKEN' });
      }
  
      let userData;
      try {
        userData = await User.findOne({ pulseId: userId });
        if (!userData) {
          throw new NotFoundException({ message: 'User not found', code: 'USER_NOT_FOUND' });
        }
      } catch (e) {
        logger.error('Error retrieving user during deletion', e.stack);
        throw new InternalServerErrorException({ message: 'Could not delete user account', code: 'DELETE_RETRIEVE_FAILED' });
      }
  
      if (userData.userDeleted) {
        throw new BadRequestException({ message: 'Account already deleted', code: 'ALREADY_DELETED' });
      }
  
      try {
        await User.updateOne({ pulseId: userId }, { $set: { userDeleted: true, userDeletedAt: new Date() } });
      } catch (e) {
        logger.error('Failed to mark user as deleted', e.stack);
        throw new InternalServerErrorException({ message: 'Failed to delete user', code: 'DELETE_FAILED' });
      }
  
      res.clearCookie('PULSE_ACCESS');
      res.clearCookie('PULSE_REFRESH');
  
      logger.log(`Account deleted: ${userId}`);
      return;
    }
  
    @HttpCode(200)
    @Throttle({ default: { ttl: minutes(1), limit: 30 } })
    @Get('get_auth_user')
    async refreshToken(@Req() req: Request) {
      return this.tokenService.decodeToken(req);
    }
  
    @Patch(':id')
    updateOne(@Param('id') id: string, @Body() userUpdate: any) {
      logger.log(`Updating user ${id}`);
      return { id, userUpdate };
    }
  
    @Delete(':id')
    delete(@Param('id') id: string) {
      logger.log(`Deleting user ${id}`);
      return { id };
    }
  }  