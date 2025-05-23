import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

import * as sanitizeHtml from 'sanitize-html';

export class ForgotPasswordDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const clean = sanitizeHtml(value, {
            allowedTags: [], // no tags allowed at all
            allowedAttributes: {},
        });
        return clean.trim().toLowerCase();
    })
    email: string;
}
