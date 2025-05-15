import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
    constructor(private readonly oauthService: OauthService) { }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    }

    @Get('callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        try {
            const user = await this.oauthService.login(req.user);
            return res.json(user);
        } catch (error) {
            console.error('OAuth callback error:', error);
            return res.status(500).json({ message: error.message || 'Internal error' });
        }
    }
}