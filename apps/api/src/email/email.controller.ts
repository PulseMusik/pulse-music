import { BadRequestException, Controller, Post } from '@nestjs/common';

@Controller('email')
export class EmailController {
    @Post('send_email')
    async sendWelcomeEmail(email: string) {
        if (!email) {
            throw new BadRequestException()
        }
    }
}
